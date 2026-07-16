import os
import pandas as pd

# Try imports supporting running both as a module from backend root or directly
try:
    from feature_engineering.feature_config import DISCIPLINE_CONFIG, CASH_FLOW_CONFIG, STABILITY_CONFIG
except ModuleNotFoundError:
    from feature_config import DISCIPLINE_CONFIG, CASH_FLOW_CONFIG, STABILITY_CONFIG

def build_features(df):
    """
    Perform feature engineering calculations on the loaded dataset.
    Creates new derived indicators while keeping all original columns.
    
    Args:
        df (pd.DataFrame): Raw synthetic dataset.
        
    Returns:
        pd.DataFrame: DataFrame containing original and new engineered features.
    """
    # Create a copy to prevent modifying the original dataframe
    processed_df = df.copy()
    
    # 1. Financial Buffer
    # Ratio of average balance to monthly expenses, representing buffer months of expenses covered.
    # Vectorized safe division avoiding division by zero.
    safe_expenses = processed_df["monthly_expenses"].copy()
    safe_expenses[safe_expenses <= 0] = 1.0
    processed_df["financial_buffer"] = (processed_df["average_balance"] / safe_expenses).round(4)
    processed_df.loc[processed_df["monthly_expenses"] <= 0, "financial_buffer"] = 0.0
    
    # 2. Digital Trust Score
    # The proportion of digital transactions in the total transaction activity (digital + cash).
    # Vectorized safe division avoiding division by zero.
    total_tx = processed_df["digital_transactions"] + processed_df["cash_transactions"]
    safe_tx = total_tx.copy()
    safe_tx[safe_tx <= 0] = 1.0
    processed_df["digital_trust_score"] = (processed_df["digital_transactions"] / safe_tx).round(4)
    processed_df.loc[total_tx <= 0, "digital_trust_score"] = 0.0
    
    # 3. Spending Power
    # Disposable cash left after paying monthly expenses and allocating savings.
    processed_df["spending_power"] = (
        processed_df["monthly_income"] - 
        processed_df["monthly_expenses"] - 
        processed_df["savings"]
    )
    
    # 4. Financial Discipline Score (0-100)
    # Measures overall spending discipline based on expense ratios, debt EMIs, and missed payments.
    exp_points = (
        DISCIPLINE_CONFIG["max_expense_points"] * (1.0 - processed_df["expense_ratio"])
    ).clip(lower=0.0)
    
    emi_points = (
        DISCIPLINE_CONFIG["max_emi_points"] * (1.0 - processed_df["emi_ratio"])
    ).clip(lower=0.0)
    
    missed_penalty = (
        processed_df["missed_payments"] * DISCIPLINE_CONFIG["missed_payment_penalty"]
    )
    missed_points = (
        DISCIPLINE_CONFIG["max_missed_payment_points"] - missed_penalty
    ).clip(lower=0.0)
    
    processed_df["financial_discipline_score"] = (
        exp_points + emi_points + missed_points
    ).round(2)
    
    # 5. Cash Flow Health (0-100)
    # Measures the cash flow liquidity quality combining savings ratio, buffer, and expense ratios.
    sav_points = (
        processed_df["savings_ratio"] * CASH_FLOW_CONFIG["savings_ratio_multiplier"]
    ).clip(upper=CASH_FLOW_CONFIG["max_savings_points"])
    
    exp_flow_points = (
        CASH_FLOW_CONFIG["max_expense_points"] * (1.0 - processed_df["expense_ratio"])
    ).clip(lower=0.0)
    
    buf_points = (
        processed_df["financial_buffer"] * CASH_FLOW_CONFIG["buffer_multiplier"]
    ).clip(upper=CASH_FLOW_CONFIG["max_buffer_points"])
    
    processed_df["cash_flow_health"] = (
        sav_points + exp_flow_points + buf_points
    ).round(2)
    
    # 6. Stability Score (0-100)
    # Measures income stability and consistency over time based on variance, growth, and payment defaults.
    var_points = processed_df["income_variance"].map(STABILITY_CONFIG["variance_points"]).fillna(0.0)
    growth_points = processed_df["income_growth"].map(STABILITY_CONFIG["growth_points"]).fillna(0.0)
    
    missed_stab_penalty = (
        processed_df["missed_payments"] * STABILITY_CONFIG["missed_payment_penalty"]
    )
    missed_stab_points = (
        STABILITY_CONFIG["max_missed_payment_points"] - missed_stab_penalty
    ).clip(lower=0.0)
    
    processed_df["stability_score"] = (
        var_points + growth_points + missed_stab_points
    ).round(2)
    
    return processed_df

def run_feature_engineering_pipeline():
    # Resolve input path
    input_path = os.path.join("synthetic_data", "growledger_dataset.csv")
    if not os.path.exists(input_path):
        # Try path relative to the script location
        script_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        input_path = os.path.join(script_dir, "synthetic_data", "growledger_dataset.csv")
        
    if not os.path.exists(input_path):
        print(f"Error: Raw dataset not found at: {input_path}")
        return
        
    print(f"Loading raw dataset from: {input_path}")
    df = pd.read_csv(input_path)
    
    # Build new features
    print("Building engineered features...")
    features_df = build_features(df)
    
    # Define and create output path
    output_dir = os.path.join("processed_data")
    if not os.path.isabs(output_dir):
        script_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        output_dir = os.path.join(script_dir, "processed_data")
        
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "growledger_features.csv")
    
    # Save the processed dataset
    print(f"Saving processed features to: {output_path}")
    features_df.to_csv(output_path, index=False)
    
    print("\n--------------------------------")
    print("GrowLedger Feature Engineering Complete")
    print(f"Total Rows: {len(features_df)}")
    print(f"Original Columns: {len(df.columns)}")
    print(f"New Columns: {len(features_df.columns)}")
    print(f"New Features Added:")
    print("  - financial_buffer")
    print("  - digital_trust_score")
    print("  - spending_power")
    print("  - financial_discipline_score")
    print("  - cash_flow_health")
    print("  - stability_score")
    print("--------------------------------")

if __name__ == "__main__":
    run_feature_engineering_pipeline()

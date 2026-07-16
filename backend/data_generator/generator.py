import os
import random
import pandas as pd

# Try imports supporting running both as a module from backend root or directly
try:
    from data_generator.personas import PERSONAS
    from data_generator.schema import DATASET_COLUMNS
except ModuleNotFoundError:
    from personas import PERSONAS
    from schema import DATASET_COLUMNS

def generate_user(persona_name, user_id_str):
    """
    Generates a single synthetic user dictionary based on a given persona configuration.
    
    Args:
        persona_name (str): Name of the persona (e.g. 'Rajesh')
        user_id_str (str): Formatted sequential user ID (e.g. 'GL00001')
        
    Returns:
        dict: A single user's financial profile data
    """
    persona_data = PERSONAS[persona_name]
    
    # Randomly sample within the persona's configured numeric ranges
    income = random.randint(*persona_data["monthly_income"])
    
    # Generate expense_ratio dynamically based on persona expenses and income ranges
    min_exp, max_exp = persona_data["monthly_expenses"]
    min_ratio = min_exp / persona_data["monthly_income"][1]
    max_ratio = max_exp / persona_data["monthly_income"][0]
    min_ratio = max(0.1, min_ratio)
    max_ratio = min(0.99, max_ratio)
    expense_ratio = round(random.uniform(min_ratio, max_ratio), 4)
    
    # Compute expenses from income and expense_ratio
    expenses = int(income * expense_ratio)
    
    # Compute savings from the remaining income
    remaining_income = income - expenses
    if remaining_income > 0:
        min_sav, max_sav = persona_data["savings"]
        min_sav_ratio = max(0.0, min(0.95, min_sav / remaining_income))
        max_sav_ratio = max(0.0, min(0.95, max_sav / remaining_income))
        if min_sav_ratio > max_sav_ratio:
            min_sav_ratio, max_sav_ratio = max_sav_ratio, min_sav_ratio
        savings_fraction = random.uniform(min_sav_ratio, max_sav_ratio)
        savings = int(remaining_income * savings_fraction)
    else:
        savings = 0

    average_balance = random.randint(*persona_data["average_balance"])
    
    digital_txs = random.randint(*persona_data["digital_transactions"])
    cash_txs = random.randint(*persona_data["cash_transactions"])
    missed_payments = random.randint(*persona_data["missed_payments"])
    
    # Sample ratio values
    emi_ratio = round(random.uniform(*persona_data["emi_ratio"]), 4)
    
    # Calculate derived values (ratios & buffer)
    savings_ratio = round(savings / income, 4) if income > 0 else 0.0
    financial_buffer = round(average_balance / expenses, 4) if expenses > 0 else 0.0
    
    # Sample categorical values
    income_growth = random.choice(persona_data["income_growth"])
    
    # Sample income_variance dynamically using weighted probabilities
    income_var_cfg = persona_data["income_variance"]
    income_variance = random.choices(income_var_cfg["values"], weights=income_var_cfg["weights"])[0]
    
    # Calculate financial tier dynamically based on behavior score
    score = 0
    if expense_ratio < 0.65:
        score += 2
    if savings_ratio > 0.20:
        score += 2
    if emi_ratio < 0.15:
        score += 2
    if missed_payments == 0:
        score += 2
    if income_growth == "Increasing":
        score += 2
    if digital_txs > 100:
        score += 1

    financial_score = min(10, score)

    if financial_score >= 8:
        financial_tier = "Ready"
    elif financial_score >= 5:
        financial_tier = "Emerging"
    else:
        financial_tier = "Building"

    user_data = {
        "user_id": user_id_str,
        "occupation": persona_data["occupation"],
        "monthly_income": income,
        "monthly_expenses": expenses,
        "savings": savings,
        "average_balance": average_balance,
        "digital_transactions": digital_txs,
        "cash_transactions": cash_txs,
        "income_variance": income_variance,
        "expense_ratio": expense_ratio,
        "savings_ratio": savings_ratio,
        "emi_ratio": emi_ratio,
        "financial_buffer": financial_buffer,
        "financial_score": financial_score,
        "missed_payments": missed_payments,
        "income_growth": income_growth,
        "financial_tier": financial_tier
    }
    
    return user_data

def generate_dataset():
    """
    Generates a balanced dataset of 5000 users (1000 per persona),
    converts it to a pandas DataFrame, and saves it as a CSV file.
    """
    user_list = []
    user_counter = 1
    
    # We iterate through each persona defined in PERSONAS
    for persona_name in PERSONAS.keys():
        # Generate exactly 1000 users for the current persona
        for _ in range(1000):
            user_id_str = f"GL{user_counter:05d}"
            user_data = generate_user(persona_name, user_id_str)
            user_list.append(user_data)
            user_counter += 1
            
    # Convert list of dictionaries to pandas DataFrame
    df = pd.DataFrame(user_list)
    
    # Reorder columns to match the defined schema
    df = df[DATASET_COLUMNS]
    
    # Ensure target output directory exists relative to the script directory
    script_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    output_dir = os.path.join(script_dir, "synthetic_data")
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "growledger_dataset.csv")
    
    # Save the dataframe as CSV without row indexes
    df.to_csv(output_path, index=False)
    
    # Count tier distributions for the summary output
    tier_counts = df["financial_tier"].value_counts()
    count_building = tier_counts.get("Building", 0)
    count_emerging = tier_counts.get("Emerging", 0)
    count_ready = tier_counts.get("Ready", 0)
    
    # Print the summary console message as specified in constraints
    print("--------------------------------")
    print("GrowLedger Dataset Generated")
    print(f"Total Users: {len(df)}")
    print(f"Building: {count_building}")
    print(f"Emerging: {count_emerging}")
    print(f"Ready: {count_ready}")
    print(f"Saved To: {output_path}")
    print("--------------------------------")

if __name__ == "__main__":
    generate_dataset()

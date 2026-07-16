import os
import pandas as pd

def audit_dataset():
    # Resolve CSV file path
    csv_path = os.path.join("synthetic_data", "growledger_dataset.csv")
    if not os.path.exists(csv_path):
        # Try path relative to the script location
        script_dir = os.path.dirname(os.path.abspath(__file__))
        csv_path = os.path.join(script_dir, "synthetic_data", "growledger_dataset.csv")
        
    if not os.path.exists(csv_path):
        print(f"Error: Dataset not found at path: {csv_path}")
        return
        
    print(f"Loading dataset from: {csv_path}\n")
    df = pd.read_csv(csv_path)
    
    # 2. Print Basic Statistics
    print("========================================")
    print("            DATASET AUDIT               ")
    print("========================================")
    print(f"Total Rows: {len(df)}")
    print(f"Total Columns: {len(df.columns)}")
    print(f"Duplicate Rows: {df.duplicated().sum()}")
    
    # Missing values
    missing_vals = df.isnull().sum().sum()
    print(f"Missing Values (Total): {missing_vals}")
    if missing_vals > 0:
        print("\nMissing values breakdown by column:")
        print(df.isnull().sum()[df.isnull().sum() > 0])
        
    # Class distribution (financial_tier)
    print("\nClass Distribution (financial_tier):")
    tier_counts = df["financial_tier"].value_counts()
    for tier, count in tier_counts.items():
        print(f"  - {tier}: {count} ({count / len(df) * 100:.2f}%)")
        
    # Dataframe description summary
    print("\nNumerical Attributes Summary (describe):")
    print(df.describe().to_string())
    print("\n========================================")
    print("            AUDIT WARNINGS              ")
    print("========================================")
    
    warnings_triggered = False
    
    # Check 1: expense_ratio > 1
    excessive_expenses = df[df["expense_ratio"] > 1]
    if not excessive_expenses.empty:
        print(f"[WARNING] {len(excessive_expenses)} rows found where expense_ratio > 1")
        warnings_triggered = True
        
    # Check 2: savings_ratio > 1
    excessive_savings = df[df["savings_ratio"] > 1]
    if not excessive_savings.empty:
        print(f"[WARNING] {len(excessive_savings)} rows found where savings_ratio > 1")
        warnings_triggered = True
        
    # Check 3: monthly_expenses > monthly_income
    expenses_gt_income = df[df["monthly_expenses"] > df["monthly_income"]]
    if not expenses_gt_income.empty:
        print(f"[WARNING] {len(expenses_gt_income)} rows found where monthly_expenses > monthly_income")
        warnings_triggered = True
        
    # Check 4: negative values exist in numeric columns
    numeric_cols = df.select_dtypes(include=["number"]).columns
    negative_val_counts = {}
    for col in numeric_cols:
        neg_count = (df[col] < 0).sum()
        if neg_count > 0:
            negative_val_counts[col] = neg_count
            
    if negative_val_counts:
        print("[WARNING] Negative values found in the following columns:")
        for col, count in negative_val_counts.items():
            print(f"  - {col}: {count} instances")
        warnings_triggered = True
        
    if not warnings_triggered:
        print("Audit passed successfully! No anomalies detected.")
    print("========================================")

if __name__ == "__main__":
    audit_dataset()

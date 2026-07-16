# Dataset schema definition containing the columns and description metadata.

DATASET_COLUMNS = [
    "user_id",
    "occupation",
    "monthly_income",
    "monthly_expenses",
    "savings",
    "average_balance",
    "digital_transactions",
    "cash_transactions",
    "income_variance",
    "expense_ratio",
    "savings_ratio",
    "emi_ratio",
    "financial_buffer",
    "financial_score",
    "missed_payments",
    "income_growth",
    "financial_tier"
]

# Total target user counts and class balanced distribution settings.
DATASET_CONFIG = {
    "total_users": 5000,
    "distribution": {
        "Rajesh": 1000,
        "Lakshmi": 1000,
        "Arun": 1000,
        "Priya": 1000,
        "Ramesh": 1000
    }
}

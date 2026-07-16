# Configuration parameters for feature engineering scoring systems.
# Keeping configurations separate makes the code modular, maintainable, and easy to adjust.

# Financial Discipline Score Configurations (Max Score: 100)
DISCIPLINE_CONFIG = {
    "max_expense_points": 40,
    "max_emi_points": 30,
    "max_missed_payment_points": 30,
    "missed_payment_penalty": 6,  # Reduces 6 points per missed payment (max 5 missed payments)
}

# Cash Flow Health Configurations (Max Score: 100)
CASH_FLOW_CONFIG = {
    "max_savings_points": 40,
    "savings_ratio_multiplier": 100.0,  # E.g. savings_ratio of 0.25 -> 25 points
    "max_expense_points": 30,
    "max_buffer_points": 30,
    "buffer_multiplier": 15.0,  # E.g. buffer of 1.5 months -> 22.5 points (capped at 30)
}

# Stability Score Configurations (Max Score: 100)
STABILITY_CONFIG = {
    "variance_points": {
        "Low": 40,
        "Medium": 20,
        "High": 0
    },
    "growth_points": {
        "Increasing": 40,
        "Stable": 20,
        "Declining": 0
    },
    "max_missed_payment_points": 20,
    "missed_payment_penalty": 4,  # Reduces 4 points per missed payment (max 5 missed payments)
}

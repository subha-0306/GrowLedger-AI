# User Personas definitions and random value generation ranges.
# These ranges reflect realistic financial profiles of gig workers and small business owners in India.

PERSONAS = {
    "Rajesh": {
        "occupation": "Delivery Partner",
        "monthly_income": (32000, 45000),
        "monthly_expenses": (20000, 35000),
        "savings": (2000, 8000),
        "average_balance": (8000, 22000),
        "digital_transactions": (70, 140),
        "cash_transactions": (15, 30),
        "income_variance": {
            "values": ["Medium", "Low", "High"],
            "weights": [0.7, 0.2, 0.1]
        },
        "missed_payments": (0, 3),
        "income_growth": ["Stable", "Declining"],
        "emi_ratio": (0.1, 0.3)
    },
    "Lakshmi": {
        "occupation": "Tea Shop Owner",
        "monthly_income": (45000, 70000),
        "monthly_expenses": (25000, 40000),
        "savings": (15000, 30000),
        "average_balance": (25000, 55000),
        "digital_transactions": (150, 300),
        "cash_transactions": (100, 200),
        "income_variance": {
            "values": ["Low", "Medium"],
            "weights": [0.8, 0.2]
        },
        "missed_payments": (0, 1),
        "income_growth": ["Increasing", "Stable"],
        "emi_ratio": (0.0, 0.15)
    },
    "Arun": {
        "occupation": "Freelancer",
        "monthly_income": (20000, 80000),
        "monthly_expenses": (15000, 45000),
        "savings": (5000, 20000),
        "average_balance": (10000, 40000),
        "digital_transactions": (40, 90),
        "cash_transactions": (5, 15),
        "income_variance": {
            "values": ["High", "Medium", "Low"],
            "weights": [0.7, 0.2, 0.1]
        },
        "missed_payments": (0, 4),
        "income_growth": ["Increasing", "Stable", "Declining"],
        "emi_ratio": (0.05, 0.25)
    },
    "Priya": {
        "occupation": "Boutique Owner",
        "monthly_income": (40000, 85000),
        "monthly_expenses": (25000, 50000),
        "savings": (10000, 25000),
        "average_balance": (15000, 45000),
        "digital_transactions": (80, 160),
        "cash_transactions": (20, 50),
        "income_variance": {
            "values": ["Medium", "Low", "High"],
            "weights": [0.7, 0.2, 0.1]
        },
        "missed_payments": (0, 2),
        "income_growth": ["Increasing", "Stable"],
        "emi_ratio": (0.05, 0.2)
    },
    "Ramesh": {
        "occupation": "Daily Wage Worker",
        "monthly_income": (10000, 22000),
        "monthly_expenses": (9000, 19000),
        "savings": (0, 2000),
        "average_balance": (1000, 5000),
        "digital_transactions": (5, 25),
        "cash_transactions": (30, 60),
        "income_variance": {
            "values": ["Medium", "High", "Low"],
            "weights": [0.6, 0.3, 0.1]
        },
        "missed_payments": (0, 5),
        "income_growth": ["Stable", "Declining"],
        "emi_ratio": (0.1, 0.4)
    }
}

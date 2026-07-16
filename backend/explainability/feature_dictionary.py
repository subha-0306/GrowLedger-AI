# Feature dictionary mapping raw column names to human-readable names.
# This config will be used to generate clean visual labels and conversational descriptions.

FEATURE_DICT = {
    "monthly_income": "Monthly Income",
    "monthly_expenses": "Monthly Expenses",
    "savings": "Monthly Savings",
    "average_balance": "Average Account Balance",
    "digital_transactions": "Digital Transaction Count",
    "cash_transactions": "Cash Transaction Count",
    "expense_ratio": "Expense-to-Income Ratio",
    "savings_ratio": "Savings-to-Income Ratio",
    "emi_ratio": "Debt EMI-to-Income Ratio",
    "missed_payments": "Missed Payment Defaults",
    "financial_buffer": "Financial Emergency Buffer",
    "digital_trust_score": "Digital Footprint Share",
    "spending_power": "Disposable Spending Capacity",
    
    # One-hot encoded occupation categories
    "occupation_Delivery Partner": "Occupation (Delivery Partner)",
    "occupation_Tea Shop Owner": "Occupation (Tea Shop Owner)",
    "occupation_Freelancer": "Occupation (Freelancer)",
    "occupation_Boutique Owner": "Occupation (Boutique Owner)",
    "occupation_Daily Wage Worker": "Occupation (Daily Wage Worker)",
    
    # One-hot encoded variance categories
    "income_variance_Low": "Income Variance (Low)",
    "income_variance_Medium": "Income Variance (Medium)",
    "income_variance_High": "Income Variance (High)",
    
    # One-hot encoded growth categories
    "income_growth_Increasing": "Income Growth Trend (Increasing)",
    "income_growth_Stable": "Income Growth Trend (Stable)",
    "income_growth_Declining": "Income Growth Trend (Declining)",
}

# Conversational descriptions for user-facing dashboards.
# Positive and negative directions maps to the sign of the SHAP attribution values.
FEATURE_EXPLANATIONS = {
    "monthly_income": {
        "positive": {
            "title": "Healthy Income Level",
            "description": "Your current monthly income levels support a stable financial baseline."
        },
        "negative": {
            "title": "Restricted Income Level",
            "description": "Your lower monthly income level limits your financial flexibility."
        }
    },
    "monthly_expenses": {
        "positive": {
            "title": "Low Monthly Expenditures",
            "description": "You maintain low monthly expenses, leaving more room for savings."
        },
        "negative": {
            "title": "High Monthly Expenses",
            "description": "Your high monthly expenses take up a large portion of your incoming cash flow."
        }
    },
    "savings": {
        "positive": {
            "title": "Consistent Savings Accumulation",
            "description": "You save a substantial amount of cash monthly, building wealth over time."
        },
        "negative": {
            "title": "Low Monthly Savings",
            "description": "You are saving very little cash, making it harder to absorb financial emergencies."
        }
    },
    "average_balance": {
        "positive": {
            "title": "Strong Cash Reserves",
            "description": "You keep a healthy average balance in your bank account, showing liquidity."
        },
        "negative": {
            "title": "Minimal Account Balance",
            "description": "Your bank account average balance is low, presenting a cash shortage risk."
        }
    },
    "digital_transactions": {
        "positive": {
            "title": "High Digital Footprint",
            "description": "Your frequent digital transactions provide highly documented financial activity."
        },
        "negative": {
            "title": "Low Digital Footprint",
            "description": "You perform few digital transactions, meaning less electronic financial history."
        }
    },
    "cash_transactions": {
        "positive": {
            "title": "Low Cash Reliance",
            "description": "You rely less on cash transactions, making your income easier to verify."
        },
        "negative": {
            "title": "High Cash Reliance",
            "description": "Most of your operations are cash-based, making your earnings harder to trace."
        }
    },
    "expense_ratio": {
        "positive": {
            "title": "Controlled Spending",
            "description": "Your expenses consume a small fraction of your total income."
        },
        "negative": {
            "title": "High Monthly Expenses",
            "description": "Your expenses take up too much of your income, reducing financial safety."
        }
    },
    "savings_ratio": {
        "positive": {
            "title": "Healthy Savings Habit",
            "description": "You consistently save a significant percentage of your monthly earnings."
        },
        "negative": {
            "title": "Low Savings Buffer",
            "description": "You save a very small percentage of your monthly income, risking vulnerability."
        }
    },
    "emi_ratio": {
        "positive": {
            "title": "Low Debt Burden",
            "description": "Your monthly loan EMI commitments are low and manageable."
        },
        "negative": {
            "title": "High EMI Commitments",
            "description": "A large portion of your income goes to loan repayments, stressing your budget."
        }
    },
    "missed_payments": {
        "positive": {
            "title": "Flawless Payment Record",
            "description": "You have zero or very few missed bill/debt payments, displaying strong discipline."
        },
        "negative": {
            "title": "Recent Payment Defaults",
            "description": "You have multiple missed payments, which impacts creditworthiness."
        }
    },
    "financial_buffer": {
        "positive": {
            "title": "Robust Emergency Cover",
            "description": "Your account balance covers multiple months of typical expenses."
        },
        "negative": {
            "title": "Limited Financial Buffer",
            "description": "Your account balance provides minimal cover against unexpected expenses."
        }
    },
    "digital_trust_score": {
        "positive": {
            "title": "Strong Digital Financial Footprint",
            "description": "A high share of digital transactions validates your financial profile."
        },
        "negative": {
            "title": "Limited Digital Financial Activity",
            "description": "High cash transaction shares make validating your financial profile difficult."
        }
    },
    "spending_power": {
        "positive": {
            "title": "Solid Disposable Income",
            "description": "You maintain a comfortable amount of surplus cash after expenses and savings."
        },
        "negative": {
            "title": "Tight Disposable Cash",
            "description": "You have little unallocated cash remaining at the end of the month."
        }
    },
    
    # Categorical Occupation descriptions
    "occupation_Delivery Partner": {
        "positive": {
            "title": "Active Gig Employment",
            "description": "Delivery operations provide frequent, predictable daily micro-income flows."
        },
        "negative": {
            "title": "Gig Work Fluctuations",
            "description": "Delivery driver income is subject to platform demand changes."
        }
    },
    "occupation_Tea Shop Owner": {
        "positive": {
            "title": "Steady Business Revenue",
            "description": "Tea shop operations bring consistent daily cash inflows."
        },
        "negative": {
            "title": "Local Shop Vulnerability",
            "description": "Tea shop margins depend heavily on foot traffic and local weather."
        }
    },
    "occupation_Freelancer": {
        "positive": {
            "title": "High Income Potential",
            "description": "Specialized freelance projects bring large payout opportunities."
        },
        "negative": {
            "title": "Volatile Freelance Income",
            "description": "Freelancing brings project variance and irregular payment delays."
        }
    },
    "occupation_Boutique Owner": {
        "positive": {
            "title": "High Margin Retail",
            "description": "Boutique fashion retail offers good profit margins on sales."
        },
        "negative": {
            "title": "Seasonal Fashion Revenue",
            "description": "Boutique sales are highly dependent on wedding and festival seasons."
        }
    },
    "occupation_Daily Wage Worker": {
        "positive": {
            "title": "Immediate Daily Payouts",
            "description": "Daily wage work delivers immediate cash earnings, avoiding collection lags."
        },
        "negative": {
            "title": "Unstable Daily Labor",
            "description": "Daily wage opportunities are irregular, offering low income security."
        }
    },
    "income_variance_Low": {
        "positive": {
            "title": "Highly Predictable Earnings",
            "description": "Low income variance gives you absolute confidence in meeting debt bills."
        },
        "negative": {
            "title": "Fixed Cash Flow Caps",
            "description": "Predictable but fixed income limits quick budget expansions."
        }
    },
    "income_variance_High": {
        "positive": {
            "title": "High Upside Potential",
            "description": "High income variance suggests occasionally highly profitable months."
        },
        "negative": {
            "title": "Unpredictable Income Drops",
            "description": "High income volatility increases default risks during down months."
        }
    },
    "income_growth_Increasing": {
        "positive": {
            "title": "Positive Growth Trajectory",
            "description": "Your income is growing over time, making future payments easier."
        },
        "negative": {
            "title": "Growth Expectations Pressures",
            "description": "Current scaling operations might increase short-term capital needs."
        }
    },
    "income_growth_Declining": {
        "positive": {
            "title": "Defensive Cost Structure",
            "description": "You keep a low-cost profile even in downward cycles."
        },
        "negative": {
            "title": "Declining Revenue Trend",
            "description": "Your monthly incoming cash flows are shrinking, reducing debt capacity."
        }
    }
}

# Short description clauses for dynamic text generation.
FEATURE_CLAUSES = {
    "monthly_income": {
        "positive": "a healthy income baseline",
        "negative": "restricted monthly income",
        "recommendation": "exploring secondary income sources"
    },
    "monthly_expenses": {
        "positive": "low expenditures",
        "negative": "elevated cost structures",
        "recommendation": "rationalizing monthly cost items"
    },
    "savings": {
        "positive": "consistent monthly savings",
        "negative": "low savings accumulation",
        "recommendation": "increasing monthly saving amounts"
    },
    "average_balance": {
        "positive": "strong cash reserves",
        "negative": "a minimal bank balance",
        "recommendation": "maintaining a higher average account balance"
    },
    "digital_transactions": {
        "positive": "frequent digital transactions",
        "negative": "limited digital footprint history",
        "recommendation": "shifting more payments to digital modes"
    },
    "cash_transactions": {
        "positive": "low cash reliance",
        "negative": "heavy cash reliance",
        "recommendation": "depositing cash earnings into your bank account"
    },
    "expense_ratio": {
        "positive": "controlled spending",
        "negative": "high monthly expenses",
        "recommendation": "cutting down unnecessary expenditures"
    },
    "savings_ratio": {
        "positive": "healthy saving habits",
        "negative": "a low savings rate",
        "recommendation": "boosting your monthly savings rate"
    },
    "emi_ratio": {
        "positive": "a manageable debt burden",
        "negative": "a relatively high EMI burden",
        "recommendation": "reducing your debt obligations"
    },
    "missed_payments": {
        "positive": "a flawless payment record",
        "negative": "frequent missed payments",
        "recommendation": "improving payment consistency"
    },
    "financial_buffer": {
        "positive": "a solid emergency buffer",
        "negative": "a limited emergency buffer",
        "recommendation": "expanding your emergency cash reserve"
    },
    "digital_trust_score": {
        "positive": "a strong digital transaction history",
        "negative": "unverifiable cash transactions",
        "recommendation": "conducting more transactions digitally"
    },
    "spending_power": {
        "positive": "good disposable spending capacity",
        "negative": "tight disposable cash reserves",
        "recommendation": "budgeting to expand surplus cash"
    },
    "occupation_Delivery Partner": {
        "positive": "active gig employment",
        "negative": "gig work market fluctuations",
        "recommendation": "diversifying gig delivery options"
    },
    "occupation_Tea Shop Owner": {
        "positive": "steady business revenue",
        "negative": "foot traffic fluctuations",
        "recommendation": "optimizing shop operating margins"
    },
    "occupation_Freelancer": {
        "positive": "high freelancing income potential",
        "negative": "volatile project cash flows",
        "recommendation": "securing long-term retainer agreements"
    },
    "occupation_Boutique Owner": {
        "positive": "good boutique retail margins",
        "negative": "seasonal retail demand drops",
        "recommendation": "smoothing out seasonal sales drops"
    },
    "occupation_Daily Wage Worker": {
        "positive": "regular daily payouts",
        "negative": "unstable wage opportunities",
        "recommendation": "seeking more stable contract agreements"
    },
    "income_variance_Low": {
        "positive": "highly predictable earnings",
        "negative": "inflexible income caps",
        "recommendation": "seeking additional revenue sources"
    },
    "income_variance_High": {
        "positive": "high monthly income upside",
        "negative": "highly volatile monthly earnings",
        "recommendation": "building a buffer for down months"
    },
    "income_growth_Increasing": {
        "positive": "a positive income growth trend",
        "negative": "capital growth cost pressures",
        "recommendation": "managing operational expansion costs"
    },
    "income_growth_Declining": {
        "positive": "defensive expense management",
        "negative": "a declining revenue trend",
        "recommendation": "restructuring cost lines to match revenue"
    }
}


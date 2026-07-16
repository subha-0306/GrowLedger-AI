# Deterministic recommendation rules mapping predictive features to credit advice.
# Calculates specific numerical adjustments based on user financials to remain realistic.

def get_recommendation(feature, user_features):
    """
    Formulates a specific credit improvement action plan based on user financial variables.
    
    Args:
        feature (str): The column name representing the target improvement variable.
        user_features (dict or pd.Series): The raw user inputs.
        
    Returns:
        dict: Recommendation payload containing title, description, and estimated_change.
    """
    # Extract baseline financials
    monthly_income = float(user_features.get("monthly_income", 30000))
    monthly_expenses = float(user_features.get("monthly_expenses", 20000))
    savings = float(user_features.get("savings", 5000))
    missed_payments = int(user_features.get("missed_payments", 0))
    emi_ratio = float(user_features.get("emi_ratio", 0))
    
    if feature == "expense_ratio":
        # Recommend reducing monthly expenses by 15% of expenses or 10% of income
        target_reduction = min(monthly_expenses * 0.15, monthly_income * 0.1)
        target_reduction = round(target_reduction, -2) # Round to nearest 100
        if target_reduction < 500:
            target_reduction = 500
        return {
            "feature": "expense_ratio",
            "title": "Reduce Discretionary Spending",
            "description": "Your monthly expenses take up a large portion of your income, reducing credit safety margins.",
            "estimated_change": f"Reduce monthly expenses by approximately ₹{int(target_reduction):,}."
        }
        
    elif feature == "emi_ratio":
        # Recommend lower debt ratio
        current_emi = monthly_income * emi_ratio
        target_reduction = round(current_emi * 0.25, -2)
        if target_reduction < 1000:
            target_reduction = 1000
        return {
            "feature": "emi_ratio",
            "title": "Reduce Debt Obligations",
            "description": "A high debt-to-income ratio limits your cash flow flexibility for new credit limits.",
            "estimated_change": f"Lower monthly loan commitments by at least ₹{int(target_reduction):,} or close smaller debts first."
        }
        
    elif feature == "missed_payments":
        return {
            "feature": "missed_payments",
            "title": "Improve Payment Consistency",
            "description": "Recent payment delays are negatively impacting your repayment history score.",
            "estimated_change": "Ensure all EMI and utility bills are paid on time for the next 3 consecutive months."
        }
        
    elif feature == "digital_trust_score" or feature == "digital_transactions" or feature == "digital_trust":
        return {
            "feature": "digital_trust_score",
            "title": "Build Digital Footprint",
            "description": "High reliance on cash transactions makes verify your daily business earnings difficult for formal lenders.",
            "estimated_change": "Shift at least 5 cash purchases per month to digital modes like UPI or bank cards."
        }
        
    elif feature == "savings_ratio" or feature == "savings":
        # Recommend saving an extra 5% of monthly income
        target_extra_savings = round(monthly_income * 0.05, -2)
        if target_extra_savings < 500:
            target_extra_savings = 500
        return {
            "feature": "savings_ratio",
            "title": "Increase Savings Rate",
            "description": "Your current savings rate is low, leaving you vulnerable to financial disruptions.",
            "estimated_change": f"Increase savings by transferring an additional ₹{int(target_extra_savings):,} every month."
        }
        
    elif feature == "financial_buffer" or feature == "average_balance":
        # Target a liquid emergency fund covering 1 month of typical expenses
        target_buffer = round(monthly_expenses, -3)
        return {
            "feature": "financial_buffer",
            "title": "Build Emergency Fund",
            "description": "Your account balance provides minimal cover against unexpected expenses during downturns.",
            "estimated_change": f"Build a liquid emergency fund buffer of ₹{int(target_buffer):,}."
        }
        
    else:
        # Fallback recommendations
        return {
            "feature": feature,
            "title": "Optimize Financial Profile",
            "description": f"Improve {feature.replace('_', ' ').title()} to strengthen credit readiness indicators.",
            "estimated_change": "Maintain consistent savings and pay all utility bills on time."
        }

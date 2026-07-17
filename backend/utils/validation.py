def validate_predict_payload(data):
    """
    Validates user financial inputs for the prediction endpoint.
    Returns a dictionary of cleaned inputs if valid, or raises ValueError.
    """
    if not isinstance(data, dict):
        raise ValueError("Payload must be a JSON object.")
        
    required_fields = {
        "occupation": str,
        "monthly_income": (int, float),
        "monthly_expenses": (int, float),
        "savings": (int, float),
        "average_balance": (int, float),
        "digital_transactions": (int, float),
        "cash_transactions": (int, float),
        "income_variance": str,
        "missed_payments": (int, float),
        "income_growth": str,
    }
    
    cleaned = {}
    
    # Check required fields and types
    for field, expected_type in required_fields.items():
        if field not in data:
            raise ValueError(f"Missing required field: '{field}'.")
        val = data[field]
        if not isinstance(val, expected_type):
            raise ValueError(
                f"Field '{field}' must be of type {expected_type.__name__ if not isinstance(expected_type, tuple) else ' or '.join([t.__name__ for t in expected_type])}."
            )
        cleaned[field] = val
        
    # Optional fields
    optional_fields = {
        "emi_ratio": (int, float),
        "expense_ratio": (int, float),
        "savings_ratio": (int, float),
    }
    for field, expected_type in optional_fields.items():
        if field in data:
            val = data[field]
            if not isinstance(val, expected_type):
                raise ValueError(
                    f"Field '{field}' must be of type {expected_type.__name__ if not isinstance(expected_type, tuple) else ' or '.join([t.__name__ for t in expected_type])}."
                )
            cleaned[field] = val
            
    # Business logic validation
    if cleaned["monthly_income"] < 0:
        raise ValueError("monthly_income cannot be negative.")
    if cleaned["monthly_expenses"] < 0:
        raise ValueError("monthly_expenses cannot be negative.")
    if cleaned["savings"] < 0:
        raise ValueError("savings cannot be negative.")
    if cleaned["average_balance"] < 0:
        raise ValueError("average_balance cannot be negative.")
    if cleaned["digital_transactions"] < 0:
        raise ValueError("digital_transactions cannot be negative.")
    if cleaned["cash_transactions"] < 0:
        raise ValueError("cash_transactions cannot be negative.")
    if cleaned["missed_payments"] < 0:
        raise ValueError("missed_payments cannot be negative.")
    if "emi_ratio" in cleaned and (cleaned["emi_ratio"] < 0 or cleaned["emi_ratio"] > 1):
        raise ValueError("emi_ratio must be between 0.0 and 1.0.")
    if "expense_ratio" in cleaned and (cleaned["expense_ratio"] < 0 or cleaned["expense_ratio"] > 1):
        raise ValueError("expense_ratio must be between 0.0 and 1.0.")
    if "savings_ratio" in cleaned and (cleaned["savings_ratio"] < 0 or cleaned["savings_ratio"] > 1):
        raise ValueError("savings_ratio must be between 0.0 and 1.0.")
        
    # Categorical domain checks
    allowed_occupations = ["Delivery Partner", "Tea Shop Owner", "Freelancer", "Boutique Owner", "Daily Wage Worker"]
    if cleaned["occupation"] not in allowed_occupations:
        raise ValueError(f"Invalid occupation. Allowed values: {allowed_occupations}")
        
    allowed_variance = ["Low", "Medium", "High"]
    if cleaned["income_variance"] not in allowed_variance:
        raise ValueError(f"Invalid income_variance. Allowed values: {allowed_variance}")
        
    allowed_growth = ["Stable", "Increasing", "Declining"]
    if cleaned["income_growth"] not in allowed_growth:
        raise ValueError(f"Invalid income_growth. Allowed values: {allowed_growth}")
        
    return cleaned

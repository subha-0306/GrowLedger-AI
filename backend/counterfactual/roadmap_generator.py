# Roadmap generator module for countering financial weakness.
# Organizes milestones into 30-day, 60-day, and 90-day segments depending on targeted feature.

def generate_roadmap(recommendation, user_features):
    """
    Generates a structured roadmap of specific, realistic milestones.
    
    Args:
        recommendation (dict): Recommendation payload containing feature name and targets.
        user_features (dict): Raw user inputs.
        
    Returns:
        dict: Roadmap dictionary mapped into 30_days, 60_days, and 90_days blocks.
    """
    feature = recommendation["feature"]
    monthly_income = float(user_features.get("monthly_income", 30000))
    monthly_expenses = float(user_features.get("monthly_expenses", 20000))
    
    if feature == "expense_ratio":
        target_reduction = min(monthly_expenses * 0.15, monthly_income * 0.1)
        target_reduction = round(target_reduction, -2)
        if target_reduction < 500:
            target_reduction = 500
        return {
            "30_days": [
                "Track all discretionary spending (dining, tea shops, shopping) for the next 2 weeks.",
                "Identify at least 2 recurring micro-subscriptions or services to cancel."
            ],
            "60_days": [
                f"Reduce daily non-essential purchases to save ₹{int(target_reduction / 2):,} this month.",
                "Set a weekly spending alert inside your main banking app."
            ],
            "90_days": [
                f"Achieve the full monthly expense reduction target of ₹{int(target_reduction):,}.",
                "Automate routing the saved difference into a recurring deposit account."
            ]
        }
        
    elif feature == "emi_ratio":
        return {
            "30_days": [
                "List all outstanding microloans, active EMI amounts, and payment deadlines.",
                "Commit to avoiding new buy-now-pay-later (BNPL) purchases this month."
            ],
            "60_days": [
                "Target the smallest outstanding loan balance and plan a foreclosure/early payment.",
                "Consolidate multiple payment due dates into a single calendar view."
            ],
            "90_days": [
                "Pay off the targeted microloan completely to permanently lower monthly bills.",
                "Verify that total active EMI commitments take up less than 30% of your net income."
            ]
        }
        
    elif feature == "missed_payments":
        return {
            "30_days": [
                "Set up auto-debit payments for all recurring utility bills and active EMIs.",
                "Reschedule all billing due dates to fall within 3 days after your salary deposit."
            ],
            "60_days": [
                "Verify your credit report to ensure all cleared payments are reported accurately.",
                "Maintain a cash reserve equivalent to 1 month's EMI in your primary repayment account."
            ],
            "90_days": [
                "Complete 3 consecutive months of flawless, on-time payments across all bills.",
                "Confirm that no late payment notifications were generated."
            ]
        }
        
    elif feature in ["digital_trust_score", "digital_transactions", "digital_trust"]:
        return {
            "30_days": [
                "Set up a UPI application linked to your primary savings account.",
                "Perform at least 3 small grocery payments using QR code scans instead of cash."
            ],
            "60_days": [
                "Move utility bill payments (electricity, water, DTH, mobile prepaid) to online platforms.",
                "Target completing at least 50% of your monthly transaction counts digitally."
            ],
            "90_days": [
                "Maintain a clear electronic bank statement detailing UPI transaction activity.",
                "Review statement to verify digital footprint has improved compared to cash volume."
            ]
        }
        
    elif feature in ["savings_ratio", "savings"]:
        target_extra_savings = round(monthly_income * 0.05, -2)
        if target_extra_savings < 500:
            target_extra_savings = 500
        return {
            "30_days": [
                f"Automate a standing instruction to transfer ₹{int(target_extra_savings):,} into savings on salary day.",
                "Open a separate digital savings account with zero minimum balance requirement."
            ],
            "60_days": [
                "Set aside at least 15% of any unexpected cash earnings or variable incentives.",
                "Review savings accumulation weekly to build habit consistency."
            ],
            "90_days": [
                f"Successfully maintain the higher savings rate for 3 consecutive months.",
                "Ensure total accumulated savings equal at least one week of earnings."
            ]
        }
        
    elif feature in ["financial_buffer", "average_balance"]:
        target_buffer = round(monthly_expenses, -3)
        step_savings = round(target_buffer / 3, -2)
        return {
            "30_days": [
                f"Transfer a starter deposit of ₹{int(step_savings):,} into a dedicated emergency fund.",
                "Keep emergency reserves in a liquid, high-yield account separate from your shopping card."
            ],
            "60_days": [
                f"Accumulate emergency reserves to hit a mid-target of ₹{int(step_savings * 2):,}.",
                "Create a strict definition of what qualifies as an emergency withdrawal."
            ],
            "90_days": [
                f"Reach your emergency fund buffer goal of ₹{int(target_buffer):,}.",
                "Commit to replenishing this buffer immediately if any withdrawals occur."
            ]
        }
        
    else:
        # Generic default roadmap
        return {
            "30_days": [
                "Track all monthly cash inflows and outflows on a paper ledger or sheet.",
                "Avoid taking any high-interest micro-credit offers this month."
            ],
            "60_days": [
                "Align all billing dates with your cash flow cycle to avoid delays.",
                "Establish a basic savings account with no fee penalties."
            ],
            "90_days": [
                "Verify credit score metrics to confirm improvement progress.",
                "Maintain a consistent average bank balance over the quarter."
            ]
        }

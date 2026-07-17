import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { predictCreditReadiness } from '../services/api';
import demoProfiles from '../data/demo_profiles.json';
import { 
  ArrowRight, Play, RefreshCw, AlertCircle, HelpCircle, ShieldCheck, 
  ArrowLeft, CheckCircle2, Loader2, Check, Activity, Sparkles, 
  AlertTriangle, MessageSquare, Compass, CheckSquare, Target, ChevronRight, Landmark 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard({ predictionData, setPredictionData }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [processingStep, setProcessingStep] = useState(0); // 0: Idle, 1-5: Checkpoints, 6: Syncing
  const [error, setError] = useState(null);
  const [completedSteps, setCompletedSteps] = useState({}); // Toggles checklist milestones

  // Form State
  const [form, setForm] = useState({
    occupation: 'Freelancer',
    monthly_income: 45000,
    monthly_expenses: 30000,
    savings: 8000,
    average_balance: 15000,
    digital_transactions: 65,
    cash_transactions: 10,
    income_variance: 'Medium',
    missed_payments: 2,
    income_growth: 'Stable',
    emi_ratio: 0.15,
  });

  const processingStepsList = [
    "Validating Financial Data",
    "Running AI Prediction",
    "Explaining Decision",
    "Preparing Financial Story",
    "Building Personalized Roadmap"
  ];

  const handleProfileSelect = (profile) => {
    const selectedData = {
      occupation: profile.occupation,
      monthly_income: profile.monthly_income,
      monthly_expenses: profile.monthly_expenses,
      savings: profile.savings,
      average_balance: profile.average_balance,
      digital_transactions: profile.digital_transactions,
      cash_transactions: profile.cash_transactions,
      income_variance: profile.income_variance,
      missed_payments: profile.missed_payments,
      income_growth: profile.income_growth,
      emi_ratio: profile.emi_ratio,
    };
    setForm(selectedData);
    setStep(3); // Fast forward wizard step to final step
    setError(null);
    toast.success(`Loaded ${profile.name}'s profile parameters! Starting credit evaluation...`);

    // Run prediction scoring flow immediately with selected dataset
    runScoringExecution(selectedData);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value,
    }));
  };

  // Step-level validation
  const validateStep = (currentStep) => {
    setError(null);
    
    if (currentStep === 1) {
      if (!form.occupation || !form.income_variance || !form.income_growth) {
        setError('Please select values for all profile parameters.');
        return false;
      }
    } 
    
    else if (currentStep === 2) {
      if (form.monthly_income === '' || form.monthly_income <= 0) {
        setError('Monthly income must be a positive number greater than zero.');
        return false;
      }
      if (form.monthly_expenses === '' || form.monthly_expenses < 0) {
        setError('Monthly expenses cannot be negative.');
        return false;
      }
      if (form.savings === '' || form.savings < 0) {
        setError('Monthly savings cannot be negative.');
        return false;
      }
      if (form.average_balance === '' || form.average_balance < 0) {
        setError('Average balance cannot be negative.');
        return false;
      }
    } 
    
    else if (currentStep === 3) {
      if (form.digital_transactions === '' || form.digital_transactions < 0) {
        setError('Digital transactions count cannot be negative.');
        return false;
      }
      if (form.cash_transactions === '' || form.cash_transactions < 0) {
        setError('Cash transactions count cannot be negative.');
        return false;
      }
      if (form.missed_payments === '' || form.missed_payments < 0) {
        setError('Missed payments cannot be negative.');
        return false;
      }
      if (form.emi_ratio === '' || form.emi_ratio < 0 || form.emi_ratio > 1) {
        setError('EMI ratio must be between 0.0 and 1.0 (0% to 100%).');
        return false;
      }
    }
    
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setError(null);
    setStep((prev) => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;
    
    const payload = {
      ...form,
      monthly_income: Number(form.monthly_income),
      monthly_expenses: Number(form.monthly_expenses),
      savings: Number(form.savings),
      average_balance: Number(form.average_balance),
      digital_transactions: Number(form.digital_transactions),
      cash_transactions: Number(form.cash_transactions),
      missed_payments: Number(form.missed_payments),
      emi_ratio: Number(form.emi_ratio),
    };
    runScoringExecution(payload);
  };

  const runScoringExecution = async (payload) => {
    setLoading(true);
    setProcessingStep(1);
    setError(null);
    setPredictionData(null); // Clear previous results to show loading state
    setCompletedSteps({}); // Reset checklists

    // 1. Kick off API call in background
    let apiPromise = predictCreditReadiness(payload);
    let apiResult = null;
    let apiError = null;

    apiPromise.then(
      (res) => { apiResult = res; },
      (err) => { apiError = err; }
    );

    // 2. Trigger sequential checkmark interval animation
    let currentAnimationStep = 1;
    const intervalId = setInterval(() => {
      currentAnimationStep += 1;
      if (currentAnimationStep <= 5) {
        setProcessingStep(currentAnimationStep);
      } else {
        clearInterval(intervalId);
        setProcessingStep(6); // Step 6: wait for API resolution
        checkApiResolution();
      }
    }, 600);

    const checkApiResolution = () => {
      const checkInterval = setInterval(() => {
        if (apiResult !== null || apiError !== null) {
          clearInterval(checkInterval);
          completeProgressFlow(apiResult, apiError);
        }
      }, 100);
    };

    const completeProgressFlow = (result, errorPayload) => {
      setLoading(false);
      setProcessingStep(0); // Reset loading state
      
      if (errorPayload) {
        console.error(errorPayload);
        const errMsg = errorPayload.message || 'Error communicating with Flask API.';
        setError(errMsg);
        toast.error(errMsg);
      } else if (result && result.success) {
        setPredictionData(result.data);
        toast.success('Credit readiness rating updated!');
      } else {
        const errMsg = result?.error?.message || 'Server returned an error.';
        setError(errMsg);
        toast.error(errMsg);
      }
    };
  };

  const toggleMilestone = (dayKey, idx) => {
    const key = `${dayKey}-${idx}`;
    setCompletedSteps((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    toast.success('Milestone checkpoint updated!');
  };

  const getStepHeaderClass = (stepNum) => {
    if (step === stepNum) return 'border-blue-600 text-blue-600 font-bold';
    if (step > stepNum) return 'border-emerald-500 text-emerald-600 font-bold';
    return 'border-zinc-200 text-zinc-400 font-medium';
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Ready':
        return 'from-emerald-50 to-teal-50 text-emerald-800 border-emerald-200 glow-emerald';
      case 'Emerging':
        return 'from-amber-50 to-orange-50 text-amber-800 border-amber-200 glow-amber';
      case 'Building':
      default:
        return 'from-rose-50 to-red-50 text-rose-800 border-rose-200 glow-rose';
    }
  };

  const getTierBadgeColor = (tier) => {
    switch (tier) {
      case 'Ready':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Emerging':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Building':
      default:
        return 'bg-rose-100 text-rose-800 border-rose-200';
    }
  };

  // Derive helper indices for Section 2: Financial Health
  const calcSavingsRate = () => {
    const income = Number(form.monthly_income) || 0;
    if (income <= 0) return '0%';
    return `${((Number(form.savings) / income) * 100).toFixed(1)}%`;
  };

  const calcExpenseRate = () => {
    const income = Number(form.monthly_income) || 0;
    if (income <= 0) return '0%';
    return `${((Number(form.monthly_expenses) / income) * 100).toFixed(1)}%`;
  };

  const calcFinancialBuffer = () => {
    const expenses = Number(form.monthly_expenses) || 0;
    if (expenses <= 0) return '0.0';
    return (Number(form.average_balance) / expenses).toFixed(1);
  };

  const calcDigitalUPI = () => {
    const totalTxs = (Number(form.digital_transactions) || 0) + (Number(form.cash_transactions) || 0);
    if (totalTxs <= 0) return '0%';
    return `${((Number(form.digital_transactions) / totalTxs) * 100).toFixed(1)}%`;
  };

  const calcSpendingPower = () => {
    const income = Number(form.monthly_income) || 0;
    const expenses = Number(form.monthly_expenses) || 0;
    const savings = Number(form.savings) || 0;
    return income - expenses - savings;
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Intro Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-zinc-900 m-0 tracking-tight">Credit Readiness Assessment</h2>
        <p className="text-zinc-500 mt-1 text-sm">Submit Indian gig worker financial parameters to evaluate formal credit access ratings.</p>
      </div>
      
      {/* SECTION: Rich Demo Profile Cards Selector (Rajesh, Lakshmi, Arun, Priya, Ramesh) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5 select-none">
          <Landmark className="w-4 h-4 text-blue-600" />
          <span>Interactive Demo Personas</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {demoProfiles.map((profile) => (
            <button
              key={profile.id}
              onClick={() => handleProfileSelect(profile)}
              className="glass-panel p-4 rounded-2xl text-left hover:border-blue-500/50 hover:bg-zinc-50 transition-all duration-300 cursor-pointer shadow-sm group select-none flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{profile.avatar}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                    profile.tier === 'Good' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : profile.tier === 'Average' 
                      ? 'bg-amber-50 text-amber-700 border-amber-200' 
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {profile.tier}
                  </span>
                </div>
                <span className="block text-sm font-extrabold text-zinc-900 group-hover:text-blue-600 transition-colors mt-2">{profile.name}</span>
                <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wide mt-0.5">{profile.occupation}</span>
              </div>
              <p className="text-[10px] text-zinc-550 mt-3 leading-relaxed border-t border-zinc-100 pt-2.5 m-0 line-clamp-3 group-hover:text-zinc-700">{profile.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Stepper Progress bar */}
      <div className="glass-panel p-4 rounded-xl flex items-center justify-between gap-4 text-xs select-none">
        <div className={`flex items-center gap-2 border-b-2 pb-1.5 px-1 transition-all ${getStepHeaderClass(1)}`}>
          <span className="w-5 h-5 rounded-full flex items-center justify-center border text-[10px] font-bold">1</span>
          <span>Occupation Profile</span>
        </div>
        <div className="h-px bg-zinc-200 flex-1 hidden sm:block" />
        <div className={`flex items-center gap-2 border-b-2 pb-1.5 px-1 transition-all ${getStepHeaderClass(2)}`}>
          <span className="w-5 h-5 rounded-full flex items-center justify-center border text-[10px] font-bold">2</span>
          <span>Cash Flow Details</span>
        </div>
        <div className="h-px bg-zinc-200 flex-1 hidden sm:block" />
        <div className={`flex items-center gap-2 border-b-2 pb-1.5 px-1 transition-all ${getStepHeaderClass(3)}`}>
          <span className="w-5 h-5 rounded-full flex items-center justify-center border text-[10px] font-bold">3</span>
          <span>Transactions & History</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Form Column */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl space-y-6">
          <h3 className="text-lg font-bold text-zinc-900 border-b border-zinc-100 pb-3">
            {step === 1 && 'Step 1: Profile & Occupation'}
            {step === 2 && 'Step 2: Core Cash Flow Details'}
            {step === 3 && 'Step 3: Transactions & Repayments'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* STEP 1 FIELDS */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                {/* Occupation */}
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide mb-1.5">Occupation</label>
                  <select
                    name="occupation"
                    value={form.occupation}
                    onChange={handleChange}
                    className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm text-zinc-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Delivery Partner">Delivery Partner</option>
                    <option value="Tea Shop Owner">Tea Shop Owner</option>
                    <option value="Freelancer">Freelancer</option>
                    <option value="Boutique Owner">Boutique Owner</option>
                    <option value="Daily Wage Worker">Daily Wage Worker</option>
                  </select>
                </div>

                {/* Income Variance */}
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide mb-1.5">Income Variance</label>
                  <select
                    name="income_variance"
                    value={form.income_variance}
                    onChange={handleChange}
                    className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm text-zinc-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Low">Low (Consistent income)</option>
                    <option value="Medium">Medium (Moderate fluctuations)</option>
                    <option value="High">High (Highly unpredictable)</option>
                  </select>
                </div>

                {/* Income Growth */}
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide mb-1.5">Income Growth Trend</label>
                  <select
                    name="income_growth"
                    value={form.income_growth}
                    onChange={handleChange}
                    className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm text-zinc-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Increasing">Increasing (Growing earnings)</option>
                    <option value="Stable">Stable (Flat earnings)</option>
                    <option value="Declining">Declining (Shrinking earnings)</option>
                  </select>
                </div>
              </div>
            )}

            {/* STEP 2 FIELDS */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Monthly Income */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide mb-1.5">Monthly Income (₹)</label>
                    <input
                      type="number"
                      name="monthly_income"
                      min="0"
                      required
                      value={form.monthly_income}
                      onChange={handleChange}
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm text-zinc-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Monthly Expenses */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide mb-1.5">Monthly Expenses (₹)</label>
                    <input
                      type="number"
                      name="monthly_expenses"
                      min="0"
                      required
                      value={form.monthly_expenses}
                      onChange={handleChange}
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm text-zinc-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Savings */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide mb-1.5">Monthly Savings (₹)</label>
                    <input
                      type="number"
                      name="savings"
                      min="0"
                      required
                      value={form.savings}
                      onChange={handleChange}
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm text-zinc-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Average Balance */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide mb-1.5">Average Bank Balance (₹)</label>
                    <input
                      type="number"
                      name="average_balance"
                      min="0"
                      required
                      value={form.average_balance}
                      onChange={handleChange}
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm text-zinc-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 FIELDS */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Digital Transactions */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide mb-1.5">Digital UPI Txs (Count/Mo)</label>
                    <input
                      type="number"
                      name="digital_transactions"
                      min="0"
                      required
                      value={form.digital_transactions}
                      onChange={handleChange}
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm text-zinc-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Cash Transactions */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide mb-1.5">Cash Txs (Count/Mo)</label>
                    <input
                      type="number"
                      name="cash_transactions"
                      min="0"
                      required
                      value={form.cash_transactions}
                      onChange={handleChange}
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm text-zinc-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* EMI Ratio */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide mb-1.5">Active EMI Ratio (0.00 to 1.00)</label>
                    <input
                      type="number"
                      name="emi_ratio"
                      step="0.01"
                      min="0"
                      max="1"
                      required
                      value={form.emi_ratio}
                      onChange={handleChange}
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm text-zinc-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Missed Payments */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide mb-1.5">Missed Payments (Last 12 Mo)</label>
                    <input
                      type="number"
                      name="missed_payments"
                      min="0"
                      required
                      value={form.missed_payments}
                      onChange={handleChange}
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm text-zinc-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex gap-2.5 items-start bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3.5 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center gap-3 border-t border-zinc-100 pt-5">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl font-bold bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-all border border-zinc-200/60 cursor-pointer text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl text-white font-bold bg-blue-600 hover:bg-blue-700 transition-all cursor-pointer text-sm"
                >
                  Next Section
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 transition-all duration-200 shadow-md cursor-pointer disabled:opacity-50 text-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Evaluating...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Evaluate Credit Readiness
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Unified Scrollable Results Dashboard Column */}
        <div className="lg:col-span-6">
          {processingStep > 0 ? (
            /* Animated Checklist Screen */
            <div className="glass-panel p-6 rounded-2xl space-y-6 animate-fade-in min-h-[400px] flex flex-col justify-center">
              <div className="text-center space-y-1">
                <h4 className="text-base font-extrabold text-zinc-900 m-0">AI Credit Scoring Engine</h4>
                <p className="text-xs text-zinc-550">Processing real-time cash flow parameters...</p>
              </div>

              <div className="space-y-4 px-2">
                {processingStepsList.map((stepText, idx) => {
                  const stepNum = idx + 1;
                  const isCompleted = processingStep > stepNum;
                  const isActive = processingStep === stepNum;
                  
                  return (
                    <div 
                      key={idx} 
                      className={`flex items-center gap-3 transition-all duration-300 ${
                        isCompleted ? 'text-zinc-500' : isActive ? 'text-blue-600 font-bold scale-102' : 'text-zinc-400'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500 border border-emerald-400 flex items-center justify-center text-white scale-110 transition-all duration-300">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        ) : isActive ? (
                          <div className="w-5 h-5 rounded-full border border-blue-500 flex items-center justify-center text-blue-600 animate-pulse">
                            <Loader2 className="w-3 h-3 animate-spin stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-zinc-200 bg-zinc-50 flex items-center justify-center text-[10px] text-zinc-400 font-bold">
                            {stepNum}
                          </div>
                        )}
                      </div>
                      <span className="text-sm">{isCompleted ? `✓ ${stepText}` : stepText}</span>
                    </div>
                  );
                })}
              </div>

              <div className="w-full bg-zinc-100 rounded-full h-1.5 border border-zinc-200/50 mt-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(100, (processingStep - 1) * 25)}%` }}
                />
              </div>
            </div>
          ) : predictionData ? (
            /* CONSOLIDATED RESULTS DASHBOARD */
            <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-3 scroll-smooth">
              
              {/* SECTION 1: Prediction Summary */}
              <div id="summary" className={`glass-panel bg-gradient-to-br ${getTierColor(predictionData.prediction)} border p-6 rounded-2xl text-center space-y-4`}>
                <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4.5 h-4.5" />
                  <span>Prediction Summary</span>
                </div>
                <div className="text-5xl font-black tracking-tight m-0">{predictionData.prediction}</div>
                <div className="flex justify-center items-center gap-2">
                  <span className="text-sm font-semibold opacity-90 text-zinc-650">Model Confidence:</span>
                  <span className="text-sm font-bold bg-white/80 px-2.5 py-1 rounded-md text-zinc-850 border border-zinc-200/80 shadow-sm">{predictionData.confidence}%</span>
                </div>
              </div>

              {/* SECTION 2: Financial Health */}
              <div id="health" className="glass-panel p-6 rounded-2xl space-y-4">
                <h4 className="text-sm font-bold text-zinc-850 border-b border-zinc-100 pb-2.5 flex items-center gap-2">
                  <Activity className="w-4.5 h-4.5 text-blue-600" />
                  <span>Financial Health Indicators</span>
                </h4>
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="bg-zinc-50 border border-zinc-200/60 p-3.5 rounded-xl">
                    <span className="block text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Savings Rate</span>
                    <span className="text-base font-extrabold text-emerald-600 mt-1 block">{calcSavingsRate()}</span>
                  </div>
                  <div className="bg-zinc-50 border border-zinc-200/60 p-3.5 rounded-xl">
                    <span className="block text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Expense Rate</span>
                    <span className="text-base font-extrabold text-blue-600 mt-1 block">{calcExpenseRate()}</span>
                  </div>
                  <div className="bg-zinc-50 border border-zinc-200/60 p-3.5 rounded-xl">
                    <span className="block text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Expense Buffer</span>
                    <span className="text-base font-extrabold text-indigo-600 mt-1 block">{calcFinancialBuffer()} Mo</span>
                  </div>
                  <div className="bg-zinc-50 border border-zinc-200/60 p-3.5 rounded-xl">
                    <span className="block text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Digital UPI Txs</span>
                    <span className="text-base font-extrabold text-purple-600 mt-1 block">{calcDigitalUPI()}</span>
                  </div>
                  <div className="bg-zinc-50 border border-zinc-200/60 p-3.5 rounded-xl col-span-2">
                    <span className="block text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Net Spending Power</span>
                    <span className={`text-base font-extrabold mt-1 block ${calcSpendingPower() >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      ₹{calcSpendingPower().toLocaleString('en-IN')} / month
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Strengthened Profile */}
              <div id="strengths" className="glass-panel p-6 rounded-2xl space-y-4">
                <h4 className="text-sm font-bold text-zinc-850 border-b border-zinc-100 pb-2.5 flex items-center gap-2">
                  <Sparkles className="w-4.5 h-4.5 text-emerald-600" />
                  <span>Strengthened Profile (Positive Drivers)</span>
                </h4>
                <div className="space-y-3">
                  {predictionData.strengthened_profile?.map((item, idx) => (
                    <div key={idx} className="bg-emerald-50/20 border border-emerald-100/60 p-3.5 rounded-xl">
                      <div className="text-xs font-bold text-emerald-700">{item.title}</div>
                      <p className="text-xs text-zinc-550 mt-1 mb-0 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 4: Reduced Readiness */}
              <div id="weaknesses" className="glass-panel p-6 rounded-2xl space-y-4">
                <h4 className="text-sm font-bold text-zinc-855 border-b border-zinc-100 pb-2.5 flex items-center gap-2">
                  <AlertTriangle className="w-4.5 h-4.5 text-rose-600" />
                  <span>Reduced Readiness (Limiting Drivers)</span>
                </h4>
                <div className="space-y-3">
                  {predictionData.reduced_readiness?.map((item, idx) => (
                    <div key={idx} className="bg-rose-50/20 border border-rose-100/60 p-3.5 rounded-xl">
                      <div className="text-xs font-bold text-rose-700">{item.title}</div>
                      <p className="text-xs text-zinc-550 mt-1 mb-0 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 5: Financial Story */}
              <div id="story" className="glass-panel p-6 rounded-2xl space-y-3">
                <h4 className="text-sm font-bold text-zinc-850 border-b border-zinc-100 pb-2 flex items-center gap-2">
                  <MessageSquare className="w-4.5 h-4.5 text-blue-600" />
                  <span>Financial Narrative</span>
                </h4>
                <p className="text-zinc-650 text-sm italic leading-relaxed m-0 pl-1">
                  "{predictionData.financial_story}"
                </p>
              </div>

              {/* SECTION 6: Priority Action */}
              <div id="priority" className="glass-panel p-6 rounded-2xl space-y-4">
                <h4 className="text-sm font-bold text-zinc-850 border-b border-zinc-100 pb-2.5 flex items-center gap-2">
                  <Compass className="w-4.5 h-4.5 text-blue-600" />
                  <span>Credit Improvement Focus</span>
                </h4>
                <div className="space-y-4.5">
                  <div className="flex gap-3 bg-blue-50/30 border border-blue-100 p-4 rounded-xl">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Priority action card</div>
                      <div className="text-sm font-bold text-zinc-900 mt-1">{predictionData.coaching?.priority_action}</div>
                      <p className="text-xs text-zinc-550 mt-1 mb-0 leading-relaxed">{predictionData.coaching?.action_description}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 bg-emerald-50/30 border border-emerald-100 p-4 rounded-xl">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0 mt-0.5">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Quick win target</div>
                      <p className="text-xs text-zinc-600 mt-1.5 mb-0 leading-relaxed font-semibold">{predictionData.coaching?.quick_win}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 7: 30/60/90 Roadmap */}
              <div id="roadmap" className="glass-panel p-6 rounded-2xl space-y-5">
                <h4 className="text-sm font-bold text-zinc-850 border-b border-zinc-100 pb-2.5 flex items-center gap-2">
                  <CheckSquare className="w-4.5 h-4.5 text-blue-600" />
                  <span>30/60/90 Day Savings Roadmap</span>
                </h4>
                
                <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-100">
                  {/* 30 Days */}
                  <div className="relative pl-8 space-y-2">
                    <div className="absolute left-2.5 top-1.5 w-2.5 h-2.5 rounded-full bg-blue-600 z-10" />
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full w-max">30 Days</span>
                    <div className="space-y-2">
                      {predictionData.coaching?.roadmap?.['30_days']?.map((stepStr, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => toggleMilestone('30_days', idx)}
                          className="flex gap-2.5 items-start p-2.5 rounded-xl border border-zinc-100 bg-zinc-50/20 hover:bg-zinc-50 transition-all cursor-pointer select-none text-xs text-zinc-650"
                        >
                          <CheckSquare className={`w-4.5 h-4.5 flex-shrink-0 mt-0.5 ${completedSteps[`30_days-${idx}`] ? 'text-blue-600 fill-blue-50' : 'text-zinc-400'}`} />
                          <span className={completedSteps[`30_days-${idx}`] ? 'line-through text-zinc-450' : ''}>{stepStr}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 60 Days */}
                  <div className="relative pl-8 space-y-2">
                    <div className="absolute left-2.5 top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-600 z-10" />
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full w-max">60 Days</span>
                    <div className="space-y-2">
                      {predictionData.coaching?.roadmap?.['60_days']?.map((stepStr, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => toggleMilestone('60_days', idx)}
                          className="flex gap-2.5 items-start p-2.5 rounded-xl border border-zinc-100 bg-zinc-50/20 hover:bg-zinc-50 transition-all cursor-pointer select-none text-xs text-zinc-650"
                        >
                          <CheckSquare className={`w-4.5 h-4.5 flex-shrink-0 mt-0.5 ${completedSteps[`60_days-${idx}`] ? 'text-indigo-600 fill-indigo-50' : 'text-zinc-400'}`} />
                          <span className={completedSteps[`60_days-${idx}`] ? 'line-through text-zinc-450' : ''}>{stepStr}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 90 Days */}
                  <div className="relative pl-8 space-y-2">
                    <div className="absolute left-2.5 top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-600 z-10" />
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full w-max">90 Days</span>
                    <div className="space-y-2">
                      {predictionData.coaching?.roadmap?.['90_days']?.map((stepStr, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => toggleMilestone('90_days', idx)}
                          className="flex gap-2.5 items-start p-2.5 rounded-xl border border-zinc-100 bg-zinc-50/20 hover:bg-zinc-50 transition-all cursor-pointer select-none text-xs text-zinc-650"
                        >
                          <CheckSquare className={`w-4.5 h-4.5 flex-shrink-0 mt-0.5 ${completedSteps[`90_days-${idx}`] ? 'text-emerald-600 fill-emerald-50' : 'text-zinc-400'}`} />
                          <span className={completedSteps[`90_days-${idx}`] ? 'line-through text-zinc-450' : ''}>{stepStr}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 8: Future Projection */}
              <div id="projection" className="glass-panel p-6 rounded-2xl space-y-5 text-center animate-fade-in">
                <h4 className="text-sm font-bold text-zinc-850 border-b border-zinc-100 pb-2.5 flex items-center gap-2 text-left">
                  <Target className="w-4.5 h-4.5 text-blue-600" />
                  <span>Heuristic Transition Projection</span>
                </h4>
                
                <div className="flex flex-col sm:flex-row items-center gap-3 bg-zinc-55/40 p-4 rounded-xl border border-zinc-200/60">
                  <div className={`px-3 py-2 rounded-lg border text-xs font-bold uppercase tracking-wider w-full ${getTierBadgeColor(predictionData.coaching?.future_projection?.current_tier)}`}>
                    Current: {predictionData.coaching?.future_projection?.current_tier}
                  </div>
                  <div className="flex justify-center items-center w-6 h-6 rounded-full bg-zinc-100 text-zinc-400">
                    <ChevronRight className="w-4 h-4 transform rotate-90 sm:rotate-0" />
                  </div>
                  <div className={`px-3 py-2 rounded-lg border text-xs font-bold uppercase tracking-wider w-full animate-pulse ${getTierBadgeColor(predictionData.coaching?.future_projection?.projected_tier)}`}>
                    Projected: {predictionData.coaching?.future_projection?.projected_tier}
                  </div>
                </div>

                <div className="space-y-3 text-left border-t border-zinc-100 pt-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 font-bold">Readiness Score Confidence</span>
                    <span className="text-zinc-800 font-black">{predictionData.coaching?.future_projection?.confidence}%</span>
                  </div>
                  <div className="w-full bg-zinc-100 rounded-full h-2 border border-zinc-200/50">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${predictionData.coaching?.future_projection?.confidence}%` }}
                    />
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* Empty State Placeholder */
            <div className="glass-panel p-8 rounded-2xl text-center flex flex-col items-center justify-center h-80 space-y-4 animate-fade-in">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-zinc-800">No Assessment Loaded</h4>
                <p className="text-zinc-500 text-sm mt-1 max-w-xs mx-auto">Fill in the financial variables or load a preset and press evaluate to run the predictive scoring flow.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

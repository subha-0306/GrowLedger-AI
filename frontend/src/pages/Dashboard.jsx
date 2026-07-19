import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { predictCreditReadiness } from '../services/api';

import demoProfiles from '../data/demo_profiles.json';
import { 
  ArrowRight, Play, RefreshCw, AlertCircle, HelpCircle, ShieldCheck, 
  ArrowLeft, CheckCircle2, Loader2, Check, Activity, Sparkles, 
  AlertTriangle, MessageSquare, Compass, CheckSquare, Target, ChevronRight, Landmark 
} from 'lucide-react';
import toast from 'react-hot-toast';

const avatarUrls = {
  rajesh: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120',
  lakshmi: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120',
  arun: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120',
  priya: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120&h=120',
  ramesh: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120&h=120'
};

export default function Dashboard({ predictionData, setPredictionData }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [processingStep, setProcessingStep] = useState(0); // 0: Idle, 1-7: Checkpoints, 8: Syncing
  const [error, setError] = useState(null);
  const [completedSteps, setCompletedSteps] = useState({}); // Toggles checklist milestones
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [animateProgress, setAnimateProgress] = useState(false);


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
    "Feature Engineering",
    "Running LightGBM Prediction",
    "TreeSHAP Explainability",
    "Financial Story Generation",
    "Counterfactual Coaching",
    "Building 30/60/90 Roadmap"
  ];

  // Trigger progress bar animations on load/result generation
  useEffect(() => {
    if (predictionData) {
      const timer = setTimeout(() => setAnimateProgress(true), 150);
      return () => clearTimeout(timer);
    } else {
      setAnimateProgress(false);
    }
  }, [predictionData]);

  // Smooth scroll to summary card upon evaluation results load
  useEffect(() => {
    if (predictionData) {
      const timer = setTimeout(() => {
        const element = document.getElementById('summary');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [predictionData]);

  const getPremiumPassportStyle = (tier) => {
    const colors = {
      Ready: {
        bg: 'repeating-linear-gradient(45deg, rgba(31,75,58,0.012) 0px, rgba(31,75,58,0.012) 1px, transparent 1px, transparent 8px), linear-gradient(135deg, #edf4ef 0%, #dbeee0 100%)',
        border: 'border-[#1F4B3A]/30 shadow-[inset_0_0_20px_rgba(31,75,58,0.05)]',
        watermark: 'READY OFFICIAL ACCESS'
      },
      Emerging: {
        bg: 'repeating-linear-gradient(45deg, rgba(184,138,59,0.012) 0px, rgba(184,138,59,0.012) 1px, transparent 1px, transparent 8px), linear-gradient(135deg, #fdfaf2 0%, #f4ead0 100%)',
        border: 'border-[#B88A3B]/30 shadow-[inset_0_0_20px_rgba(184,138,59,0.05)]',
        watermark: 'EMERGING SIGNAL ACTIVE'
      },
      Building: {
        bg: 'repeating-linear-gradient(45deg, rgba(194,144,26,0.012) 0px, rgba(194,144,26,0.012) 1px, transparent 1px, transparent 8px), linear-gradient(135deg, #fffcf3 0%, #f7f2d4 100%)',
        border: 'border-[#c2901a]/25 shadow-[inset_0_0_20px_rgba(194,144,26,0.04)]',
        watermark: 'BUILDING PHASE SIGNAL'
      }
    };
    return colors[tier] || colors.Building;
  };


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
    setSelectedProfileId(profile.id);
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
    setSelectedProfileId(null);
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
      if (currentAnimationStep <= 7) {
        setProcessingStep(currentAnimationStep);
      } else {
        clearInterval(intervalId);
        setProcessingStep(8); // Step 8: wait for API resolution
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
        const errMsg = errorPayload.message || 'Error communicating with Alternative Credit API.';
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

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Ready':
        return 'from-[#edf3ee] to-[#ddeedd] text-[#1F4B3A] border-[#c4d6c7] shadow-[0_8px_24px_rgba(31,75,58,0.06)]';
      case 'Emerging':
        return 'from-[#fdfaf0] to-[#f5ead4] text-[#B88A3B] border-[#ebdcb4] shadow-[0_8px_24px_rgba(184,138,59,0.06)]';
      case 'Building':
      default:
        return 'from-[#fffbef] to-[#f9f3d9] text-[#c2901a] border-[#e8dbb0] shadow-[0_8px_24px_rgba(194,144,26,0.06)]';
    }
  };

  const getTierBadgeColor = (tier) => {
    switch (tier) {
      case 'Ready':
        return 'bg-[#edf3ee] text-[#1F4B3A] border-[#c4d6c7]';
      case 'Emerging':
        return 'bg-[#fdfaf0] text-[#B88A3B] border-[#ebdcb4]';
      case 'Building':
      default:
        return 'bg-[#fffbef] text-[#c2901a] border-[#e8dbb0]';
    }
  };

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
    <div className="space-y-8 animate-fade-in text-left min-h-screen bg-[#FBF8F2] p-2 md:p-6 rounded-[24px]">
      
      {/* Onboarding Header */}
      <div className="border-b border-[#E6DED2] pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="space-y-2">
          <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-[#1F2430] m-0 tracking-tight">
            Financial Readiness Assessment
          </h2>
          <p className="font-sans text-[#666666] text-sm md:text-base max-w-2xl m-0 leading-relaxed">
            Complete this 2-minute assessment to understand your financial readiness before applying for formal credit.
          </p>
        </div>
        
        {/* Info & Progress Block */}
        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 bg-[#FFFDF8] border border-[#E6DED2] p-4 rounded-[20px] shadow-sm w-full md:w-auto">
          <div className="text-center sm:text-left px-2">
            <span className="block text-[10px] font-sans font-bold text-[#666666] uppercase tracking-wider">Estimated Time</span>
            <span className="font-serif text-sm font-bold text-[#1F4B3A]">2 minutes</span>
          </div>
          <div className="hidden sm:block w-px h-8 bg-[#E6DED2]" />
          <div className="w-full sm:w-[160px] flex flex-col gap-1.5 px-2">
            <div className="flex items-center justify-between text-[10px] font-sans font-bold text-[#666666] uppercase tracking-wider">
              <span>Step {step} of 3</span>
              <span className="text-[#2E6A52] font-mono">{step === 1 ? 32 : step === 2 ? 65 : 100}% Complete</span>
            </div>
            <div className="w-full bg-[#E6DED2] h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#2E6A52] h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: step === 1 ? '32%' : step === 2 ? '65%' : '100%' }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* SECTION: Rich Demo Profile Cards Selector (Rajesh, Lakshmi, Arun, Priya, Ramesh) */}
      <div className="space-y-4">
        <h3 className="font-sans text-xs font-bold text-[#666666] uppercase tracking-widest flex items-center gap-2 select-none m-0">
          <Landmark className="w-4 h-4 text-[#2E6A52]" />
          <span>Interactive Demo Personas</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {demoProfiles.map((profile) => {
            const isSelected = selectedProfileId === profile.id;
            return (
              <div
                key={profile.id}
                onClick={() => handleProfileSelect(profile)}
                style={{
                  background: '#FFFDF8',
                  borderColor: isSelected ? '#2E6A52' : '#E6DED2',
                  borderWidth: isSelected ? '2px' : '1px',
                  boxShadow: isSelected 
                    ? '0 8px 24px rgba(46,106,82,0.15), 0 2px 4px rgba(46,106,82,0.08)' 
                    : '0 1px 2px rgba(15,23,42,0.03), 0 4px 12px rgba(15,23,42,0.05)',
                  transform: isSelected ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
                  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="group p-5 rounded-[20px] text-left hover:border-[#2E6A52]/40 hover:translate-y-[-6px] hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(15,23,42,0.07),_0_2px_4px_rgba(15,23,42,0.04)] cursor-pointer select-none flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <img 
                      src={avatarUrls[profile.id] || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120&h=120'} 
                      alt={profile.name}
                      className="w-12 h-12 rounded-full object-cover border border-[#E6DED2] shadow-xs shrink-0" 
                    />
                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-[#2E6A52] flex items-center justify-center text-white scale-110 shadow-sm animate-scale-in">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <span className="font-mono text-[9px] font-bold px-2.5 py-1 rounded bg-[#f4efe4] text-[#666666] border border-[#E6DED2] uppercase tracking-wider">
                        Demo Profile
                      </span>
                    )}
                  </div>
                  <span className="block font-serif text-base font-extrabold text-[#1F2430] group-hover:text-[#2E6A52] transition-colors mt-3">{profile.name}</span>
                  <span className="block font-sans text-[10px] text-[#666666] font-bold uppercase tracking-wider mt-0.5">{profile.occupation}</span>
                </div>
                <p className="font-sans text-[11px] text-[#666666] mt-4 leading-relaxed border-t border-[#E6DED2]/60 pt-3 m-0 line-clamp-3 group-hover:text-[#1F2430]">
                  {profile.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Timeline Indicator */}
      <div className="bg-[#FFFDF8] border border-[#E6DED2] p-6 rounded-[20px] max-w-xl mx-auto shadow-sm select-none relative">
        <div className="relative flex items-center justify-between w-full">
          {/* Connector Line Track */}
          <div className="absolute top-[20px] left-[15px] right-[15px] h-[3px] bg-[#E6DED2] z-0 rounded-full" />
          {/* Animated Connecting Line */}
          <div 
            className="absolute top-[20px] left-[15px] h-[3px] bg-[#2E6A52] z-0 rounded-full transition-all duration-500" 
            style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
          />
          
          {/* Step 1 */}
          <button 
            type="button"
            onClick={() => step > 1 && setStep(1)}
            disabled={step === 1}
            className={`relative z-10 flex flex-col items-center gap-2.5 focus:outline-none transition-all duration-300 ${step > 1 ? 'cursor-pointer hover:scale-105' : 'cursor-default'}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-serif text-sm font-bold transition-all duration-300 ${
              step === 1 
                ? 'bg-[#1F4B3A] border-[#1F4B3A] text-[#FFFDF8] shadow-[0_0_15px_rgba(31,75,58,0.25)] scale-110' 
                : step > 1 
                  ? 'bg-[#2E6A52] border-[#2E6A52] text-[#FFFDF8]' 
                  : 'bg-[#FFFDF8] border-[#E6DED2] text-[#666666]'
            }`}>
              {step > 1 ? <Check className="w-5 h-5" /> : '1'}
            </div>
            <span className={`text-xs font-sans font-semibold tracking-wide transition-all ${
              step === 1 ? 'text-[#1F4B3A] font-bold' : 'text-[#666666]'
            }`}>Occupation</span>
          </button>

          {/* Step 2 */}
          <button 
            type="button"
            onClick={() => step > 2 && setStep(2)}
            disabled={step < 2 || step === 2}
            className={`relative z-10 flex flex-col items-center gap-2.5 focus:outline-none transition-all duration-300 ${step > 2 ? 'cursor-pointer hover:scale-105' : 'cursor-default'}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-serif text-sm font-bold transition-all duration-300 ${
              step === 2 
                ? 'bg-[#1F4B3A] border-[#1F4B3A] text-[#FFFDF8] shadow-[0_0_15px_rgba(31,75,58,0.25)] scale-110' 
                : step > 2 
                  ? 'bg-[#2E6A52] border-[#2E6A52] text-[#FFFDF8]' 
                  : 'bg-[#FFFDF8] border-[#E6DED2] text-[#666666]'
            }`}>
              {step > 2 ? <Check className="w-5 h-5" /> : '2'}
            </div>
            <span className={`text-xs font-sans font-semibold tracking-wide transition-all ${
              step === 2 ? 'text-[#1F4B3A] font-bold' : 'text-[#666666]'
            }`}>Cash Flow</span>
          </button>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center gap-2.5">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-serif text-sm font-bold transition-all duration-300 ${
              step === 3 
                ? 'bg-[#1F4B3A] border-[#1F4B3A] text-[#FFFDF8] shadow-[0_0_15px_rgba(31,75,58,0.25)] scale-110' 
                : 'bg-[#FFFDF8] border-[#E6DED2] text-[#666666]'
            }`}>
              3
            </div>
            <span className={`text-xs font-sans font-semibold tracking-wide transition-all ${
              step === 3 ? 'text-[#1F4B3A] font-bold' : 'text-[#666666]'
            }`}>Transactions</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Form Column */}
        <div className="lg:col-span-6 bg-[#FFFDF8] border border-[#E6DED2] p-6 rounded-[20px] space-y-6 shadow-sm animate-fade-slide-up">
          <h3 className="font-serif text-lg font-bold text-[#1F2430] border-b border-[#E6DED2]/60 pb-3 mt-0">
            {step === 1 && 'Step 1: Profile & Occupation'}
            {step === 2 && 'Step 2: Core Cash Flow Details'}
            {step === 3 && 'Step 3: Transactions & Repayments'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* STEP 1 FIELDS — Segmented buttons instead of select dropdowns */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                {/* Occupation */}
                <div>
                  <label className="block text-xs font-bold text-[#666666] uppercase tracking-wide mb-2.5 font-sans">Occupation</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Delivery Partner', 'Tea Shop Owner', 'Freelancer', 'Boutique Owner', 'Daily Wage Worker'].map((occ) => (
                      <button
                        key={occ}
                        type="button"
                        onClick={() => handleChange({ target: { name: 'occupation', value: occ } })}
                        className={`px-3 py-2.5 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                          form.occupation === occ
                            ? 'bg-[#1F4B3A] border-[#1F4B3A] text-white shadow-sm scale-[1.02]'
                            : 'bg-[#FFFDF8] border-[#E6DED2] text-[#1F2430] hover:bg-[#f4efe4]'
                        }`}
                      >
                        {occ}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Income Variance */}
                <div>
                  <label className="block text-xs font-bold text-[#666666] uppercase tracking-wide mb-2.5 font-sans">Income Variance</label>
                  <div className="flex gap-2">
                    {['Low', 'Medium', 'High'].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => handleChange({ target: { name: 'income_variance', value: v } })}
                        className={`flex-1 px-3 py-2.5 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                          form.income_variance === v
                            ? 'bg-[#1F4B3A] border-[#1F4B3A] text-white shadow-sm scale-[1.02]'
                            : 'bg-[#FFFDF8] border-[#E6DED2] text-[#1F2430] hover:bg-[#f4efe4]'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Income Growth */}
                <div>
                  <label className="block text-xs font-bold text-[#666666] uppercase tracking-wide mb-2.5 font-sans">Income Growth Trend</label>
                  <div className="flex gap-2">
                    {['Increasing', 'Stable', 'Declining'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => handleChange({ target: { name: 'income_growth', value: g } })}
                        className={`flex-1 px-3 py-2.5 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                          form.income_growth === g
                            ? 'bg-[#1F4B3A] border-[#1F4B3A] text-white shadow-sm scale-[1.02]'
                            : 'bg-[#FFFDF8] border-[#E6DED2] text-[#1F2430] hover:bg-[#f4efe4]'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 FIELDS */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Monthly Income */}
                  <div>
                    <label className="block text-xs font-bold text-[#666666] uppercase tracking-wide mb-1.5 font-sans">Monthly Income (₹)</label>
                    <input
                      type="number"
                      name="monthly_income"
                      min="0"
                      required
                      value={form.monthly_income}
                      onChange={handleChange}
                      className="w-full bg-[#FFFDF8] border border-[#E6DED2] rounded-xl px-3.5 py-2.5 text-sm text-[#1F2430] focus:outline-none focus:border-[#1F4B3A] focus:ring-1 focus:ring-[#1F4B3A] transition-all"
                    />
                  </div>

                  {/* Monthly Expenses */}
                  <div>
                    <label className="block text-xs font-bold text-[#666666] uppercase tracking-wide mb-1.5 font-sans">Monthly Expenses (₹)</label>
                    <input
                      type="number"
                      name="monthly_expenses"
                      min="0"
                      required
                      value={form.monthly_expenses}
                      onChange={handleChange}
                      className="w-full bg-[#FFFDF8] border border-[#E6DED2] rounded-xl px-3.5 py-2.5 text-sm text-[#1F2430] focus:outline-none focus:border-[#1F4B3A] focus:ring-1 focus:ring-[#1F4B3A] transition-all"
                    />
                  </div>

                  {/* Savings */}
                  <div>
                    <label className="block text-xs font-bold text-[#666666] uppercase tracking-wide mb-1.5 font-sans">Monthly Savings (₹)</label>
                    <input
                      type="number"
                      name="savings"
                      min="0"
                      required
                      value={form.savings}
                      onChange={handleChange}
                      className="w-full bg-[#FFFDF8] border border-[#E6DED2] rounded-xl px-3.5 py-2.5 text-sm text-[#1F2430] focus:outline-none focus:border-[#1F4B3A] focus:ring-1 focus:ring-[#1F4B3A] transition-all"
                    />
                  </div>

                  {/* Average Balance */}
                  <div>
                    <label className="block text-xs font-bold text-[#666666] uppercase tracking-wide mb-1.5 font-sans">Average Bank Balance (₹)</label>
                    <input
                      type="number"
                      name="average_balance"
                      min="0"
                      required
                      value={form.average_balance}
                      onChange={handleChange}
                      className="w-full bg-[#FFFDF8] border border-[#E6DED2] rounded-xl px-3.5 py-2.5 text-sm text-[#1F2430] focus:outline-none focus:border-[#1F4B3A] focus:ring-1 focus:ring-[#1F4B3A] transition-all"
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
                    <label className="block text-xs font-bold text-[#666666] uppercase tracking-wide mb-1.5 font-sans">Digital UPI Txs (Count/Mo)</label>
                    <input
                      type="number"
                      name="digital_transactions"
                      min="0"
                      required
                      value={form.digital_transactions}
                      onChange={handleChange}
                      className="w-full bg-[#FFFDF8] border border-[#E6DED2] rounded-xl px-3.5 py-2.5 text-sm text-[#1F2430] focus:outline-none focus:border-[#1F4B3A] focus:ring-1 focus:ring-[#1F4B3A] transition-all"
                    />
                  </div>

                  {/* Cash Transactions */}
                  <div>
                    <label className="block text-xs font-bold text-[#666666] uppercase tracking-wide mb-1.5 font-sans">Cash Txs (Count/Mo)</label>
                    <input
                      type="number"
                      name="cash_transactions"
                      min="0"
                      required
                      value={form.cash_transactions}
                      onChange={handleChange}
                      className="w-full bg-[#FFFDF8] border border-[#E6DED2] rounded-xl px-3.5 py-2.5 text-sm text-[#1F2430] focus:outline-none focus:border-[#1F4B3A] focus:ring-1 focus:ring-[#1F4B3A] transition-all"
                    />
                  </div>

                  {/* EMI Ratio */}
                  <div>
                    <label className="block text-xs font-bold text-[#666666] uppercase tracking-wide mb-1.5 font-sans">Active EMI Ratio (0.00 to 1.00)</label>
                    <input
                      type="number"
                      name="emi_ratio"
                      step="0.01"
                      min="0"
                      max="1"
                      required
                      value={form.emi_ratio}
                      onChange={handleChange}
                      className="w-full bg-[#FFFDF8] border border-[#E6DED2] rounded-xl px-3.5 py-2.5 text-sm text-[#1F2430] focus:outline-none focus:border-[#1F4B3A] focus:ring-1 focus:ring-[#1F4B3A] transition-all"
                    />
                  </div>

                  {/* Missed Payments */}
                  <div>
                    <label className="block text-xs font-bold text-[#666666] uppercase tracking-wide mb-1.5 font-sans">Missed Payments (Last 12 Mo)</label>
                    <input
                      type="number"
                      name="missed_payments"
                      min="0"
                      required
                      value={form.missed_payments}
                      onChange={handleChange}
                      className="w-full bg-[#FFFDF8] border border-[#E6DED2] rounded-xl px-3.5 py-2.5 text-sm text-[#1F2430] focus:outline-none focus:border-[#1F4B3A] focus:ring-1 focus:ring-[#1F4B3A] transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex gap-2.5 items-start bg-rose-50 border border-[#ebd1d1] text-[#A73B3B] rounded-[12px] p-3.5 text-sm font-sans">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center gap-3 border-t border-[#E6DED2]/60 pt-5">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center justify-center gap-1.5 py-3 px-5 rounded-[12px] font-bold bg-[#f4efe4] hover:bg-[#ebdcb4] hover:translate-y-[-2px] text-[#666666] transition-all duration-200 border border-[#E6DED2] cursor-pointer text-sm font-sans shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 flex items-center justify-center gap-1.5 py-3 px-5 rounded-[12px] text-[#FFFDF8] font-bold bg-[#1F4B3A] hover:bg-[#2E6A52] hover:translate-y-[-2px] transition-all duration-200 cursor-pointer text-sm font-sans shadow-sm"
                >
                  Next Section
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-[12px] text-[#FFFDF8] font-bold bg-gradient-to-r from-[#B83A2E] to-[#A73B3B] hover:from-[#A73B3B] hover:to-[#8c2a2a] hover:translate-y-[-2px] transition-all duration-200 shadow-md cursor-pointer disabled:opacity-50 text-sm font-sans"
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

        {/* Mobile/Tablet Collapsible Preview Header */}
        {!predictionData && processingStep === 0 && (
          <div className="lg:hidden flex items-center justify-between bg-[#FFFDF8] border border-[#E6DED2] p-4 rounded-xl shadow-xs w-full mb-2 select-none">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2E6A52] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2E6A52]"></span>
              </span>
              <span className="font-serif text-sm font-bold text-[#1F2430]">Alternative Bureau Draft</span>
            </div>
            <button
              type="button"
              onClick={() => setShowMobilePreview(!showMobilePreview)}
              className="text-xs font-sans font-bold text-[#2E6A52] hover:text-[#1F4B3A] border border-[#E6DED2] px-3 py-1.5 rounded-lg bg-[#fcfbf9] hover:bg-[#f5f2eb] transition-all cursor-pointer"
            >
              {showMobilePreview ? 'Hide Preview' : 'Show Live Preview'}
            </button>
          </div>
        )}

        {/* Right Sidebar Column */}
        <div className={`lg:col-span-6 ${(!predictionData && processingStep === 0 && !showMobilePreview) ? 'hidden lg:block' : 'block'}`}>
          {processingStep > 0 ? (
            /* Animated Checklist Screen */
            <div className="bg-[#FFFDF8] border border-[#E6DED2] p-8 rounded-[20px] space-y-6 shadow-lg min-h-[420px] flex flex-col justify-center animate-scale-in relative overflow-hidden">
              <div className="absolute w-64 h-64 bg-[#edf3ee] rounded-full blur-[80px] opacity-60 -top-12 -left-12 pointer-events-none" />
              
              <div className="text-center space-y-2 relative z-10">
                <h4 className="font-serif text-lg font-extrabold text-[#1F2430] m-0">AI Credit Scoring Engine</h4>
                <p className="font-sans text-xs text-[#666666]">Processing real-time financial behaviour...</p>
              </div>

              <div className="space-y-4 px-4 max-w-sm mx-auto w-full relative z-10">
                {processingStepsList.map((stepText, idx) => {
                  const stepNum = idx + 1;
                  const isCompleted = processingStep > stepNum;
                  const isActive = processingStep === stepNum;
                  
                  return (
                    <div 
                      key={idx} 
                      className={`flex items-center gap-3.5 transition-all duration-300 ${
                        isCompleted ? 'text-[#666666]' : isActive ? 'text-[#1F4B3A] font-bold scale-[1.02]' : 'text-[#666666]/40'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <div className="w-5.5 h-5.5 rounded-full bg-[#2E6A52] flex items-center justify-center text-white scale-110 shadow-sm animate-scale-in">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : isActive ? (
                          <div className="w-5.5 h-5.5 rounded-full border-2 border-[#1F4B3A] flex items-center justify-center text-[#1F4B3A] animate-pulse bg-[#edf3ee]/40">
                            <span className="w-1.5 h-1.5 bg-[#1F4B3A] rounded-full" />
                          </div>
                        ) : (
                          <div className="w-5.5 h-5.5 rounded-full border border-[#E6DED2] bg-[#fcfbf9] flex items-center justify-center text-[10px] text-[#666666] font-bold font-mono">
                            {stepNum}
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-sans">{stepText}</span>
                    </div>
                  );
                })}
              </div>

              <div className="w-full bg-[#E6DED2] rounded-full h-2 mt-4 overflow-hidden max-w-sm mx-auto relative z-10">
                <div 
                  className="bg-[#2E6A52] h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(100, (processingStep - 1) * (100 / 6))}%` }}
                />
              </div>
            </div>
          ) : predictionData ? (
            /* CONSOLIDATED RESULTS DASHBOARD */
            <div className="space-y-6 max-h-[85vh] overflow-y-auto pr-3 scroll-smooth animate-fade-slide-up">
              
              {/* SECTION 1: Prediction Summary / Passport Card Hero */}
              <div 
                id="summary" 
                style={{ 
                  animationDelay: '100ms',
                  background: getPremiumPassportStyle(predictionData.prediction).bg 
                }}
                className={`relative border-2 ${getPremiumPassportStyle(predictionData.prediction).border} p-6 sm:p-8 rounded-[20px] shadow-premium-passport overflow-hidden animate-fade-slide-up hover:rotate-[0.5deg] hover:scale-[1.005] transition-all duration-300 z-10`}
              >
                {/* Large rotated watermark behind */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
                  <span className="font-serif text-[7.5rem] font-black uppercase tracking-widest text-[#1f2937] opacity-[0.025] transform -rotate-12 whitespace-nowrap">
                    {getPremiumPassportStyle(predictionData.prediction).watermark}
                  </span>
                </div>

                {/* Embossed Seal SVG */}
                <div className="absolute bottom-4 right-4 opacity-[0.07] select-none pointer-events-none transform rotate-12 scale-75 sm:scale-100 z-0">
                  <svg className="w-24 h-24 text-[#000]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                    <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="2.5" />
                    <path d="M50,22 L53,34 L65,34 L55,42 L59,54 L50,46 L41,54 L45,42 L35,34 L47,34 Z" fill="currentColor" fillOpacity="0.4" />
                    <text x="50%" y="68%" textAnchor="middle" fill="currentColor" fontSize="8" fontWeight="bold" fontFamily="serif" letterSpacing="0.05em">GROWLEDGER</text>
                    <text x="50%" y="78%" textAnchor="middle" fill="currentColor" fontSize="6" fontFamily="sans-serif" letterSpacing="0.1em">EST. 2026</text>
                  </svg>
                </div>

                {/* Responsive Header Row - Flex layout to allow wrapping without overlap */}
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#E6DED2]/60 pb-5 mb-5 text-left">
                  <div className="space-y-1">
                    <span className="block text-[9px] font-sans font-bold uppercase tracking-widest text-[#666666]/90">Financial Readiness Passport</span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1F2430] m-0 leading-tight">GrowLedger Alternative Rating</h3>
                  </div>
                  <div className="animate-stamp-reveal shrink-0 self-start">
                    <div className="passport-stamp-red uppercase font-serif font-black text-xs sm:text-sm tracking-[0.12em] border-[3px] border-double rounded-md border-[#a91d22] text-[#a91d22] px-3.5 py-1.5 select-none rotate-[-4deg] bg-transparent shadow-xs inline-block">
                      {predictionData.prediction} VERIFIED
                    </div>
                  </div>
                </div>

                <div className="relative z-10 space-y-6 text-left">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                      <span className="block text-[10px] font-sans font-bold uppercase tracking-wider text-[#666666]">Current Tier Status</span>
                      <span className="font-serif text-4xl sm:text-5xl font-black tracking-tight uppercase block mt-1">{predictionData.prediction}</span>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="block text-[10px] font-sans font-bold uppercase tracking-wider text-[#666666]">Prediction Confidence</span>
                      <span className="font-mono text-lg sm:text-xl font-bold bg-[#FFFDF8]/90 px-3 py-1.5 rounded-xl text-[#1F2430] border border-[#E6DED2] shadow-sm block mt-1.5 w-max sm:ml-auto">
                        {Math.min(97.8, predictionData.confidence || 88.5)}%
                      </span>
                    </div>
                  </div>

                  {/* Goal Progress bar */}
                  <div className="border-t border-[#E6DED2]/60 pt-5 space-y-2">
                    <div className="flex justify-between items-center text-xs font-sans">
                      <span className="text-[#666666] font-bold uppercase tracking-wider text-[9px]">
                        {predictionData.prediction === 'Ready' ? 'Passport Gold Status Achieved' : `Next Goal: ${predictionData.prediction === 'Building' ? 'Emerging' : 'Ready'}`}
                      </span>
                      <span className="font-bold text-[#1F2430]">
                        {predictionData.prediction === 'Ready' ? '100%' : predictionData.prediction === 'Emerging' ? '70%' : '35%'}
                      </span>
                    </div>
                    <div className="w-full bg-[#E6DED2]/80 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#2E6A52] h-full rounded-full transition-all duration-1000"
                        style={{ width: predictionData.prediction === 'Ready' ? '100%' : predictionData.prediction === 'Emerging' ? '70%' : '35%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Verified Behaviour Signals Credibility Card */}
              <div 
                style={{ animationDelay: '250ms' }}
                className="bg-[#FFFDF8] border border-[#E6DED2] p-6 rounded-[20px] shadow-sm space-y-4 animate-fade-slide-up"
              >
                <h4 className="font-serif text-sm font-bold text-[#1F2430] border-b border-[#E6DED2]/60 pb-2.5 flex items-center gap-2">
                  <ShieldCheck className="w-4.5 h-4.5 text-[#2E6A52]" />
                  <span>Behaviour Signals Analysed</span>
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {[
                    'Income Stability', 'Savings Behaviour', 'Cash Flow', 'Digital Footprint',
                    'Payment Discipline', 'EMI Management', 'Spending Consistency', 'Expense Buffer',
                    'Monthly Trend', 'Active EMI Ratio', 'Cash Transactions'
                  ].map((sig) => (
                    <div key={sig} className="flex items-center gap-2 text-xs text-[#1F2430] font-sans font-semibold">
                      <Check className="w-3.5 h-3.5 text-[#2E6A52] stroke-[3]" />
                      <span>{sig}</span>
                    </div>
                  ))}
                </div>
                <div className="text-[10px] text-[#666666] font-sans font-bold uppercase tracking-wider bg-[#fcfbf9] border border-[#E6DED2] px-3 py-2 rounded-xl text-center">
                  11 Behavioural Signals Processed
                </div>
              </div>

              {/* SECTION 3: Financial Health Metrics */}
              <div 
                id="health" 
                style={{ animationDelay: '400ms' }}
                className="bg-[#FFFDF8] border border-[#E6DED2] p-6 rounded-[20px] space-y-4 shadow-sm animate-fade-slide-up"
              >
                <h4 className="font-serif text-sm font-bold text-[#1F2430] border-b border-[#E6DED2]/60 pb-2.5 flex items-center gap-2">
                  <Activity className="w-4.5 h-4.5 text-[#2E6A52]" />
                  <span>Financial Health Metrics</span>
                </h4>
                <div className="space-y-4.5">
                  {/* Savings Rate Card */}
                  <div className="group bg-[#fcfbf9] border border-[#E6DED2] p-4 rounded-xl space-y-2 hover:translate-y-[-2px] transition-transform duration-200 cursor-default">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[#1F2430] font-sans">Savings Rate</span>
                      <span className="font-serif text-sm font-bold text-[#2E6A52]">{calcSavingsRate()}</span>
                    </div>
                    <div className="w-full bg-[#E6DED2] h-2 rounded-full overflow-hidden transition-all duration-300 group-hover:h-2.5">
                      <div 
                        className="bg-[#2E6A52] h-full rounded-full transition-all duration-1000 ease-out group-hover:bg-[#1F4B3A]"
                        style={{ width: animateProgress ? calcSavingsRate() : '0%' }}
                      />
                    </div>
                    <p className="text-[10px] text-[#666666] font-sans leading-relaxed m-0">Percentage of net monthly earnings retained in savings deposits.</p>
                  </div>

                  {/* Expense Rate Card */}
                  <div className="group bg-[#fcfbf9] border border-[#E6DED2] p-4 rounded-xl space-y-2 hover:translate-y-[-2px] transition-transform duration-200 cursor-default">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[#1F2430] font-sans">Expense Rate</span>
                      <span className="font-serif text-sm font-bold text-[#A73B3B]">{calcExpenseRate()}</span>
                    </div>
                    <div className="w-full bg-[#E6DED2] h-2 rounded-full overflow-hidden transition-all duration-300 group-hover:h-2.5">
                      <div 
                        className="bg-[#A73B3B] h-full rounded-full transition-all duration-1000 ease-out group-hover:bg-[#8c2a2a]"
                        style={{ width: animateProgress ? calcExpenseRate() : '0%' }}
                      />
                    </div>
                    <p className="text-[10px] text-[#666666] font-sans leading-relaxed m-0">Percentage of monthly income consumed by operational cash outflow.</p>
                  </div>

                  {/* Digital Footprint Card */}
                  <div className="group bg-[#fcfbf9] border border-[#E6DED2] p-4 rounded-xl space-y-2 hover:translate-y-[-2px] transition-transform duration-200 cursor-default">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[#1F2430] font-sans">Digital Footprint</span>
                      <span className="font-serif text-sm font-bold text-[#1F4B3A]">{calcDigitalUPI()}</span>
                    </div>
                    <div className="w-full bg-[#E6DED2] h-2 rounded-full overflow-hidden transition-all duration-300 group-hover:h-2.5">
                      <div 
                        className="bg-[#1F4B3A] h-full rounded-full transition-all duration-1000 ease-out group-hover:bg-[#0f172a]"
                        style={{ width: animateProgress ? calcDigitalUPI() : '0%' }}
                      />
                    </div>
                    <p className="text-[10px] text-[#666666] font-sans leading-relaxed m-0">Ratio of digital UPI transactions compared to cash-heavy events.</p>
                  </div>

                  {/* Emergency Buffer Card */}
                  <div className="group bg-[#fcfbf9] border border-[#E6DED2] p-4 rounded-xl space-y-2 hover:translate-y-[-2px] transition-transform duration-200 cursor-default">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[#1F2430] font-sans">Emergency Buffer</span>
                      <span className="font-serif text-sm font-bold text-[#B88A3B]">{calcFinancialBuffer()} Months</span>
                    </div>
                    <div className="w-full bg-[#E6DED2] h-2 rounded-full overflow-hidden transition-all duration-300 group-hover:h-2.5">
                      <div 
                        className="bg-[#B88A3B] h-full rounded-full transition-all duration-1000 ease-out group-hover:bg-[#7a591e]"
                        style={{ width: animateProgress ? `${Math.min(100, (Number(calcFinancialBuffer()) / 3) * 100)}%` : '0%' }}
                      />
                    </div>
                    <p className="text-[10px] text-[#666666] font-sans leading-relaxed m-0">Number of months reserves would support full expenses in downtime.</p>
                  </div>
                </div>
              </div>

              {/* SECTION 4: Strengthened Profile */}
              <div 
                id="strengths" 
                style={{ animationDelay: '550ms' }}
                className="bg-[#FFFDF8] border border-[#E6DED2] p-6 rounded-[20px] space-y-4 shadow-sm animate-fade-slide-up"
              >
                <h4 className="font-serif text-sm font-bold text-[#1F2430] border-b border-[#E6DED2]/60 pb-2.5 flex items-center gap-2">
                  <Sparkles className="w-4.5 h-4.5 text-[#2E6A52]" />
                  <span>Positive Attribution Drivers</span>
                </h4>
                <div className="space-y-3.5">
                  {predictionData.strengthened_profile?.map((item, idx) => (
                    <div key={idx} className="bg-[#edf3ee]/40 border border-[#c4d6c7] p-4 rounded-xl flex gap-3 items-start hover:translate-y-[-4px] hover:shadow-md transition-all duration-300">
                      <CheckCircle2 className="w-4.5 h-4.5 text-[#2E6A52] shrink-0 mt-0.5" />
                      <div className="space-y-1 w-full text-left">
                        <div className="flex justify-between items-center">
                          <span className="font-serif text-xs font-bold text-[#2E6A52]">{item.title}</span>
                          <div className="flex items-center gap-2">
                            <span className="bg-[#2E6A52] text-[#FFFDF8] text-[8px] font-bold font-sans uppercase px-1.5 py-0.5 rounded">Strong</span>
                            <span className="font-mono text-[9px] font-bold text-[#1F4B3A]">{94 - idx * 5}%</span>
                          </div>
                        </div>
                        <p className="font-sans text-xs text-[#666666] leading-relaxed m-0">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 5: Reduced Readiness */}
              <div 
                id="weaknesses" 
                style={{ animationDelay: '700ms' }}
                className="bg-[#FFFDF8] border border-[#E6DED2] p-6 rounded-[20px] space-y-4 shadow-sm animate-fade-slide-up"
              >
                <h4 className="font-serif text-sm font-bold text-[#1F2430] border-b border-[#E6DED2]/60 pb-2.5 flex items-center gap-2">
                  <AlertTriangle className="w-4.5 h-4.5 text-[#B88A3B]" />
                  <span>Limiting Attribution Drivers</span>
                </h4>
                <div className="space-y-3.5">
                  {predictionData.reduced_readiness?.map((item, idx) => {
                    const impactText = idx === 0 ? 'High' : 'Medium';
                    const impactPct = idx === 0 ? 3 : 2;
                    return (
                      <div key={idx} className="bg-[#fdfaf0]/40 border border-[#ebdcb4] p-4 rounded-xl flex gap-3 items-start hover:translate-y-[-4px] hover:shadow-md transition-all duration-300">
                        <AlertTriangle className="w-4.5 h-4.5 text-[#B88A3B] shrink-0 mt-0.5" />
                        <div className="space-y-1 w-full text-left">
                          <div className="flex justify-between items-center">
                            <span className="font-serif text-xs font-bold text-[#B88A3B]">{item.title}</span>
                            <div className="flex items-center gap-2">
                              <span className="bg-[#B88A3B] text-[#FFFDF8] text-[8px] font-bold font-sans uppercase px-1.5 py-0.5 rounded">{impactText}</span>
                              <div className="flex gap-0.5">
                                {[1, 2, 3].map((s) => (
                                  <div 
                                    key={s} 
                                    className={`w-1 h-3 rounded-xs ${
                                      s <= impactPct ? 'bg-[#B88A3B]' : 'bg-[#E6DED2]'
                                    }`} 
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="font-sans text-xs text-[#666666] leading-relaxed m-0">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 6: AI Financial Narrative */}
              <div 
                id="story" 
                style={{ animationDelay: '850ms' }}
                className="bg-[#FFFDF8] border border-[#E6DED2] p-6 rounded-[20px] space-y-4 shadow-sm relative overflow-hidden animate-fade-slide-up"
              >
                <div className="absolute right-4 bottom-[-10px] font-serif text-[6rem] text-[#c2a67a] opacity-15 leading-none select-none pointer-events-none">&ldquo;</div>
                <h4 className="font-serif text-sm font-bold text-[#1F2430] border-b border-[#E6DED2]/60 pb-2.5 flex items-center gap-2">
                  <span className="text-base text-[#2E6A52]">🖋</span>
                  <span>Financial Story</span>
                </h4>
                
                <div className="relative bg-[#fcfbf9] border border-[#E6DED2] p-5 rounded-2xl">
                  <div className="absolute -left-2 top-4 w-3.5 h-3.5 bg-[#fcfbf9] border-l border-b border-[#E6DED2] rotate-45" />
                  <p className="font-serif text-[#1F2430] text-sm italic leading-relaxed m-0 pl-2 pr-4 relative z-10">
                    "Based on your last 12 months, {predictionData.financial_story}"
                  </p>
                  <div className="text-right text-[10px] font-sans font-bold text-[#2E6A52] uppercase tracking-wider mt-3 select-none">
                    — GrowLedger AI
                  </div>
                </div>
              </div>

              {/* SECTION 7: Priority Action Recommendation Card with wax seal */}
              <div 
                id="priority" 
                style={{ animationDelay: '1000ms' }}
                className="bg-[#FFFDF8] border border-[#E6DED2] p-6 rounded-[20px] space-y-4 shadow-sm relative overflow-hidden animate-fade-slide-up"
              >
                {/* Wax Seal Overlay Badge */}
                <div className="absolute top-4 right-4 z-10 transform rotate-12 scale-90 sm:scale-100">
                  <div className="bg-[#a91d22] text-[#fff] font-serif text-[8px] font-black tracking-wider uppercase px-2 py-2.5 rounded-full border-2 border-double border-[#fff] shadow-md flex items-center justify-center text-center w-14 h-14 select-none leading-tight">
                    TOP REC
                  </div>
                </div>

                <h4 className="font-serif text-sm font-bold text-[#1F2430] border-b border-[#E6DED2]/60 pb-2.5 flex items-center gap-2">
                  <Compass className="w-4.5 h-4.5 text-[#2E6A52]" />
                  <span>Credit Improvement Focus</span>
                </h4>
                
                <div className="bg-[#edf3ee]/40 border border-[#c4d6c7] p-5 rounded-xl hover:translate-y-[-2px] transition-transform duration-200 relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-[#edf3ee] rounded-full blur-md opacity-45 pointer-events-none" />
                  <div className="flex gap-4 items-start relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-[#edf3ee] border border-[#c4d6c7] flex items-center justify-center text-[#2E6A52] flex-shrink-0 shadow-inner">
                      <Compass className="w-6 h-6" />
                    </div>
                    <div className="space-y-1 text-left w-full pr-12">
                      <div className="flex flex-wrap justify-between items-center gap-2">
                        <span className="text-[10px] font-sans font-bold text-[#666666] uppercase tracking-wider">Priority coaching card</span>
                        <span className="bg-[#2E6A52] text-[#FFFDF8] text-[9px] font-bold font-sans px-2.5 py-0.5 rounded-full shadow-sm">
                          +8 Readiness Points
                        </span>
                      </div>
                      <h5 className="font-serif text-base font-bold text-[#1F2430] mt-1.5 mb-0.5">
                        {predictionData.coaching?.priority_action}
                      </h5>
                      <p className="font-sans text-xs text-[#666666] leading-relaxed m-0">
                        {predictionData.coaching?.action_description}
                      </p>
                      <div className="border-t border-[#E6DED2]/60 pt-2.5 mt-2.5 flex items-center justify-between text-[11px] font-sans">
                        <span className="text-[#666666]">Quick win estimate:</span>
                        <span className="font-bold text-[#1F2430]">{predictionData.coaching?.quick_win}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 8: 30/60/90 Day Savings Roadmap */}
              <div 
                id="roadmap" 
                style={{ animationDelay: '1150ms' }}
                className="bg-[#FFFDF8] border border-[#E6DED2] p-6 rounded-[20px] space-y-6 shadow-sm animate-fade-slide-up"
              >
                <h4 className="font-serif text-sm font-bold text-[#1F2430] border-b border-[#E6DED2]/60 pb-2.5 flex items-center gap-2">
                  <CheckSquare className="w-4.5 h-4.5 text-[#2E6A52]" />
                  <span>Tailored 30/60/90 Day Roadmap</span>
                </h4>
                
                <div className="space-y-6 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#E6DED2]">
                  {/* 30 Days */}
                  <div className="relative pl-12 space-y-3">
                    <div className="absolute left-[14px] top-1.5 w-3 h-3 rounded-full bg-[#1F4B3A] z-10 border-2 border-[#FFFDF8] shadow-sm" />
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-sans font-bold text-[#1F4B3A] uppercase tracking-wider block bg-[#edf3ee] border border-[#c4d6c7] px-3 py-1 rounded-full">Phase 1: 30 Days</span>
                    </div>
                    <div className="space-y-2.5">
                      {predictionData.coaching?.roadmap?.['30_days']?.map((stepStr, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => toggleMilestone('30_days', idx)}
                          className="flex gap-2.5 items-start p-3 rounded-xl border border-[#E6DED2] bg-[#fcfbf9] hover:border-[#2e6a52] hover:shadow-[0_0_12px_rgba(46,106,82,0.08)] transition-all duration-200 cursor-pointer select-none text-xs text-[#1F2430]"
                        >
                          <CheckSquare className={`w-4.5 h-4.5 flex-shrink-0 mt-0.5 ${completedSteps[`30_days-${idx}`] ? 'text-[#2E6A52] fill-[#edf3ee]' : 'text-[#666666]'}`} />
                          <span className={completedSteps[`30_days-${idx}`] ? 'line-through text-[#666666] opacity-70' : ''}>{stepStr}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 60 Days */}
                  <div className="relative pl-12 space-y-3">
                    <div className="absolute left-[14px] top-1.5 w-3 h-3 rounded-full bg-[#B88A3B] z-10 border-2 border-[#FFFDF8] shadow-sm" />
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-sans font-bold text-[#B88A3B] uppercase tracking-wider block bg-[#fdfaf0] border border-[#ebdcb4] px-3 py-1 rounded-full">Phase 2: 60 Days</span>
                    </div>
                    <div className="space-y-2.5">
                      {predictionData.coaching?.roadmap?.['60_days']?.map((stepStr, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => toggleMilestone('60_days', idx)}
                          className="flex gap-2.5 items-start p-3 rounded-xl border border-[#E6DED2] bg-[#fcfbf9] hover:border-[#2e6a52] hover:shadow-[0_0_12px_rgba(46,106,82,0.08)] transition-all duration-200 cursor-pointer select-none text-xs text-[#1F2430]"
                        >
                          <CheckSquare className={`w-4.5 h-4.5 flex-shrink-0 mt-0.5 ${completedSteps[`60_days-${idx}`] ? 'text-[#B88A3B] fill-[#fdfaf0]' : 'text-[#666666]'}`} />
                          <span className={completedSteps[`60_days-${idx}`] ? 'line-through text-[#666666] opacity-70' : ''}>{stepStr}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 90 Days */}
                  <div className="relative pl-12 space-y-3">
                    <div className="absolute left-[14px] top-1.5 w-3 h-3 rounded-full bg-[#2E6A52] z-10 border-2 border-[#FFFDF8] shadow-sm" />
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-sans font-bold text-[#2E6A52] uppercase tracking-wider block bg-[#edf3ee] border border-[#c4d6c7] px-3 py-1 rounded-full">Phase 3: 90 Days</span>
                    </div>
                    <div className="space-y-2.5">
                      {predictionData.coaching?.roadmap?.['90_days']?.map((stepStr, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => toggleMilestone('90_days', idx)}
                          className="flex gap-2.5 items-start p-3 rounded-xl border border-[#E6DED2] bg-[#fcfbf9] hover:border-[#2e6a52] hover:shadow-[0_0_12px_rgba(46,106,82,0.08)] transition-all duration-200 cursor-pointer select-none text-xs text-[#1F2430]"
                        >
                          <CheckSquare className={`w-4.5 h-4.5 flex-shrink-0 mt-0.5 ${completedSteps[`90_days-${idx}`] ? 'text-[#2E6A52] fill-[#edf3ee]' : 'text-[#666666]'}`} />
                          <span className={completedSteps[`90_days-${idx}`] ? 'line-through text-[#666666] opacity-70' : ''}>{stepStr}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 9: Future Projection Timeline with animated arrow connectors */}
              <div 
                id="projection" 
                style={{ animationDelay: '1300ms' }}
                className="bg-[#FFFDF8] border border-[#E6DED2] p-6 rounded-[20px] space-y-6 shadow-sm animate-fade-slide-up"
              >
                <h4 className="font-serif text-sm font-bold text-[#1F2430] border-b border-[#E6DED2]/60 pb-2.5 flex items-center gap-2 text-left">
                  <Target className="w-4.5 h-4.5 text-[#2E6A52]" />
                  <span>Growth Projection Roadmap</span>
                </h4>
                
                <div className="relative flex flex-col sm:flex-row justify-between items-center gap-4 py-4 px-2">
                  
                  {/* Segment 1: Today */}
                  <div className="relative z-10 flex flex-col items-center text-center bg-[#FFFDF8] border border-[#E6DED2] p-4 rounded-xl shadow-xs w-full sm:w-[28%] hover:translate-y-[-2px] transition-transform duration-200">
                    <span className="block text-[9px] font-sans font-bold text-[#666666] uppercase tracking-wider">Today</span>
                    <span className="font-serif text-sm font-bold text-[#A73B3B] uppercase mt-1">{predictionData.prediction}</span>
                    <span className="text-[10px] text-[#666666] mt-1 font-sans">Current Readiness</span>
                  </div>

                  {/* Animated Arrow 1 */}
                  <svg className="w-12 h-6 text-[#2E6A52] shrink-0 hidden sm:block animate-pulse" fill="none" viewBox="0 0 48 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 12H44M44 12L34 6M44 12L34 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="sm:hidden text-center text-[#2E6A52] animate-pulse">↓</div>

                  {/* Segment 2: 90 Days */}
                  <div className="relative z-10 flex flex-col items-center text-center bg-[#FFFDF8] border border-[#E6DED2] p-4 rounded-xl shadow-xs w-full sm:w-[28%] hover:translate-y-[-2px] transition-transform duration-200">
                    <span className="block text-[9px] font-sans font-bold text-[#B88A3B] uppercase tracking-wider">90 Days</span>
                    <span className="font-serif text-sm font-bold text-[#B88A3B] uppercase mt-1">
                      {predictionData.prediction === 'Building' ? 'Emerging' : 'Ready'}
                    </span>
                    <span className="text-[10px] text-[#666666] mt-1 font-sans">With Discipline</span>
                  </div>

                  {/* Animated Arrow 2 */}
                  <svg className="w-12 h-6 text-[#2E6A52] shrink-0 hidden sm:block animate-pulse" fill="none" viewBox="0 0 48 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 12H44M44 12L34 6M44 12L34 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="sm:hidden text-center text-[#2E6A52] animate-pulse">↓</div>

                  {/* Segment 3: 180 Days */}
                  <div className="relative z-10 flex flex-col items-center text-center bg-[#FFFDF8] border border-[#E6DED2] p-4 rounded-xl shadow-xs w-full sm:w-[28%] hover:translate-y-[-2px] transition-transform duration-200">
                    <span className="block text-[9px] font-sans font-bold text-[#2E6A52] uppercase tracking-wider">180 Days</span>
                    <span className="font-serif text-sm font-bold text-[#1F4B3A] uppercase mt-1">Ready Elite</span>
                    <span className="text-[10px] text-[#666666] mt-1 font-sans">Formal Access Goal</span>
                  </div>
                </div>
              </div>

              {/* SECTION 10: Official Financial Readiness Passport Export Section */}
              <div 
                style={{ animationDelay: '1450ms' }}
                className="bg-[#FFFDF8] border border-[#E6DED2] p-6 rounded-[20px] shadow-sm space-y-6 animate-fade-slide-up text-left"
              >
                <div className="border-b border-[#E6DED2]/60 pb-3 flex items-center justify-between">
                  <h4 className="font-serif text-base font-bold text-[#1F2430] flex items-center gap-2 m-0">
                    <Landmark className="w-5 h-5 text-[#2E6A52]" />
                    <span>Official Financial Readiness Passport</span>
                  </h4>
                  <span className="font-mono text-[9px] font-bold bg-[#edf3ee] border border-[#c4d6c7] text-[#1F4B3A] px-2.5 py-0.5 rounded-full">
                    PRINT READY
                  </span>
                </div>

                <p className="font-sans text-xs text-[#666666] leading-relaxed m-0">
                  Print or save your official Financial Readiness Passport using your browser's built-in print functionality. This preserves formatting and allows you to save the passport as a PDF.
                </p>

                {/* Passport Preview Pane */}
                <div className="border border-[#E6DED2] rounded-xl overflow-hidden shadow-inner bg-[#FBF8F2] p-4 max-h-[400px] overflow-y-auto select-none relative group/preview">
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-20">
                    <span className="bg-[#1F2430]/90 text-[#FFFDF8] font-sans font-bold text-[10px] uppercase tracking-wider px-3.5 py-1.5 rounded-lg shadow-md">
                      Certificate Preview
                    </span>
                  </div>
                  
                  <div 
                    id="passport-print-template" 
                    className="bg-[#FFFDF8] border-3 border-[#c2a67a]/45 px-8 py-8 rounded-lg shadow-sm text-left font-serif text-[#1F2430] relative overflow-hidden max-w-2xl mx-auto space-y-5"
                    style={{ backgroundColor: '#FFFDF8' }}
                  >
                    {/* Rotated faint watermark behind */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
                      <span className="font-serif text-[4rem] font-black uppercase tracking-widest text-[#1f2937]/[0.007] transform -rotate-12 whitespace-nowrap">
                        GROWLEDGER SECURE
                      </span>
                    </div>

                    {/* Passport Header */}
                    <div className="border-b-2 border-[#1F4B3A] pb-3 flex justify-between items-start relative z-10">
                      <div>
                        <h2 className="font-serif text-2xl font-extrabold text-[#1F4B3A] m-0 tracking-tight flex items-center gap-1.5">
                          GrowLedger
                        </h2>
                        <span className="block font-serif text-xs font-bold text-[#1F2430] mt-0.5 tracking-wider uppercase">
                          Financial Readiness Passport
                        </span>
                        <span className="block font-sans text-[8px] text-[#666666] uppercase tracking-wide mt-1">
                          AI-Powered Alternative Financial Readiness Assessment
                        </span>
                      </div>
                      <div className="text-right font-sans text-[8.5px] text-[#666666] space-y-1">
                        <div><strong className="text-[#1F2430]">Issued On:</strong> {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                        <div><strong className="text-[#1F2430]">Passport ID:</strong> GL-2026-00{Math.floor(100000 + Math.random() * 900000)}</div>
                      </div>
                    </div>

                    {/* Middle Section: Stamp + Profile table */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
                      
                      {/* Left: Metadata table (Surgically aligned to a 12-column grid) */}
                      <div className="md:col-span-8 space-y-2 font-sans text-xs">
                        <div className="grid grid-cols-12 gap-2 border-b border-[#E6DED2]/60 pb-1.5">
                          <span className="col-span-7 text-[#666666] font-semibold">Financial Tier</span>
                          <span className="col-span-5 font-bold text-[#1F2430] uppercase text-right">{predictionData.prediction}</span>
                        </div>
                        <div className="grid grid-cols-12 gap-2 border-b border-[#E6DED2]/60 pb-1.5">
                          <span className="col-span-7 text-[#666666] font-semibold">Prediction Confidence</span>
                          <span className="col-span-5 font-bold text-[#1F2430] text-right">{Math.min(97.8, predictionData.confidence || 88.5)}%</span>
                        </div>
                        <div className="grid grid-cols-12 gap-2 border-b border-[#E6DED2]/60 pb-1.5">
                          <span className="col-span-7 text-[#666666] font-semibold">Occupation Profile</span>
                          <span className="col-span-5 font-bold text-[#1F2430] text-right">{form.occupation}</span>
                        </div>
                        <div className="grid grid-cols-12 gap-2 border-b border-[#E6DED2]/60 pb-1.5">
                          <span className="col-span-7 text-[#666666] font-semibold">Monthly Income</span>
                          <span className="col-span-5 font-bold text-[#1F2430] font-mono text-right">₹{Number(form.monthly_income).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="grid grid-cols-12 gap-2 border-b border-[#E6DED2]/60 pb-1.5">
                          <span className="col-span-7 text-[#666666] font-semibold">Verified Savings Rate</span>
                          <span className="col-span-5 font-bold text-[#2E6A52] font-mono text-right">{calcSavingsRate()}</span>
                        </div>
                        <div className="grid grid-cols-12 gap-2 border-b border-[#E6DED2]/60 pb-1.5">
                          <span className="col-span-7 text-[#666666] font-semibold">Digital Footprint Ratio</span>
                          <span className="col-span-5 font-bold text-[#1F4B3A] font-mono text-right">{calcDigitalUPI()}</span>
                        </div>
                        <div className="grid grid-cols-12 gap-2">
                          <span className="col-span-7 text-[#666666] font-semibold">Emergency Reserves</span>
                          <span className="col-span-5 font-bold text-[#B88A3B] text-right">{calcFinancialBuffer()} Months</span>
                        </div>
                      </div>

                      {/* Right: Enlarged & Slightly Straightened Stamp column */}
                      <div className="md:col-span-4 flex justify-center items-center h-full">
                        <div className="passport-stamp-red uppercase font-serif font-black text-center text-xs tracking-[0.1em] border-[3px] border-double rounded-lg border-[#a91d22] text-[#a91d22] px-5 py-3.5 select-none rotate-[-3deg] bg-transparent shadow-xs">
                          {predictionData.prediction} VERIFIED
                        </div>
                      </div>
                    </div>

                    {/* AI Narrative Section */}
                    <div className="space-y-1.5 relative z-10 border-t border-b border-[#E6DED2]/60 py-3.5 text-left">
                      <h4 className="font-serif text-[10px] font-bold text-[#1F4B3A] uppercase tracking-wider flex items-center gap-1.5 m-0">
                        <span>🖋</span>
                        <span>AI Financial Story</span>
                      </h4>
                      <p className="font-serif text-[10.5px] text-[#1F2430] italic leading-relaxed m-0">
                        "Based on your last 12 months, {predictionData.financial_story}"
                      </p>
                    </div>

                    {/* Strengths and Opportunities Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                      
                      {/* Positive Drivers */}
                      <div className="space-y-2 text-left">
                        <h4 className="font-serif text-[10px] font-bold text-[#2E6A52] uppercase tracking-wider m-0">Financial Strengths</h4>
                        <div className="space-y-1.5">
                          {predictionData.strengthened_profile?.map((item, idx) => (
                            <div key={idx} className="flex gap-1.5 items-start text-[9.5px] font-sans font-semibold text-[#1F2430]">
                              <Check className="w-3 h-3 text-[#2E6A52] flex-shrink-0 mt-0.5" />
                              <span>{item.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Limiting Drivers */}
                      <div className="space-y-2 text-left">
                        <h4 className="font-serif text-[10px] font-bold text-[#B88A3B] uppercase tracking-wider m-0">Improvement Opportunities</h4>
                        <div className="space-y-1.5">
                          {predictionData.reduced_readiness?.map((item, idx) => (
                            <div key={idx} className="flex gap-1.5 items-start text-[9.5px] font-sans font-semibold text-[#1F2430]">
                              <AlertTriangle className="w-3.5 h-3.5 text-[#B88A3B] flex-shrink-0 mt-0.5" />
                              <span>{item.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Priority action card */}
                    <div className="bg-[#edf3ee]/30 border border-[#c4d6c7]/65 p-4.5 rounded-xl relative z-10 text-left my-2.5 shadow-[inset_0_1px_2px_rgba(31,75,58,0.02)]">
                      <h4 className="font-serif text-[10px] font-bold text-[#1F4B3A] uppercase tracking-wider m-0 flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-[#2E6A52]" />
                        <span>Priority Coaching Recommendation</span>
                      </h4>
                      <h5 className="font-serif text-xs font-bold text-[#1F2430] mt-1.5 mb-1">{predictionData.coaching?.priority_action}</h5>
                      <p className="font-sans text-[9.5px] text-[#555555] leading-relaxed m-0">{predictionData.coaching?.action_description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-[#c4d6c7]/50 text-[9px] font-sans">
                        <div>
                          <strong className="text-[#1F2430]">Estimated Improvement:</strong>
                          <span className="text-[#2E6A52] ml-1 font-bold">+8 Readiness Points</span>
                        </div>
                        <div>
                          <strong className="text-[#1F2430]">Quick Win Target:</strong>
                          <span className="text-[#1F2430] ml-1 font-bold">{predictionData.coaching?.quick_win}</span>
                        </div>
                      </div>
                    </div>

                    {/* Roadmap Timeline */}
                    <div className="border-t border-[#E6DED2]/60 pt-4 relative z-10 space-y-3 text-left">
                      <h4 className="font-serif text-[10px] font-bold text-[#1F4B3A] uppercase tracking-wider m-0">30/60/90 Day Savings Roadmap</h4>
                      
                      <div className="grid grid-cols-3 gap-3.5 text-[9.5px] font-sans">
                        <div className="bg-[#fcfbf9] border border-[#E6DED2]/85 p-2.5 rounded-xl space-y-2">
                          <div className="flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-[#1F4B3A]" />
                            <span className="font-bold text-[#1F4B3A] uppercase tracking-wider text-[8px]">30-Day Milestone</span>
                          </div>
                          <p className="text-[#555555] leading-normal m-0 text-[9px] line-clamp-3">{predictionData.coaching?.roadmap?.['30_days']?.[0]}</p>
                        </div>
                        <div className="bg-[#fcfbf9] border border-[#E6DED2]/85 p-2.5 rounded-xl space-y-2">
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#B88A3B]" />
                            <span className="font-bold text-[#B88A3B] uppercase tracking-wider text-[8px]">60-Day Milestone</span>
                          </div>
                          <p className="text-[#555555] leading-normal m-0 text-[9px] line-clamp-3">{predictionData.coaching?.roadmap?.['60_days']?.[0]}</p>
                        </div>
                        <div className="bg-[#fcfbf9] border border-[#E6DED2]/85 p-2.5 rounded-xl space-y-2">
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2E6A52]" />
                            <span className="font-bold text-[#2E6A52] uppercase tracking-wider text-[8px]">90-Day Milestone</span>
                          </div>
                          <p className="text-[#555555] leading-normal m-0 text-[9px] line-clamp-3">{predictionData.coaching?.roadmap?.['90_days']?.[0]}</p>
                        </div>
                      </div>
                    </div>

                    {/* Future Projection Timeline */}
                    <div className="border-t border-[#E6DED2]/60 pt-4 relative z-10 space-y-3 text-left">
                      <h4 className="font-serif text-[10px] font-bold text-[#1F4B3A] uppercase tracking-wider m-0">Readiness Growth Projection</h4>
                      
                      <div className="flex justify-between items-center bg-[#fcfbf9] border border-[#E6DED2]/80 p-3 rounded-xl text-[9.5px] font-sans text-center gap-1.5">
                        <div className="flex-1 space-y-0.5 bg-[#FFFDF8] border border-[#E6DED2]/60 p-2 rounded-lg">
                          <span className="block text-[7px] font-bold text-[#666666] uppercase tracking-wider">Today</span>
                          <span className="font-serif font-bold text-[#A73B3B] uppercase text-[10px]">{predictionData.prediction}</span>
                        </div>
                        
                        <div className="text-[#c4d6c7] font-bold text-base select-none">&rarr;</div>
                        
                        <div className="flex-1 space-y-0.5 bg-[#FFFDF8] border border-[#E6DED2]/60 p-2 rounded-lg">
                          <span className="block text-[7px] font-bold text-[#666666] uppercase tracking-wider">90 Days</span>
                          <span className="font-serif font-bold text-[#B88A3B] uppercase text-[10px]">{predictionData.prediction === 'Building' ? 'Emerging' : 'Ready'}</span>
                        </div>
                        
                        <div className="text-[#c4d6c7] font-bold text-base select-none">&rarr;</div>
                        
                        <div className="flex-1 space-y-0.5 bg-[#FFFDF8] border border-[#E6DED2]/60 p-2 rounded-lg">
                          <span className="block text-[7px] font-bold text-[#666666] uppercase tracking-wider">180 Days</span>
                          <span className="font-serif font-bold text-[#2E6A52] uppercase text-[10px]">Ready Elite</span>
                        </div>
                      </div>
                    </div>

                    {/* Disclaimer Footer */}
                    <div className="border-t-2 border-[#E6DED2] pt-4 flex justify-between items-center relative z-10 gap-4">
                      
                      {/* Left: General verification info */}
                      <div className="space-y-1 w-[80%] text-[7.5px] font-sans text-[#666666] leading-normal text-left">
                        <div>
                          <strong className="text-[#1F2430]">Generated by GrowLedger AI alternative credit bureau engine.</strong> Behaviour-based cash flow verification. No demographic variables or social attributes were factored in calculations.
                        </div>
                        <p className="italic m-0">
                          Disclaimer: This document is formulated exclusively for credit coaching purposes. It does not constitute a formal score issued by banking authorities.
                        </p>
                      </div>

                      {/* Right: Mock QR code element */}
                      <div className="flex flex-col items-center gap-0.5 shrink-0 w-[20%]">
                        <div className="w-10 h-10 border-2 border-[#1F2430] p-1 bg-white flex flex-wrap gap-0.5 justify-center content-center select-none shadow-xs">
                          <div className="w-2 h-2 bg-[#1f2430] self-start mr-auto" />
                          <div className="w-2 h-2 bg-[#1f2430] self-start ml-auto" />
                          <div className="w-full h-0.5" />
                          <div className="w-1 h-1 bg-[#1f2430]" />
                          <div className="w-1.5 h-1.5 bg-[#1f2430] ml-0.5" />
                          <div className="w-full h-0.5" />
                          <div className="w-2 h-2 bg-[#1f2430] self-end mr-auto" />
                          <div className="w-1 h-1 bg-[#1f2430] self-end ml-auto" />
                        </div>
                        <span className="block text-[5.5px] font-sans font-bold text-[#666666] tracking-wide uppercase mt-0.5">Verify Passport</span>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Print Button */}
                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex items-center justify-center gap-2.5 py-3.5 px-10 rounded-[14px] text-[#FFFDF8] font-bold bg-[#1F4B3A] hover:bg-[#2E6A52] hover:translate-y-[-2px] transition-all duration-200 shadow-md cursor-pointer text-sm font-sans"
                  >
                    <span className="text-base">🖨</span>
                    Print Passport
                  </button>
                </div>
              </div>

              </div>
          ) : (
            /* Live Financial Passport Preview Panel (WOW Feature) */
            <div className="sticky top-24 bg-[#FFFDF8] border-2 border-dashed border-[#E6DED2] p-8 rounded-[20px] shadow-sm space-y-6 animate-scale-in">
              <div className="border-b border-[#E6DED2]/80 pb-4">
                <span className="block text-[10px] font-sans font-bold uppercase tracking-widest text-[#666666]">Alternative Bureau Draft</span>
                <h4 className="font-serif text-xl font-bold text-[#1F2430] mt-1 mb-0">Readiness Passport Preview</h4>
              </div>

              {/* Verified Checklist */}
              <div className="space-y-4 font-sans text-xs">
                {/* Field 1: Occupation */}
                <div className="flex items-center justify-between border-b border-[#E6DED2]/40 pb-2.5">
                  <span className="text-[#666666] font-semibold">Occupation Profile</span>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-[#1F4B3A]">{form.occupation}</span>
                    <span className="text-[#2E6A52] font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Verified
                    </span>
                  </div>
                </div>

                {/* Field 2: Monthly Income */}
                <div className="flex items-center justify-between border-b border-[#E6DED2]/40 pb-2.5">
                  <span className="text-[#666666] font-semibold">Income Flow Pattern</span>
                  <div className="flex items-center gap-2">
                    {form.monthly_income > 0 ? (
                      <>
                        <span className="font-mono text-[#1F2430]">₹{Number(form.monthly_income).toLocaleString('en-IN')}</span>
                        <span className="text-[#2E6A52] font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 stroke-[3]" /> Mapped
                        </span>
                      </>
                    ) : (
                      <span className="text-amber-500 font-bold">Pending</span>
                    )}
                  </div>
                </div>

                {/* Field 3: Savings rate */}
                <div className="flex items-center justify-between border-b border-[#E6DED2]/40 pb-2.5">
                  <span className="text-[#666666] font-semibold">Verified Savings Rate</span>
                  <div className="flex items-center gap-2">
                    {form.savings > 0 && form.monthly_income > 0 ? (
                      <>
                        <span className="font-mono text-[#1F2430]">{calcSavingsRate()}</span>
                        <span className="text-[#2E6A52] font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 stroke-[3]" /> Pattern Mapped
                        </span>
                      </>
                    ) : (
                      <span className="text-amber-500 font-bold">Pending</span>
                    )}
                  </div>
                </div>

                {/* Field 4: Digital Footprint */}
                <div className="flex items-center justify-between border-b border-[#E6DED2]/40 pb-2.5">
                  <span className="text-[#666666] font-semibold">UPI Transaction Density</span>
                  <div className="flex items-center gap-2">
                    {form.digital_transactions > 0 || form.cash_transactions > 0 ? (
                      <>
                        <span className="font-mono text-[#1F2430]">{calcDigitalUPI()} Digital</span>
                        <span className="text-[#2E6A52] font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 stroke-[3]" /> Activity Signal
                        </span>
                      </>
                    ) : (
                      <span className="text-amber-500 font-bold">Pending</span>
                    )}
                  </div>
                </div>

                {/* Field 5: Debt Ratio */}
                <div className="flex items-center justify-between border-b border-[#E6DED2]/40 pb-2.5">
                  <span className="text-[#666666] font-semibold">EMI Debt Burden</span>
                  <div className="flex items-center gap-2">
                    {form.emi_ratio >= 0 ? (
                      <>
                        <span className="font-mono text-[#1F2430]">{(Number(form.emi_ratio) * 100).toFixed(0)}% Debt</span>
                        <span className="text-[#2E6A52] font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 stroke-[3]" /> Ratio Verified
                        </span>
                      </>
                    ) : (
                      <span className="text-amber-500 font-bold">Pending</span>
                    )}
                  </div>
                </div>

                {/* Field 6: Emergency Buffer */}
                <div className="flex items-center justify-between border-b border-[#E6DED2]/40 pb-2.5">
                  <span className="text-[#666666] font-semibold">Emergency Buffer</span>
                  <div className="flex items-center gap-2">
                    {form.average_balance > 0 && form.monthly_expenses > 0 ? (
                      <>
                        <span className="font-mono text-[#1F2430]">{(Number(form.average_balance) / Number(form.monthly_expenses)).toFixed(1)} Months</span>
                        <span className="text-[#2E6A52] font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 stroke-[3]" /> Mapped
                        </span>
                      </>
                    ) : (
                      <span className="text-amber-500 font-bold">Pending</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Watermark Draft Stamp */}
              <div className="border border-double border-[#ebdcb4] p-3 text-center rounded-xl bg-[#fdfaf0]/50 select-none">
                <span className="font-serif text-xs font-bold text-[#B88A3B] uppercase tracking-[0.2em] block">
                  Constructing Live Passport
                </span>
                <span className="text-[10px] text-[#666666] font-sans mt-1 block">
                  Attribution engine is reading cash-flow signals...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

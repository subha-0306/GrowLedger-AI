import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { predictCreditReadiness } from '../services/api';
import demoProfiles from '../data/demo_profiles.json';
import { 
  ArrowRight, ArrowLeft, CheckCircle2, Loader2, Check, Activity, 
  AlertTriangle, Compass, CheckSquare, Target, Landmark, ShieldCheck, 
  Lock, Info, FileText, RefreshCw, Heart, PiggyBank, ShieldAlert,
  Truck, Store, Laptop, ShoppingBag, Wrench, TrendingUp, Minus, ArrowDownRight,
  Wallet, Coins, Shield, Smartphone, CreditCard, Banknote, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

const avatarUrls = {
  rajesh: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120',
  lakshmi: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120',
  arun: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120',
  priya: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120&h=120',
  ramesh: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120&h=120'
};

// Conversational Question 1 Options (occupation) with Lucide React Vector Icons
const occupationOptions = [
  {
    id: 'Delivery Partner',
    icon: Truck,
    title: 'Delivery or Logistics Partner',
    desc: 'Delivering food, packages, or driving on gig apps like Swiggy, Zomato, Porter, or Dunzo.',
    badge: 'Gig Work'
  },
  {
    id: 'Tea Shop Owner',
    icon: Store,
    title: 'Local Shop or Stall Owner',
    desc: 'Running a tea stall, food shop, neighborhood store, or small local retail business.',
    badge: 'Micro Retail'
  },
  {
    id: 'Freelancer',
    icon: Laptop,
    title: 'Freelancer or Independent Worker',
    desc: 'Working independently on design, tech, writing, consulting, or client projects.',
    badge: 'Independent'
  },
  {
    id: 'Boutique Owner',
    icon: ShoppingBag,
    title: 'Boutique or Clothing Shop Owner',
    desc: 'Managing a fashion boutique, tailoring shop, craft store, or apparel stall.',
    badge: 'Small Business'
  },
  {
    id: 'Daily Wage Worker',
    icon: Wrench,
    title: 'Daily Wage Tradesperson or Worker',
    desc: 'Working on day rates in construction, skilled trades, farming, or flexible labor.',
    badge: 'Day Rate Work'
  }
];

// Conversational Question 2 Options (income_variance)
const varianceOptions = [
  {
    id: 'Low',
    icon: ShieldCheck,
    title: 'Steady & Predictable',
    desc: 'My monthly earnings stay pretty much the same almost every month.'
  },
  {
    id: 'Medium',
    icon: Compass,
    title: 'Changes Slightly',
    desc: 'Some months bring in a bit more, others a bit less depending on demand.'
  },
  {
    id: 'High',
    icon: Activity,
    title: 'Varies a Lot',
    desc: 'My income fluctuates heavily based on festivals, harvests, or gig demand.'
  }
];

// Conversational Question 2 Sub-Options (income_growth)
const growthOptions = [
  {
    id: 'Increasing',
    icon: TrendingUp,
    title: 'Growing & Expanding',
    desc: 'I am bringing in more overall now than I was 12 months ago.'
  },
  {
    id: 'Stable',
    icon: Minus,
    title: 'Holding Steady',
    desc: 'My overall annual monthly income level has remained consistent.'
  },
  {
    id: 'Declining',
    icon: ArrowDownRight,
    title: 'Slowing Down Recently',
    desc: 'Work has been quieter recently compared to earlier months.'
  }
];

export default function Dashboard({ predictionData, setPredictionData }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [error, setError] = useState(null);
  const [completedSteps, setCompletedSteps] = useState({});
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [animateProgress, setAnimateProgress] = useState(false);

  // Exact payload state mapping preserved
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
    "Reading real-world cash flow signals",
    "Checking income consistency",
    "Calculating debt safety capacity",
    "Building TreeSHAP attribution story",
    "Formulating 30/60/90 roadmap",
    "Verifying Financial Passport"
  ];

  const stepsList = [
    { num: 1, title: 'Chapter 1 · Primary Work', desc: 'How you earn' },
    { num: 2, title: 'Chapter 2 · Income Stability', desc: 'Consistency & trend' },
    { num: 3, title: 'Chapter 3 · Monthly Cash Flow', desc: 'Earnings & expenses' },
    { num: 4, title: 'Chapter 4 · Savings & Cushion', desc: 'Emergency buffer' },
    { num: 5, title: 'Chapter 5 · Payments & History', desc: 'UPI & bill discipline' },
  ];

  useEffect(() => {
    if (predictionData) {
      const timer = setTimeout(() => setAnimateProgress(true), 150);
      return () => clearTimeout(timer);
    } else {
      setAnimateProgress(false);
    }
  }, [predictionData]);

  useEffect(() => {
    if (predictionData) {
      const timer = setTimeout(() => {
        const element = document.getElementById('summary');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [predictionData]);

  const getPremiumPassportStyle = (tier) => {
    const colors = {
      Ready: {
        bg: 'linear-gradient(135deg, #fdfbf7 0%, #f4efe4 100%)',
        border: 'border-[#c4d6c7] shadow-[inset_0_0_20px_rgba(31,75,58,0.03)]',
        watermark: 'READY OFFICIAL ACCESS'
      },
      Emerging: {
        bg: 'linear-gradient(135deg, #fdfaf5 0%, #f7f1e3 100%)',
        border: 'border-[#ebdcb4] shadow-[inset_0_0_20px_rgba(184,138,59,0.03)]',
        watermark: 'EMERGING SIGNAL ACTIVE'
      },
      Building: {
        bg: 'linear-gradient(135deg, #fcfaf6 0%, #f5efe2 100%)',
        border: 'border-[#e8dbb0] shadow-[inset_0_0_20px_rgba(194,144,26,0.03)]',
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
    setSelectedProfileId(profile.id);
    setError(null);
    toast.success(`Loaded ${profile.name}'s profile parameters!`);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value,
    }));
    setSelectedProfileId(null);
  };

  const updateField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setSelectedProfileId(null);
  };

  const validateStep = (currentStep) => {
    setError(null);
    if (currentStep === 1) {
      if (!form.occupation) {
        setError('Please pick the work option that best fits how you earn.');
        return false;
      }
    } else if (currentStep === 2) {
      if (!form.income_variance || !form.income_growth) {
        setError('Please select both your income consistency and overall trend.');
        return false;
      }
    } else if (currentStep === 3) {
      if (form.monthly_income === '' || form.monthly_income <= 0) {
        setError('Please enter a monthly income estimate greater than zero.');
        return false;
      }
      if (form.monthly_expenses === '' || form.monthly_expenses < 0) {
        setError('Monthly living expenses cannot be negative.');
        return false;
      }
    } else if (currentStep === 4) {
      if (form.savings === '' || form.savings < 0) {
        setError('Monthly savings cannot be negative.');
        return false;
      }
      if (form.average_balance === '' || form.average_balance < 0) {
        setError('Emergency cushion balance cannot be negative.');
        return false;
      }
    } else if (currentStep === 5) {
      if (form.digital_transactions === '' || form.digital_transactions < 0) {
        setError('Digital transactions cannot be negative.');
        return false;
      }
      if (form.cash_transactions === '' || form.cash_transactions < 0) {
        setError('Cash transactions cannot be negative.');
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
      setStep((prev) => Math.min(5, prev + 1));
    }
  };

  const handleBack = () => {
    setError(null);
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep(5)) return;
    
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
    setPredictionData(null);
    setCompletedSteps({});

    let apiPromise = predictCreditReadiness(payload);
    let apiResult = null;
    let apiError = null;

    apiPromise.then(
      (res) => { apiResult = res; },
      (err) => { apiError = err; }
    );

    let currentAnimationStep = 1;
    const intervalId = setInterval(() => {
      currentAnimationStep += 1;
      if (currentAnimationStep <= 6) {
        setProcessingStep(currentAnimationStep);
      } else {
        clearInterval(intervalId);
        setProcessingStep(7);
        checkApiResolution();
      }
    }, 550);

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
      setProcessingStep(0);
      
      if (errorPayload) {
        console.error(errorPayload);
        const errMsg = errorPayload.message || 'Unable to generate your Financial Passport right now.';
        setError(errMsg);
        toast.error(errMsg);
      } else if (result && result.success) {
        setPredictionData(result.data);
        toast.success('Your Financial Passport is ready!');
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
    toast.success('Milestone updated!');
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

  const progressPercentage = Math.round((step / 5) * 100);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#0f172a] font-sans antialiased py-4 md:py-8 px-3 sm:px-6 lg:px-10 max-w-7xl mx-auto">
      
      {/* Header Reset Option when Results Active */}
      {predictionData && (
        <div className="mb-6 flex justify-between items-center bg-[#fcfbfa] border border-[#e9e4db] p-4 rounded-2xl shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#faf8f5] border border-[#e9e4db] flex items-center justify-center text-[#a91d22]">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#475569]">Verified Passport Issued</span>
              <h2 className="font-serif text-lg font-bold text-[#0f172a] m-0">GrowLedger Readiness Passport</h2>
            </div>
          </div>
          <button
            onClick={() => setPredictionData(null)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#0f172a] bg-[#faf8f5] border border-[#e9e4db] rounded-xl hover:bg-[#f5efe2] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retake Assessment
          </button>
        </div>
      )}

      {/* TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT SIDEBAR COLUMN */}
        {/* ========================================================================= */}
        <aside className="lg:col-span-4 bg-[#fcfbfa] border border-[#e9e4db] rounded-2xl p-6 sm:p-7 shadow-xs space-y-7 relative overflow-hidden flex flex-col justify-between min-h-[600px]">
          
          {/* Minimal Passport Vector Watermark */}
          <div className="absolute top-0 right-0 opacity-[0.035] select-none pointer-events-none transform translate-x-8 -translate-y-8 z-0">
            <svg className="w-64 h-64 text-[#0f172a]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="50" cy="50" r="36" stroke="currentColor" strokeWidth="2" />
              <path d="M50,25 L53,37 L65,37 L55,44 L59,56 L50,48 L41,56 L45,44 L35,37 L47,37 Z" fill="currentColor" fillOpacity="0.4" />
              <text x="50%" y="70%" textAnchor="middle" fill="currentColor" fontSize="7" fontWeight="bold" fontFamily="serif" letterSpacing="0.08em">GROWLEDGER</text>
            </svg>
          </div>

          <div className="space-y-6 relative z-10">
            {/* Branding Header */}
            <div className="space-y-3 border-b border-[#e9e4db] pb-5">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="GrowLedger AI Logo"
                  className="w-10 h-10 object-contain drop-shadow-xs"
                />
                <div>
                  <h1 className="font-serif text-xl font-bold text-[#0f172a] leading-none m-0">GrowLedger</h1>
                  <span className="text-[10px] font-sans font-semibold tracking-wider text-[#475569] uppercase block mt-1">Financial Passport</span>
                </div>
              </div>
              
              <div className="pt-2">
                <span className="inline-block text-[10px] font-sans font-bold text-[#475569] uppercase tracking-wider bg-[#faf8f5] border border-[#e9e4db] px-2.5 py-1 rounded-md mb-2">
                  Human-Centered Assessment
                </span>
                <p className="font-sans text-sm text-[#475569] leading-relaxed italic m-0">
                  "We're here to understand you, not judge you."
                </p>
              </div>
            </div>

            {/* Assessment Step Navigator */}
            <div className="space-y-2">
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#475569] block mb-1">
                Your Conversation Chapters
              </span>
              {stepsList.map((s) => {
                const isActive = step === s.num;
                const isDone = step > s.num;
                return (
                  <button
                    key={s.num}
                    type="button"
                    onClick={() => setStep(s.num)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[#faf8f5] border-[#0f172a] shadow-xs text-[#0f172a]'
                        : isDone
                          ? 'bg-[#fcfbfa] border-[#e9e4db] text-[#475569] hover:bg-[#faf8f5]'
                          : 'bg-[#fcfbfa] border-[#e9e4db]/60 text-[#475569]/60 hover:bg-[#faf8f5]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[11px] font-bold transition-colors ${
                        isActive
                          ? 'bg-[#0f172a] text-[#ffffff]'
                          : isDone
                            ? 'bg-[#5f7d66] text-[#ffffff]'
                            : 'bg-[#faf8f5] border border-[#e9e4db] text-[#475569]'
                      }`}>
                        {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.num}
                      </div>
                      <div>
                        <span className={`block font-serif text-xs ${isActive ? 'font-bold text-[#0f172a]' : 'font-semibold text-[#475569]'}`}>
                          {s.title}
                        </span>
                        <span className="text-[9.5px] font-sans text-[#475569] block">
                          {s.desc}
                        </span>
                      </div>
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 rounded-full bg-[#a91d22]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Demo Persona Switcher */}
            <div className="space-y-2 border-t border-[#e9e4db] pt-4">
              <div className="flex justify-between items-center text-[10px] font-sans font-bold text-[#475569] uppercase tracking-wider">
                <span>Fast-Track Demo Profiles</span>
                <span className="text-[#a91d22]">Click to try</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {demoProfiles.map((p) => {
                  const isSelected = selectedProfileId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleProfileSelect(p)}
                      title={`${p.name} (${p.occupation})`}
                      className={`flex flex-col items-center p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-[#faf8f5] border-[#a91d22] ring-1 ring-[#a91d22]' 
                          : 'bg-[#fcfbfa] border-[#e9e4db] hover:border-[#0f172a]'
                      }`}
                    >
                      <img
                        src={avatarUrls[p.id] || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120&h=120'}
                        alt={p.name}
                        className="w-7 h-7 rounded-full object-cover border border-[#e9e4db]"
                      />
                      <span className="text-[9px] font-sans font-semibold text-[#0f172a] truncate w-full mt-1">
                        {p.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Privacy Notice */}
          <div className="relative z-10 border-t border-[#e9e4db] pt-4 mt-6">
            <div className="flex items-start gap-2.5 bg-[#faf8f5] border border-[#e9e4db] p-3 rounded-xl">
              <Lock className="w-4 h-4 text-[#5f7d66] shrink-0 mt-0.5" />
              <p className="text-[11px] font-sans text-[#475569] leading-tight m-0">
                Your information stays private and is only used to generate your Financial Passport.
              </p>
            </div>
          </div>

        </aside>


        {/* ========================================================================= */}
        {/* MAIN CONVERSATIONAL CONTENT AREA */}
        {/* ========================================================================= */}
        <main className="lg:col-span-8 bg-[#fcfbfa] border border-[#e9e4db] rounded-2xl p-6 sm:p-9 shadow-xs space-y-7 animate-fade-slide-up">
          
          {processingStep > 0 ? (
            /* AI Processing Overlay */
            <div className="p-8 space-y-7 min-h-[460px] flex flex-col justify-center animate-scale-in text-center relative overflow-hidden">
              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold text-[#0f172a] m-0">AI Financial Passport Engine</h3>
                <p className="font-sans text-sm text-[#475569]">Calculating your cash flow strengths and attribution drivers...</p>
              </div>

              <div className="space-y-3 max-w-md mx-auto w-full text-left">
                {processingStepsList.map((stepText, idx) => {
                  const stepNum = idx + 1;
                  const isCompleted = processingStep > stepNum;
                  const isActive = processingStep === stepNum;
                  
                  return (
                    <div 
                      key={idx} 
                      className={`flex items-center gap-3.5 p-3 rounded-xl border transition-all duration-300 ${
                        isCompleted 
                          ? 'bg-[#faf8f5] border-[#e9e4db] text-[#475569]' 
                          : isActive 
                            ? 'bg-[#fcfbfa] border-[#0f172a] text-[#0f172a] font-bold shadow-xs scale-[1.01]' 
                            : 'bg-[#fcfbfa] border-[#e9e4db]/50 text-[#475569]/40'
                      }`}
                    >
                      <div className="shrink-0">
                        {isCompleted ? (
                          <div className="w-5 h-5 rounded-full bg-[#5f7d66] flex items-center justify-center text-white">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : isActive ? (
                          <div className="w-5 h-5 rounded-full border-2 border-[#a91d22] flex items-center justify-center text-[#a91d22] animate-pulse">
                            <span className="w-1.5 h-1.5 bg-[#a91d22] rounded-full" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-[#e9e4db] flex items-center justify-center text-[10px] text-[#475569] font-mono">
                            {stepNum}
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-sans">{stepText}</span>
                    </div>
                  );
                })}
              </div>

              <div className="w-full max-w-md mx-auto bg-[#e9e4db] rounded-full h-2 overflow-hidden mt-4">
                <div 
                  className="bg-[#a91d22] h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(100, (processingStep - 1) * (100 / 6))}%` }}
                />
              </div>
            </div>
          ) : predictionData ? (
            /* CONSOLIDATED PASSPORT RESULTS DISPLAY */
            <div className="space-y-8 animate-fade-slide-up">
              
              {/* Hero Passport Certificate */}
              <div 
                id="summary"
                style={{ background: getPremiumPassportStyle(predictionData.prediction).bg }}
                className={`relative border-2 ${getPremiumPassportStyle(predictionData.prediction).border} p-6 sm:p-8 rounded-2xl shadow-premium-passport overflow-hidden text-left`}
              >
                {/* Top Row: Title on Left, Confidence Badge on Right */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-[#e9e4db] pb-4 mb-5 relative z-10">
                  <div>
                    <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#475569]">Official Assessment Passport</span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f172a] m-0">GrowLedger Financial Passport</h3>
                  </div>
                  <span className="text-xs font-mono font-bold bg-[#fcfbfa] border border-[#e9e4db] px-3.5 py-1.5 rounded-xl text-[#0f172a] shadow-xs shrink-0 self-start sm:self-auto">
                    Confidence: {Math.min(97.8, predictionData.confidence || 88.5)}%
                  </span>
                </div>

                {/* Middle Row: Tier Status on Left, Stamp Seal Centered-Right */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 my-4 relative z-10 pr-2">
                  <div className="space-y-1">
                    <span className="text-xs font-sans text-[#475569] font-bold uppercase tracking-wider block">Tier Status</span>
                    <span className="font-serif text-3xl sm:text-4xl font-extrabold text-[#0f172a] uppercase block">{predictionData.prediction}</span>
                  </div>

                  <div className="animate-stamp-reveal shrink-0 sm:mr-4">
                    <div className="passport-stamp-red uppercase font-serif font-bold text-xs sm:text-sm tracking-[0.14em] border-[3px] border-double rounded-md border-[#a91d22] text-[#a91d22] px-4 py-2 rotate-[-3deg] bg-[#fcfbfa]/90 shadow-xs inline-block">
                      {predictionData.prediction} VERIFIED
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Readiness Progress Bar */}
                <div className="space-y-1.5 pt-3 relative z-10">
                  <div className="flex justify-between items-center text-xs font-sans">
                    <span className="text-[#475569] font-semibold">Passport Readiness Level</span>
                    <span className="font-bold text-[#0f172a]">
                      {predictionData.prediction === 'Ready' ? '100% Verified Access' : predictionData.prediction === 'Emerging' ? '70% Progress Level' : '35% Building Foundation'}
                    </span>
                  </div>
                  <div className="w-full bg-[#e9e4db] h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#a91d22] h-full rounded-full transition-all duration-1000"
                      style={{ width: predictionData.prediction === 'Ready' ? '100%' : predictionData.prediction === 'Emerging' ? '70%' : '35%' }}
                    />
                  </div>
                </div>
              </div>

              {/* Financial Health Metrics */}
              <div className="bg-[#fcfbfa] border border-[#e9e4db] p-6 rounded-2xl space-y-4 shadow-xs">
                <h4 className="font-serif text-lg font-bold text-[#0f172a] border-b border-[#e9e4db] pb-3 flex items-center gap-2 m-0">
                  <Activity className="w-5 h-5 text-[#5f7d66]" />
                  <span>Key Cash Flow Metrics</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#faf8f5] border border-[#e9e4db] p-4 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[#475569] font-sans uppercase">Savings Rate</span>
                      <span className="font-serif text-base font-bold text-[#0f172a]">{calcSavingsRate()}</span>
                    </div>
                    <div className="w-full bg-[#e9e4db] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#a91d22] h-full rounded-full transition-all duration-1000" style={{ width: animateProgress ? calcSavingsRate() : '0%' }} />
                    </div>
                  </div>

                  <div className="bg-[#faf8f5] border border-[#e9e4db] p-4 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[#475569] font-sans uppercase">Expense Ratio</span>
                      <span className="font-serif text-base font-bold text-[#0f172a]">{calcExpenseRate()}</span>
                    </div>
                    <div className="w-full bg-[#e9e4db] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#475569] h-full rounded-full transition-all duration-1000" style={{ width: animateProgress ? calcExpenseRate() : '0%' }} />
                    </div>
                  </div>

                  <div className="bg-[#faf8f5] border border-[#e9e4db] p-4 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[#475569] font-sans uppercase">Digital UPI Density</span>
                      <span className="font-serif text-base font-bold text-[#0f172a]">{calcDigitalUPI()}</span>
                    </div>
                    <div className="w-full bg-[#e9e4db] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#5f7d66] h-full rounded-full transition-all duration-1000" style={{ width: animateProgress ? calcDigitalUPI() : '0%' }} />
                    </div>
                  </div>

                  <div className="bg-[#faf8f5] border border-[#e9e4db] p-4 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[#475569] font-sans uppercase">Safety Cushion</span>
                      <span className="font-serif text-base font-bold text-[#0f172a]">{calcFinancialBuffer()} Months</span>
                    </div>
                    <div className="w-full bg-[#e9e4db] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#0f172a] h-full rounded-full transition-all duration-1000" style={{ width: animateProgress ? `${Math.min(100, (Number(calcFinancialBuffer()) / 3) * 100)}%` : '0%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Attribution Drivers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#fcfbfa] border border-[#e9e4db] p-5 rounded-2xl space-y-3">
                  <h4 className="font-serif text-base font-bold text-[#0f172a] border-b border-[#e9e4db] pb-2 flex items-center gap-2 m-0">
                    <CheckCircle2 className="w-4.5 h-4.5 text-[#5f7d66]" />
                    <span>Positive Attribution Drivers</span>
                  </h4>
                  <div className="space-y-2.5">
                    {predictionData.strengthened_profile?.map((item, idx) => (
                      <div key={idx} className="bg-[#faf8f5] border border-[#e9e4db] p-3 rounded-xl space-y-1">
                        <span className="font-serif text-xs font-bold text-[#0f172a] block">{item.title}</span>
                        <p className="font-sans text-xs text-[#475569] leading-relaxed m-0">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#fcfbfa] border border-[#e9e4db] p-5 rounded-2xl space-y-3">
                  <h4 className="font-serif text-base font-bold text-[#0f172a] border-b border-[#e9e4db] pb-2 flex items-center gap-2 m-0">
                    <AlertTriangle className="w-4.5 h-4.5 text-[#c87a53]" />
                    <span>Growth Opportunities</span>
                  </h4>
                  <div className="space-y-2.5">
                    {predictionData.reduced_readiness?.map((item, idx) => (
                      <div key={idx} className="bg-[#faf8f5] border border-[#e9e4db] p-3 rounded-xl space-y-1">
                        <span className="font-serif text-xs font-bold text-[#0f172a] block">{item.title}</span>
                        <p className="font-sans text-xs text-[#475569] leading-relaxed m-0">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Narrative */}
              <div className="bg-[#faf8f5] border border-[#e9e4db] p-6 rounded-2xl space-y-3 text-left">
                <h4 className="font-serif text-base font-bold text-[#0f172a] border-b border-[#e9e4db] pb-2 flex items-center gap-2 m-0">
                  <FileText className="w-4.5 h-4.5 text-[#a91d22]" />
                  <span>Your Financial Story</span>
                </h4>
                <p className="font-serif text-sm text-[#0f172a] italic leading-relaxed m-0">
                  "Based on your last 12 months, {predictionData.financial_story}"
                </p>
              </div>

              {/* 30/60/90 Day Roadmap */}
              <div className="bg-[#fcfbfa] border border-[#e9e4db] p-6 rounded-2xl space-y-5">
                <h4 className="font-serif text-base font-bold text-[#0f172a] border-b border-[#e9e4db] pb-3 flex items-center gap-2 m-0">
                  <CheckSquare className="w-4.5 h-4.5 text-[#5f7d66]" />
                  <span>30 / 60 / 90 Day Milestone Roadmap</span>
                </h4>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-sans font-bold text-[#ffffff] uppercase tracking-wider bg-[#0f172a] px-2.5 py-1 rounded-md inline-block">
                      Phase 1: 30 Days
                    </span>
                    {predictionData.coaching?.roadmap?.['30_days']?.map((stepStr, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => toggleMilestone('30_days', idx)}
                        className="flex gap-2.5 items-start p-3 rounded-xl border border-[#e9e4db] bg-[#faf8f5] hover:border-[#0f172a] transition-colors cursor-pointer text-xs text-[#0f172a]"
                      >
                        <CheckSquare className={`w-4 h-4 shrink-0 mt-0.5 ${completedSteps[`30_days-${idx}`] ? 'text-[#5f7d66]' : 'text-[#475569]'}`} />
                        <span className={completedSteps[`30_days-${idx}`] ? 'line-through opacity-60' : ''}>{stepStr}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-sans font-bold text-[#0f172a] uppercase tracking-wider bg-[#faf8f5] border border-[#e9e4db] px-2.5 py-1 rounded-md inline-block">
                      Phase 2: 60 Days
                    </span>
                    {predictionData.coaching?.roadmap?.['60_days']?.map((stepStr, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => toggleMilestone('60_days', idx)}
                        className="flex gap-2.5 items-start p-3 rounded-xl border border-[#e9e4db] bg-[#faf8f5] hover:border-[#0f172a] transition-colors cursor-pointer text-xs text-[#0f172a]"
                      >
                        <CheckSquare className={`w-4 h-4 shrink-0 mt-0.5 ${completedSteps[`60_days-${idx}`] ? 'text-[#5f7d66]' : 'text-[#475569]'}`} />
                        <span className={completedSteps[`60_days-${idx}`] ? 'line-through opacity-60' : ''}>{stepStr}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Printable Certificate Template */}
              <div id="passport-print-template" className="bg-[#fcfbfa] border-2 border-[#e9e4db] p-8 rounded-2xl space-y-6 text-left font-serif text-[#0f172a]">
                <div className="border-b-2 border-[#0f172a] pb-4 flex justify-between items-start">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#0f172a] m-0">GrowLedger</h2>
                    <span className="text-xs font-sans font-bold text-[#475569] tracking-wider uppercase block mt-1">Official Financial Readiness Passport</span>
                  </div>
                  <div className="passport-stamp-red uppercase font-serif font-bold text-xs border-[3px] border-double rounded border-[#a91d22] text-[#a91d22] px-3 py-1 rotate-[-3deg]">
                    {predictionData.prediction} VERIFIED
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 font-sans text-xs border-b border-[#e9e4db] pb-4">
                  <div><strong className="text-[#475569]">Work Profile:</strong> {form.occupation}</div>
                  <div><strong className="text-[#475569]">Monthly Earnings:</strong> ₹{Number(form.monthly_income).toLocaleString('en-IN')}</div>
                  <div><strong className="text-[#475569]">Savings Rate:</strong> {calcSavingsRate()}</div>
                  <div><strong className="text-[#475569]">Digital Footprint:</strong> {calcDigitalUPI()}</div>
                </div>

                <p className="font-serif text-xs italic text-[#475569]">
                  "Based on your last 12 months, {predictionData.financial_story}"
                </p>

                <div className="text-[9px] font-sans text-[#475569] border-t border-[#e9e4db] pt-3">
                  Issued by GrowLedger AI Alternative Credit Engine. For credit coaching & verification purposes.
                </div>
              </div>

              {/* Print Action */}
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn-stamp-primary"
                >
                  Print Official Financial Passport
                </button>
              </div>

            </div>
          ) : (
            /* CONVERSATIONAL QUESTION WIZARD (CHAPTER STRUCTURE) */
            <form onSubmit={handleSubmit} className="space-y-7">
              
              {/* Header Progress Tracker */}
              <div className="space-y-3 border-b border-[#e9e4db] pb-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans font-bold text-[#475569] uppercase tracking-wider">
                    {stepsList[step - 1].title}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#a91d22]">
                    {progressPercentage}% Complete
                  </span>
                </div>

                {/* Progress Bar: STAMP RED fill accent */}
                <div className="w-full bg-[#e9e4db] h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#a91d22] h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* CHAPTER 1: PRIMARY WORK (occupation) */}
              {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                  
                  <div className="space-y-2">
                    <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#a91d22] block">
                      Chapter 1 &bull; Primary Work
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f172a] m-0 tracking-tight">
                      How do you earn your living day to day?
                    </h2>
                    <p className="font-sans text-sm text-[#475569] leading-relaxed m-0">
                      Tell us about your main source of income — we support all types of work, not just traditional 9-to-5 jobs.
                    </p>
                  </div>

                  {/* Single Page "Why We Ask This" Card */}
                  <div className="bg-[#faf8f5] border border-[#e9e4db] p-4.5 rounded-xl flex items-start gap-3.5">
                    <Info className="w-5 h-5 text-[#5f7d66] shrink-0 mt-0.5" />
                    <div className="space-y-1 text-xs font-sans">
                      <span className="font-bold text-[#0f172a] block">Why we ask this:</span>
                      <p className="text-[#475569] leading-relaxed m-0">
                        Different kinds of work have different earning patterns. Knowing how you earn helps us evaluate your cash flow fairly without requiring traditional corporate payslips.
                      </p>
                    </div>
                  </div>

                  {/* Radio-Card Selections with Vector Icons */}
                  <div className="grid grid-cols-1 gap-3.5 pt-2">
                    {occupationOptions.map((occ) => {
                      const isSelected = form.occupation === occ.id;
                      const IconComponent = occ.icon;
                      return (
                        <div
                          key={occ.id}
                          onClick={() => updateField('occupation', occ.id)}
                          className={`p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer text-left flex items-start justify-between gap-4 ${
                            isSelected
                              ? 'bg-[#faf8f5] border-[#a91d22] shadow-xs'
                              : 'bg-[#fcfbfa] border-[#e9e4db] hover:border-[#0f172a]/40 hover:bg-[#faf8f5]'
                          }`}
                        >
                          <div className="flex gap-3.5 items-start">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                              isSelected 
                                ? 'bg-[#a91d22] text-[#ffffff]' 
                                : 'bg-[#faf8f5] border border-[#e9e4db] text-[#0f172a]'
                            }`}>
                              <IconComponent className="w-4.5 h-4.5" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-serif text-base sm:text-lg font-bold text-[#0f172a]">
                                  {occ.title}
                                </span>
                                <span className={`text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                  isSelected ? 'bg-[#a91d22] text-[#ffffff]' : 'bg-[#e9e4db]/60 text-[#475569]'
                                }`}>
                                  {occ.badge}
                                </span>
                              </div>
                              <p className="text-xs font-sans text-[#475569] leading-relaxed m-0">
                                {occ.desc}
                              </p>
                            </div>
                          </div>

                          <div className="shrink-0 pt-1">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                              isSelected ? 'bg-[#a91d22] border-[#a91d22] text-[#ffffff]' : 'border-[#e9e4db] bg-[#fcfbfa]'
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              )}

              {/* CHAPTER 2: INCOME STABILITY (income_variance & income_growth) */}
              {step === 2 && (
                <div className="space-y-7 animate-fade-in">
                  
                  <div className="space-y-2">
                    <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#a91d22] block">
                      Chapter 2 &bull; Income Stability
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f172a] m-0 tracking-tight">
                      How predictable is your income stream?
                    </h2>
                    <p className="font-sans text-sm text-[#475569] leading-relaxed m-0">
                      Understanding your earning flow helps us see how comfortably you manage your expenses throughout the year.
                    </p>
                  </div>

                  {/* Single Page "Why We Ask This" Card */}
                  <div className="bg-[#faf8f5] border border-[#e9e4db] p-4.5 rounded-xl flex items-start gap-3.5">
                    <Info className="w-5 h-5 text-[#5f7d66] shrink-0 mt-0.5" />
                    <div className="space-y-1 text-xs font-sans">
                      <span className="font-bold text-[#0f172a] block">Why we ask this:</span>
                      <p className="text-[#475569] leading-relaxed m-0">
                        Seasonal fluctuations are completely normal for gig workers and shop owners. We evaluate your growth trend alongside income variance so you get credit for steady progress.
                      </p>
                    </div>
                  </div>

                  {/* Sub-Card Group 1: income_variance */}
                  <div className="space-y-3 pt-2">
                    <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider font-sans">
                      A. Monthly Income Consistency
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {varianceOptions.map((v) => {
                        const isSelected = form.income_variance === v.id;
                        const IconComponent = v.icon;
                        return (
                          <div
                            key={v.id}
                            onClick={() => updateField('income_variance', v.id)}
                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-left flex flex-col justify-between ${
                              isSelected
                                ? 'bg-[#faf8f5] border-[#a91d22] shadow-xs'
                                : 'bg-[#fcfbfa] border-[#e9e4db] hover:border-[#0f172a]/40'
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                  isSelected 
                                    ? 'bg-[#a91d22] text-[#ffffff]' 
                                    : 'bg-[#faf8f5] border border-[#e9e4db] text-[#0f172a]'
                                }`}>
                                  <IconComponent className="w-4 h-4" />
                                </div>
                                {isSelected && <Check className="w-4 h-4 text-[#a91d22] stroke-[3]" />}
                              </div>
                              <span className="font-serif text-sm font-bold text-[#0f172a] block">{v.title}</span>
                              <p className="text-[11px] font-sans text-[#475569] leading-snug m-0">{v.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sub-Card Group 2: income_growth */}
                  <div className="space-y-3 pt-2">
                    <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider font-sans">
                      B. 12-Month Earning Direction
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {growthOptions.map((g) => {
                        const isSelected = form.income_growth === g.id;
                        const IconComponent = g.icon;
                        return (
                          <div
                            key={g.id}
                            onClick={() => updateField('income_growth', g.id)}
                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-left flex flex-col justify-between ${
                              isSelected
                                ? 'bg-[#faf8f5] border-[#a91d22] shadow-xs'
                                : 'bg-[#fcfbfa] border-[#e9e4db] hover:border-[#0f172a]/40'
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                  isSelected 
                                    ? 'bg-[#a91d22] text-[#ffffff]' 
                                    : 'bg-[#faf8f5] border border-[#e9e4db] text-[#0f172a]'
                                }`}>
                                  <IconComponent className="w-4 h-4" />
                                </div>
                                {isSelected && <Check className="w-4 h-4 text-[#a91d22] stroke-[3]" />}
                              </div>
                              <span className="font-serif text-sm font-bold text-[#0f172a] block">{g.title}</span>
                              <p className="text-[11px] font-sans text-[#475569] leading-snug m-0">{g.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}

              {/* CHAPTER 3: MONTHLY CASH FLOW (monthly_income & monthly_expenses) */}
              {step === 3 && (
                <div className="space-y-7 animate-fade-in">
                  
                  <div className="space-y-2">
                    <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#a91d22] block">
                      Chapter 3 &bull; Monthly Cash Flow
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f172a] m-0 tracking-tight">
                      What does your monthly cash flow look like?
                    </h2>
                    <p className="font-sans text-sm text-[#475569] leading-relaxed m-0">
                      A rough estimate of what comes in and what goes out in a typical month from memory.
                    </p>
                  </div>

                  {/* Single Page "Why We Ask This" Card */}
                  <div className="bg-[#faf8f5] border border-[#e9e4db] p-4.5 rounded-xl flex items-start gap-3.5">
                    <Info className="w-5 h-5 text-[#5f7d66] shrink-0 mt-0.5" />
                    <div className="space-y-1 text-xs font-sans">
                      <span className="font-bold text-[#0f172a] block">Why we ask this:</span>
                      <p className="text-[#475569] leading-relaxed m-0">
                        Comparing your average monthly earnings with living expenses like rent, groceries, and utilities ensures any new financial commitment fits comfortably within your budget.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                    
                    {/* Monthly Income Selection Cards */}
                    <div className="bg-[#faf8f5] border border-[#e9e4db] p-4.5 rounded-2xl space-y-3">
                      <label className="block text-xs font-bold text-[#0f172a] uppercase font-sans">
                        Rough Monthly Earnings
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: '₹15k / mo', val: 15000 },
                          { label: '₹35k / mo', val: 35000 },
                          { label: '₹50k / mo', val: 50000 },
                          { label: '₹75k+ / mo', val: 75000 },
                        ].map((item) => (
                          <button
                            key={item.val}
                            type="button"
                            onClick={() => updateField('monthly_income', item.val)}
                            className={`py-2.5 px-3 rounded-xl border text-xs font-serif font-bold transition-all cursor-pointer ${
                              form.monthly_income === item.val
                                ? 'bg-[#faf8f5] border-[#a91d22] text-[#a91d22] shadow-xs'
                                : 'bg-[#fcfbfa] border-[#e9e4db] text-[#0f172a] hover:border-[#0f172a]'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                      <div className="pt-2 border-t border-[#e9e4db]">
                        <span className="text-[10px] font-sans text-[#475569] block mb-1">Or enter exact amount:</span>
                        <input
                          type="number"
                          name="monthly_income"
                          min="0"
                          required
                          value={form.monthly_income}
                          onChange={handleChange}
                          className="w-full bg-[#fcfbfa] border border-[#e9e4db] rounded-xl px-3.5 py-2 text-sm font-serif font-bold text-[#0f172a] focus:outline-none focus:border-[#0f172a]"
                        />
                      </div>
                    </div>

                    {/* Monthly Expenses Selection Cards */}
                    <div className="bg-[#faf8f5] border border-[#e9e4db] p-4.5 rounded-2xl space-y-3">
                      <label className="block text-xs font-bold text-[#0f172a] uppercase font-sans">
                        Rough Monthly Living Expenses
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: '₹10k / mo', val: 10000 },
                          { label: '₹25k / mo', val: 25000 },
                          { label: '₹40k / mo', val: 40000 },
                          { label: '₹60k+ / mo', val: 60000 },
                        ].map((item) => (
                          <button
                            key={item.val}
                            type="button"
                            onClick={() => updateField('monthly_expenses', item.val)}
                            className={`py-2.5 px-3 rounded-xl border text-xs font-serif font-bold transition-all cursor-pointer ${
                              form.monthly_expenses === item.val
                                ? 'bg-[#faf8f5] border-[#a91d22] text-[#a91d22] shadow-xs'
                                : 'bg-[#fcfbfa] border-[#e9e4db] text-[#0f172a] hover:border-[#0f172a]'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                      <div className="pt-2 border-t border-[#e9e4db]">
                        <span className="text-[10px] font-sans text-[#475569] block mb-1">Or enter exact amount:</span>
                        <input
                          type="number"
                          name="monthly_expenses"
                          min="0"
                          required
                          value={form.monthly_expenses}
                          onChange={handleChange}
                          className="w-full bg-[#fcfbfa] border border-[#e9e4db] rounded-xl px-3.5 py-2 text-sm font-serif font-bold text-[#0f172a] focus:outline-none focus:border-[#0f172a]"
                        />
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* CHAPTER 4: SAVINGS & CUSHION (savings & average_balance) */}
              {step === 4 && (
                <div className="space-y-7 animate-fade-in">
                  
                  <div className="space-y-2">
                    <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#a91d22] block">
                      Chapter 4 &bull; Savings & Cushion
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f172a] m-0 tracking-tight">
                      How do you handle savings and emergency funds?
                    </h2>
                    <p className="font-sans text-sm text-[#475569] leading-relaxed m-0">
                      Even small amounts put into savings or kept as a safety buffer show strong financial health.
                    </p>
                  </div>

                  {/* Single Page "Why We Ask This" Card */}
                  <div className="bg-[#faf8f5] border border-[#e9e4db] p-4.5 rounded-xl flex items-start gap-3.5">
                    <Info className="w-5 h-5 text-[#5f7d66] shrink-0 mt-0.5" />
                    <div className="space-y-1 text-xs font-sans">
                      <span className="font-bold text-[#0f172a] block">Why we ask this:</span>
                      <p className="text-[#475569] leading-relaxed m-0">
                        Having savings and an emergency bank balance cushion protects your household during unexpected work pauses or sudden expenses.
                      </p>
                    </div>
                  </div>

                  {/* Savings Radio-Card Selections */}
                  <div className="space-y-3 pt-2">
                    <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider font-sans">
                      A. Your Monthly Savings Habit
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { 
                          id: 'every_month', 
                          icon: PiggyBank, 
                          title: 'I save money almost every month.', 
                          desc: 'I consistently set aside a portion of my earnings every month.',
                          val: 8000
                        },
                        { 
                          id: 'whenever_can', 
                          icon: Wallet, 
                          title: 'I save whenever I can.', 
                          desc: 'I put money aside when I have extra after paying expenses.',
                          val: 3000
                        },
                        { 
                          id: 'rarely_left', 
                          icon: Coins, 
                          title: 'I rarely have money left to save.', 
                          desc: 'Most of my earnings go immediately toward daily living costs.',
                          val: 500
                        }
                      ].map((sOpt) => {
                        const isSelected = form.savings === sOpt.val;
                        const IconComponent = sOpt.icon;
                        return (
                          <div
                            key={sOpt.id}
                            onClick={() => updateField('savings', sOpt.val)}
                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-left flex flex-col justify-between ${
                              isSelected
                                ? 'bg-[#faf8f5] border-[#a91d22] shadow-xs'
                                : 'bg-[#fcfbfa] border-[#e9e4db] hover:border-[#0f172a]/40'
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                  isSelected 
                                    ? 'bg-[#a91d22] text-[#ffffff]' 
                                    : 'bg-[#faf8f5] border border-[#e9e4db] text-[#0f172a]'
                                }`}>
                                  <IconComponent className="w-4 h-4" />
                                </div>
                                {isSelected && <Check className="w-4 h-4 text-[#a91d22] stroke-[3]" />}
                              </div>
                              <span className="font-serif text-sm font-bold text-[#0f172a] block">{sOpt.title}</span>
                              <p className="text-[11px] font-sans text-[#475569] leading-snug m-0">{sOpt.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Cushion Radio-Card Selections (average_balance) */}
                  <div className="space-y-3 pt-2">
                    <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider font-sans">
                      B. If an unexpected expense came up tomorrow, about how much money do you usually have available in your bank account?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { 
                          id: 'short', 
                          icon: Shield, 
                          title: 'Less than 1 month of expenses', 
                          desc: 'I keep a small cash reserve for immediate daily needs.',
                          val: 3000
                        },
                        { 
                          id: 'medium', 
                          icon: ShieldCheck, 
                          title: 'About 1 to 2 months of expenses', 
                          desc: 'I have enough buffer to cover expenses for a month or two.',
                          val: 15000
                        },
                        { 
                          id: 'long', 
                          icon: Landmark, 
                          title: '3 months or more of expenses', 
                          desc: 'I maintain a solid emergency reserve in my bank account.',
                          val: 35000
                        }
                      ].map((cOpt) => {
                        const isSelected = form.average_balance === cOpt.val;
                        const IconComponent = cOpt.icon;
                        return (
                          <div
                            key={cOpt.id}
                            onClick={() => updateField('average_balance', cOpt.val)}
                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-left flex flex-col justify-between ${
                              isSelected
                                ? 'bg-[#faf8f5] border-[#a91d22] shadow-xs'
                                : 'bg-[#fcfbfa] border-[#e9e4db] hover:border-[#0f172a]/40'
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                  isSelected 
                                    ? 'bg-[#a91d22] text-[#ffffff]' 
                                    : 'bg-[#faf8f5] border border-[#e9e4db] text-[#0f172a]'
                                }`}>
                                  <IconComponent className="w-4 h-4" />
                                </div>
                                {isSelected && <Check className="w-4 h-4 text-[#a91d22] stroke-[3]" />}
                              </div>
                              <span className="font-serif text-sm font-bold text-[#0f172a] block">{cOpt.title}</span>
                              <p className="text-[11px] font-sans text-[#475569] leading-snug m-0">{cOpt.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}

              {/* CHAPTER 5: PAYMENTS & HISTORY (digital_transactions, cash_transactions, emi_ratio, missed_payments) */}
              {step === 5 && (
                <div className="space-y-7 animate-fade-in">
                  
                  <div className="space-y-2">
                    <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#a91d22] block">
                      Chapter 5 &bull; Payments & History
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f172a] m-0 tracking-tight">
                      How do you handle daily payments and existing commitments?
                    </h2>
                    <p className="font-sans text-sm text-[#475569] leading-relaxed m-0">
                      Using phone payment apps and keeping up with bills demonstrates reliability and builds a strong credit passport.
                    </p>
                  </div>

                  {/* Single Page "Why We Ask This" Card */}
                  <div className="bg-[#faf8f5] border border-[#e9e4db] p-4.5 rounded-xl flex items-start gap-3.5">
                    <Info className="w-5 h-5 text-[#5f7d66] shrink-0 mt-0.5" />
                    <div className="space-y-1 text-xs font-sans">
                      <span className="font-bold text-[#0f172a] block">Why we ask this:</span>
                      <p className="text-[#475569] leading-relaxed m-0">
                        Digital UPI payments create a clear paper trail that replaces traditional credit bureau reports, proving your consistency without a credit score.
                      </p>
                    </div>
                  </div>

                  {/* Payment Habits Radio Cards */}
                  <div className="space-y-3 pt-2">
                    <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider font-sans">
                      A. Your Daily Payment Routine
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { 
                          id: 'digital', 
                          icon: Smartphone, 
                          title: 'Mostly phone apps (UPI / QR)', 
                          desc: 'I use Google Pay, PhonePe, or Paytm for almost all my spending.',
                          digital: 120, cash: 15
                        },
                        { 
                          id: 'mix', 
                          icon: CreditCard, 
                          title: 'A mix of UPI phone apps & cash', 
                          desc: 'I use UPI for bills and shopping, and cash for small daily expenses.',
                          digital: 65, cash: 35
                        },
                        { 
                          id: 'cash', 
                          icon: Banknote, 
                          title: 'Mostly paper cash', 
                          desc: 'My daily routine and work run primarily on physical cash.',
                          digital: 15, cash: 100
                        }
                      ].map((h) => {
                        const isSelected = form.digital_transactions >= form.cash_transactions ? (h.id === 'digital' || h.id === 'mix') : h.id === 'cash';
                        const IconComponent = h.icon;
                        return (
                          <div
                            key={h.id}
                            onClick={() => {
                              updateField('digital_transactions', h.digital);
                              updateField('cash_transactions', h.cash);
                            }}
                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-left flex flex-col justify-between ${
                              isSelected
                                ? 'bg-[#faf8f5] border-[#a91d22] shadow-xs'
                                : 'bg-[#fcfbfa] border-[#e9e4db] hover:border-[#0f172a]/40'
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                  isSelected 
                                    ? 'bg-[#a91d22] text-[#ffffff]' 
                                    : 'bg-[#faf8f5] border border-[#e9e4db] text-[#0f172a]'
                                }`}>
                                  <IconComponent className="w-4 h-4" />
                                </div>
                                {isSelected && <Check className="w-4 h-4 text-[#a91d22] stroke-[3]" />}
                              </div>
                              <span className="font-serif text-sm font-bold text-[#0f172a] block">{h.title}</span>
                              <p className="text-[11px] font-sans text-[#475569] leading-snug m-0">{h.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Existing EMIs & Missed Payments Radio Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                    
                    {/* Active EMI Ratio Radio Cards (emi_ratio) */}
                    <div className="bg-[#faf8f5] border border-[#e9e4db] p-4.5 rounded-2xl space-y-3">
                      <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider font-sans">
                        B. Do you currently pay any monthly loans, EMIs, or installment plans?
                      </label>
                      <div className="space-y-2">
                        {[
                          { label: 'No active loan EMIs right now', ratio: 0.0 },
                          { label: 'Small EMI (e.g. Phone or Appliance)', ratio: 0.15 },
                          { label: 'Moderate EMIs (Around 30% of income)', ratio: 0.30 },
                          { label: 'Heavy loan EMIs (Over 40% of income)', ratio: 0.45 },
                        ].map((opt) => (
                          <div
                            key={opt.ratio}
                            onClick={() => updateField('emi_ratio', opt.ratio)}
                            className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between text-xs font-sans ${
                              form.emi_ratio === opt.ratio
                                ? 'bg-[#fcfbfa] border-[#a91d22] font-bold text-[#0f172a]'
                                : 'bg-[#fcfbfa] border-[#e9e4db] text-[#475569] hover:border-[#0f172a]'
                            }`}
                          >
                            <span>{opt.label}</span>
                            {form.emi_ratio === opt.ratio && <Check className="w-4 h-4 text-[#a91d22] stroke-[3]" />}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Missed Payments Radio Cards (missed_payments) */}
                    <div className="bg-[#faf8f5] border border-[#e9e4db] p-4.5 rounded-2xl space-y-3">
                      <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider font-sans">
                        C. In the past year, how often have you missed or delayed bill payments?
                      </label>
                      <div className="space-y-2">
                        {[
                          { label: 'Zero delayed payments', count: 0, icon: CheckCircle2, color: 'text-[#5f7d66]' },
                          { label: '1 or 2 minor late payments', count: 1, icon: Clock, color: 'text-[#c87a53]' },
                          { label: '3 or more delayed payments', count: 3, icon: AlertTriangle, color: 'text-[#a91d22]' },
                        ].map((opt) => {
                          const IconComp = opt.icon;
                          return (
                            <div
                              key={opt.count}
                              onClick={() => updateField('missed_payments', opt.count)}
                              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between text-xs font-sans ${
                                form.missed_payments === opt.count
                                  ? 'bg-[#fcfbfa] border-[#a91d22] font-bold text-[#0f172a]'
                                  : 'bg-[#fcfbfa] border-[#e9e4db] text-[#475569] hover:border-[#0f172a]'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <IconComp className={`w-4 h-4 ${opt.color}`} />
                                <span>{opt.label}</span>
                              </div>
                              {form.missed_payments === opt.count && <Check className="w-4 h-4 text-[#a91d22] stroke-[3]" />}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* Error Notice */}
              {error && (
                <div className="p-3.5 bg-[#fdf2f2] border border-[#a91d22]/30 text-[#a91d22] rounded-xl text-xs font-sans font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Navigation Bar */}
              <div className="flex items-center gap-4 border-t border-[#e9e4db] pt-6">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-5 py-3 rounded-xl border border-[#e9e4db] bg-[#faf8f5] text-[#0f172a] font-sans font-semibold text-sm hover:bg-[#f5efe2] transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </button>
                )}

                {step < 5 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 py-3.5 px-6 rounded-xl bg-[#0f172a] text-[#ffffff] font-sans font-semibold text-sm hover:bg-[#1e293b] transition-all duration-200 shadow-xs cursor-pointer flex items-center justify-center gap-2"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3.5 px-6 rounded-xl bg-[#0f172a] text-[#ffffff] font-sans font-semibold text-sm hover:bg-[#1e293b] transition-all duration-200 shadow-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#a91d22]" />
                        Building Your Passport...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-[#a91d22]" />
                        Generate Financial Passport
                      </>
                    )}
                  </button>
                )}
              </div>

            </form>
          )}

        </main>

      </div>
    </div>
  );
}

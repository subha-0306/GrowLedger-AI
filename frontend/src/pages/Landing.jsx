import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Sparkles, ShieldCheck, Compass, BarChart3, TrendingUp, Landmark } from 'lucide-react';
import { predictCreditReadiness } from '../services/api';
import toast from 'react-hot-toast';

export default function Landing({ setPredictionData }) {
  const navigate = useNavigate();
  const [loadingDemo, setLoadingDemo] = useState(false);

  // Triggers immediate evaluation of a Good preset and navigates to the result sheet
  const handleTryDemo = async () => {
    setLoadingDemo(true);
    const toastId = toast.loading('Simulating credit evaluation for Lakshmi (Tea Shop Preset)...');
    
    const demoPayload = {
      occupation: 'Tea Shop Owner',
      monthly_income: 60000,
      monthly_expenses: 30000,
      savings: 20000,
      average_balance: 40000,
      digital_transactions: 200,
      cash_transactions: 120,
      income_variance: 'Low',
      missed_payments: 0,
      income_growth: 'Increasing',
      emi_ratio: 0.05,
    };

    try {
      const result = await predictCreditReadiness(demoPayload);
      if (result.success) {
        setPredictionData(result.data);
        toast.success('Demo evaluation parsed! Redirecting to dashboard...', { id: toastId });
        navigate('/assess');
      } else {
        throw new Error(result.error?.message || 'Failed to resolve model prediction.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Could not connect to backend API. Loading static demo instead.', { id: toastId });
      
      // Fallback placeholder data if backend is offline so the demo NEVER breaks!
      const mockResult = {
        prediction: 'Ready',
        confidence: 95.0,
        financial_story: 'Your financial profile shows healthy saving habits and a positive income growth trend. However, unverifiable cash transactions and heavy cash reliance reduced your readiness.',
        strengthened_profile: [
          { title: 'Healthy Savings Habit', description: 'You consistently save a significant percentage of your monthly earnings.' },
          { title: 'Positive Growth Trajectory', description: 'Your income is growing over time, making future payments easier.' }
        ],
        reduced_readiness: [
          { title: 'Limited Digital Financial Activity', description: 'High cash transaction shares make validating your financial profile difficult.' }
        ],
        coaching: {
          priority_action: 'Build Digital Footprint',
          action_description: "Focus on UPI transactions to document your daily flow.",
          quick_win: 'Shift at least 5 cash purchases to UPI.',
          expected_impact: 'Projected to transition your profile with high confidence.',
          roadmap: {
            '30_days': ['Set up UPI application.', 'Make 3 small scan payments.'],
            '60_days': ['Move utility bills online.', 'Reach 50% digital ratio.'],
            '90_days': ['Review UPI bank statements.']
          },
          future_projection: {
            current_tier: 'Ready',
            projected_tier: 'Ready',
            confidence: 95.0,
            impact_level: 'Very High'
          }
        },
        model_metadata: { model: 'LightGBM', explanation_method: 'TreeSHAP' }
      };
      setPredictionData(mockResult);
      navigate('/assess');
    } finally {
      setLoadingDemo(false);
    }
  };

  return (
    <div className="space-y-20 animate-fade-in py-8">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Hero Copy */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation Alternative Scoring</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-900 tracking-tight leading-none m-0">
            Unlock capital using your <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">daily cash flows</span>.
          </h2>
          
          <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-xl">
            GrowLedger AI bridges formal banking gaps for gig workers and small merchants. By evaluating ledger activity rather than just credit history, we open pathways to fair, affordable credit limits.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              onClick={() => navigate('/assess')}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-md shadow-blue-500/10 cursor-pointer text-sm"
            >
              Start Credit Assessment
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleTryDemo}
              disabled={loadingDemo}
              className="flex items-center justify-center gap-2 bg-white hover:bg-zinc-50 text-zinc-700 font-bold py-3.5 px-6 rounded-xl border border-zinc-200 hover:border-zinc-300 transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-50 text-sm"
            >
              <Play className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              Try Demo Profile
            </button>
          </div>
        </div>

        {/* Hero Interactive Mockup Widget */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="w-full max-w-sm glass-panel p-6 rounded-2xl border border-zinc-200 shadow-lg animate-float relative z-10">
            {/* Mock Dashboard Header */}
            <div className="flex justify-between items-center border-b border-zinc-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">GL</div>
                <span className="text-xs font-bold text-zinc-800">Mock Ledger Analytics</span>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {/* Mock Radial Score Circle */}
            <div className="flex flex-col items-center py-4 space-y-2">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="absolute w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="54" stroke="#f4f4f5" strokeWidth="10" fill="transparent" />
                  <circle cx="64" cy="64" r="54" stroke="#10b981" strokeWidth="10" fill="transparent" strokeDasharray="339" strokeDashoffset="67" strokeLinecap="round" />
                </svg>
                <div className="text-center">
                  <span className="text-2xl font-black text-zinc-800 tracking-tight">Ready</span>
                  <span className="block text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mt-0.5">Tier Rating</span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">Score: 8.5 / 10</span>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-zinc-100">
              <div className="bg-zinc-50/80 p-3 rounded-xl border border-zinc-100 text-center">
                <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider">UPI Share</span>
                <span className="text-sm font-extrabold text-blue-600 mt-0.5 block">85.4%</span>
              </div>
              <div className="bg-zinc-50/80 p-3 rounded-xl border border-zinc-100 text-center">
                <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Savings Ratio</span>
                <span className="text-sm font-extrabold text-emerald-600 mt-0.5 block">33.3%</span>
              </div>
            </div>
          </div>
          
          {/* Decorative background glow rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-blue-100 filter blur-3xl opacity-40 -z-0" />
        </div>
      </section>

      {/* Product Introduction / About Section */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight m-0">
            Engineered for Transparency & Coaching
          </h3>
          <p className="text-zinc-500 text-sm sm:text-base leading-relaxed">
            GrowLedger leverages machine learning models coupled with explainable intelligence to not only evaluate credit readiness, but coach workers toward qualification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="glass-panel p-6 rounded-2xl space-y-4 text-left glass-panel-hover">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-zinc-900 m-0">Ledger-Based Scorecards</h4>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                We ingest transaction frequencies, income variance, stability trends, and digital trust scores to bypass traditional, non-existent bureau histories.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="glass-panel p-6 rounded-2xl space-y-4 text-left glass-panel-hover">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-zinc-900 m-0">TreeSHAP Explainability</h4>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                Attributions explain exactly why you scored the way you did. Users get direct visibility into positive drivers and factors holding back their readiness.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="glass-panel p-6 rounded-2xl space-y-4 text-left glass-panel-hover">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-zinc-900 m-0">Milestone Credit Coaching</h4>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                The counterfactual engine maps your weaknesses to specific 30/60/90 day savings and spending checklist roadmaps to improve your rating.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Banner / Callout */}
      <section className="bg-gradient-to-tr from-blue-600 to-indigo-700 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-md relative overflow-hidden">
        {/* Background visual shapes */}
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/5 rounded-full filter blur-2xl translate-x-12 translate-y-12" />
        
        <div className="max-w-xl mx-auto space-y-2 relative z-10">
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white m-0">Ready to unlock your credit profile?</h3>
          <p className="text-blue-100 text-sm leading-relaxed">
            Run a transaction ledger simulation using our scorecard dashboard. Calculate your rating, inspect SHAP drivers, and download milestone roadmaps.
          </p>
        </div>
        <div className="flex justify-center relative z-10">
          <button
            onClick={() => navigate('/assess')}
            className="flex items-center gap-2 bg-white hover:bg-zinc-50 text-blue-600 font-bold px-6 py-3.5 rounded-xl transition-all duration-200 shadow-lg cursor-pointer text-sm"
          >
            Start Assessment
            <ArrowRight className="w-4.5 h-4.5 text-blue-600" />
          </button>
        </div>
      </section>
    </div>
  );
}

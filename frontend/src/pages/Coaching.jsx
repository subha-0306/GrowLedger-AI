import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, CheckSquare, Target, CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Coaching({ predictionData }) {
  const navigate = useNavigate();

  // Internal state tracking checked milestones
  const [completedSteps, setCompletedSteps] = useState({});

  if (!predictionData || !predictionData.coaching) {
    return (
      <div className="glass-panel p-12 rounded-2xl text-center space-y-6 max-w-xl mx-auto my-12 animate-fade-in text-left">
        <div className="w-16 h-16 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-500 mx-auto">
          <Compass className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-zinc-900 text-center">No Coaching Plan Available</h3>
          <p className="text-zinc-500 mt-2 text-sm text-center">You must complete a credit assessment on the dashboard before we can formulate a tailored milestone savings roadmap.</p>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/assess')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all cursor-pointer text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to Credit Assessment
          </button>
        </div>
      </div>
    );
  }

  const { coaching } = predictionData;
  const roadmap = coaching.roadmap || {};
  const projection = coaching.future_projection || {};

  const toggleStep = (dayKey, idx) => {
    const key = `${dayKey}-${idx}`;
    setCompletedSteps((prev) => {
      const isChecked = !prev[key];
      if (isChecked) {
        toast.success('Milestone checkpoint updated!');
      }
      return {
        ...prev,
        [key]: isChecked,
      };
    });
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Ready':
        return 'text-emerald-700 border-emerald-200 bg-emerald-50';
      case 'Emerging':
        return 'text-amber-700 border-amber-200 bg-amber-50';
      case 'Building':
      default:
        return 'text-rose-700 border-rose-200 bg-rose-50';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-zinc-900 m-0 tracking-tight">Financial Coach Roadmap</h2>
          <p className="text-zinc-500 mt-1">Milestone coaching recommendations mapped to address your highest limiting credit factors.</p>
        </div>
        <button
          onClick={() => navigate('/assess')}
          className="flex items-center gap-2 self-start bg-white border border-zinc-200 text-zinc-700 hover:text-zinc-950 px-4 py-2 rounded-xl text-sm font-semibold hover:border-zinc-300 transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Input Form
        </button>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Priority Action Card */}
        <div className="glass-panel p-5 rounded-2xl flex gap-4 items-start">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-150 flex items-center justify-center flex-shrink-0 text-blue-600">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Priority Action</h4>
            <div className="text-base font-bold text-zinc-900 mb-1">{coaching.priority_action}</div>
            <p className="text-xs text-zinc-500 leading-relaxed m-0">{coaching.action_description}</p>
          </div>
        </div>

        {/* Quick Win Card */}
        <div className="glass-panel p-5 rounded-2xl flex gap-4 items-start">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-150 flex items-center justify-center flex-shrink-0 text-emerald-600">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Quick Win Target</h4>
            <div className="text-base font-bold text-zinc-900 mb-1">Target Action</div>
            <p className="text-xs text-zinc-600 leading-relaxed m-0">{coaching.quick_win}</p>
          </div>
        </div>

        {/* Expected Impact Card */}
        <div className="glass-panel p-5 rounded-2xl flex gap-4 items-start">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-150 flex items-center justify-center flex-shrink-0 text-amber-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Projected Result</h4>
            <div className="text-xs text-zinc-600 leading-relaxed font-semibold mt-1">{coaching.expected_impact}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Milestone Steps Timeline Column */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl space-y-8">
          <h3 className="text-lg font-bold text-zinc-900 border-b border-zinc-100 pb-3">Milestone Progress Plan</h3>
          
          <div className="space-y-8 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200">
            {/* 30 Days */}
            <div className="relative pl-12 space-y-4">
              <div className="absolute left-2.5 top-0 w-5 h-5 rounded-full bg-white border-2 border-blue-500 z-10" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">Phase 1: 30-Day Checkpoints</span>
              </div>
              <div className="space-y-3">
                {roadmap['30_days']?.map((step, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => toggleStep('30_days', idx)}
                    className="flex gap-3 items-start bg-zinc-50/40 hover:bg-zinc-50/80 p-4 rounded-xl border border-zinc-200/80 hover:border-zinc-300 transition-all cursor-pointer select-none"
                  >
                    <CheckSquare className={`w-5 h-5 flex-shrink-0 mt-0.5 ${completedSteps[`30_days-${idx}`] ? 'text-blue-600 fill-blue-50' : 'text-zinc-400'}`} />
                    <span className={`text-sm leading-relaxed ${completedSteps[`30_days-${idx}`] ? 'text-zinc-400 line-through' : 'text-zinc-700'}`}>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 60 Days */}
            <div className="relative pl-12 space-y-4">
              <div className="absolute left-2.5 top-0 w-5 h-5 rounded-full bg-white border-2 border-indigo-500 z-10" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">Phase 2: 60-Day Checkpoints</span>
              </div>
              <div className="space-y-3">
                {roadmap['60_days']?.map((step, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => toggleStep('60_days', idx)}
                    className="flex gap-3 items-start bg-zinc-50/40 hover:bg-zinc-50/80 p-4 rounded-xl border border-zinc-200/80 hover:border-zinc-300 transition-all cursor-pointer select-none"
                  >
                    <CheckSquare className={`w-5 h-5 flex-shrink-0 mt-0.5 ${completedSteps[`60_days-${idx}`] ? 'text-indigo-600 fill-indigo-50' : 'text-zinc-400'}`} />
                    <span className={`text-sm leading-relaxed ${completedSteps[`60_days-${idx}`] ? 'text-zinc-400 line-through' : 'text-zinc-700'}`}>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 90 Days */}
            <div className="relative pl-12 space-y-4">
              <div className="absolute left-2.5 top-0 w-5 h-5 rounded-full bg-white border-2 border-emerald-500 z-10" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">Phase 3: 90-Day Checkpoints</span>
              </div>
              <div className="space-y-3">
                {roadmap['90_days']?.map((step, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => toggleStep('90_days', idx)}
                    className="flex gap-3 items-start bg-zinc-50/40 hover:bg-zinc-50/80 p-4 rounded-xl border border-zinc-200/80 hover:border-zinc-300 transition-all cursor-pointer select-none"
                  >
                    <CheckSquare className={`w-5 h-5 flex-shrink-0 mt-0.5 ${completedSteps[`90_days-${idx}`] ? 'text-emerald-600 fill-emerald-50' : 'text-zinc-400'}`} />
                    <span className={`text-sm leading-relaxed ${completedSteps[`90_days-${idx}`] ? 'text-zinc-400 line-through' : 'text-zinc-700'}`}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Simulation / Projection Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-5 text-center">
            <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-wider mb-2">Simulated Tier Projection</h3>
            
            {/* Current vs Projected Display */}
            <div className="flex flex-col items-center gap-4 bg-zinc-50/40 p-5 rounded-2xl border border-zinc-200/60 shadow-sm">
              <div className={`px-4 py-2.5 rounded-xl border text-sm font-bold uppercase tracking-widest w-full text-center ${getTierColor(projection.current_tier)}`}>
                Current: {projection.current_tier}
              </div>
              <div className="flex justify-center items-center w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-400">
                <ChevronRight className="w-5 h-5 transform rotate-90 lg:rotate-0" />
              </div>
              <div className={`px-4 py-2.5 rounded-xl border text-sm font-bold uppercase tracking-widest w-full text-center animate-pulse ${getTierColor(projection.projected_tier)}`}>
                Projected: {projection.projected_tier}
              </div>
            </div>

            {/* Confidence details */}
            <div className="space-y-4 text-left border-t border-zinc-100 pt-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500 font-bold">Transition Confidence</span>
                <span className="text-zinc-800 font-black">{projection.confidence}%</span>
              </div>
              <div className="w-full bg-zinc-100 rounded-full h-2 border border-zinc-200/50">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${projection.confidence}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500 font-bold">Transition Impact Level</span>
                <span className={`font-bold px-2 py-0.5 rounded text-white text-[10px] uppercase ${
                  projection.impact_level === 'Very High' || projection.impact_level === 'High'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                    : 'bg-zinc-100 border border-zinc-200 text-zinc-600'
                }`}>
                  {projection.impact_level}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

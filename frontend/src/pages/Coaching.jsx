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
      <div className="bg-[#FFFDF8] border border-[#E6DED2] p-12 rounded-[20px] text-center space-y-6 max-w-xl mx-auto my-12 animate-fade-in text-left shadow-sm">
        <div className="w-16 h-16 rounded-[20px] bg-[#f4efe4] border border-[#E6DED2] flex items-center justify-center text-[#666666] mx-auto shadow-inner">
          <Compass className="w-8 h-8 text-[#2E6A52]" />
        </div>
        <div>
          <h3 className="font-serif text-xl font-bold text-[#1F2430] text-center">No Coaching Plan Available</h3>
          <p className="font-sans text-[#666666] mt-2 text-sm text-center leading-relaxed">You must complete a credit assessment on the dashboard before we can formulate a tailored milestone savings roadmap.</p>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/assess')}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-[12px] bg-[#1F4B3A] hover:bg-[#2E6A52] hover:translate-y-[-2px] text-white font-semibold transition-all duration-200 cursor-pointer text-sm shadow-sm font-sans"
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
        return 'text-[#1F4B3A] border-[#c4d6c7] bg-[#edf3ee]';
      case 'Emerging':
        return 'text-[#B88A3B] border-[#ebdcb4] bg-[#fdfaf0]';
      case 'Building':
      default:
        return 'text-[#c2901a] border-[#e8dbb0] bg-[#fffbef]';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-left bg-[#FBF8F2] p-2 md:p-6 rounded-[24px]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E6DED2] pb-6">
        <div>
          <h2 className="font-serif text-3xl font-extrabold text-[#1F2430] m-0 tracking-tight">Financial Coach Roadmap</h2>
          <p className="font-sans text-[#666666] mt-1 text-sm md:text-base leading-relaxed m-0">Milestone coaching recommendations mapped to address your highest limiting credit factors.</p>
        </div>
        <button
          onClick={() => navigate('/assess')}
          className="flex items-center gap-2 self-start bg-[#FFFDF8] border border-[#E6DED2] text-[#666666] hover:text-[#1F2430] px-4 py-2.5 rounded-[12px] text-xs font-semibold hover:bg-[#f4efe4] hover:translate-y-[-2px] transition-all duration-200 cursor-pointer shadow-sm font-sans"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Assessment Form
        </button>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Priority Action Card */}
        <div className="bg-[#FFFDF8] border border-[#E6DED2] p-5 rounded-[20px] flex gap-4 items-start shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-[#edf3ee]/60 border border-[#c4d6c7] flex items-center justify-center flex-shrink-0 text-[#2E6A52] shadow-inner">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-sans text-[10px] font-bold text-[#666666] uppercase tracking-widest mb-1.5">Priority Action</h4>
            <div className="font-serif text-base font-bold text-[#1F2430] mb-1">{coaching.priority_action}</div>
            <p className="font-sans text-xs text-[#666666] leading-relaxed m-0">{coaching.action_description}</p>
          </div>
        </div>

        {/* Quick Win Card */}
        <div className="bg-[#FFFDF8] border border-[#E6DED2] p-5 rounded-[20px] flex gap-4 items-start shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-[#fdfaf0]/60 border border-[#ebdcb4] flex items-center justify-center flex-shrink-0 text-[#B88A3B] shadow-inner">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-sans text-[10px] font-bold text-[#666666] uppercase tracking-widest mb-1.5">Quick Win Target</h4>
            <div className="font-serif text-base font-bold text-[#1F2430] mb-1">Target Action</div>
            <p className="font-sans text-xs text-[#666666] leading-relaxed m-0">{coaching.quick_win}</p>
          </div>
        </div>

        {/* Expected Impact Card */}
        <div className="bg-[#FFFDF8] border border-[#E6DED2] p-5 rounded-[20px] flex gap-4 items-start shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-[#edf3ee]/60 border border-[#c4d6c7] flex items-center justify-center flex-shrink-0 text-[#2E6A52] shadow-inner">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-sans text-[10px] font-bold text-[#666666] uppercase tracking-widest mb-1.5">Projected Result</h4>
            <p className="font-sans text-xs text-[#666666] leading-relaxed font-semibold m-0 mt-1">{coaching.expected_impact}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Milestone Steps Timeline Column */}
        <div className="lg:col-span-8 bg-[#FFFDF8] border border-[#E6DED2] p-6 rounded-[20px] space-y-8 shadow-sm">
          <h3 className="font-serif text-lg font-bold text-[#1F2430] border-b border-[#E6DED2]/60 pb-3 mt-0">Milestone Progress Plan</h3>
          
          <div className="space-y-8 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#E6DED2]">
            {/* 30 Days */}
            <div className="relative pl-12 space-y-4">
              <div className="absolute left-3 top-0.5 w-4 h-4 rounded-full bg-[#1F4B3A] border-2 border-[#FFFDF8] z-10 shadow-sm" />
              <div>
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#1F4B3A] bg-[#edf3ee] border border-[#c4d6c7] px-3 py-1 rounded-full">Phase 1: 30-Day Checkpoints</span>
              </div>
              <div className="space-y-3">
                {roadmap['30_days']?.map((stepStr, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => toggleStep('30_days', idx)}
                    className="flex gap-3 items-start bg-[#fcfbf9] hover:bg-[#f5f2eb] p-4 rounded-xl border border-[#E6DED2] transition-all duration-200 cursor-pointer select-none"
                  >
                    <CheckSquare className={`w-5 h-5 flex-shrink-0 mt-0.5 ${completedSteps[`30_days-${idx}`] ? 'text-[#2E6A52] fill-[#edf3ee]' : 'text-[#666666]'}`} />
                    <span className={`text-sm leading-relaxed font-sans ${completedSteps[`30_days-${idx}`] ? 'text-[#666666] line-through' : 'text-[#1F2430]'}`}>{stepStr}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 60 Days */}
            <div className="relative pl-12 space-y-4">
              <div className="absolute left-3 top-0.5 w-4 h-4 rounded-full bg-[#B88A3B] border-2 border-[#FFFDF8] z-10 shadow-sm" />
              <div>
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#B88A3B] bg-[#fdfaf0] border border-[#ebdcb4] px-3 py-1 rounded-full">Phase 2: 60-Day Checkpoints</span>
              </div>
              <div className="space-y-3">
                {roadmap['60_days']?.map((stepStr, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => toggleStep('60_days', idx)}
                    className="flex gap-3 items-start bg-[#fcfbf9] hover:bg-[#f5f2eb] p-4 rounded-xl border border-[#E6DED2] transition-all duration-200 cursor-pointer select-none"
                  >
                    <CheckSquare className={`w-5 h-5 flex-shrink-0 mt-0.5 ${completedSteps[`60_days-${idx}`] ? 'text-[#B88A3B] fill-[#fdfaf0]' : 'text-[#666666]'}`} />
                    <span className={`text-sm leading-relaxed font-sans ${completedSteps[`60_days-${idx}`] ? 'text-[#666666] line-through' : 'text-[#1F2430]'}`}>{stepStr}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 90 Days */}
            <div className="relative pl-12 space-y-4">
              <div className="absolute left-3 top-0.5 w-4 h-4 rounded-full bg-[#2E6A52] border-2 border-[#FFFDF8] z-10 shadow-sm" />
              <div>
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#2E6A52] bg-[#edf3ee] border border-[#c4d6c7] px-3 py-1 rounded-full">Phase 3: 90-Day Checkpoints</span>
              </div>
              <div className="space-y-3">
                {roadmap['90_days']?.map((stepStr, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => toggleStep('90_days', idx)}
                    className="flex gap-3 items-start bg-[#fcfbf9] hover:bg-[#f5f2eb] p-4 rounded-xl border border-[#E6DED2] transition-all duration-200 cursor-pointer select-none"
                  >
                    <CheckSquare className={`w-5 h-5 flex-shrink-0 mt-0.5 ${completedSteps[`90_days-${idx}`] ? 'text-[#2E6A52] fill-[#edf3ee]' : 'text-[#666666]'}`} />
                    <span className={`text-sm leading-relaxed font-sans ${completedSteps[`90_days-${idx}`] ? 'text-[#666666] line-through' : 'text-[#1F2430]'}`}>{stepStr}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Simulation / Projection Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#FFFDF8] border border-[#E6DED2] p-6 rounded-[20px] space-y-5 text-center shadow-sm">
            <h3 className="font-serif text-sm font-bold text-[#1F2430] border-b border-[#E6DED2]/60 pb-2.5 mt-0 text-left">Simulated Tier Projection</h3>
            
            {/* Current vs Projected Display */}
            <div className="flex flex-col items-center gap-4 bg-[#fcfbf9] p-5 rounded-2xl border border-[#E6DED2] shadow-sm">
              <div className={`px-4 py-2.5 rounded-xl border text-xs font-sans font-bold uppercase tracking-widest w-full text-center ${getTierColor(projection.current_tier)}`}>
                Current: {projection.current_tier}
              </div>
              <div className="flex justify-center items-center w-8 h-8 rounded-full bg-[#f4efe4] border border-[#E6DED2] text-[#666666]">
                <ChevronRight className="w-5 h-5 transform rotate-90 lg:rotate-0" />
              </div>
              <div className={`px-4 py-2.5 rounded-xl border text-xs font-sans font-bold uppercase tracking-widest w-full text-center animate-pulse ${getTierColor(projection.projected_tier)}`}>
                Projected: {projection.projected_tier}
              </div>
            </div>

            {/* Confidence details */}
            <div className="space-y-4 text-left border-t border-[#E6DED2]/60 pt-4">
              <div className="flex justify-between items-center text-xs font-sans">
                <span className="text-[#666666] font-bold uppercase tracking-wider text-[10px]">Transition Confidence</span>
                <span className="text-[#1F2430] font-black font-mono">{projection.confidence}%</span>
              </div>
              <div className="w-full bg-[#E6DED2] rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#2E6A52] to-[#B88A3B] h-full rounded-full transition-all duration-1000"
                  style={{ width: `${projection.confidence}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-xs font-sans">
                <span className="text-[#666666] font-bold uppercase tracking-wider text-[10px]">Transition Impact Level</span>
                <span className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase border ${
                  projection.impact_level === 'Very High' || projection.impact_level === 'High'
                    ? 'bg-[#edf3ee] border-[#c4d6c7] text-[#1F4B3A]'
                    : 'bg-[#f4efe4] border-[#E6DED2] text-[#666666]'
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

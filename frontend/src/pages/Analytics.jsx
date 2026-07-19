import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ShieldCheck, Sparkles, AlertTriangle, Compass, ArrowLeft } from 'lucide-react';

export default function Analytics({ predictionData }) {
  const navigate = useNavigate();

  if (!predictionData) {
    return (
      <div className="bg-[#FFFDF8] border border-[#E6DED2] p-12 rounded-[20px] text-center space-y-6 max-w-xl mx-auto my-12 animate-fade-in text-left shadow-sm">
        <div className="w-16 h-16 rounded-[20px] bg-[#f4efe4] border border-[#E6DED2] flex items-center justify-center text-[#666666] mx-auto shadow-inner">
          <ShieldCheck className="w-8 h-8 text-[#2E6A52]" />
        </div>
        <div>
          <h3 className="font-serif text-xl font-bold text-[#1F2430] text-center">No Explanation Data Available</h3>
          <p className="font-sans text-[#666666] mt-2 text-sm text-center leading-relaxed">You must complete a credit assessment on the dashboard before we can calculate and visualize SHAP explainability metrics.</p>
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

  // Pre-process drivers for Recharts mapping
  const chartData = [
    ...predictionData.strengthened_profile.map((item, idx) => ({
      name: item.title,
      type: 'Positive Impact',
      weight: 10 - idx * 2.5, 
    })),
    ...predictionData.reduced_readiness.map((item, idx) => ({
      name: item.title,
      type: 'Negative Impact',
      weight: -(10 - idx * 2.5),
    })),
  ];

  return (
    <div className="space-y-8 animate-fade-in text-left bg-[#FBF8F2] p-2 md:p-6 rounded-[24px]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E6DED2] pb-6">
        <div>
          <h2 className="font-serif text-3xl font-extrabold text-[#1F2430] m-0 tracking-tight">SHAP Explainability & Attributions</h2>
          <p className="font-sans text-[#666666] mt-1 text-sm md:text-base leading-relaxed m-0">Explores the machine learning features that drove your assessment score using TreeSHAP.</p>
        </div>
        <button
          onClick={() => navigate('/assess')}
          className="flex items-center gap-2 self-start bg-[#FFFDF8] border border-[#E6DED2] text-[#666666] hover:text-[#1F2430] px-4 py-2.5 rounded-[12px] text-xs font-semibold hover:bg-[#f4efe4] hover:translate-y-[-2px] transition-all duration-200 cursor-pointer shadow-sm font-sans"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Assessment Form
        </button>
      </div>

      {/* Attributions Chart */}
      <div className="bg-[#FFFDF8] border border-[#E6DED2] p-6 rounded-[20px] shadow-sm">
        <h3 className="font-serif text-lg font-bold text-[#1F2430] mb-4 border-b border-[#E6DED2]/60 pb-3 mt-0">TreeSHAP Feature Impact Chart</h3>
        <div className="h-80 w-full font-sans">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E6DED2" />
              <XAxis type="number" stroke="#666666" fontSize={11} tickFormatter={(v) => `${v > 0 ? '+' : ''}${v}`} />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="#666666" 
                fontSize={10} 
                width={140} 
                tickLine={false} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#FFFDF8', borderColor: '#E6DED2', borderRadius: '12px', boxShadow: '0 4px 12px rgba(15,23,42,0.05)' }}
                labelClassName="text-[#1F2430] font-bold"
                formatter={(value) => [
                  `${value > 0 ? 'Strengthening' : 'Limiting'} (${Math.abs(value)})`,
                  'Credit Signal Force'
                ]}
              />
              <Bar dataKey="weight">
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.weight > 0 ? '#2E6A52' : '#B88A3B'} 
                    fillOpacity={0.9}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Strengthened Profile Indicators (Positive) */}
        <div className="bg-[#FFFDF8] border border-[#E6DED2] p-6 rounded-[20px] space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-[#2E6A52] font-bold border-b border-[#E6DED2]/60 pb-2.5">
            <Sparkles className="w-5 h-5" />
            <span className="font-serif text-sm">Positive Credit Drivers (Strengths)</span>
          </div>
          
          <div className="space-y-4">
            {predictionData.strengthened_profile.length > 0 ? (
              predictionData.strengthened_profile.map((item, idx) => (
                <div key={idx} className="bg-[#edf3ee]/40 p-4 rounded-xl border border-[#c4d6c7] hover:border-[#2E6A52]/40 transition-all duration-200">
                  <h4 className="font-serif text-sm font-bold text-[#1F4B3A] mb-1">{item.title}</h4>
                  <p className="font-sans text-xs text-[#666666] leading-relaxed m-0">{item.description}</p>
                </div>
              ))
            ) : (
              <p className="text-[#666666] text-sm font-sans">No positive indicators detected.</p>
            )}
          </div>
        </div>

        {/* Reduced Readiness Indicators (Negative) */}
        <div className="bg-[#FFFDF8] border border-[#E6DED2] p-6 rounded-[20px] space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-[#B88A3B] font-bold border-b border-[#E6DED2]/60 pb-2.5">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-serif text-sm">Limiting Credit Drivers (Weaknesses)</span>
          </div>

          <div className="space-y-4">
            {predictionData.reduced_readiness.length > 0 ? (
              predictionData.reduced_readiness.map((item, idx) => (
                <div key={idx} className="bg-[#fdfaf0]/40 p-4 rounded-xl border border-[#ebdcb4] hover:border-[#B88A3B]/40 transition-all duration-200">
                  <h4 className="font-serif text-sm font-bold text-[#B88A3B] mb-1">{item.title}</h4>
                  <p className="font-sans text-xs text-[#666666] leading-relaxed m-0">{item.description}</p>
                </div>
              ))
            ) : (
              <p className="text-[#666666] text-sm font-sans">No negative/limiting indicators detected.</p>
            )}
          </div>
        </div>
      </div>

      {/* Model Methodology Metadata Footer */}
      <div className="bg-[#FFFDF8] border border-[#E6DED2] p-4 rounded-xl flex items-center justify-between text-xs text-[#666666] shadow-sm font-mono">
        <div>
          Model Engine: <span className="text-[#1F2430] font-bold">{predictionData.model_metadata?.model || 'LightGBM'}</span>
        </div>
        <div>
          Explainability Engine: <span className="text-[#1F2430] font-bold">{predictionData.model_metadata?.explanation_method || 'TreeSHAP'}</span>
        </div>
      </div>
    </div>
  );
}

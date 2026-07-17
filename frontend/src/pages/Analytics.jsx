import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ShieldCheck, Sparkles, AlertTriangle, Compass, ArrowLeft } from 'lucide-react';

export default function Analytics({ predictionData }) {
  const navigate = useNavigate();

  if (!predictionData) {
    return (
      <div className="glass-panel p-12 rounded-2xl text-center space-y-6 max-w-xl mx-auto my-12 animate-fade-in text-left">
        <div className="w-16 h-16 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-500 mx-auto">
          <ShieldCheck className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-zinc-900 text-center">No Explanation Data Available</h3>
          <p className="text-zinc-500 mt-2 text-sm text-center">You must complete a credit assessment on the dashboard before we can calculate and visualize SHAP explainability metrics.</p>
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
    <div className="space-y-8 animate-fade-in text-left">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-zinc-900 m-0 tracking-tight">SHAP Explainability & Attributions</h2>
          <p className="text-zinc-500 mt-1">Explores the machine learning features that drove your assessment score using TreeSHAP.</p>
        </div>
        <button
          onClick={() => navigate('/assess')}
          className="flex items-center gap-2 self-start bg-white border border-zinc-200 text-zinc-700 hover:text-zinc-950 px-4 py-2 rounded-xl text-sm font-semibold hover:border-zinc-300 transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Input Form
        </button>
      </div>

      {/* Attributions Chart */}
      <div className="glass-panel p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-zinc-900 mb-4 border-b border-zinc-100 pb-3">TreeSHAP Feature Impact Chart</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
              <XAxis type="number" stroke="#71717a" fontSize={12} tickFormatter={(v) => `${v > 0 ? '+' : ''}${v}`} />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="#71717a" 
                fontSize={11} 
                width={150} 
                tickLine={false} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e4e4e7', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                labelClassName="text-zinc-900 font-bold"
                formatter={(value, name, props) => [
                  `${value > 0 ? 'Strengthening Impact' : 'Limiting Impact'} (${Math.abs(value)})`,
                  'Credit Readiness Force'
                ]}
              />
              <Bar dataKey="weight">
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.weight > 0 ? '#10b981' : '#f43f5e'} 
                    fillOpacity={0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Strengthened Profile Indicators (Positive) */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-emerald-600 font-bold border-b border-zinc-100 pb-2.5">
            <Sparkles className="w-5 h-5" />
            <span>Positive Credit Drivers (Strengths)</span>
          </div>
          
          <div className="space-y-4">
            {predictionData.strengthened_profile.length > 0 ? (
              predictionData.strengthened_profile.map((item, idx) => (
                <div key={idx} className="bg-zinc-50/50 p-4 rounded-xl border border-zinc-200/60 hover:border-emerald-500/20 transition-all">
                  <h4 className="text-sm font-bold text-emerald-700 mb-1">{item.title}</h4>
                  <p className="text-xs text-zinc-600 leading-relaxed m-0">{item.description}</p>
                </div>
              ))
            ) : (
              <p className="text-zinc-500 text-sm">No positive indicators detected.</p>
            )}
          </div>
        </div>

        {/* Reduced Readiness Indicators (Negative) */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-rose-600 font-bold border-b border-zinc-100 pb-2.5">
            <AlertTriangle className="w-5 h-5" />
            <span>Limiting Credit Drivers (Weaknesses)</span>
          </div>

          <div className="space-y-4">
            {predictionData.reduced_readiness.length > 0 ? (
              predictionData.reduced_readiness.map((item, idx) => (
                <div key={idx} className="bg-zinc-50/50 p-4 rounded-xl border border-zinc-200/60 hover:border-rose-500/20 transition-all">
                  <h4 className="text-sm font-bold text-rose-700 mb-1">{item.title}</h4>
                  <p className="text-xs text-zinc-600 leading-relaxed m-0">{item.description}</p>
                </div>
              ))
            ) : (
              <p className="text-zinc-500 text-sm">No negative/limiting indicators detected.</p>
            )}
          </div>
        </div>
      </div>

      {/* Model Methodology Metadata Footer */}
      <div className="glass-panel p-4 rounded-xl flex items-center justify-between text-xs text-zinc-500">
        <div>
          Model Engine: <span className="text-zinc-600 font-bold">{predictionData.model_metadata?.model || 'LightGBM'}</span>
        </div>
        <div>
          Explainability Engine: <span className="text-zinc-600 font-bold">{predictionData.model_metadata?.explanation_method || 'TreeSHAP'}</span>
        </div>
      </div>
    </div>
  );
}

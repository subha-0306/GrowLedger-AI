import React, { useState, useEffect } from 'react';
import { getHealthStatus } from '../services/api';
import { Activity, RefreshCw, Server, Cpu, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Status() {
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState(null);
  const [latency, setLatency] = useState(null);
  const [error, setError] = useState(null);

  const checkStatus = async () => {
    setLoading(true);
    setError(null);
    const start = performance.now();
    
    try {
      const data = await getHealthStatus();
      const end = performance.now();
      setLatency(Math.round(end - start));
      
      if (data && data.status) {
        setHealth(data);
      } else {
        throw new Error('Invalid response structure from backend.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unable to reach backend diagnostics.');
      setHealth(null);
      setLatency(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleRefresh = () => {
    checkStatus();
    toast.success('Pinging API endpoint...');
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl mx-auto text-left bg-[#FBF8F2] p-2 md:p-6 rounded-[24px]">
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-[#E6DED2] pb-6">
        <div>
          <h2 className="font-serif text-3xl font-extrabold text-[#1F2430] m-0 tracking-tight">Diagnostics & System Status</h2>
          <p className="font-sans text-[#666666] mt-1 text-sm md:text-base leading-relaxed m-0">Real-time health monitoring of the GrowLedger Flask API backend service.</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center justify-center p-3 rounded-[12px] bg-[#FFFDF8] border border-[#E6DED2] hover:bg-[#f4efe4] hover:translate-y-[-2px] text-[#666666] hover:text-[#1F2430] transition-all duration-200 cursor-pointer shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Main Status Container */}
      <div className="bg-[#FFFDF8] border border-[#E6DED2] p-6 rounded-[20px] space-y-6 shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <RefreshCw className="w-8 h-8 text-[#2E6A52] animate-spin" />
            <span className="text-sm font-sans text-[#666666] font-medium">Checking server connectivity...</span>
          </div>
        ) : health ? (
          /* Live Connected State */
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#E6DED2]/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#2E6A52] animate-pulse" />
                <span className="text-lg font-serif font-bold text-[#1F2430]">All Systems Operational</span>
              </div>
              <span className="font-mono text-[10px] text-[#666666] font-bold bg-[#f4efe4] border border-[#E6DED2] px-3 py-1 rounded-full uppercase tracking-wider">
                Ver {health.version || '1.0.0'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
              {/* API Core latency */}
              <div className="bg-[#fcfbf9] border border-[#E6DED2] p-5 rounded-xl text-center space-y-2">
                <Server className="w-6 h-6 text-[#2E6A52] mx-auto" />
                <h4 className="text-[10px] font-bold text-[#666666] uppercase tracking-wider">API Latency</h4>
                <div className="font-serif text-2xl font-black text-[#1F2430]">{latency} ms</div>
              </div>

              {/* Service status */}
              <div className="bg-[#fcfbf9] border border-[#E6DED2] p-5 rounded-xl text-center space-y-2">
                <Activity className="w-6 h-6 text-[#2E6A52] mx-auto" />
                <h4 className="text-[10px] font-bold text-[#666666] uppercase tracking-wider">Service Status</h4>
                <div className="font-serif text-2xl font-black text-[#2E6A52] uppercase tracking-wide">{health.status}</div>
              </div>

              {/* Engine identification */}
              <div className="bg-[#fcfbf9] border border-[#E6DED2] p-5 rounded-xl text-center space-y-2">
                <Cpu className="w-6 h-6 text-[#B88A3B] mx-auto" />
                <h4 className="text-[10px] font-bold text-[#666666] uppercase tracking-wider">Server Type</h4>
                <div className="font-serif text-2xl font-black text-[#1F2430]">Flask WSGI</div>
              </div>
            </div>

            {/* Connection Information */}
            <div className="bg-[#fcfbf9] border border-[#E6DED2] p-4 rounded-xl text-xs text-[#666666] leading-relaxed font-mono">
              Flask is configured to run at <code className="text-[#1F2430] text-[10px] ml-1 bg-white px-2 py-0.5 border border-[#E6DED2]">http://localhost:5000</code>. Cross-Origin Resource Sharing (CORS) is enabled to support local developer request mapping.
            </div>
          </div>
        ) : (
          /* Disconnected State */
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-[#E6DED2]/60 pb-4 text-[#A73B3B]">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <span className="font-serif text-lg font-bold">API Connection Refused</span>
            </div>

            <div className="bg-rose-50/50 border border-[#ebd1d1] rounded-xl p-6 space-y-3">
              <h4 className="font-serif text-sm font-bold text-[#A73B3B] mt-0">Diagnosis Details</h4>
              <p className="font-sans text-xs text-[#666666] leading-relaxed m-0">
                {error || 'The front-end client failed to establish an HTTP connection with the GrowLedger backend.'}
              </p>
              <ul className="font-sans text-xs text-[#666666] space-y-1.5 list-disc pl-5 m-0">
                <li>Verify the backend server is running: <code className="text-[10px] bg-white px-1.5 py-0.5 border border-[#E6DED2] text-[#1F2430] font-mono">python app.py</code> in the <code className="text-[10px] bg-white px-1.5 py-0.5 border border-[#E6DED2] text-[#1F2430] font-mono">backend</code> directory.</li>
                <li>Ensure the backend is running on port <code className="text-[10px] bg-white px-1.5 py-0.5 border border-[#E6DED2] text-[#1F2430] font-mono">5000</code>.</li>
                <li>Check that firewall settings do not block localhost API routing requests.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

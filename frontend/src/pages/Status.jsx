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
    <div className="space-y-8 animate-fade-in max-w-3xl mx-auto text-left">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-zinc-900 m-0 tracking-tight">Diagnostics & System Status</h2>
          <p className="text-zinc-500 mt-1">Real-time health monitoring of the GrowLedger Flask API backend service.</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center justify-center p-2.5 rounded-xl bg-white border border-zinc-200 hover:border-blue-500/50 hover:bg-zinc-50 text-zinc-600 hover:text-blue-600 transition-all cursor-pointer shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Main Status Container */}
      <div className="glass-panel p-6 rounded-2xl space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="text-sm text-zinc-400 font-medium">Checking server connectivity...</span>
          </div>
        ) : health ? (
          /* Live Connected State */
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-lg font-bold text-zinc-900 font-sans">All Systems Operational</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-bold bg-zinc-100 border border-zinc-200 px-3 py-1 rounded-full uppercase tracking-wider">
                Ver {health.version || '1.0.0'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* API Core latency */}
              <div className="bg-zinc-50/50 border border-zinc-200/60 p-5 rounded-2xl text-center space-y-2">
                <Server className="w-6 h-6 text-blue-600 mx-auto" />
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">API Latency</h4>
                <div className="text-2xl font-black text-zinc-800">{latency} ms</div>
              </div>

              {/* Service status */}
              <div className="bg-zinc-50/50 border border-zinc-200/60 p-5 rounded-2xl text-center space-y-2">
                <Activity className="w-6 h-6 text-emerald-600 mx-auto" />
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Service Status</h4>
                <div className="text-2xl font-black text-emerald-600 uppercase tracking-wide">{health.status}</div>
              </div>

              {/* Engine identification */}
              <div className="bg-zinc-50/50 border border-zinc-200/60 p-5 rounded-2xl text-center space-y-2">
                <Cpu className="w-6 h-6 text-indigo-500 mx-auto" />
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Server Type</h4>
                <div className="text-2xl font-black text-zinc-850">Flask WSGI</div>
              </div>
            </div>

            {/* Connection Information */}
            <div className="bg-zinc-50/30 border border-zinc-200/50 p-4 rounded-xl text-xs text-zinc-500 leading-relaxed">
              Flask is configured to run at <code className="text-zinc-600 text-[10px] ml-1 bg-white px-2 py-0.5 border border-zinc-200">http://localhost:5000</code>. Cross-Origin Resource Sharing (CORS) is enabled to support local developer request mapping.
            </div>
          </div>
        ) : (
          /* Disconnected State */
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-150 pb-4 text-rose-600">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <span className="text-lg font-bold">API Connection Refused</span>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 space-y-3">
              <h4 className="text-sm font-bold text-rose-700">Diagnosis Details</h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {error || 'The front-end client failed to establish an HTTP connection with the GrowLedger backend.'}
              </p>
              <ul className="text-xs text-zinc-500 space-y-1 list-disc pl-5">
                <li>Verify the backend server is running: <code className="text-[10px] bg-white px-1 py-0.5 border border-zinc-200 text-zinc-600">python app.py</code> in the <code className="text-[10px] bg-white px-1 py-0.5 border border-zinc-200 text-zinc-600">backend</code> directory.</li>
                <li>Ensure the backend is running on port <code className="text-[10px] bg-white px-1 py-0.5 border border-zinc-200 text-zinc-600">5000</code>.</li>
                <li>Check that firewall settings do not block localhost API routing requests.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

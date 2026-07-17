import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-fade-in text-zinc-900">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 border border-blue-500/20 flex items-center justify-center text-white glow-blue shadow-md">
        <Compass className="w-10 h-10 animate-spin-slow" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-4xl font-black text-zinc-950 m-0 tracking-tight">404 - Sheet Not Found</h2>
        <p className="text-zinc-500 text-sm max-w-sm mx-auto">
          The dashboard projection or audit sheet you are trying to view does not exist.
        </p>
      </div>

      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 py-3 px-6 rounded-xl text-zinc-700 font-bold bg-white border border-zinc-200 hover:border-blue-500/50 hover:bg-zinc-50 transition-all text-sm shadow-sm cursor-pointer"
      >
        <Home className="w-4 h-4 text-blue-500" />
        Return to Home Page
      </button>
    </div>
  );
}

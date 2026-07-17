import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Sparkles, Activity, Menu, X, Landmark } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Credit Assessment', href: '/assess', icon: Sparkles },
    { name: 'System Status', href: '/status', icon: Activity },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 text-zinc-900 font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-shrink-0 md:flex-col w-64 border-r border-zinc-200 bg-white shadow-sm">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo Header */}
          <div className="flex items-center h-16 px-6 gap-3 border-b border-zinc-100 bg-zinc-50/50">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-sm">
              <Landmark className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-sm font-extrabold tracking-tight text-zinc-900 block">GrowLedger AI</span>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider m-0 mt-0.5">Credit Readiness</p>
            </div>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto bg-white">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end={item.href === '/'} // End route strict matching for root home page
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 group ${
                      isActive
                        ? 'bg-blue-50 border border-blue-100 text-blue-600 shadow-sm'
                        : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-850 border border-transparent'
                    }`
                  }
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0 group-hover:scale-105 transition-transform duration-200" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Footer Info */}
          <div className="p-4 border-t border-zinc-100 bg-zinc-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse animate-duration-1000" />
              <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Core API Connected</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden bg-zinc-950/20 backdrop-blur-sm">
          <div className="relative flex flex-col flex-1 w-full max-w-xs pt-5 pb-4 bg-white border-r border-zinc-200 animate-slide-in">
            {/* Close Button */}
            <div className="absolute top-0 right-0 pt-2 -mr-12">
              <button
                type="button"
                className="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-500 hover:text-zinc-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Logo */}
            <div className="flex items-center px-6 gap-3 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600">
                <Landmark className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold text-zinc-950">GrowLedger AI</span>
            </div>

            {/* Mobile Navigation Links */}
            <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    end={item.href === '/'}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-50 text-blue-600 border border-blue-100 shadow-sm'
                          : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-850 border border-transparent'
                      }`
                    }
                  >
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-zinc-50">
        {/* Mobile Header Nav bar */}
        <header className="flex items-center justify-between h-16 px-6 border-b border-zinc-200 md:hidden bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600">
              <Landmark className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-zinc-900 tracking-wide uppercase">GrowLedger AI</span>
          </div>
          <button
            type="button"
            className="p-2 -mr-2 rounded-lg text-zinc-500 hover:text-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Dynamic Page Slots */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none p-6 md:p-8">
          <div className="max-w-6xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

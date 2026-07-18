import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isLanding = location.pathname === '/';

  const navLinks = [
    { name: 'Home',            href: '/'             },
    { name: 'How It Works',    href: '/#how-it-works'  },
    { name: 'Methodology',     href: '/#methodology'   },
    { name: 'Demo Profiles',   href: '/#demo-profiles' },
    { name: 'About',           href: '/#about'         },
  ];

  const handleStartAssessment = () => {
    navigate('/assess');
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-[#0f172a] font-sans antialiased selection:bg-[#a91d22]/10 selection:text-[#a91d22]">

      {/* ─── Sticky Top Navigation — Premium Dark Forest Green + Gold Accent ─── */}
      <header className="sticky top-0 z-50 bg-[#081c15]/95 backdrop-blur-md border-b border-[#c2a67a]/25 h-[90px] w-full flex items-center justify-between px-6 md:px-14 select-none shadow-sm transition-all">

        {/* Left: Transparent Logo + Wordmark */}
        <Link to="/" className="flex items-center gap-3.5 group decoration-transparent shrink-0">
          <img
            src="/logo.png"
            alt="GrowLedger Logo"
            className="w-[62px] h-[62px] object-contain transition-transform duration-200 group-hover:scale-105"
          />
          <span className="font-serif text-2xl font-bold tracking-tight text-white leading-none">
            GrowLedger
          </span>
        </Link>

        {/* Center: Nav Links — warm white on dark forest */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="font-sans text-sm font-medium text-[#a3b8b0] hover:text-white transition-colors duration-150 decoration-transparent relative py-1.5 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#c2a67a] after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-250"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right: Richer Red CTA with softer corners */}
        <div className="hidden lg:flex items-center shrink-0">
          <button
            onClick={handleStartAssessment}
            className="bg-[#a91d22] hover:bg-[#c4252a] text-white text-[13.5px] font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-95"
          >
            Start Assessment
          </button>
        </div>

        {/* Mobile hamburger */}
        <div className="lg:hidden flex items-center">
          <button
            type="button"
            className="p-2 -mr-2 text-[#a3b8b0] hover:text-white focus:outline-none transition-colors duration-150"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer — dark forest green */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#081c15] border-b border-[#c2a67a]/25 px-6 py-5 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block font-sans text-sm font-medium text-[#a3b8b0] hover:text-white py-2.5 border-b border-[#0f2e22] decoration-transparent transition-colors duration-150"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-4">
            <button
              onClick={handleStartAssessment}
              className="w-full bg-[#a91d22] hover:bg-[#c4252a] text-white text-sm font-semibold py-3.5 px-4 rounded-lg transition-all duration-200"
            >
              Start Assessment
            </button>
          </div>
        </div>
      )}

      {/* Main Page Content */}
      <main className="flex-1 w-full">
        {isLanding ? (
          children
        ) : (
          <div className="max-w-7xl mx-auto px-6 py-10 md:px-12 md:py-16">
            {children}
          </div>
        )}
      </main>

    </div>
  );
}

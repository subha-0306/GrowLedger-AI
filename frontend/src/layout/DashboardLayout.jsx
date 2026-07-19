import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isLanding = location.pathname === '/';

  const navLinks = [
    { name: 'Home',            href: '/'               },
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

      {/* ─── Sticky Top Navigation ─── */}
      <header
        className="sticky top-0 z-50 bg-[#081c15]/96 backdrop-blur-md border-b border-[#c2a67a]/20 w-full select-none"
        style={{ height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 56px', boxShadow: '0 1px 0 rgba(194,166,122,0.12), 0 4px 24px rgba(8,28,21,0.18)' }}
      >

        {/* Left: Logo + Wordmark */}
        <Link to="/" className="flex items-center gap-3 group decoration-transparent shrink-0">
          <img
            src="/logo.png"
            alt="GrowLedger Logo"
            style={{
              width: '120px',
              height: '120px',
              marginTop: '-24px',
              marginBottom: '-24px',
              objectFit: 'contain',
              transition: 'transform 0.25s cubic-bezier(0.16,1,0.3,1), filter 0.25s ease',
              filter: 'drop-shadow(0 2px 8px rgba(95,125,102,0.35))',
            }}
            className="group-hover:scale-105"
          />
          <span style={{
            fontFamily: "'Lora', Georgia, serif",
            fontSize: '21px',
            fontWeight: 700,
            letterSpacing: '-0.018em',
            color: '#ffffff',
            lineHeight: 1,
          }}>
            GrowLedger
          </span>
        </Link>

        {/* Center: Nav Links */}
        <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '13.5px',
                fontWeight: 450,
                color: '#8ba39b',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                position: 'relative',
                paddingBottom: '2px',
              }}
              className="nav-link-underline hover:!text-white"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right: Premium CTA Button */}
        <div className="hidden lg:flex items-center shrink-0">
          <button
            onClick={handleStartAssessment}
            style={{
              background: 'linear-gradient(135deg, #c4252a 0%, #a91d22 55%, #8f161a 100%)',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              padding: '9px 22px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 1px 0 rgba(255,255,255,0.1) inset, 0 3px 10px rgba(169,29,34,0.30)',
              position: 'relative',
              overflow: 'hidden',
              letterSpacing: '0.01em',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 1px 0 rgba(255,255,255,0.12) inset, 0 6px 20px rgba(169,29,34,0.40)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 0 rgba(255,255,255,0.1) inset, 0 3px 10px rgba(169,29,34,0.30)';
            }}
            onMouseDown={e => { e.currentTarget.style.transform = 'translateY(0px) scale(0.98)'; }}
            onMouseUp={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1)'; }}
          >
            Start Assessment
          </button>
        </div>

        {/* Mobile hamburger */}
        <div className="lg:hidden flex items-center">
          <button
            type="button"
            className="p-2 -mr-2 text-[#a3b8b0] hover:text-white focus:outline-none transition-colors duration-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#081c15] border-b border-[#c2a67a]/20 px-6 py-5 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block font-sans text-sm font-medium text-[#8ba39b] hover:text-white py-2.5 border-b border-[#0f2e22] decoration-transparent transition-colors duration-150"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-4">
            <button
              onClick={handleStartAssessment}
              className="w-full text-white text-sm font-semibold py-3.5 px-4 rounded-lg transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #c4252a 0%, #a91d22 55%, #8f161a 100%)',
                boxShadow: '0 3px 10px rgba(169,29,34,0.30)',
              }}
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

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, CheckCircle2, ArrowDown, CheckCircle, XCircle,
  Wallet, ScanSearch, BookOpen, TrendingUp, GitBranch, Cpu, MessageSquare, Award,
  Users, Landmark
} from 'lucide-react';
import { predictCreditReadiness } from '../services/api';
import toast from 'react-hot-toast';

/* ─────────────────────────────────────────────────────────────
   DEMO PROFILES
───────────────────────────────────────────────────────────── */
const DEMO_PROFILES = [
  {
    id: 'rajesh',  name: 'Rajesh Kumar',  initials: 'RK',
    occupation: 'Chai Stall Owner',  tier: 'Ready',  tierColor: 'sage',
    description: 'Consistent daily turnover, growing UPI adoption.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120',
    payload: { occupation: 'Chai Stall Owner', monthly_income: 55000, monthly_expenses: 28000, savings: 18000, average_balance: 35000, digital_transactions: 180, cash_transactions: 100, income_variance: 'Low', missed_payments: 0, income_growth: 'Stable', emi_ratio: 0.08 },
  },
  {
    id: 'lakshmi', name: 'Lakshmi Devi',  initials: 'LD',
    occupation: 'Tea Shop Owner',    tier: 'Ready',  tierColor: 'sage',
    description: 'Strong savings ratio, positive income trajectory.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120',
    payload: { occupation: 'Tea Shop Owner', monthly_income: 60000, monthly_expenses: 30000, savings: 20000, average_balance: 40000, digital_transactions: 200, cash_transactions: 120, income_variance: 'Low', missed_payments: 0, income_growth: 'Increasing', emi_ratio: 0.05 },
  },
  {
    id: 'arun',    name: 'Arun Shankar',  initials: 'AS',
    occupation: 'Auto Driver',       tier: 'Developing', tierColor: 'clay',
    description: 'Income fluctuates seasonally, building digital record.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120',
    payload: { occupation: 'Auto Driver', monthly_income: 32000, monthly_expenses: 22000, savings: 5000, average_balance: 12000, digital_transactions: 60, cash_transactions: 200, income_variance: 'Medium', missed_payments: 1, income_growth: 'Stable', emi_ratio: 0.18 },
  },
  {
    id: 'priya',   name: 'Priya Nair',    initials: 'PN',
    occupation: 'Freelance Tailor',  tier: 'Developing', tierColor: 'clay',
    description: 'Project-based income, needs documentation consistency.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120&h=120',
    payload: { occupation: 'Freelance Tailor', monthly_income: 28000, monthly_expenses: 18000, savings: 6000, average_balance: 10000, digital_transactions: 40, cash_transactions: 140, income_variance: 'High', missed_payments: 2, income_growth: 'Stable', emi_ratio: 0.22 },
  },
  {
    id: 'ramesh',  name: 'Ramesh Babu',   initials: 'RB',
    occupation: 'Street Vendor',     tier: 'Not Ready',  tierColor: 'stamp',
    description: 'High cash dependence, early stage financial building.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120&h=120',
    payload: { occupation: 'Street Vendor', monthly_income: 18000, monthly_expenses: 14000, savings: 2000, average_balance: 4000, digital_transactions: 10, cash_transactions: 280, income_variance: 'High', missed_payments: 3, income_growth: 'Decreasing', emi_ratio: 0.35 },
  },
];

const TIER_BADGE = {
  sage:  'passport-badge-sage',
  clay:  'passport-badge-clay',
  stamp: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#fdf2f2] text-[#a91d22] border border-[#f5c6c7]',
};

/* ─────────────────────────────────────────────────────────────
   HERO BACKGROUND — Layered texture + sage wash + botanical drawings
───────────────────────────────────────────────────────────── */
function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Sage watercolor wash */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 75% 65% at 70% 40%, rgba(95,125,102,0.18) 0%, rgba(95,125,102,0.06) 50%, transparent 78%)' }} />
      {/* Warm clay blushes */}
      <div className="absolute bottom-0 left-0 w-[550px] h-[450px]" style={{ background: 'radial-gradient(ellipse at 25% 85%, rgba(200,122,83,0.08) 0%, transparent 65%)' }} />
      
      {/* Premium botanical illustrations in background */}
      <svg className="absolute opacity-[0.06] transition-opacity duration-1000" style={{ left: '-5%', top: '5%', width: '30%', height: '80%' }} viewBox="0 0 380 600" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50,450 C80,300 180,150 320,80" stroke="#5f7d66" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M320,80 C260,110 200,160 160,220" stroke="#5f7d66" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M220,180 C180,210 140,260 120,310" stroke="#5f7d66" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      
      <svg className="absolute opacity-[0.06]" style={{ right: '2%', top: '0', width: '42%', height: '110%' }} viewBox="0 0 380 560" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M280,20 C340,80 360,180 320,280 C290,350 240,400 200,430 C160,400 110,350 80,280 C40,180 60,80 120,20 C160,-10 240,-10 280,20 Z" fill="#5f7d66"/>
        <path d="M200,20 L200,430" stroke="#3d5244" strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M200,120 C170,110 140,90 110,80" stroke="#3d5244" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M200,180 C165,165 130,148 95,140" stroke="#3d5244" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M200,240 C168,222 135,205 100,198" stroke="#3d5244" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M200,300 C172,285 142,270 110,262" stroke="#3d5244" strokeWidth="1.5" strokeLinecap="round"/>
        <ellipse cx="80" cy="460" rx="55" ry="30" transform="rotate(-30 80 460)" fill="#5f7d66"/>
        <ellipse cx="320" cy="500" rx="45" ry="24" transform="rotate(20 320 500)" fill="#5f7d66"/>
      </svg>

      {/* Ledger ruled lines */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.045 }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hero-ledger" x="0" y="0" width="100%" height="44" patternUnits="userSpaceOnUse">
            <line x1="0" y1="43" x2="100%" y2="43" stroke="#0f172a" strokeWidth="0.65"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-ledger)"/>
      </svg>

      {/* Paper grain */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.035 }} xmlns="http://www.w3.org/2000/svg">
        <filter id="hero-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-grain)"/>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   FINANCIAL READINESS PASSPORT CARD — Visual Benchmark Alignment
───────────────────────────────────────────────────────────── */
function PassportCard() {
  return (
    /* Outer wrapper — 6° tilt, transitions to near-flat on hover */
    <div
      style={{ transform: 'rotate(6deg)', transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)' }}
      className="relative w-full max-w-[480px] mx-auto hover:[transform:rotate(3deg)]"
    >
      {/* Floating animation wrapper */}
      <div className="animate-passport-float relative">

        {/* Financial watermark behind passport — 5% opacity */}
        <svg
          aria-hidden="true"
          className="absolute pointer-events-none"
          style={{ inset: '-12%', width: '124%', height: '124%', opacity: 0.05, zIndex: 0 }}
          viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg"
        >
          <text x="50%" y="52%" dominantBaseline="middle" textAnchor="middle"
            fontFamily="Georgia,serif" fontSize="64" fontWeight="700" fill="#5f7d66"
            letterSpacing="4" transform="rotate(-20,200,200)">
            GROWLEDGER
          </text>
          <circle cx="200" cy="200" r="175" stroke="#5f7d66" strokeWidth="2" fill="none" />
          <circle cx="200" cy="200" r="155" stroke="#5f7d66" strokeWidth="0.8" fill="none" />
        </svg>

        {/* Layered shadows for physical realism */}
        <div
          className="absolute inset-0 rounded-[14px] pointer-events-none"
          style={{
            boxShadow: [
              '0 2px 4px rgba(15,23,42,0.06)',
              '0 6px 12px rgba(15,23,42,0.08)',
              '0 20px 40px rgba(15,23,42,0.12)',
              '0 40px 80px rgba(15,23,42,0.08)',
              '0 1px 1px rgba(255,255,255,0.7) inset',
            ].join(', '),
          }}
          aria-hidden="true"
        />

        {/* Card Body — warm passport paper */}
        <div
          className="relative rounded-[14px] p-7 space-y-6 overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, #fdfcf6 0%, #faf8f0 100%)',
            border: '1.5px solid #d8d0c0',
            zIndex: 1,
          }}
        >
          {/* Paper grain texture overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: 0.055,
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
            aria-hidden="true"
          />

          {/* Aged inner light border */}
          <div className="absolute inset-0 border border-white/50 rounded-[13px] pointer-events-none" />

          {/* Document Header */}
          <div className="flex items-center justify-between border-b border-[#e4ddd0] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f0f5f1] border border-[#d0ddd2] flex items-center justify-center" style={{ boxShadow: '0 1px 3px rgba(95,125,102,0.15)' }}>
                <Landmark className="w-5 h-5 text-[#5f7d66]" />
              </div>
              <div>
                <p className="font-mono text-[9px] text-[#a8a09a] tracking-[0.28em] uppercase">FINANCIAL READINESS</p>
                <p className="font-serif text-[18px] text-[#1a1208] font-bold tracking-tight">PASSPORT</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono text-[8px] text-[#a8a09a] tracking-[0.2em] uppercase">ISSUED BY</p>
              <p className="font-serif text-[13px] text-[#5f7d66] font-semibold">GrowLedger · 2026</p>
            </div>
          </div>

          {/* Tier & Confidence */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[8px] tracking-[0.24em] uppercase text-[#a8a09a] mb-1">READINESS TIER</p>
              <p className="font-serif text-3xl font-extrabold text-[#1a1208] tracking-tight">Ready</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[8px] tracking-[0.24em] uppercase text-[#a8a09a] mb-1">CONFIDENCE</p>
              <p className="font-mono text-2xl font-black text-[#5f7d66]">94.2%</p>
            </div>
          </div>

          {/* Verified Stamp — with shadow for physical realism */}
          <div className="flex justify-center py-2 relative">
            <div
              className="passport-stamp-red animate-stamp-reveal"
              style={{ boxShadow: '0 3px 12px rgba(169,29,34,0.18), 0 1px 3px rgba(0,0,0,0.1)' }}
            >
              CREDIT READY
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none">
              <Landmark className="w-24 h-24 text-[#1a1208]" />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#e4ddd0]" />

          {/* Key Strengths */}
          <div className="space-y-3">
            <p className="font-mono text-[8px] tracking-[0.24em] uppercase text-[#a8a09a]">TOP FINANCIAL STRENGTHS</p>
            <ul className="space-y-2.5">
              {[
                'Consistent UPI activity over 90 days',
                'Positive income growth trend (+12% MoM)'
              ].map((s) => (
                <li key={s} className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-[#edf3ee] border border-[#d4dfd6] flex items-center justify-center shrink-0" style={{ boxShadow: '0 1px 2px rgba(95,125,102,0.12)' }}>
                    <CheckCircle className="w-3.5 h-3.5 text-[#5f7d66]" />
                  </span>
                  <span className="font-sans text-[12.5px] text-[#2d3a28] font-medium">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Priority action */}
          <div className="space-y-2">
            <p className="font-mono text-[8px] tracking-[0.24em] uppercase text-[#a8a09a]">PRIORITY IMPROVEMENT</p>
            <div className="flex items-start gap-2.5 bg-[#fdf3ec] border border-[#e5c8b4] p-3 rounded-lg">
              <span className="w-4 h-4 rounded-full bg-[#fdf6f0] flex items-center justify-center shrink-0 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-[#c87a53]" />
              </span>
              <span className="font-sans text-[12px] text-[#85401d] leading-relaxed">
                Reduce reliance on cash transactions to establish digital trail.
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-[#e4ddd0] flex items-center justify-between text-[#b2a898] font-mono text-[8px]">
            <span>REF: GL-2026-9428</span>
            <span>EXPLAINABLE AI SECURED</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SHARED UTILITIES
───────────────────────────────────────────────────────────── */
function SectionLabel({ children, color = 'sage' }) {
  const c = { sage: 'text-[#5f7d66]', clay: 'text-[#c87a53]', muted: 'text-[#8fa6a0]' };
  return (
    <p
      className={`font-mono font-semibold uppercase ${c[color]}`}
      style={{ fontSize: '10.5px', letterSpacing: '0.38em', marginBottom: '16px' }}
    >
      {children}
    </p>
  );
}

function SectionDivider() {
  return <div className="w-full border-t border-[#e9e4db]" />;
}


/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
export default function Landing({ setPredictionData }) {
  const navigate = useNavigate();
  const [loadingId,        setLoadingId]        = useState(null);
  const [activeMethodStep, setActiveMethodStep] = useState(null);
  const [hoveredStep,      setHoveredStep]      = useState(null);
  const [lineVisible,      setLineVisible]      = useState(false);
  const [timelineProgress, setTimelineProgress] = useState(0);
  const [methodVisible,    setMethodVisible]    = useState(false);

  const howItWorksRef = useRef(null);
  const methodRef     = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLineVisible(true);
          setTimeout(() => setTimelineProgress(1), 280);
          setTimeout(() => setTimelineProgress(2), 620);
          setTimeout(() => setTimelineProgress(3), 980);
        }
      },
      { threshold: 0.15 }
    );
    if (howItWorksRef.current) observer.observe(howItWorksRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mo = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setMethodVisible(true); },
      { threshold: 0.12 }
    );
    if (methodRef.current) mo.observe(methodRef.current);
    return () => mo.disconnect();
  }, []);

  const handleTryProfile = async (profile) => {
    setLoadingId(profile.id);
    const toastId = toast.loading(`Reading ${profile.name}'s financial profile...`);
    try {
      const result = await predictCreditReadiness(profile.payload);
      if (result.success) {
        setPredictionData(result.data);
        toast.success('Profile loaded. Generating passport...', { id: toastId });
        navigate('/assess');
      } else {
        throw new Error(result.error?.message || 'Prediction failed.');
      }
    } catch {
      toast.error('Could not connect. Loading demo result instead.', { id: toastId });
      setPredictionData({
        prediction: profile.tier,
        confidence: profile.tierColor === 'sage' ? 92.0 : profile.tierColor === 'clay' ? 61.0 : 38.0,
        financial_story: `${profile.name} works as a ${profile.occupation}. ${profile.description}`,
        strengthened_profile: [{ title: 'Financial Activity', description: 'Regular transaction patterns observed.' }],
        reduced_readiness: [{ title: 'Digital Adoption', description: 'Increasing UPI usage would improve this score.' }],
        coaching: {
          priority_action: 'Build Digital Record',
          action_description: 'Shift daily payments to UPI.',
          quick_win: 'Make 5 UPI transactions this week.',
          expected_impact: 'Significant tier improvement within 60 days.',
          roadmap: { '30_days': ['Set up UPI.', 'Make 3 scan payments.'], '60_days': ['Reach 50% digital.'], '90_days': ['Review bank statement.'] },
          future_projection: { current_tier: profile.tier, projected_tier: 'Ready', confidence: 85.0, impact_level: 'High' },
        },
        model_metadata: { model: 'LightGBM', explanation_method: 'TreeSHAP' },
      });
      navigate('/assess');
    } finally {
      setLoadingId(null);
    }
  };

  const howItWorksSteps = [
    { step: '1', icon: Wallet,      title: 'Share your financial behaviour',  body: 'Income, expenses, transaction patterns, payment habits. Information you already know about yourself — not what a bureau sees.' },
    { step: '2', icon: ScanSearch,  title: 'We read the complete picture',    body: 'Our model evaluates 11 behavioural signals: savings consistency, digital activity, income stability, and EMI discipline.' },
    { step: '3', icon: BookOpen,    title: 'You receive your Passport',       body: 'A clear readiness tier, a plain-language explanation of every decision, and a personalised 90-day action plan.' },
  ];

  const methodologySteps = [
    { icon: TrendingUp,   label: 'Financial Behaviour',   sub: 'Income, expenses, transaction data'      },
    { icon: GitBranch,    label: 'Feature Engineering',   sub: '11 behavioural signals extracted'         },
    { icon: Cpu,          label: 'Explainable AI',        sub: 'LightGBM + TreeSHAP attribution'         },
    { icon: MessageSquare, label: 'Personalised Coaching', sub: 'Counterfactual 30/60/90 roadmap'        },
    { icon: Award,        label: 'Financial Passport',    sub: 'Tier, explanation, action plan'           },
  ];

  const comparisonRows = [
    { trad: 'EMI repayment history only',    gl: 'Daily transaction consistency'      },
    { trad: 'Formal salary slips required',  gl: 'Income trend over any period'       },
    { trad: 'A single bureau score',         gl: '11 behavioural signals'             },
    { trad: 'Binary: approve or reject',     gl: 'Tier + plain-language explanation'  },
    { trad: 'No improvement guidance',       gl: 'Personalised 90-day growth roadmap' },
  ];

  return (
    <div className="bg-[#faf8f5] text-[#0f172a] antialiased">

      {/* ════════════════════════════════════════════════════════
          1. HERO — Matches premium benchmark layout
      ════════════════════════════════════════════════════════ */}
      <section id="home" className="relative flex items-center overflow-hidden bg-[#fbf9f5] border-b border-[#e9e4db]" style={{ minHeight: '90vh' }}>
        <HeroBackground />

        <div
          className="relative z-10 w-full max-w-[1380px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          style={{ padding: '96px 56px 80px' }}
        >

          {/* Left Column Copy */}
          <div className="lg:col-span-6" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <SectionLabel color="sage">FINANCIAL READINESS · TRANSPARENT BY DESIGN</SectionLabel>

            {/* Hero Headline — tight editorial rhythm */}
            <h1 style={{
              fontFamily: "'Lora', Georgia, serif",
              fontSize: 'clamp(3rem, 5.2vw, 4.8rem)',
              fontWeight: 800,
              lineHeight: 0.94,
              letterSpacing: '-0.028em',
              color: '#0d1117',
              margin: 0,
            }}>
              Your daily<br />
              financial<br />
              behaviour already<br />
              tells a complete<br />
              <span style={{ fontStyle: 'italic', color: '#5f7d66', fontSize: '1.06em', lineHeight: 1 }}>story.</span>
            </h1>

            {/* Body Copy — 18px, 1.72 line-height, soft dark gray */}
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '18px',
              lineHeight: 1.72,
              color: '#3d4d5c',
              maxWidth: '500px',
              margin: 0,
              fontWeight: 400,
            }}>
              Most people aren't denied credit because they're irresponsible.
              They're denied because the system doesn't know how to read them.
              GrowLedger does.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Primary — gradient red with gloss + lift */}
              <button
                onClick={() => navigate('/assess')}
                style={{
                  background: 'linear-gradient(135deg, #c4252a 0%, #a91d22 55%, #8f161a 100%)',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  padding: '14px 32px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.1) inset, 0 4px 16px rgba(169,29,34,0.30)',
                  letterSpacing: '0.01em',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 1px 0 rgba(255,255,255,0.12) inset, 0 8px 28px rgba(169,29,34,0.40)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 0 rgba(255,255,255,0.1) inset, 0 4px 16px rgba(169,29,34,0.30)';
                }}
              >
                Start Assessment →
              </button>
              {/* Secondary — white glass */}
              <a
                href="#how-it-works"
                style={{
                  background: 'rgba(253,251,250,0.88)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  color: '#0d1117',
                  fontSize: '15px',
                  fontWeight: 500,
                  fontFamily: "'Inter', sans-serif",
                  padding: '14px 32px',
                  borderRadius: '10px',
                  border: '1px solid rgba(220,214,200,0.9)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 0 2px 8px rgba(15,23,42,0.04)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 1px 0 rgba(255,255,255,0.9) inset, 0 4px 16px rgba(15,23,42,0.07)';
                  e.currentTarget.style.borderColor = 'rgba(193,183,166,0.9)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 0 rgba(255,255,255,0.9) inset, 0 2px 8px rgba(15,23,42,0.04)';
                  e.currentTarget.style.borderColor = 'rgba(220,214,200,0.9)';
                }}
              >
                See How It Works
              </a>
            </div>

            {/* Trust Indicator Bar */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {['Explainable AI', 'No Credit Bureau Required', '90-Day Growth Roadmap'].map((item, i) => (
                <React.Fragment key={item}>
                  {i > 0 && <span className="text-[#d8d2c8] text-sm select-none">&middot;</span>}
                  <span className="flex items-center gap-2 text-xs font-semibold text-[#5e7280] tracking-wide">
                    <CheckCircle2 className="w-4 h-4 text-[#5f7d66] shrink-0" />
                    {item}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right Column — Passport Card */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <PassportCard />
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          2. PROBLEM — Light Cream Background
      ════════════════════════════════════════════════════════ */}
      <section id="problem" className="relative bg-[#f6f3eb] border-b border-[#e9e4db] overflow-hidden" style={{ padding: '96px 56px' }}>
        {/* Topographic curves watermark */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.04 }} xmlns="http://www.w3.org/2000/svg">
          <path d="M0,80 Q200,40 400,80 T800,80 T1200,80 T1600,80" fill="none" stroke="#5c7f5b" strokeWidth="1.5"/>
          <path d="M0,160 Q200,120 400,160 T800,160 T1200,160 T1600,160" fill="none" stroke="#5c7f5b" strokeWidth="1.5"/>
          <path d="M0,240 Q200,200 400,240 T800,240 T1200,240 T1600,240" fill="none" stroke="#5c7f5b" strokeWidth="1.5"/>
        </svg>
        <div className="max-w-[1200px] mx-auto relative">
          <div className="text-center" style={{ marginBottom: '64px' }}>
            <SectionLabel color="muted">THE PROBLEM</SectionLabel>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

            {/* Stat Card 1 — sage gradient */}
            <div
              className="lg:col-span-3 stat-card p-8 rounded-[20px] border border-[#e4dfd6] text-center cursor-default"
              style={{ background: 'linear-gradient(160deg, #fdfcf8 0%, #f5f2e8 100%)' }}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: 'linear-gradient(135deg, #edf3ee, #d8ead9)', boxShadow: '0 2px 8px rgba(92,127,91,0.15), inset 0 1px 0 rgba(255,255,255,0.9)' }}>
                <Users className="w-6 h-6 text-[#5c7f5b]" />
              </div>
              <p className="font-mono text-4xl font-black" style={{ color: '#18222c', letterSpacing: '-0.04em' }}>190M+</p>
              <p className="font-sans text-[13px] text-[#64748b] font-medium leading-snug mt-2">Indians creditworthy but undocumented</p>
            </div>

            {/* Central Statement */}
            <div className="lg:col-span-6 text-center px-6" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{
                fontFamily: "'Lora', Georgia, serif",
                fontSize: 'clamp(2rem, 3.6vw, 3.1rem)',
                fontWeight: 700,
                lineHeight: 1.1,
                color: '#18222c',
                margin: 0,
                letterSpacing: '-0.022em',
              }}>
                Over 190 million Indians are<br />
                creditworthy&mdash;<br />
                <span style={{ color: '#b83a2e', fontStyle: 'italic' }}>but invisible to formal lenders.</span>
              </h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '17px', lineHeight: 1.75, color: '#4a5568', maxWidth: '500px', margin: '0 auto' }}>
                They work every day. They save. They transact. Just not in ways traditional credit scores were designed to read. The bureau sees a blank page. We see a full financial story.
              </p>
            </div>

            {/* Stat Card 2 — clay gradient */}
            <div
              className="lg:col-span-3 stat-card p-8 rounded-[20px] border border-[#e8ddd2] text-center cursor-default"
              style={{ background: 'linear-gradient(160deg, #fdfcf8 0%, #f7f0e8 100%)' }}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: 'linear-gradient(135deg, #fdf6f0, #f5e4d4)', boxShadow: '0 2px 8px rgba(200,122,83,0.15), inset 0 1px 0 rgba(255,255,255,0.9)' }}>
                <Landmark className="w-6 h-6 text-[#c87a53]" />
              </div>
              <p className="font-mono text-4xl font-black" style={{ color: '#18222c', letterSpacing: '-0.04em' }}>100%</p>
              <p className="font-sans text-[13px] text-[#64748b] font-medium leading-snug mt-2">Excluded from prime traditional banking</p>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          3. HOW IT WORKS — Soft Sage Tint, Horizontal Timeline Flow
      ════════════════════════════════════════════════════════ */}
      <section id="how-it-works" ref={howItWorksRef} className="relative bg-[#ecf2ec] border-b border-[#d4dfd6] overflow-hidden" style={{ padding: '96px 56px' }}>
        {/* Subtle circular seal watermark */}
        <svg className="absolute right-12 top-1/2 -translate-y-1/2 pointer-events-none" style={{ width: 320, height: 320, opacity: 0.04 }} viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="90" stroke="#5c7f5b" strokeWidth="2"/>
          <circle cx="100" cy="100" r="72" stroke="#5c7f5b" strokeWidth="1"/>
          <circle cx="100" cy="100" r="56" stroke="#5c7f5b" strokeWidth="0.7"/>
          <circle cx="100" cy="100" r="8" fill="#5c7f5b"/>
        </svg>
        <div className="max-w-[1200px] mx-auto text-center relative">
          <div style={{ marginBottom: '60px' }}>
            <SectionLabel color="sage">HOW IT WORKS</SectionLabel>
            <h2 style={{
              fontFamily: "'Lora', Georgia, serif",
              fontSize: 'clamp(1.95rem, 3.6vw, 3rem)',
              fontWeight: 700, lineHeight: 1.08, color: '#18222c',
              letterSpacing: '-0.022em', marginTop: '12px',
            }}>
              Three steps to your Financial Readiness Passport.
            </h2>
          </div>

          {/* Timeline track */}
          <div className="relative mb-10 hidden md:block" style={{ height: '4px' }}>
            <div className="absolute top-0 left-[15%] right-[15%] rounded-full" style={{ height: '3px', background: 'rgba(200,190,175,0.5)' }} />
            <div
              className="absolute top-0 left-[15%] rounded-full transition-all duration-[1400ms] ease-out"
              style={{ height: '3px', width: lineVisible ? '70%' : '0%', background: 'linear-gradient(90deg, #5c7f5b, #3d5244)' }}
            />
          </div>

          {/* Step cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center relative z-10">
            {howItWorksSteps.map((item, idx) => {
              const Icon = item.icon;
              const isLit = timelineProgress > idx || hoveredStep === idx;
              return (
                <div
                  key={item.step}
                  className="flex flex-col items-center cursor-default rounded-[20px] transition-all duration-350"
                  style={{
                    padding: '32px 24px 28px',
                    background: hoveredStep === idx ? 'rgba(253,252,248,0.85)' : 'transparent',
                    transform: hoveredStep === idx ? 'translateY(-6px)' : 'translateY(0)',
                    boxShadow: hoveredStep === idx
                      ? '0 4px 12px rgba(15,23,42,0.06), 0 16px 40px rgba(15,23,42,0.08)'
                      : 'none',
                    transitionDuration: '350ms',
                    transitionTimingFunction: 'ease-out',
                  }}
                  onMouseEnter={() => setHoveredStep(idx)}
                  onMouseLeave={() => setHoveredStep(null)}
                >
                  <div className="relative flex justify-center mb-6">
                    {/* Main icon circle — gradient bg when lit */}
                    <div
                      className="w-18 h-18 rounded-full flex items-center justify-center transition-all duration-450"
                      style={{
                        width: 72, height: 72,
                        background: isLit
                          ? 'linear-gradient(145deg, #edf3ee, #d8ead9)'
                          : 'linear-gradient(145deg, #ffffff, #f4f2ec)',
                        border: `2px solid ${isLit ? '#b8d4bb' : '#dbd5c9'}`,
                        boxShadow: isLit
                          ? '0 4px 16px rgba(92,127,91,0.18), inset 0 1px 0 rgba(255,255,255,0.9)'
                          : '0 2px 8px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
                      }}
                    >
                      <Icon
                        style={{
                          width: 26, height: 26,
                          color: isLit ? '#3d5244' : '#94a3b8',
                          transition: 'all 0.45s ease-out',
                          transform: hoveredStep === idx ? 'rotate(8deg) scale(1.1)' : 'rotate(0) scale(1)',
                        }}
                      />
                    </div>
                    {/* Step number badge — gradient circle */}
                    <div
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center font-serif text-xs font-bold transition-all duration-450"
                      style={{
                        background: isLit
                          ? 'linear-gradient(135deg, #183327, #2d5240)'
                          : 'linear-gradient(135deg, #ffffff, #f0ece4)',
                        border: `1.5px solid ${isLit ? '#c2a67a' : '#d8d2c8'}`,
                        color: isLit ? '#ffffff' : '#18222c',
                        boxShadow: isLit
                          ? '0 2px 8px rgba(24,51,39,0.30)'
                          : '0 1px 4px rgba(15,23,42,0.10)',
                      }}
                    >
                      {item.step}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <h3 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: '18px', fontWeight: 700, color: '#18222c', lineHeight: 1.3, margin: 0 }}>{item.title}</h3>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', lineHeight: 1.72, color: '#4d6070', margin: 0 }}>{item.body}</p>
                  </div>

                  <div className="mt-5 w-5 h-[2px] rounded-full transition-all duration-300"
                    style={{ background: isLit ? '#5c7f5b' : 'transparent' }} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ════════════════════════════════════════════════════════
          4. METHODOLOGY PREVIEW — Warm Parchment Pipeline Map
      ════════════════════════════════════════════════════════ */}
      <section id="methodology" ref={methodRef} className="relative bg-[#fbf8f2] border-b border-[#e9e4db] overflow-hidden" style={{ padding: '96px 56px' }}>
        {/* Financial watermark stamp rings */}
        <svg className="absolute left-6 bottom-6 pointer-events-none" style={{ width: 200, height: 200, opacity: 0.04 }} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="46" stroke="#183327" strokeWidth="2"/>
          <circle cx="50" cy="50" r="36" stroke="#183327" strokeWidth="1"/>
          <text x="50" y="54" textAnchor="middle" fontFamily="serif" fontSize="7" fill="#183327" letterSpacing="3">VERIFIED</text>
        </svg>
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

            {/* Left info block */}
            <div className="lg:col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <SectionLabel color="muted">METHODOLOGY PREVIEW</SectionLabel>
              <h2 style={{
                fontFamily: "'Lora', Georgia, serif",
                fontSize: 'clamp(1.8rem, 3.2vw, 2.8rem)',
                fontWeight: 700, lineHeight: 1.08, color: '#18222c',
                margin: 0, letterSpacing: '-0.022em',
              }}>
                Why GrowLedger makes different decisions.
              </h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px', lineHeight: 1.72, color: '#4d6070', maxWidth: '320px', margin: 0 }}>
                Every readiness assessment is backed by transparent attribution models. We replace traditional black boxes with explainable AI nodes.
              </p>
              <a href="#"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 600, color: '#183327', textDecoration: 'none', borderBottom: '1px solid rgba(24,51,39,0.25)', paddingBottom: '2px', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderBottomColor = 'rgba(24,51,39,0.8)'}
                onMouseLeave={e => e.currentTarget.style.borderBottomColor = 'rgba(24,51,39,0.25)'}
              >
                Explore full methodology →
              </a>
            </div>

            {/* Pipeline track */}
            <div
              className="lg:col-span-8 rounded-[20px] border border-[#e9e4db] p-10"
              style={{
                background: 'linear-gradient(160deg, #fdfcf8, #f8f4ec)',
                boxShadow: '0 1px 2px rgba(15,23,42,0.03), 0 8px 24px rgba(15,23,42,0.06), 0 24px 56px rgba(15,23,42,0.06)',
              }}
            >
              <div className="grid grid-cols-5 gap-0 items-center">
                {methodologySteps.map((step, i) => {
                  const Icon = step.icon;
                  const isActive   = activeMethodStep === i;
                  const hasHover   = activeMethodStep !== null;
                  const isInactive = hasHover && !isActive;
                  const isVisible  = methodVisible;
                  return (
                    <div key={step.label} className="flex items-center">
                      <div
                        className={`flex-1 flex flex-col items-center gap-3 cursor-pointer py-5 px-2 rounded-[16px] method-card ${isVisible ? 'reveal-visible' : 'reveal-hidden'}`}
                        style={{
                          opacity:         isInactive ? 0.3 : 1,
                          background:      isActive ? 'linear-gradient(145deg, #edf3ee, #ddeedd)' : 'transparent',
                          transform:       isActive ? 'translateY(-4px) scale(1.05)' : undefined,
                          animationDelay:  `${i * 100}ms`,
                          boxShadow:       isActive ? '0 4px 16px rgba(92,127,91,0.18), 0 12px 32px rgba(92,127,91,0.12)' : undefined,
                          transition:      'opacity 0.3s ease-out, background 0.3s ease-out, transform 0.3s ease-out, box-shadow 0.3s ease-out',
                        }}
                        onMouseEnter={() => setActiveMethodStep(i)}
                        onMouseLeave={() => setActiveMethodStep(null)}
                      >
                        <div
                          className="flex items-center justify-center rounded-[14px] border-2 transition-all duration-350"
                          style={{
                            width: 64, height: 64,
                            background: isActive
                              ? 'linear-gradient(145deg, #ffffff, #f0f8f0)'
                              : 'linear-gradient(145deg, #f3f7f3, #eaede8)',
                            borderColor: isActive ? '#5c7f5b' : '#dcd8d0',
                            boxShadow:   isActive ? '0 4px 12px rgba(92,127,91,0.22)' : '0 1px 4px rgba(15,23,42,0.06)',
                          }}
                        >
                          <Icon style={{
                            width: 26, height: 26,
                            color: isActive ? '#3d5244' : '#94a3b8',
                            transform: isActive ? 'scale(1.15)' : 'scale(1)',
                            transition: 'all 0.3s ease-out',
                          }} />
                        </div>
                        <p style={{ fontFamily: "'Lora', serif", fontSize: '13.5px', fontWeight: 700, color: '#18222c', textAlign: 'center', lineHeight: 1.3, margin: 0 }}>{step.label}</p>
                        <p className="hidden md:block" style={{ fontFamily: "'Inter', sans-serif", fontSize: '11.5px', color: '#64748b', textAlign: 'center', lineHeight: 1.4, margin: 0 }}>{step.sub}</p>
                      </div>

                      {i < methodologySteps.length - 1 && (
                        <div className="shrink-0 flex items-center justify-center" style={{ width: 20 }}>
                          <ArrowRight
                            style={{
                              width: 14, height: 14,
                              color: isActive ? '#5c7f5b' : '#c8c0b4',
                              transition: 'all 0.3s ease-out',
                              transform: isActive ? 'translateX(2px)' : 'translateX(0)',
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ════════════════════════════════════════════════════════
          5. COMPARISON — Cream Background
      ════════════════════════════════════════════════════════ */}
      <section className="bg-[#f6f3eb] border-b border-[#e9e4db]" style={{ padding: '96px 56px' }}>
        <div className="max-w-[960px] mx-auto">
          <div className="text-center" style={{ marginBottom: '60px' }}>
            <SectionLabel color="muted">WHY DIFFERENT</SectionLabel>
            <h2 style={{
              fontFamily: "'Lora', Georgia, serif",
              fontSize: 'clamp(1.9rem, 3.2vw, 2.9rem)',
              fontWeight: 700, lineHeight: 1.08, color: '#18222c',
              margin: '12px 0 0 0', letterSpacing: '-0.022em',
            }}>
              Traditional credit versus GrowLedger.
            </h2>
          </div>

          {/* Table */}
          <div style={{
            border: '1px solid #dcd6c8',
            background: 'linear-gradient(160deg, #fdfcf8, #faf8f2)',
            borderRadius: '18px',
            overflow: 'hidden',
            boxShadow: '0 1px 2px rgba(15,23,42,0.03), 0 8px 24px rgba(15,23,42,0.06), 0 24px 56px rgba(15,23,42,0.05)',
          }}>
            {/* Header */}
            <div className="grid grid-cols-2">
              <div style={{ background: 'linear-gradient(135deg, #fdf6f0, #faeee4)', padding: '18px 28px', borderBottom: '1px solid #dcd6c8', borderRight: '1px solid #dcd6c8', display: 'flex', alignItems: 'center', gap: 10 }}>
                <XCircle className="w-4 h-4 text-[#c87a53] shrink-0" />
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c87a53', margin: 0 }}>Traditional Credit</p>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #edf3ee, #ddeedd)', padding: '18px 28px', borderBottom: '1px solid #dcd6c8', display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle className="comparison-check-icon w-4 h-4 text-[#5c7f5b] shrink-0" />
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#3d5244', margin: 0 }}>GrowLedger</p>
              </div>
            </div>
            {/* Rows */}
            {comparisonRows.map(({ trad, gl }, i) => (
              <div key={i} className="comparison-row grid grid-cols-2" style={{ borderBottom: i < comparisonRows.length - 1 ? '1px solid #e9e4db' : 'none' }}>
                <div style={{ padding: '20px 28px', borderRight: '1px solid #e9e4db', transition: 'background 0.25s ease-out' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(253,246,240,0.75)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(200,122,83,0.5)', flexShrink: 0, marginTop: 6 }} />
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#64748b', margin: 0, lineHeight: 1.6 }}>{trad}</p>
                  </div>
                </div>
                <div style={{ padding: '20px 28px', transition: 'background 0.25s ease-out' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(237,243,238,0.75)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <CheckCircle className="comparison-check-icon shrink-0" style={{ width: 15, height: 15, color: '#5c7f5b', marginTop: 3 }} />
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#18222c', fontWeight: 500, margin: 0, lineHeight: 1.6 }}>{gl}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ════════════════════════════════════════════════════════
          6. DEMO PROFILES — Light Sage Background
      ════════════════════════════════════════════════════════ */}
      <section id="demo-profiles" className="relative bg-[#edf2ed] border-b border-[#d4dfd6] overflow-hidden" style={{ padding: '96px 56px' }}>
        {/* Leaf watermark */}
        <svg className="absolute left-0 top-0 pointer-events-none" style={{ width: 280, height: 280, opacity: 0.04 }} viewBox="0 0 100 100" fill="#183327">
          <path d="M10,90 C30,70 50,40 80,20 C70,25 60,35 55,45 C50,55 52,65 58,70 C64,75 72,70 76,60 C80,50 82,35 80,20 Z" />
        </svg>
        <div className="max-w-[1240px] mx-auto relative">
          <div className="text-center" style={{ marginBottom: '64px' }}>
            <SectionLabel color="sage">TRY IT NOW</SectionLabel>
            <h2 style={{
              fontFamily: "'Lora', Georgia, serif",
              fontSize: 'clamp(1.9rem, 3.2vw, 2.9rem)',
              fontWeight: 700, lineHeight: 1.08, color: '#18222c',
              margin: '12px 0 0 0', letterSpacing: '-0.022em',
            }}>
              Five real financial profiles.
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '15.5px', lineHeight: 1.7, color: '#64748b', maxWidth: '400px', margin: '18px auto 0' }}>
              Select a passport profile card below to load simulated financial ledger data immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {DEMO_PROFILES.map((profile) => {
              const isLoading = loadingId === profile.id;
              return (
                <div
                  key={profile.id}
                  className="group flex flex-col cursor-pointer"
                  style={{
                    padding: '24px',
                    borderRadius: '20px',
                    background: 'linear-gradient(160deg, #fdfcf8, #faf8f2)',
                    border: '1px solid #dcd6c8',
                    boxShadow: '0 1px 2px rgba(15,23,42,0.03), 0 4px 12px rgba(15,23,42,0.05), 0 12px 32px rgba(15,23,42,0.05)',
                    transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(15,23,42,0.07), 0 16px 40px rgba(15,23,42,0.10), 0 32px 64px rgba(92,127,91,0.08)';
                    e.currentTarget.style.borderColor = 'rgba(92,127,91,0.4)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 1px 2px rgba(15,23,42,0.03), 0 4px 12px rgba(15,23,42,0.05), 0 12px 32px rgba(15,23,42,0.05)';
                    e.currentTarget.style.borderColor = '#dcd6c8';
                  }}
                  onClick={() => handleTryProfile(profile)}
                >
                  {/* Avatar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      style={{
                        width: 56, height: 56, borderRadius: '50%', objectFit: 'cover',
                        border: '2px solid #e9e4db', flexShrink: 0,
                        boxShadow: '0 2px 8px rgba(15,23,42,0.10), 0 1px 2px rgba(15,23,42,0.06)',
                      }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontFamily: "'Lora', serif", fontSize: '14px', fontWeight: 700, color: '#18222c', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile.name}</p>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '11.5px', color: '#8fa0b0', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile.occupation}</p>
                    </div>
                  </div>

                  {/* Badge */}
                  <div style={{ marginBottom: 14 }}>
                    <span className={TIER_BADGE[profile.tierColor]} style={{ fontSize: '11px', padding: '3px 10px' }}>{profile.tier}</span>
                  </div>

                  {/* Description */}
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#546272', lineHeight: 1.7, flex: 1, marginBottom: 20 }}>
                    {profile.description}
                  </p>

                  {/* Button */}
                  <button
                    disabled={isLoading}
                    style={{
                      width: '100%', fontSize: '13px', fontWeight: 600,
                      padding: '10px 16px', borderRadius: '14px',
                      border: '1px solid #dcd6c8', color: '#18222c',
                      background: 'transparent',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      transition: 'all 0.25s ease-out', cursor: 'pointer',
                      fontFamily: "'Inter', sans-serif",
                      opacity: isLoading ? 0.5 : 1,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #b83a2e, #9a2c22)';
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.borderColor = '#b83a2e';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(184,58,46,0.28)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#18222c';
                      e.currentTarget.style.borderColor = '#dcd6c8';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    onClick={(e) => { e.stopPropagation(); handleTryProfile(profile); }}
                  >
                    {isLoading ? 'Loading...' : <><span>Try Profile</span><ArrowRight style={{ width: 14, height: 14 }} /></>}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ════════════════════════════════════════════════════════
          7. MISSION — Warm Cream Background
      ════════════════════════════════════════════════════════ */}
      <section id="about" className="relative overflow-hidden" style={{ padding: '120px 56px', background: 'linear-gradient(180deg, #f4f1e8 0%, #ede9dc 100%)' }}>
        {/* Radial glow center */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(92,127,91,0.07) 0%, transparent 72%)' }} />
        {/* Left leaf */}
        <svg className="absolute left-8 top-1/2 -translate-y-1/2 pointer-events-none" style={{ width: 220, height: 220, opacity: 0.05 }} viewBox="0 0 100 100" fill="#183327">
          <path d="M80,20 C70,25 60,35 55,45 C50,55 52,65 58,70 C64,75 72,70 76,60 C80,50 82,35 80,20 Z" />
          <path d="M10,90 C30,70 50,40 80,20" stroke="#183327" strokeWidth="2" fill="none"/>
        </svg>
        {/* Right leaf (mirrored) */}
        <svg className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none" style={{ width: 220, height: 220, opacity: 0.05, transform: 'translateY(-50%) scaleX(-1)' }} viewBox="0 0 100 100" fill="#183327">
          <path d="M80,20 C70,25 60,35 55,45 C50,55 52,65 58,70 C64,75 72,70 76,60 C80,50 82,35 80,20 Z" />
          <path d="M10,90 C30,70 50,40 80,20" stroke="#183327" strokeWidth="2" fill="none"/>
        </svg>

        <div className="relative max-w-4xl mx-auto text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
          <SectionLabel color="muted">OUR MISSION</SectionLabel>

          {/* Large opening quote */}
          <div style={{ fontFamily: "'Lora', Georgia, serif", fontSize: '7rem', color: '#c2a67a', opacity: 0.3, lineHeight: 0.7, userSelect: 'none', marginBottom: 8 }}>&ldquo;</div>

          <blockquote style={{
            fontFamily: "'Lora', Georgia, serif",
            fontSize: 'clamp(1.35rem, 2.4vw, 2rem)',
            fontStyle: 'italic',
            lineHeight: 1.85,
            color: '#18222c',
            fontWeight: 500,
            padding: '0 24px',
            margin: 0,
            position: 'relative',
            zIndex: 1,
          }}>
            We built GrowLedger because financial access should reflect who you are &mdash; not just what a bureau can verify. Transparent, explainable, and fair, for the workers who keep India running.
          </blockquote>

          {/* Large closing quote */}
          <div style={{ fontFamily: "'Lora', Georgia, serif", fontSize: '7rem', color: '#c2a67a', opacity: 0.3, lineHeight: 0.7, userSelect: 'none', marginTop: 8 }}>&rdquo;</div>

          <div style={{ marginTop: 48, position: 'relative', zIndex: 1 }}>
            <button
              onClick={() => navigate('/assess')}
              className="animate-glow-pulse"
              style={{
                background: 'linear-gradient(135deg, #b83a2e 0%, #9a2c22 60%, #7d1e18 100%)',
                color: '#ffffff', fontSize: '15px', fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                padding: '16px 44px', borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer',
                letterSpacing: '0.01em',
                transition: 'transform 0.3s ease-out',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Begin Your Assessment →
            </button>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ════════════════════════════════════════════════════════
          8. FOOTER — Dark Forest Green Background
      ════════════════════════════════════════════════════════ */}
      <footer style={{ background: '#0d2018', color: '#8fa8a0', borderTop: '1px solid rgba(194,166,122,0.20)' }}>
        <div className="max-w-[1200px] mx-auto" style={{ padding: '80px 56px 64px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '64px', alignItems: 'start' }}>

          {/* Brand */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src="/logo.png" alt="GrowLedger"
                style={{ width: '80px', height: '80px', marginTop: '-16px', marginBottom: '-16px', objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(92,127,91,0.45))' }}
              />
              <span style={{ fontFamily: "'Lora', serif", fontSize: '20px', fontWeight: 700, color: 'rgba(255,255,255,0.90)', letterSpacing: '-0.02em' }}>GrowLedger</span>
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#5a7870', lineHeight: 1.75, maxWidth: '280px', margin: 0 }}>
              A transparent alternative financial readiness engine for gig workers and small merchants across India.
            </p>
          </div>

          {/* Nav links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#4a6660', marginBottom: 16 }}>PAGES</p>
            {['How It Works', 'Methodology', 'Demo Profiles', 'Start Assessment'].map((item) => (
              <a
                key={item}
                href={item === 'Start Assessment' ? '/assess' : `/#${item.toLowerCase().replace(/ /g, '-')}`}
                className="footer-link"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#5a7870', textDecoration: 'none', padding: '5px 0', transition: 'color 0.2s ease-out', display: 'block' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
                onMouseLeave={e => e.currentTarget.style.color = '#5a7870'}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Built for */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'right' }}>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#4a6660', margin: 0 }}>BUILT FOR</p>
            <p style={{ fontFamily: "'Lora', serif", fontSize: '18px', color: 'rgba(255,255,255,0.88)', fontWeight: 600, margin: 0 }}>Bharat &middot; 2026</p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#5a7870', lineHeight: 1.75, margin: 0 }}>
              LightGBM &middot; TreeSHAP &middot; Flask &middot; React<br />
              National Hackathon Submission
            </p>
          </div>

        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="max-w-[1200px] mx-auto" style={{ padding: '20px 56px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '10.5px', color: '#3d5550', letterSpacing: '0.04em', margin: 0 }}>&copy; 2026 GrowLedger. All rights reserved.</p>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '10.5px', color: '#3d5550', letterSpacing: '0.04em', margin: 0 }}>Transparent &middot; Explainable &middot; Fair</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

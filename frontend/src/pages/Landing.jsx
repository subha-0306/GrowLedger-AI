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
    <div style={{ transform: 'rotate(2.5deg)' }} className="relative w-full max-w-[500px] mx-auto transition-transform duration-300 hover:rotate-1">
      {/* Floating animation wrapper */}
      <div className="animate-passport-float relative">
        
        {/* Layered premium shadows */}
        <div className="absolute inset-0 rounded-[12px] shadow-premium-passport" aria-hidden="true" />

        {/* Card Body */}
        <div className="relative bg-[#fdfcfa] border-[1.5px] border-[#dcd6c8] rounded-[12px] p-7 space-y-6 overflow-hidden">
          
          {/* Paper Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.035] pointer-events-none" aria-hidden="true"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='150' height='150' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

          {/* Aged paper edges effect */}
          <div className="absolute inset-0 border border-white/40 rounded-[11px] pointer-events-none" />

          {/* Document Header */}
          <div className="flex items-center justify-between border-b border-[#e9e4db] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f3f7f3] border border-[#d4dfd6] flex items-center justify-center">
                <Landmark className="w-5 h-5 text-[#5f7d66]" />
              </div>
              <div>
                <p className="font-mono text-[9px] text-[#94a3b8] tracking-[0.25em] uppercase">FINANCIAL READINESS</p>
                <p className="font-serif text-[18px] text-[#0f172a] font-bold tracking-tight">PASSPORT</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono text-[8px] text-[#94a3b8] tracking-[0.18em] uppercase">ISSUED BY</p>
              <p className="font-serif text-[13px] text-[#5f7d66] font-semibold">GrowLedger · 2026</p>
            </div>
          </div>

          {/* Tier & Confidence Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[8px] tracking-[0.22em] uppercase text-[#94a3b8] mb-1">READINESS TIER</p>
              <p className="font-serif text-3xl font-extrabold text-[#0f172a] tracking-tight">Ready</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[8px] tracking-[0.22em] uppercase text-[#94a3b8] mb-1">CONFIDENCE</p>
              <p className="font-mono text-2xl font-black text-[#5f7d66]">94.2%</p>
            </div>
          </div>

          {/* Verified Stamp Motif */}
          <div className="flex justify-center py-2 relative">
            <div className="passport-stamp-red animate-stamp-reveal text-[13px] tracking-[0.15em] border-[3px] border-[#a91d22]">
              CREDIT READY
            </div>
            {/* Watermark official seal emblem in background */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-[0.035] pointer-events-none">
              <Landmark className="w-24 h-24 text-[#0f172a]" />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#e9e4db]" />

          {/* Key Strengths list */}
          <div className="space-y-3">
            <p className="font-mono text-[8px] tracking-[0.22em] uppercase text-[#94a3b8]">TOP FINANCIAL STRENGTHS</p>
            <ul className="space-y-2.5">
              {[
                'Consistent UPI activity over 90 days',
                'Positive income growth trend (+12% MoM)'
              ].map((s) => (
                <li key={s} className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-[#edf3ee] border border-[#d4dfd6] flex items-center justify-center shrink-0">
                    <CheckCircle className="w-3.5 h-3.5 text-[#5f7d66]" />
                  </span>
                  <span className="font-sans text-[12.5px] text-[#334155] font-medium">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Priority action area */}
          <div className="space-y-2">
            <p className="font-mono text-[8px] tracking-[0.22em] uppercase text-[#94a3b8]">PRIORITY IMPROVEMENT</p>
            <div className="flex items-start gap-2.5 bg-[#fdf6f0] border border-[#e8cebf] p-3 rounded-lg">
              <span className="w-4 h-4 rounded-full bg-[#fdf6f0] flex items-center justify-center shrink-0 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-[#c87a53]" />
              </span>
              <span className="font-sans text-[12px] text-[#85401d] leading-relaxed">
                Reduce reliance on cash transactions to establish digital trail.
              </span>
            </div>
          </div>

          {/* Embellishments footer */}
          <div className="pt-3 border-t border-[#e9e4db] flex items-center justify-between text-[#b8b0a5] font-mono text-[8px]">
            <span>REF: GL-2026-9428</span>
            <span>EXPLAINABLE AI SECURED</span>
          </div>

        </div>
      </div>
    </div>
  );
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
  
  const howItWorksRef = useRef(null);

  // Staggered lighting animation trigger for the timeline
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLineVisible(true);
          // Trigger step lighting animation sequence
          setTimeout(() => setTimelineProgress(1), 300);
          setTimeout(() => setTimelineProgress(2), 700);
          setTimeout(() => setTimelineProgress(3), 1100);
        }
      },
      { threshold: 0.15 }
    );
    if (howItWorksRef.current) observer.observe(howItWorksRef.current);
    return () => observer.disconnect();
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
      <section id="home" className="relative min-h-[82vh] flex items-center overflow-hidden bg-[#fbf9f5] border-b border-[#e9e4db]">
        <HeroBackground />
        
        <div className="relative z-10 w-full max-w-[1380px] mx-auto px-6 md:px-14 py-14 lg:py-18 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* Left Column Copy — ~45% width equivalent */}
          <div className="lg:col-span-6 space-y-6">
            <SectionLabel color="sage">FINANCIAL READINESS · TRANSPARENT BY DESIGN</SectionLabel>

            {/* ★ Large Lora ExtraBold Headline exactly matching benchmark size & feel */}
            <h1 style={{
              fontFamily: "'Lora', Georgia, serif",
              fontSize: 'clamp(2.8rem, 5vw, 4.6rem)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
              color: '#0f172a',
              margin: 0,
            }}>
              Your daily financial<br />
              behaviour already<br />
              tells a complete<br />
              <span className="italic font-serif text-[#5f7d66]">story.</span>
            </h1>

            {/* Body Copy — 21px, 520px maxWidth, rich line-height */}
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '21px',
              lineHeight: 1.65,
              color: '#475569',
              maxWidth: '520px',
              margin: 0,
            }}>
              Most people aren't denied credit because they're irresponsible.
              They're denied because the system doesn't know how to read them.
              GrowLedger does.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={() => navigate('/assess')}
                className="bg-[#a91d22] hover:bg-[#c4252a] text-white text-[15px] font-semibold py-3.5 px-8 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.01]"
              >
                Start Assessment &rarr;
              </button>
              <a
                href="#how-it-works"
                className="btn-passport-outline text-[15px] font-medium py-3.5 px-8 rounded-lg"
              >
                See How It Works
              </a>
            </div>

            {/* Trust Indicator Bar */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2">
              {['Explainable AI', 'No Credit Bureau Required', '90-Day Growth Roadmap'].map((item, i) => (
                <React.Fragment key={item}>
                  {i > 0 && <span className="text-[#d8d2c8] text-sm select-none">&middot;</span>}
                  <span className="flex items-center gap-2 text-xs font-semibold text-[#64748b] tracking-wide">
                    <CheckCircle2 className="w-4 h-4 text-[#5f7d66] shrink-0" />
                    {item}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right Column — Large tilted Passport Card */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <PassportCard />
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          2. PROBLEM — Light Cream Background
      ════════════════════════════════════════════════════════ */}
      <section id="problem" className="bg-[#f6f3eb] py-16 px-6 md:px-14 border-b border-[#e9e4db]">
        <div className="max-w-[1200px] mx-auto">
          
          <div className="text-center mb-4">
            <p className="font-mono text-[11px] font-bold tracking-[0.3em] uppercase text-[#94a3b8]">THE PROBLEM</p>
          </div>

          {/* Center text with flanked statistics widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Stat 1 */}
            <div className="lg:col-span-3 bg-[#faf8f5]/80 p-6 rounded-xl border border-[#e9e4db] text-center space-y-2 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#edf3ee] border border-[#d4dfd6] flex items-center justify-center mx-auto">
                <Users className="w-5 h-5 text-[#5f7d66]" />
              </div>
              <p className="font-mono text-3xl font-black text-[#0f172a]">190M+</p>
              <p className="font-sans text-[12px] text-[#64748b] font-medium leading-tight">Indians creditworthy but undocumented</p>
            </div>

            {/* Stat description statement */}
            <div className="lg:col-span-6 text-center space-y-4 px-4">
              {/* Stat Headline size: ~46px Lora */}
              <h2 style={{
                fontFamily: "'Lora', Georgia, serif",
                fontSize: 'clamp(1.8rem, 3.2vw, 2.7rem)',
                fontWeight: 700,
                lineHeight: 1.25,
                color: '#0f172a',
                margin: 0,
              }}>
                Over 190 million Indians are creditworthy &mdash;
                <br />
                <span className="text-[#a91d22]">but invisible to formal lenders.</span>
              </h2>
              <p className="font-sans text-base text-[#475569] leading-relaxed max-w-xl mx-auto">
                They work every day. They save. They transact. Just not in ways traditional credit scores were designed to read. The bureau sees a blank page. We see a full financial story.
              </p>
            </div>

            {/* Stat 2 */}
            <div className="lg:col-span-3 bg-[#faf8f5]/80 p-6 rounded-xl border border-[#e9e4db] text-center space-y-2 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#fdf6f0] border border-[#ebd8cc] flex items-center justify-center mx-auto">
                <Landmark className="w-5 h-5 text-[#c87a53]" />
              </div>
              <p className="font-mono text-3xl font-black text-[#0f172a]">100%</p>
              <p className="font-sans text-[12px] text-[#64748b] font-medium leading-tight">Excluded from prime traditional banking</p>
            </div>

          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          3. HOW IT WORKS — Soft Sage Tint, Horizontal Timeline Flow
      ════════════════════════════════════════════════════════ */}
      <section id="how-it-works" ref={howItWorksRef} className="py-16 px-6 md:px-14 bg-[#ecf2ec] border-b border-[#d4dfd6]">
        <div className="max-w-[1200px] mx-auto text-center">
          
          <div className="mb-4">
            <p className="font-mono text-[11px] font-bold tracking-[0.3em] uppercase text-[#5f7d66]">HOW IT WORKS</p>
            {/* Title size: ~48px Lora */}
            <h2 className="mt-2" style={{
              fontFamily: "'Lora', Georgia, serif",
              fontSize: 'clamp(1.8rem, 3.5vw, 2.85rem)',
              fontWeight: 700,
              lineHeight: 1.25,
              color: '#0f172a',
            }}>
              Three steps to your Financial Readiness Passport.
            </h2>
          </div>

          {/* Centered timeline container */}
          <div className="relative mt-12 mb-8 hidden md:block">
            {/* Base timeline gray line */}
            <div className="absolute top-[22px] left-[15%] right-[15%] h-[2px] bg-[#d8d2c8]" />
            {/* Animated green progress line */}
            <div 
              className="absolute top-[22px] left-[15%] h-[2px] bg-[#5f7d66] transition-all duration-[1200ms] ease-out" 
              style={{ width: lineVisible ? '70%' : '0%' }}
            />
          </div>

          {/* Cards timeline columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative z-10">
            {howItWorksSteps.map((item, idx) => {
              const Icon = item.icon;
              const isLit = timelineProgress > idx || hoveredStep === idx;
              return (
                <div
                  key={item.step}
                  className="flex flex-col items-center gap-4 cursor-default p-4 rounded-xl transition-all duration-300 hover:bg-[#faf8f5]/40"
                  onMouseEnter={() => setHoveredStep(idx)}
                  onMouseLeave={() => setHoveredStep(null)}
                >
                  {/* Timeline indicator node */}
                  <div className="relative flex justify-center">
                    {/* Circle badge */}
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 shadow-sm"
                      style={{
                        backgroundColor: isLit ? '#081c15' : '#ffffff',
                        borderColor:     isLit ? '#c2a67a' : '#d8d2c8',
                      }}
                    >
                      <span
                        className="font-serif text-lg font-bold transition-colors duration-500"
                        style={{ color: isLit ? '#ffffff' : '#081c15' }}
                      >
                        {item.step}
                      </span>
                    </div>

                    {/* Node floating icon badge */}
                    <div 
                      className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg flex items-center justify-center border shadow-xs transition-colors duration-300"
                      style={{
                        backgroundColor: isLit ? '#edf3ee' : '#ffffff',
                        borderColor:     isLit ? '#d4dfd6' : '#ebd8cc',
                      }}
                    >
                      <Icon className="w-4 h-4" style={{ color: isLit ? '#5f7d66' : '#94a3b8' }} />
                    </div>
                  </div>

                  {/* Copy content */}
                  <div className="space-y-2 mt-2">
                    <h3 className="font-serif text-lg font-bold text-[#0f172a] leading-snug">{item.title}</h3>
                    <p className="font-sans text-[13.5px] leading-relaxed text-[#475569]">
                      {item.body}
                    </p>
                  </div>

                  {/* Small alignment dot indicator */}
                  <div className="w-1.5 h-1.5 rounded-full mt-2 transition-all duration-300" 
                    style={{ backgroundColor: isLit ? '#5f7d66' : 'transparent' }} />
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
      <section id="methodology" className="py-16 px-6 md:px-14 bg-[#fbf8f2] border-b border-[#e9e4db]">
        <div className="max-w-[1200px] mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left title info block */}
            <div className="lg:col-span-4 space-y-4">
              <p className="font-mono text-[11px] font-bold tracking-[0.3em] uppercase text-[#94a3b8]">METHODOLOGY PREVIEW</p>
              {/* Title size: ~46px Lora */}
              <h2 style={{
                fontFamily: "'Lora', Georgia, serif",
                fontSize: 'clamp(1.75rem, 3vw, 2.6rem)',
                fontWeight: 700,
                lineHeight: 1.25,
                color: '#0f172a',
                margin: 0,
              }}>
                Why GrowLedger makes different decisions.
              </h2>
              <p className="font-sans text-sm text-[#475569] leading-relaxed max-w-sm">
                Every readiness assessment is backed by transparent attribution models. We replace traditional black boxes with explainable AI nodes.
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#081c15] border-b border-[#081c15]/25 hover:border-[#081c15] pb-0.5 transition-colors decoration-transparent"
              >
                Explore full methodology &rarr;
              </a>
            </div>

            {/* Right horizontal pipeline nodes track */}
            <div className="lg:col-span-8 bg-[#faf8f5] border border-[#e9e4db] rounded-2xl p-6 shadow-sm">
              <div className="grid grid-cols-5 gap-0 items-center">
                {methodologySteps.map((step, i) => {
                  const Icon = step.icon;
                  const isActive   = activeMethodStep === i;
                  const hasHover   = activeMethodStep !== null;
                  const isInactive = hasHover && !isActive;
                  return (
                    <div key={step.label} className="flex items-center">
                      <div
                        className="flex-1 flex flex-col items-center gap-2.5 cursor-pointer py-3.5 px-2 rounded-xl transition-all duration-300"
                        style={{
                          opacity:         isInactive ? 0.35 : 1,
                          backgroundColor: isActive ? '#edf3ee' : 'transparent',
                          transform:       isActive ? 'scale(1.05)' : 'scale(1)',
                        }}
                        onMouseEnter={() => setActiveMethodStep(i)}
                        onMouseLeave={() => setActiveMethodStep(null)}
                      >
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center border-2 transition-all duration-300"
                          style={{
                            backgroundColor: isActive ? '#ffffff' : '#f3f7f3',
                            borderColor:     isActive ? '#5f7d66' : '#e9e4db',
                            boxShadow:       isActive ? '0 4px 10px rgba(95,125,102,0.15)' : 'none',
                          }}
                        >
                          <Icon className="w-5 h-5 transition-transform" style={{ color: isActive ? '#5f7d66' : '#94a3b8', transform: isActive ? 'scale(1.1)' : 'none' }} />
                        </div>
                        <p className="font-serif text-[11px] font-bold text-[#0f172a] text-center leading-tight">{step.label}</p>
                        <p className="font-sans text-[10px] text-[#94a3b8] text-center leading-tight hidden md:block">{step.sub}</p>
                      </div>
                      
                      {/* Flow arrow indicator */}
                      {i < methodologySteps.length - 1 && (
                        <div className="shrink-0 flex items-center justify-center w-5">
                          <ArrowRight className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-[#5f7d66] font-bold' : 'text-[#d8d2c8]'}`} />
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
      <section className="py-16 px-6 md:px-14 bg-[#f6f3eb] border-b border-[#e9e4db]">
        <div className="max-w-[960px] mx-auto">
          
          <div className="text-center mb-10">
            <p className="font-mono text-[11px] font-bold tracking-[0.3em] uppercase text-[#94a3b8]">WHY DIFFERENT</p>
            {/* Title size: ~46px Lora */}
            <h2 style={{
              fontFamily: "'Lora', Georgia, serif",
              fontSize: 'clamp(1.75rem, 3vw, 2.6rem)',
              fontWeight: 700,
              lineHeight: 1.25,
              color: '#0f172a',
              margin: 0,
            }}>
              Traditional credit versus GrowLedger.
            </h2>
          </div>

          {/* Table Container */}
          <div className="border border-[#dcd6c8] bg-[#fdfcfa] rounded-xl overflow-hidden shadow-sm">
            {/* Header */}
            <div className="grid grid-cols-2">
              <div className="bg-[#fdf6f0] px-6 py-4 border-b border-r border-[#dcd6c8] flex items-center gap-2.5">
                <XCircle className="w-4 h-4 text-[#c87a53] shrink-0" />
                <p className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-[#c87a53]">Traditional Credit</p>
              </div>
              <div className="bg-[#edf3ee] px-6 py-4 border-b border-[#dcd6c8] flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#5f7d66] shrink-0" />
                <p className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-[#5f7d66]">GrowLedger</p>
              </div>
            </div>
            {/* Rows */}
            {comparisonRows.map(({ trad, gl }, i) => (
              <div key={i} className="group grid grid-cols-2 border-b border-[#e9e4db] last:border-b-0">
                <div className="px-6 py-4 border-r border-[#e9e4db] transition-colors duration-150 group-hover:bg-[#fdf6f0]/75">
                  <div className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c87a53]/50 mt-1.5 shrink-0" />
                    <p className="font-sans text-sm text-[#64748b]">{trad}</p>
                  </div>
                </div>
                <div className="px-6 py-4 transition-colors duration-150 group-hover:bg-[#edf3ee]/65">
                  <div className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5f7d66]/60 mt-1.5 shrink-0" />
                    <p className="font-sans text-sm text-[#0f172a] font-medium">{gl}</p>
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
      <section id="demo-profiles" className="py-16 px-6 md:px-14 bg-[#edf2ed] border-b border-[#d4dfd6]">
        <div className="max-w-[1240px] mx-auto">
          
          <div className="text-center mb-10 space-y-3">
            <p className="font-mono text-[11px] font-bold tracking-[0.3em] uppercase text-[#5f7d66]">TRY IT NOW</p>
            {/* Title: ~46px Lora */}
            <h2 style={{
              fontFamily: "'Lora', Georgia, serif",
              fontSize: 'clamp(1.75rem, 3vw, 2.6rem)',
              fontWeight: 700,
              lineHeight: 1.25,
              color: '#0f172a',
              margin: 0,
            }}>
              Five real financial profiles.
            </h2>
            <p className="font-sans text-[13.5px] text-[#64748b] max-w-sm mx-auto">
              Select a passport profile card below to load simulated financial ledger data immediately.
            </p>
          </div>

          {/* Premium Passport Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {DEMO_PROFILES.map((profile) => {
              const isLoading = loadingId === profile.id;
              return (
                <div
                  key={profile.id}
                  className="group flex flex-col p-5 rounded-xl bg-[#fdfcfa] border border-[#dcd6c8] transition-all duration-300 shadow-premium-card hover:border-[#5f7d66]/40 cursor-pointer"
                  onClick={() => handleTryProfile(profile)}
                >
                  {/* Card Avatar / Photo */}
                  <div className="flex items-center gap-3 mb-4">
                    <img 
                      src={profile.avatar} 
                      alt={profile.name} 
                      className="w-12 h-12 rounded-full object-cover border border-[#e9e4db] shadow-inner shrink-0" 
                    />
                    <div className="min-w-0">
                      <p className="font-serif text-[13.5px] font-bold text-[#0f172a] truncate">{profile.name}</p>
                      <p className="font-sans text-[11px] text-[#94a3b8] truncate">{profile.occupation}</p>
                    </div>
                  </div>

                  {/* Tier status indicator badge */}
                  <div className="mb-3.5">
                    <span className={TIER_BADGE[profile.tierColor]}>{profile.tier}</span>
                  </div>

                  {/* Description details */}
                  <p className="font-sans text-[12.5px] text-[#546272] leading-relaxed flex-1 mb-4">
                    {profile.description}
                  </p>

                  {/* Action CTA Button */}
                  <button
                    disabled={isLoading}
                    className="w-full text-[12.5px] font-bold py-2.5 px-3 rounded-lg border border-[#dcd6c8] text-[#0f172a] bg-transparent inline-flex items-center justify-center gap-1.5 transition-all duration-200 group-hover:bg-[#a91d22] group-hover:text-white group-hover:border-[#a91d22] disabled:opacity-50"
                    onClick={(e) => { e.stopPropagation(); handleTryProfile(profile); }}
                  >
                    {isLoading ? 'Loading...' : <><span>Try Profile</span><ArrowRight className="w-3.5 h-3.5" /></>}
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
      <section id="about" className="relative py-16 px-6 md:px-14 bg-[#f4f1e8] overflow-hidden">
        {/* Watercolor watermark stains */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(95,125,102,0.05)_0%,transparent_80%)] pointer-events-none" />
        
        <div className="relative max-w-3xl mx-auto text-center space-y-5">
          <p className="font-mono text-[11px] font-bold tracking-[0.3em] uppercase text-[#94a3b8]">OUR MISSION</p>
          
          {/* Faded Quote Ornament marks */}
          <div className="font-serif text-[6rem] text-[#ddd8cd] leading-none select-none -mb-6">&ldquo;</div>
          
          <blockquote style={{
            fontFamily: "'Lora', Georgia, serif",
            fontSize: 'clamp(1.2rem, 2.2vw, 1.7rem)',
            fontWeight: 500,
            lineHeight: 1.65,
            color: '#0f172a',
            fontStyle: 'italic',
            margin: 0,
          }}>
            We built GrowLedger because financial access should reflect who you are &mdash; not just what a bureau can verify. Transparent, explainable, and fair, for the workers who keep India running.
          </blockquote>
          
          <div className="font-serif text-[6rem] text-[#ddd8cd] leading-none select-none -mt-6">&rdquo;</div>

          <div className="pt-2">
            <button
              onClick={() => navigate('/assess')}
              className="bg-[#a91d22] hover:bg-[#c4252a] text-white text-[15px] font-semibold py-3.5 px-8 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.01]"
            >
              Begin Your Assessment &rarr;
            </button>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ════════════════════════════════════════════════════════
          8. FOOTER — Dark Forest Green Background
      ════════════════════════════════════════════════════════ */}
      <footer className="bg-[#081c15] text-[#a3b8b0] border-t border-[#c2a67a]/25">
        <div className="max-w-[1200px] mx-auto px-6 md:px-14 py-12 grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          
          {/* Logo brand info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="GrowLedger" className="w-9 h-9 object-contain" />
              <span className="font-serif text-xl font-bold text-white tracking-tight">GrowLedger</span>
            </div>
            <p className="font-sans text-[12.5px] text-[#6d8b80] leading-relaxed max-w-xs">
              A transparent alternative financial readiness engine for gig workers and small merchants across India.
            </p>
          </div>

          {/* Links list */}
          <nav className="space-y-2">
            <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-[#6d8b80] mb-4">PAGES</p>
            {['How It Works', 'Methodology', 'Demo Profiles', 'Start Assessment'].map((item) => (
              <a 
                key={item} 
                href={item === 'Start Assessment' ? '/assess' : `/#${item.toLowerCase().replace(/ /g, '-')}`}
                className="block font-sans text-[13.5px] text-[#6d8b80] hover:text-white transition-colors duration-150 decoration-transparent py-0.5"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Hackathon info details */}
          <div className="space-y-3 md:text-right">
            <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-[#6d8b80]">BUILT FOR</p>
            <p className="font-serif text-[17px] text-white font-medium">Bharat &middot; 2026</p>
            <p className="font-sans text-[12.5px] text-[#6d8b80] leading-relaxed">
              LightGBM &middot; TreeSHAP &middot; Flask &middot; React<br />
              National Hackathon Submission
            </p>
          </div>

        </div>

        {/* Bottom copyright details */}
        <div className="border-t border-[#0f2e22]">
          <div className="max-w-[1200px] mx-auto px-6 md:px-14 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[#6d8b80] font-mono text-[10px] tracking-wide">
            <p>&copy; 2026 GrowLedger. All rights reserved.</p>
            <p>Transparent &middot; Explainable &middot; Fair</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

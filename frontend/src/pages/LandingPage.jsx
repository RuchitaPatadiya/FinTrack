import React, { useState } from 'react'
import {
  Landmark,
  ArrowRight,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  PiggyBank,
  Wallet,
  PieChart,
  Zap,
  CheckCircle2,
  ChevronRight,
  Smile,
  Coffee,
  Plane,
  ShoppingBag,
  ArrowUpRight,
  Sliders,
  DollarSign
} from 'lucide-react'

export default function LandingPage({ onNavigate, onDemoMode }) {
  // Playground interactive state
  const [monthlyIncome, setMonthlyIncome] = useState(5500)
  const [cutCoffee, setCutCoffee] = useState(true)
  const [cutTakeout, setCutTakeout] = useState(false)
  const [cutImpulse, setCutImpulse] = useState(true)
  const [activeHeroTab, setActiveHeroTab] = useState('all')

  // Calculate annual savings boost in the interactive playground
  const coffeeSavings = cutCoffee ? 160 : 0
  const takeoutSavings = cutTakeout ? 280 : 0
  const impulseSavings = cutImpulse ? 220 : 0
  const totalMonthlyTrim = coffeeSavings + takeoutSavings + impulseSavings
  const projectedYearlySaved = Math.round((monthlyIncome * 0.22 + totalMonthlyTrim) * 12)

  const featureCards = [
    {
      title: 'Pastel Goal Vaults',
      tag: 'Goal Crushing',
      color: 'yellow',
      borderColor: 'border-yellow-400/30',
      bgGlow: 'hover:shadow-glow-yellow',
      badgeBg: 'bg-pastel-yellow/15 text-pastel-yellow border-pastel-yellow/30',
      description: 'Set customized micro-vaults for concerts, summer trips, or dream gadgets with satisfying visual completion rings.',
      icon: PiggyBank,
      sample: '🎯 Tokyo Trip: 84% saved'
    },
    {
      title: 'Vibe & Mood Tags',
      tag: 'Fun Categorization',
      color: 'pink',
      borderColor: 'border-pink-400/30',
      bgGlow: 'hover:shadow-glow-pink',
      badgeBg: 'bg-pastel-pink/15 text-pastel-pink border-pastel-pink/30',
      description: 'Tag your transactions by emotion: #TreatMyself, #EssentialVibe, or #3amRegret. Finance tracking with real personality.',
      icon: Smile,
      sample: '☕ Matcha Latte: #DailyHappiness'
    },
    {
      title: 'Predictive Cashflow',
      tag: 'Zero Surprises',
      color: 'mint',
      borderColor: 'border-mint-400/30',
      bgGlow: 'hover:shadow-glow-mint',
      badgeBg: 'bg-pastel-mint/15 text-pastel-mint border-pastel-mint/30',
      description: 'Smart balance forecasting alerts you before recurring subscriptions hit so your checking account always stays safe.',
      icon: TrendingUp,
      sample: '🌿 +$1,420 buffer predicted for end of month'
    },
    {
      title: 'Sleek Aesthetic Analytics',
      tag: 'Minimal Chic',
      color: 'purple',
      borderColor: 'border-purple-400/30',
      bgGlow: 'hover:shadow-glow-purple',
      badgeBg: 'bg-pastel-purple/15 text-pastel-purple border-pastel-purple/30',
      description: 'Clean breakdown charts in soft pastel lilac, sky blue, and coral. Never suffer through boring corporate spreadsheets again.',
      icon: PieChart,
      sample: '✨ 64% Essentials • 21% Fun • 15% Invest'
    },
    {
      title: 'Private & Local-Ready',
      tag: 'Ironclad Security',
      color: 'sky',
      borderColor: 'border-sky-400/30',
      bgGlow: 'hover:shadow-glow-sky',
      badgeBg: 'bg-pastel-sky/15 text-pastel-sky border-pastel-sky/30',
      description: 'End-to-end user isolation with clean token-based authentication. Your financial figures are solely yours to view.',
      icon: ShieldCheck,
      sample: '🔒 Bank-grade AES-256 isolation'
    },
    {
      title: 'Instant Fast-Entry',
      tag: 'Lightning Speed',
      color: 'peach',
      borderColor: 'border-orange-400/30',
      bgGlow: 'hover:shadow-glow-pink',
      badgeBg: 'bg-pastel-peach/15 text-pastel-peach border-pastel-peach/30',
      description: 'Log any receipt or tap a quick category in under 4 seconds. Designed to keep your tracking streak alive with zero friction.',
      icon: Zap,
      sample: '⚡ Average entry time: 2.8s'
    },
  ]

  const marqueeTestimonials = [
    { name: 'Chloe M.', handle: '@chloedev', quote: 'Finally a finance app that looks chic instead of looking like Windows 98 tax software! 💅', color: 'pink' },
    { name: 'Alex K.', handle: '@alex_creates', quote: 'The pastel vaults are so addictive. I saved $3k for my camera kit in 2 months. 📸', color: 'mint' },
    { name: 'Rohan P.', handle: '@rohan_builds', quote: 'The mood tagging is brilliant. Realized I was spending $200/mo on stress snacks. 🍕', color: 'yellow' },
    { name: 'Elena V.', handle: '@elenadesign', quote: 'Minimal black background with pastel accents is peak UI design. Can’t stop opening it.', color: 'purple' },
    { name: 'Marcus L.', handle: '@marcus_xyz', quote: 'FinTrack made my partner and me actually enjoy reviewing our monthly budgets together ✨', color: 'sky' }
  ]

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 bg-chic-mesh bg-grid-chic relative selection:bg-pastel-pink selection:text-black">
      {/* Chic Glow Orbs in background */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-pastel-purple/10 via-pastel-pink/10 to-pastel-mint/10 blur-[120px] pointer-events-none rounded-full" />

      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/5 px-4 sm:px-8 py-3.5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-pastel-mint via-pastel-sky to-pastel-purple p-[1.5px] shadow-glow-mint transition-transform hover:scale-105 duration-300">
              <div className="w-full h-full bg-[#0E1017] rounded-[10px] flex items-center justify-center">
                <Landmark className="h-5 w-5 text-pastel-mint" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-white font-display">
                Fin<span className="text-transparent bg-clip-text bg-gradient-to-r from-pastel-mint to-pastel-sky">Track</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-semibold tracking-wide uppercase bg-white/5 text-pastel-yellow border border-pastel-yellow/30 rounded-full">
                V2.0 Chic
              </span>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-1 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs font-medium text-slate-300">
            <a href="#features" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition">Features</a>
            <a href="#playground" className="px-3 py-1.5 rounded-full hover:text-pastel-yellow hover:bg-white/10 transition flex items-center space-x-1">
              <span>Savings Simulator</span>
              <span className="h-1.5 w-1.5 rounded-full bg-pastel-yellow animate-pulse" />
            </a>
            <a href="#how-it-works" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition">How It Works</a>
            <a href="#vibes" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition">Community</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {onDemoMode && (
              <button
                onClick={onDemoMode}
                className="hidden lg:flex items-center space-x-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-pastel-yellow/10 text-pastel-yellow hover:bg-pastel-yellow/20 border border-pastel-yellow/30 transition-all duration-200"
                title="Explore all features right now with sample data"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Instant Demo</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('login')}
              className="text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl hover:bg-white/5 transition"
            >
              Sign In
            </button>

            <button
              onClick={() => onNavigate('register')}
              className="group relative inline-flex items-center justify-center p-0.5 text-xs font-bold rounded-xl overflow-hidden shadow-glow-mint transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="w-full h-full bg-gradient-to-r from-pastel-mint via-pastel-sky to-pastel-pink absolute" />
              <span className="relative px-4 py-2 bg-[#090A0F] group-hover:bg-opacity-90 rounded-[10px] text-white flex items-center space-x-1.5 transition duration-200">
                <span>Get Started Free</span>
                <ArrowRight className="h-3.5 w-3.5 text-pastel-mint group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-14 pb-20 px-4 sm:px-8 max-w-7xl mx-auto text-center relative">
        {/* Floating pill badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-slate-300 mb-6 backdrop-blur-md animate-float-slow">
          <span className="flex h-2 w-2 rounded-full bg-pastel-mint animate-ping" />
          <span className="text-slate-400">Finance tracking, but make it</span>
          <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pastel-pink via-pastel-yellow to-pastel-mint">
            aesthetic & effortless ✨
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-display max-w-4xl mx-auto leading-[1.08] text-white">
          Track wealth in style.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pastel-mint via-pastel-sky to-pastel-purple">
            Less spreadsheets,
          </span>{' '}
          more living.
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
          FinTrack unites minimal chic dark design with joyful pastel palettes. Categorize fun spends, crush personal vault goals, and watch your net worth blossom in real-time.
        </p>

        {/* CTA Button Group */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={() => onNavigate('register')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-pastel-mint to-pastel-sky text-slate-950 font-bold text-sm sm:text-base hover:shadow-glow-mint hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>Start Tracking Free</span>
            <ArrowRight className="h-4 w-4 text-slate-950" />
          </button>

          <a
            href="#playground"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-semibold text-sm sm:text-base transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Sliders className="h-4 w-4 text-pastel-yellow" />
            <span>Try Interactive Simulator</span>
          </a>

          {onDemoMode && (
            <button
              onClick={onDemoMode}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-pastel-purple/10 hover:bg-pastel-purple/20 text-pastel-purple border border-pastel-purple/30 font-semibold text-sm transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>Direct App Preview</span>
            </button>
          )}
        </div>

        {/* Micro Social Badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-5 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-pastel-mint" />
            <span>Zero card required</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-pastel-sky" />
            <span>Bank-level private</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-pastel-yellow" />
            <span>Under 1 minute setup</span>
          </div>
        </div>

        {/* HERO INTERACTIVE SHOWCASE CARD */}
        <div className="mt-14 max-w-5xl mx-auto relative">
          {/* Floating Sticker: Payday Mint */}
          <div className="hidden md:flex absolute -top-6 -left-6 z-20 items-center space-x-2.5 px-4 py-2.5 rounded-2xl glass-panel border border-pastel-mint/30 shadow-glow-mint animate-float-slow">
            <div className="h-8 w-8 rounded-xl bg-pastel-mint/20 text-pastel-mint flex items-center justify-center font-bold text-sm">
              💸
            </div>
            <div className="text-left">
              <p className="text-[11px] text-slate-400 font-medium">Payday Deposited</p>
              <p className="text-xs font-bold text-pastel-mint">+$3,450.00 🌿</p>
            </div>
          </div>

          {/* Floating Sticker: Boba Pink */}
          <div className="hidden md:flex absolute top-1/2 -right-8 z-20 items-center space-x-2.5 px-4 py-2.5 rounded-2xl glass-panel border border-pastel-pink/30 shadow-glow-pink animate-float-reverse">
            <div className="h-8 w-8 rounded-xl bg-pastel-pink/20 text-pastel-pink flex items-center justify-center font-bold text-sm">
              🧋
            </div>
            <div className="text-left">
              <p className="text-[11px] text-slate-400 font-medium">Boba & Pastry</p>
              <p className="text-xs font-bold text-pastel-pink">-$7.25 • #MoodBoost</p>
            </div>
          </div>

          {/* Floating Sticker: Vault Yellow */}
          <div className="hidden md:flex absolute -bottom-5 left-10 z-20 items-center space-x-2.5 px-4 py-2 rounded-2xl glass-panel border border-pastel-yellow/30 shadow-glow-yellow animate-float-slow">
            <div className="h-8 w-8 rounded-xl bg-pastel-yellow/20 text-pastel-yellow flex items-center justify-center font-bold text-sm">
              ✈️
            </div>
            <div className="text-left">
              <p className="text-[11px] text-slate-400 font-medium">Tokyo Trip Vault</p>
              <p className="text-xs font-bold text-pastel-yellow">88% of $2,500 reached! 🌸</p>
            </div>
          </div>

          {/* Centerpiece Dashboard Mockup */}
          <div className="rounded-3xl p-1 bg-gradient-to-b from-white/15 via-white/5 to-transparent shadow-2xl backdrop-blur-2xl">
            <div className="bg-[#0E111A] rounded-[22px] border border-white/10 p-5 sm:p-8 text-left overflow-hidden relative">
              {/* App bar inside mockup */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-slate-400">dashboard.fintrack.app</span>
                </div>

                <div className="flex items-center space-x-1.5 bg-[#161925] p-1 rounded-xl border border-white/5 text-xs">
                  {['all', 'vaults', 'spends'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveHeroTab(tab)}
                      className={`px-3 py-1 rounded-lg capitalize transition font-medium ${
                        activeHeroTab === tab
                          ? 'bg-white/10 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {tab === 'all' ? '✨ Overview' : tab === 'vaults' ? '🎯 Goal Vaults' : '💸 Spends'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Metric Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                {/* Net Worth / Balance */}
                <div className="bg-[#141722] p-5 rounded-2xl border border-white/5 hover:border-pastel-mint/30 transition group">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-semibold uppercase tracking-wider">Total Net Balance</span>
                    <span className="p-1.5 rounded-lg bg-pastel-mint/10 text-pastel-mint group-hover:scale-110 transition">
                      <Wallet className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="text-3xl font-extrabold text-white font-display tracking-tight">
                    $24,850.40
                  </div>
                  <div className="mt-2 flex items-center space-x-1.5 text-xs text-pastel-mint font-semibold">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>+$3,120.00 this month (14.2%)</span>
                  </div>
                </div>

                {/* Monthly Inflow */}
                <div className="bg-[#141722] p-5 rounded-2xl border border-white/5 hover:border-pastel-sky/30 transition group">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-semibold uppercase tracking-wider">Monthly Income</span>
                    <span className="p-1.5 rounded-lg bg-pastel-sky/10 text-pastel-sky group-hover:scale-110 transition">
                      <TrendingUp className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="text-3xl font-extrabold text-pastel-sky font-display tracking-tight">
                    $5,800.00
                  </div>
                  <div className="mt-2 text-xs text-slate-400">
                    Salary + Freelance Design ✨
                  </div>
                </div>

                {/* Fun & Essentials Outflow */}
                <div className="bg-[#141722] p-5 rounded-2xl border border-white/5 hover:border-pastel-pink/30 transition group">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-semibold uppercase tracking-wider">Total Outflow</span>
                    <span className="p-1.5 rounded-lg bg-pastel-pink/10 text-pastel-pink group-hover:scale-110 transition">
                      <TrendingDown className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="text-3xl font-extrabold text-pastel-pink font-display tracking-tight">
                    $1,980.20
                  </div>
                  <div className="mt-2 text-xs text-pastel-mint font-medium">
                    🎯 $820 under monthly budget ceiling
                  </div>
                </div>
              </div>

              {/* Dynamic View based on Tab */}
              {activeHeroTab === 'all' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    <span>Active Pastel Vaults</span>
                    <span className="text-pastel-yellow font-normal">3 of 5 completed</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Vault 1 */}
                    <div className="bg-[#171B28] p-4 rounded-xl border border-white/5 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-base">✈️</span>
                          <span className="text-sm font-bold text-white">Kyoto & Tokyo Trip</span>
                          <span className="text-[10px] bg-pastel-yellow/20 text-pastel-yellow font-bold px-2 py-0.5 rounded-full">
                            88%
                          </span>
                        </div>
                        <div className="w-48 bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-pastel-yellow h-full rounded-full" style={{ width: '88%' }} />
                        </div>
                      </div>
                      <div className="text-right text-xs">
                        <span className="font-bold text-white">$2,200</span>
                        <span className="text-slate-400"> / $2,500</span>
                      </div>
                    </div>

                    {/* Vault 2 */}
                    <div className="bg-[#171B28] p-4 rounded-xl border border-white/5 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-base">💻</span>
                          <span className="text-sm font-bold text-white">M3 Max Setup</span>
                          <span className="text-[10px] bg-pastel-purple/20 text-pastel-purple font-bold px-2 py-0.5 rounded-full">
                            94%
                          </span>
                        </div>
                        <div className="w-48 bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-pastel-purple h-full rounded-full" style={{ width: '94%' }} />
                        </div>
                      </div>
                      <div className="text-right text-xs">
                        <span className="font-bold text-white">$2,350</span>
                        <span className="text-slate-400"> / $2,500</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeHeroTab === 'vaults' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-[#171B28] p-4 rounded-xl border border-pastel-yellow/30">
                    <span className="text-2xl">🌴</span>
                    <p className="text-sm font-bold text-white mt-1">Summer Retreat</p>
                    <p className="text-xs text-pastel-yellow font-bold mt-2">$1,800 of $2,000</p>
                  </div>
                  <div className="bg-[#171B28] p-4 rounded-xl border border-pastel-mint/30">
                    <span className="text-2xl">🛡️</span>
                    <p className="text-sm font-bold text-white mt-1">Emergency Fund</p>
                    <p className="text-xs text-pastel-mint font-bold mt-2">$10,000 (Completed!)</p>
                  </div>
                  <div className="bg-[#171B28] p-4 rounded-xl border border-pastel-pink/30">
                    <span className="text-2xl">🎨</span>
                    <p className="text-sm font-bold text-white mt-1">Design Studio Gear</p>
                    <p className="text-xs text-pastel-pink font-bold mt-2">$850 of $1,200</p>
                  </div>
                </div>
              )}

              {activeHeroTab === 'spends' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-[#171B28] rounded-xl text-xs">
                    <div className="flex items-center space-x-3">
                      <span className="p-2 bg-pastel-pink/10 text-pastel-pink rounded-lg font-bold">🍣</span>
                      <div>
                        <p className="font-bold text-white">Omakase Dinner</p>
                        <p className="text-slate-400 text-[10px]">Dining • #TreatMyself</p>
                      </div>
                    </div>
                    <span className="font-bold text-pastel-pink">-$112.50</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#171B28] rounded-xl text-xs">
                    <div className="flex items-center space-x-3">
                      <span className="p-2 bg-pastel-sky/10 text-pastel-sky rounded-lg font-bold">⚡</span>
                      <div>
                        <p className="font-bold text-white">Figma Professional</p>
                        <p className="text-slate-400 text-[10px]">Software • #Career</p>
                      </div>
                    </div>
                    <span className="font-bold text-pastel-sky">-$15.00</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE PLAYGROUND / SAVINGS SIMULATOR */}
      <section id="playground" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="glass-panel rounded-3xl border border-white/10 p-6 sm:p-12 relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-pastel-yellow/10 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-80 h-80 bg-pastel-mint/10 rounded-full blur-[90px] pointer-events-none" />

          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-pastel-yellow/10 text-pastel-yellow border border-pastel-yellow/30 text-xs font-semibold mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Interactive FinTrack Calculator</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              See what mindful tracking unlocks for you
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              Drag your income and toggle your lifestyle habits. FinTrack helps you optimize cash flow without giving up the fun stuff.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* Income Slider */}
              <div className="bg-[#141824] p-5 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Estimated Monthly Take-Home
                  </label>
                  <span className="text-xl font-extrabold text-pastel-mint font-display">
                    ${monthlyIncome.toLocaleString()} / mo
                  </span>
                </div>
                <input
                  type="range"
                  min={2000}
                  max={16000}
                  step={250}
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pastel-mint"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-2 font-mono">
                  <span>$2,000/mo</span>
                  <span>$8,000/mo</span>
                  <span>$16,000/mo</span>
                </div>
              </div>

              {/* Habit Toggles */}
              <div className="bg-[#141824] p-5 rounded-2xl border border-white/5 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Fun Spending Tweaks with FinTrack:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    onClick={() => setCutCoffee(!cutCoffee)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      cutCoffee
                        ? 'bg-pastel-pink/15 border-pastel-pink text-white shadow-glow-pink'
                        : 'bg-[#181C2B] border-white/5 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <Coffee className={`h-4 w-4 mb-1.5 ${cutCoffee ? 'text-pastel-pink' : 'text-slate-500'}`} />
                    <p className="text-xs font-bold">Coffee Hacks</p>
                    <p className="text-[11px] opacity-80">Save $160/mo</p>
                  </button>

                  <button
                    onClick={() => setCutTakeout(!cutTakeout)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      cutTakeout
                        ? 'bg-pastel-yellow/15 border-pastel-yellow text-white shadow-glow-yellow'
                        : 'bg-[#181C2B] border-white/5 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <ShoppingBag className={`h-4 w-4 mb-1.5 ${cutTakeout ? 'text-pastel-yellow' : 'text-slate-500'}`} />
                    <p className="text-xs font-bold">Takeout Audit</p>
                    <p className="text-[11px] opacity-80">Save $280/mo</p>
                  </button>

                  <button
                    onClick={() => setCutImpulse(!cutImpulse)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      cutImpulse
                        ? 'bg-pastel-mint/15 border-pastel-mint text-white shadow-glow-mint'
                        : 'bg-[#181C2B] border-white/5 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <Zap className={`h-4 w-4 mb-1.5 ${cutImpulse ? 'text-pastel-mint' : 'text-slate-500'}`} />
                    <p className="text-xs font-bold">24hr Rule</p>
                    <p className="text-[11px] opacity-80">Save $220/mo</p>
                  </button>
                </div>
              </div>
            </div>

            {/* Results Display */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#181D2D] to-[#121522] p-6 sm:p-8 rounded-3xl border border-white/10 text-center relative shadow-xl">
              <span className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">
                Projected 1-Year Wealth Growth
              </span>

              <div className="my-4 text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pastel-mint via-pastel-yellow to-pastel-pink font-display tracking-tight">
                ${projectedYearlySaved.toLocaleString()}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                That’s enough to fund a luxury holiday in Kyoto, invest in a growth index fund, and keep a calm 6-month buffer.
              </p>

              <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400">Monthly optimized surplus:</span>
                <span className="font-bold text-pastel-mint">+${Math.round(projectedYearlySaved / 12).toLocaleString()}/mo</span>
              </div>

              <button
                onClick={() => onNavigate('register')}
                className="mt-6 w-full py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-pastel-mint transition shadow-lg flex items-center justify-center space-x-2"
              >
                <span>Lock In This Plan</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CHIC BENTO FEATURES GRID */}
      <section id="features" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-pastel-purple/10 text-pastel-purple border border-pastel-purple/30 text-xs font-semibold mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Chic Feature Set</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-display">
            Built for modern aesthetic spenders
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            Everything you need to master your personal economy with zero friction and maximum visual delight.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((card, idx) => {
            const Icon = card.icon
            return (
              <div
                key={idx}
                className={`glass-panel p-6 sm:p-7 rounded-3xl border border-white/5 ${card.borderColor} transition-all duration-300 hover:-translate-y-1.5 ${card.bgGlow} group`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${card.badgeBg} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                    {card.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white font-display mb-2 group-hover:text-pastel-mint transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                  {card.description}
                </p>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-medium text-slate-300">
                  <span className="font-mono text-[11px] text-slate-400">{card.sample}</span>
                  <ArrowUpRight className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* HOW IT WORKS (3 SIMPLE STEPS) */}
      <section id="how-it-works" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-pastel-mint font-bold">
            Simplicity by Design
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display mt-2">
            Up and running in 60 seconds
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div className="bg-[#121623] p-7 rounded-3xl border border-white/10 relative">
            <div className="h-10 w-10 rounded-2xl bg-pastel-mint/10 border border-pastel-mint/30 text-pastel-mint font-mono font-bold text-base flex items-center justify-center mb-5">
              01
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-display">Create Your Account</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Sign up via email or 1-click Google Auth. No banking credentials required to get started.
            </p>
          </div>

          <div className="bg-[#121623] p-7 rounded-3xl border border-white/10 relative">
            <div className="h-10 w-10 rounded-2xl bg-pastel-yellow/10 border border-pastel-yellow/30 text-pastel-yellow font-mono font-bold text-base flex items-center justify-center mb-5">
              02
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-display">Set Fun Goal Vaults</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Define what you’re saving for (trips, gear, emergency cushion) and watch progress rings fill up.
            </p>
          </div>

          <div className="bg-[#121623] p-7 rounded-3xl border border-white/10 relative">
            <div className="h-10 w-10 rounded-2xl bg-pastel-pink/10 border border-pastel-pink/30 text-pastel-pink font-mono font-bold text-base flex items-center justify-center mb-5">
              03
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-display">Log & Watch It Grow</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Fast-log expenses with vibe tags. See predictive forecasts keep your balance stress-free.
            </p>
          </div>
        </div>
      </section>

      {/* COMMUNITY VIBES & TESTIMONIALS MARQUEE */}
      <section id="vibes" className="py-20 overflow-hidden border-t border-b border-white/5 bg-[#08090D]">
        <div className="max-w-7xl mx-auto px-4 text-center mb-10">
          <p className="text-xs font-mono uppercase tracking-widest text-pastel-purple font-bold">
            Vibe Check Passed
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
            Loved by smart spenders & creatives
          </h2>
        </div>

        {/* Marquee Ticker */}
        <div className="flex space-x-5 overflow-x-auto no-scrollbar py-4 px-4 sm:px-8">
          {marqueeTestimonials.map((t, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-80 bg-[#121522] border border-white/10 p-5 rounded-2xl hover:border-white/20 transition-all"
            >
              <div className="flex items-center space-x-2.5 mb-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-white/10 to-white/30 flex items-center justify-center font-bold text-xs text-white">
                  {t.name[0]}
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-white">{t.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{t.handle}</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">"{t.quote}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CALL TO ACTION (CTA) */}
      <section className="py-24 px-4 sm:px-8 max-w-5xl mx-auto text-center">
        <div className="rounded-3xl p-8 sm:p-14 bg-gradient-to-b from-[#171B2B] to-[#0D101A] border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-pastel-mint/15 rounded-full blur-[100px] pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-display tracking-tight relative z-10">
            Ready to upgrade your financial aesthetic?
          </h2>
          <p className="mt-4 text-slate-300 max-w-xl mx-auto text-sm sm:text-base relative z-10">
            Join thousands of modern earners tracking millions in wealth with clean simplicity and zero spreadsheet anxiety.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
            <button
              onClick={() => onNavigate('register')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-pastel-mint text-slate-950 font-extrabold text-sm sm:text-base hover:bg-pastel-mint/90 hover:shadow-glow-mint transition-all duration-200"
            >
              Claim Free Account Now
            </button>
            <button
              onClick={() => onNavigate('login')}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm border border-white/10 transition-all duration-200"
            >
              Sign In to Existing Vault
            </button>
          </div>
        </div>
      </section>

      {/* MINIMAL CHIC FOOTER */}
      <footer className="border-t border-white/5 py-10 px-4 sm:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-tr from-pastel-mint to-pastel-sky p-[1px]">
              <div className="w-full h-full bg-black rounded-[7px] flex items-center justify-center">
                <Landmark className="h-3 w-3 text-pastel-mint" />
              </div>
            </div>
            <span className="font-bold text-slate-300 font-display">FinTrack</span>
            <span>— Minimal Chic Personal Finance</span>
          </div>

          <div className="flex items-center space-x-6 text-slate-400">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#playground" className="hover:text-white transition">Simulator</a>
            <button onClick={() => onNavigate('login')} className="hover:text-white transition">Sign In</button>
            <button onClick={() => onNavigate('register')} className="hover:text-white transition">Register</button>
          </div>

          <div className="text-slate-600 font-mono text-[11px]">
            © {new Date().getFullYear()} FinTrack. Minimal Chic & Colorful.
          </div>
        </div>
      </footer>
    </div>
  )
}

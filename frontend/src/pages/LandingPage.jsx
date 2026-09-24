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
  CheckCircle2,
  ChevronRight,
  ArrowUpRight,
  Sliders,
  DollarSign,
  BarChart3,
  Lock,
  Layers,
  Percent
} from 'lucide-react'

// Indian Rupee formatting helpers
const formatINR = (val) => {
  return Number(val || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const formatINRLarge = (val) => {
  return Number(val || 0).toLocaleString('en-IN')
}

export default function LandingPage({ onNavigate, onDemoMode, isAuthenticated, user }) {
  // Financial Savings Calculator State (Indian Rupees)
  const [calcIncome, setCalcIncome] = useState(75000)
  const [calcExpenses, setCalcExpenses] = useState(42000)

  // Real financial compound calculations
  const monthlySavings = Math.max(0, calcIncome - calcExpenses)
  const savingsRate = calcIncome > 0 ? Math.round((monthlySavings / calcIncome) * 100) : 0
  const annualSavings = monthlySavings * 12

  // 5-Year projection with 7% annual compound growth rate
  const fiveYearProjected = Math.round(
    monthlySavings * ((Math.pow(1 + 0.07 / 12, 60) - 1) / (0.07 / 12))
  )

  const featureCards = [
    {
      title: 'Automated Expense Tracking',
      tag: 'Real-Time Ledger',
      color: 'mint',
      borderColor: 'border-mint-400/30',
      description: 'Log and monitor every transaction across UPI, Net Banking, and cards with immediate balance calculations.',
      icon: Wallet,
      sample: '🛒 UPI, Groceries, Rent & Inflow'
    },
    {
      title: 'Monthly Budget Ceilings',
      tag: 'Overspend Prevention',
      color: 'sky',
      borderColor: 'border-sky-400/30',
      description: 'Define your monthly spending limits in ₹ and track your real-time burn rate to stay under budget.',
      icon: TrendingUp,
      sample: '📊 68% of monthly budget utilized'
    },
    {
      title: 'Dedicated Savings Goals',
      tag: 'Targeted Milestones',
      color: 'yellow',
      borderColor: 'border-yellow-400/30',
      description: 'Isolate funds into target funds for emergency cushions, home down payments, and major life investments.',
      icon: PiggyBank,
      sample: '🎯 Emergency Reserve: ₹2,10,000 saved'
    },
    {
      title: 'Category Analytics',
      tag: 'Visual Clarity',
      color: 'purple',
      borderColor: 'border-purple-400/30',
      description: 'Dynamic breakdown charts reveal exactly where your rupees flow across housing, provisions, and investments.',
      icon: PieChart,
      sample: '📈 Real-time category breakdown'
    }
  ]

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 bg-chic-mesh bg-grid-chic selection:bg-pastel-pink selection:text-black">
      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/5 px-4 sm:px-8 py-3.5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-pastel-mint via-pastel-sky to-pastel-purple p-[1.5px] shadow-glow-mint transition-transform hover:scale-105 duration-300">
              <div className="w-full h-full bg-[#0E1017] rounded-[10px] flex items-center justify-center">
                <Landmark className="h-5 w-5 text-pastel-mint" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-white font-display">
                Fin<span className="text-transparent bg-clip-text bg-gradient-to-r from-pastel-mint to-pastel-sky">Track</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-semibold tracking-wide uppercase bg-white/5 text-pastel-mint border border-pastel-mint/30 rounded-full">
                INR (₹) Ledger
              </span>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-1 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs font-medium text-slate-300">
            <a href="#features" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition">Features</a>
            <a href="#calculator" className="px-3 py-1.5 rounded-full hover:text-pastel-mint hover:bg-white/10 transition">Savings Calculator</a>
            <a href="#how-it-works" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition">How It Works</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {onDemoMode && (
              <button
                onClick={onDemoMode}
                className="hidden lg:flex items-center space-x-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 transition"
                title="Preview app instantly with sample data"
              >
                <Sparkles className="h-3.5 w-3.5 text-pastel-yellow" />
                <span>Instant Demo</span>
              </button>
            )}

            {isAuthenticated ? (
              <button
                onClick={() => onNavigate('home')}
                className="group relative inline-flex items-center justify-center p-0.5 text-xs font-bold rounded-xl overflow-hidden shadow-glow-mint transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="w-full h-full bg-gradient-to-r from-pastel-mint via-pastel-sky to-pastel-pink absolute" />
                <span className="relative px-4 py-2 bg-[#090A0F] group-hover:bg-opacity-90 rounded-[10px] text-white flex items-center space-x-1.5 transition duration-200">
                  <span>Go to Dashboard</span>
                  <ArrowRight className="h-3.5 w-3.5 text-pastel-mint group-hover:translate-x-0.5 transition-transform" />
                </span>
              </button>
            ) : (
              <>
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
                    <span>Get Started</span>
                    <ArrowRight className="h-3.5 w-3.5 text-pastel-mint group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-14 pb-20 px-4 sm:px-8 max-w-7xl mx-auto text-center relative">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-slate-300 mb-6 backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-pastel-mint" />
          <span className="text-slate-400">Intelligent Personal Finance</span>
          <span>•</span>
          <span className="font-semibold text-pastel-mint">Built for Indian Rupee (₹)</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight font-display max-w-4xl mx-auto leading-[1.1]">
          Take complete control of your{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pastel-mint via-pastel-sky to-pastel-purple">
            money & savings.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
          FinTrack gives you absolute clarity over daily expenses, UPI payments, monthly budget limits, and targeted savings goals in Indian Rupees (₹).
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={() => onNavigate(isAuthenticated ? 'home' : 'register')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-pastel-mint to-pastel-sky text-slate-950 font-bold text-sm sm:text-base hover:shadow-glow-mint hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>{isAuthenticated ? 'Open Your Dashboard' : 'Start Tracking Free'}</span>
            <ArrowRight className="h-4 w-4 text-slate-950" />
          </button>

          <a
            href="#calculator"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-semibold text-sm sm:text-base transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Sliders className="h-4 w-4 text-pastel-mint" />
            <span>Savings Calculator</span>
          </a>

          {onDemoMode && (
            <button
              onClick={onDemoMode}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 font-semibold text-sm transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Sparkles className="h-4 w-4 text-pastel-yellow" />
              <span>Explore Demo Mode</span>
            </button>
          )}
        </div>

        {/* Trust Badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-pastel-mint" />
            <span>UPI & Card Tracking</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-pastel-sky" />
            <span>100% Private & Secure</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-pastel-yellow" />
            <span>CSV Spreadsheet Export</span>
          </div>
        </div>

        {/* HERO LIVE DASHBOARD PREVIEW CARD IN INR */}
        <div className="mt-14 max-w-5xl mx-auto relative">
          <div className="glass-panel rounded-3xl border border-white/15 p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 text-left">
              <div>
                <span className="text-[11px] font-mono text-pastel-mint uppercase font-semibold">Active Snapshot</span>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-display mt-0.5">
                  Financial Overview (INR)
                </h3>
              </div>
              <div className="flex items-center space-x-3 text-xs font-mono">
                <span className="px-3 py-1 rounded-full bg-pastel-mint/15 text-pastel-mint border border-pastel-mint/30">
                  Monthly Surplus: +₹68,350.00
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 text-slate-400 border border-white/10">
                  ₹50,000 Budget Target
                </span>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6 text-left">
              <div className="p-4 rounded-2xl bg-[#141826] border border-white/5">
                <p className="text-[10px] font-mono uppercase text-slate-400">Total Net Balance</p>
                <p className="text-xl sm:text-2xl font-bold text-white font-display mt-1">₹4,85,000</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#141826] border border-white/5">
                <p className="text-[10px] font-mono uppercase text-slate-400">Monthly Inflow</p>
                <p className="text-xl sm:text-2xl font-bold text-pastel-sky font-display mt-1">₹1,07,500</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#141826] border border-white/5">
                <p className="text-[10px] font-mono uppercase text-slate-400">Monthly Outflow</p>
                <p className="text-xl sm:text-2xl font-bold text-pastel-pink font-display mt-1">₹39,150</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#141826] border border-white/5">
                <p className="text-[10px] font-mono uppercase text-slate-400">Savings Rate</p>
                <p className="text-xl sm:text-2xl font-bold text-pastel-yellow font-display mt-1">64%</p>
              </div>
            </div>

            {/* Mock Transactions Table in INR */}
            <div className="space-y-2 text-left">
              {[
                { title: 'Monthly Salary Credit', category: 'Salary & Income', amount: '+₹85,000.00', icon: '💼', color: 'text-pastel-mint' },
                { title: 'Apartment Monthly Rent', category: 'Housing & Rent', amount: '-₹24,000.00', icon: '🏠', color: 'text-pastel-pink' },
                { title: 'Nature Basket & Blinkit Provisions', category: 'Groceries', amount: '-₹5,450.00', icon: '🛒', color: 'text-pastel-pink' },
                { title: 'Mutual Fund Dividend Credit', category: 'Investments', amount: '+₹3,400.00', icon: '📈', color: 'text-pastel-mint' }
              ].map((tx, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="text-base">{tx.icon}</span>
                    <div>
                      <p className="font-semibold text-white">{tx.title}</p>
                      <p className="text-[11px] text-slate-400">{tx.category}</p>
                    </div>
                  </div>
                  <span className={`font-mono font-bold ${tx.color}`}>{tx.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section id="features" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-semibold text-pastel-mint uppercase tracking-widest">
            Key Capabilities
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display mt-2">
            Designed for real-world personal finance in India.
          </h2>
          <p className="mt-4 text-slate-400 text-sm sm:text-base">
            Track UPI, Net Banking, credit cards, salary, and investments with effortless clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureCards.map((feat, idx) => {
            const Icon = feat.icon
            return (
              <div
                key={idx}
                className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-5">
                    <Icon className="h-6 w-6 text-pastel-mint" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    {feat.tag}
                  </span>
                  <h3 className="text-lg font-bold text-white font-display mt-1 mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 text-[11px] font-mono text-slate-300">
                  {feat.sample}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* INTERACTIVE SAVINGS & WEALTH CALCULATOR (INDIAN RUPEES) */}
      <section id="calculator" className="py-24 px-4 sm:px-8 max-w-5xl mx-auto">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/15 relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-mono text-pastel-mint uppercase font-semibold">
              Interactive Planning Tool
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-tight mt-1">
              Forecast Your Savings & Wealth in Indian Rupees (₹)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Adjust your monthly income and expenses to project how fast your net savings accumulate with compound growth.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Sliders in INR (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Monthly Income Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300">Monthly Net Income</span>
                  <span className="font-mono font-bold text-pastel-mint text-sm">₹{formatINRLarge(calcIncome)}</span>
                </div>
                <input
                  type="range"
                  min="20000"
                  max="300000"
                  step="5000"
                  value={calcIncome}
                  onChange={(e) => setCalcIncome(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pastel-mint"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>₹20,000</span>
                  <span>₹3,00,000</span>
                </div>
              </div>

              {/* Monthly Expenses Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300">Monthly Total Expenses</span>
                  <span className="font-mono font-bold text-pastel-pink text-sm">₹{formatINRLarge(calcExpenses)}</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="250000"
                  step="5000"
                  value={calcExpenses}
                  onChange={(e) => setCalcExpenses(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pastel-pink"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>₹10,000</span>
                  <span>₹2,50,000</span>
                </div>
              </div>
            </div>

            {/* Calculations Card in INR (5 cols) */}
            <div className="lg:col-span-5 bg-[#121624] p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="border-b border-white/5 pb-3">
                <p className="text-[11px] font-mono uppercase text-slate-400">Monthly Net Surplus</p>
                <p className="text-2xl font-bold font-mono text-pastel-mint mt-0.5">
                  +₹{formatINRLarge(monthlySavings)}/mo
                </p>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">{savingsRate}% Savings Rate</p>
              </div>

              <div className="border-b border-white/5 pb-3">
                <p className="text-[11px] font-mono uppercase text-slate-400">1-Year Direct Savings</p>
                <p className="text-xl font-bold font-mono text-white mt-0.5">
                  ₹{formatINRLarge(annualSavings)}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-mono uppercase text-slate-400">5-Year Growth (@ 7% return)</p>
                <p className="text-2xl font-extrabold font-mono text-pastel-sky mt-0.5">
                  ₹{formatINRLarge(fiveYearProjected)}
                </p>
                <p className="text-[10px] text-slate-500 mt-1 font-mono">Assumes conservative monthly compound index rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-semibold text-pastel-mint uppercase tracking-widest">
            Simple Workflow
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display mt-2">
            Master your finances in three steps.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-8 rounded-3xl border border-white/10 relative">
            <span className="text-3xl font-extrabold text-pastel-mint font-mono">01</span>
            <h3 className="text-lg font-bold text-white font-display mt-4 mb-2">
              Set Your Monthly Budget
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Define your monthly spending limit in ₹ to keep complete visibility over your household and personal outflow.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-white/10 relative">
            <span className="text-3xl font-extrabold text-pastel-sky font-mono">02</span>
            <h3 className="text-lg font-bold text-white font-display mt-4 mb-2">
              Log Income & Expenses
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Quickly record transactions with categorized tags and payment methods (UPI, cards, net banking).
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-white/10 relative">
            <span className="text-3xl font-extrabold text-pastel-yellow font-mono">03</span>
            <h3 className="text-lg font-bold text-white font-display mt-4 mb-2">
              Grow Your Savings Goals
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Stash surplus capital directly into dedicated milestone funds and watch your net worth blossom in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-20 px-4 sm:px-8 max-w-5xl mx-auto text-center">
        <div className="rounded-3xl p-8 sm:p-14 bg-gradient-to-b from-[#171B2B] to-[#0D101A] border border-white/10 shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-display tracking-tight relative z-10">
            Ready to upgrade your financial tracking?
          </h2>
          <p className="mt-4 text-slate-300 max-w-xl mx-auto text-sm sm:text-base relative z-10">
            Start tracking your daily expenses, managing your budgets, and crushing your savings goals in Indian Rupees (₹).
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
            <button
              onClick={() => onNavigate(isAuthenticated ? 'home' : 'register')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-pastel-mint text-slate-950 font-extrabold text-sm sm:text-base hover:bg-pastel-mint/90 hover:shadow-glow-mint transition-all duration-200"
            >
              {isAuthenticated ? 'Open Your Dashboard' : 'Create Free Account'}
            </button>
            {!isAuthenticated && (
              <button
                onClick={() => onNavigate('login')}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm border border-white/10 transition-all duration-200"
              >
                Sign In to Existing Account
              </button>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10 px-4 sm:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-tr from-pastel-mint to-pastel-sky p-[1px]">
              <div className="w-full h-full bg-black rounded-[7px] flex items-center justify-center">
                <Landmark className="h-3 w-3 text-pastel-mint" />
              </div>
            </div>
            <span className="font-bold text-slate-300 font-display">FinTrack</span>
            <span>— Personal Finance & Expense Tracker (₹ INR)</span>
          </div>

          <div className="flex items-center space-x-6 text-slate-400">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#calculator" className="hover:text-white transition">Calculator</a>
            <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
            {isAuthenticated ? (
              <button onClick={() => onNavigate('home')} className="hover:text-pastel-mint transition font-semibold">Dashboard</button>
            ) : (
              <>
                <button onClick={() => onNavigate('login')} className="hover:text-white transition">Sign In</button>
                <button onClick={() => onNavigate('register')} className="hover:text-white transition">Register</button>
              </>
            )}
          </div>

          <div className="text-slate-600 font-mono text-[11px]">
            © {new Date().getFullYear()} FinTrack. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import {
  Landmark,
  User,
  Mail,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  Bell,
  Download,
  Trash2,
  Lock,
  ExternalLink,
  Award,
  Flame,
  HelpCircle,
  Sliders,
  Palette,
  Smile,
  LogOut,
  Save,
  Check
} from 'lucide-react'

const AVATAR_OPTIONS = [
  { emoji: '🦊', label: 'Clever Fox', color: 'peach' },
  { emoji: '🌸', label: 'Cherry Blossom', color: 'pink' },
  { emoji: '⚡', label: 'High Voltage', color: 'yellow' },
  { emoji: '🌿', label: 'Green Sprout', color: 'mint' },
  { emoji: '🔮', label: 'Cosmic Crystal', color: 'purple' },
  { emoji: '🥑', label: 'Avo Mindset', color: 'mint' },
  { emoji: '🚀', label: 'Moon Bound', color: 'sky' },
  { emoji: '💅', label: 'Aesthetic Queen', color: 'pink' }
]

const FINANCIAL_ARCHETYPES = [
  { id: 'mindful', name: 'The Mindful Maximalist', emoji: '🌸', desc: 'Values quality experiences over mindless impulse spending.', color: 'pink' },
  { id: 'zen', name: 'The Zen Saver', emoji: '🌿', desc: 'Calm, collected, and consistently stacking financial cushions.', color: 'mint' },
  { id: 'tech', name: 'The Tech Optimizer', emoji: '⚡', desc: 'Loves automations, SaaS subscriptions, and digital assets.', color: 'sky' },
  { id: 'cozy', name: 'The Cozy Connoisseur', emoji: '☕', desc: 'Treats daily matcha, pastry, and vinyl as essential joy.', color: 'yellow' }
]

const UNLOCKED_BADGES = [
  { title: 'Green Thumb Saver', emoji: '🌿', color: 'mint', desc: 'Saved >35% of monthly income' },
  { title: 'Tokyo Vault Stasher', emoji: '🎯', color: 'yellow', desc: 'Over 85% towards trip goal' },
  { title: 'Aesthetic Budgeter', emoji: '✨', color: 'purple', desc: 'Maintained 12-day tracking streak' },
  { title: 'Zero Impulse Hero', emoji: '🛡️', color: 'sky', desc: 'Applied 24hr rule to 5+ online carts' }
]

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'US Dollar ($)' },
  { code: 'EUR', symbol: '€', label: 'Euro (€)' },
  { code: 'GBP', symbol: '£', label: 'British Pound (£)' },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee (₹)' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen (¥)' }
]

export default function ProfilePage({ user, onNavigate, onLogout }) {
  // Load saved profile preferences or defaults
  const [profileData, setProfileData] = useState(() => {
    try {
      const saved = localStorage.getItem('fintrack_profile_prefs')
      if (saved) return JSON.parse(saved)
    } catch {}
    return {
      fullName: user?.full_name || 'Aesthetic Spender',
      email: user?.email || 'hello@fintrack.app',
      avatarEmoji: '🌸',
      archetypeId: 'mindful',
      currency: 'USD',
      monthlyBudgetLimit: 2500,
      targetSavingsRate: 35,
      confettiOnDeposits: true,
      impulseAlerts: true,
      weeklySummary: true,
      soundEffects: false
    }
  })

  const [activeTab, setActiveTab] = useState('profile') // 'profile', 'preferences', 'security'
  const [toastMessage, setToastMessage] = useState('')
  const [isSaved, setIsSaved] = useState(false)

  // Save to localStorage whenever profile changes
  const handleSavePreferences = () => {
    try {
      localStorage.setItem('fintrack_profile_prefs', JSON.stringify(profileData))
      setIsSaved(true)
      showToast('✨ Profile preferences saved!')
      setTimeout(() => setIsSaved(false), 2500)
    } catch {
      showToast('Failed to save preferences locally.')
    }
  }

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3500)
  }

  const currentArchetype = FINANCIAL_ARCHETYPES.find((a) => a.id === profileData.archetypeId) || FINANCIAL_ARCHETYPES[0]

  // Handle export data
  const handleExportData = () => {
    try {
      const txs = localStorage.getItem('fintrack_tx_list') || '[]'
      const vaults = localStorage.getItem('fintrack_vaults') || '[]'
      const exportObject = {
        user: profileData,
        exportedAt: new Date().toISOString(),
        transactions: JSON.parse(txs),
        vaults: JSON.parse(vaults)
      }
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObject, null, 2))
      const downloadAnchor = document.createElement('a')
      downloadAnchor.setAttribute('href', dataStr)
      downloadAnchor.setAttribute('download', `fintrack_backup_${new Date().toISOString().split('T')[0]}.json`)
      document.body.appendChild(downloadAnchor)
      downloadAnchor.click()
      downloadAnchor.remove()
      showToast('📦 Financial data exported as JSON!')
    } catch {
      showToast('Export failed. Please try again.')
    }
  }

  // Handle reset data
  const handleResetData = () => {
    if (window.confirm('Reset all demo transactions and vaults to factory defaults?')) {
      localStorage.removeItem('fintrack_tx_list')
      localStorage.removeItem('fintrack_vaults')
      showToast('🔄 Demo data reset. Returning to dashboard...')
      setTimeout(() => onNavigate('home'), 1000)
    }
  }

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 bg-chic-mesh bg-grid-chic pb-24 relative selection:bg-pastel-pink selection:text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 glass-panel border border-pastel-mint/50 text-white px-4 py-3 rounded-2xl shadow-glow-mint flex items-center space-x-2 animate-float-slow">
          <Sparkles className="h-4 w-4 text-pastel-mint animate-spin" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* TOP DASHBOARD NAVIGATION BAR */}
      <header className="sticky top-0 z-40 glass-panel border-b border-white/5 px-4 sm:px-8 py-3.5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Page Switcher */}
          <div className="flex items-center space-x-4">
            <div
              className="flex items-center space-x-2.5 cursor-pointer group"
              onClick={() => onNavigate('landing')}
              title="Return to Landing Page"
            >
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-pastel-mint via-pastel-sky to-pastel-purple p-[1.5px] shadow-glow-mint group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#0E1017] rounded-[10px] flex items-center justify-center">
                  <Landmark className="h-4 w-4 text-pastel-mint" />
                </div>
              </div>
              <span className="text-lg font-bold tracking-tight text-white font-display">
                Fin<span className="text-transparent bg-clip-text bg-gradient-to-r from-pastel-mint to-pastel-sky">Track</span>
              </span>
            </div>

            {/* Quick Page Tabs */}
            <div className="hidden md:flex items-center space-x-1 bg-white/5 border border-white/10 p-1 rounded-full text-xs font-medium">
              <button
                onClick={() => onNavigate('landing')}
                className="px-3 py-1 rounded-full text-slate-400 hover:text-white transition"
              >
                Landing
              </button>
              <button
                onClick={() => onNavigate('home')}
                className="px-3 py-1 rounded-full text-slate-400 hover:text-white transition flex items-center space-x-1"
              >
                <span>Home Dashboard</span>
              </button>
              <button className="px-3 py-1 rounded-full bg-white/10 text-pastel-purple font-semibold shadow-sm flex items-center space-x-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-pastel-purple animate-pulse" />
                <span>User Profile</span>
              </button>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate('home')}
              className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-xl hover:bg-white/5 transition flex items-center space-x-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Dashboard</span>
            </button>

            <button
              onClick={handleSavePreferences}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-pastel-mint to-pastel-sky text-slate-950 font-bold text-xs shadow-glow-mint hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center space-x-1.5"
            >
              {isSaved ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : <Save className="h-3.5 w-3.5" />}
              <span>{isSaved ? 'Saved!' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* PROFILE PAGE BODY */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* AESTHETIC PROFILE BANNER CARD */}
        <div className="glass-panel rounded-3xl border border-white/10 p-6 sm:p-8 relative overflow-hidden shadow-2xl backdrop-blur-2xl">
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-pastel-purple/15 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-pastel-mint/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative z-10">
            {/* Left: Avatar & Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
              {/* Dynamic Avatar */}
              <div className="relative group">
                <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-pastel-pink via-pastel-purple to-pastel-sky p-[2px] shadow-glow-purple">
                  <div className="w-full h-full bg-[#121524] rounded-[22px] flex items-center justify-center text-4xl group-hover:scale-105 transition-transform duration-200">
                    {profileData.avatarEmoji}
                  </div>
                </div>
                <div className="absolute -bottom-1.5 -right-1.5 h-6 w-6 rounded-full bg-pastel-mint text-slate-950 flex items-center justify-center text-[10px] font-bold border-2 border-[#090A0F]" title="Account Active">
                  ✓
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
                    {profileData.fullName}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-pastel-purple/15 text-pastel-purple border border-pastel-purple/30 text-[10px] font-mono font-bold tracking-wide">
                    ✨ Pro Aesthetic
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mb-3">
                  {profileData.email} • Member since Sep 2026
                </p>

                {/* Financial Archetype Tag */}
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <span>{currentArchetype.emoji}</span>
                  <span className="font-semibold text-white">{currentArchetype.name}</span>
                  <span className="text-slate-500 text-[10px]">•</span>
                  <span className="text-slate-400 text-[11px] hidden sm:inline">{currentArchetype.desc}</span>
                </div>
              </div>
            </div>

            {/* Right: Quick Stats Pill Box */}
            <div className="flex items-center space-x-3 bg-[#121624] p-3 rounded-2xl border border-white/10">
              <div className="px-3 text-center border-r border-white/10">
                <p className="text-[10px] font-mono uppercase text-slate-400">Streak</p>
                <p className="text-base font-bold text-pastel-yellow">🔥 12d</p>
              </div>
              <div className="px-3 text-center border-r border-white/10">
                <p className="text-[10px] font-mono uppercase text-slate-400">Vaults</p>
                <p className="text-base font-bold text-pastel-mint">🎯 4 Active</p>
              </div>
              <div className="px-3 text-center">
                <p className="text-[10px] font-mono uppercase text-slate-400">Currency</p>
                <p className="text-base font-bold text-pastel-sky font-mono">{profileData.currency}</p>
              </div>
            </div>
          </div>

          {/* Avatar Picker Pill Drawer */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-xs font-mono uppercase text-slate-400 font-bold mb-3">
              Choose Your Aesthetic Avatar Emoji:
            </p>
            <div className="flex flex-wrap gap-2">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av.label}
                  type="button"
                  onClick={() => {
                    setProfileData({ ...profileData, avatarEmoji: av.emoji })
                    showToast(`Avatar updated to ${av.emoji}`)
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-sm transition flex items-center space-x-1.5 ${
                    profileData.avatarEmoji === av.emoji
                      ? 'bg-white/20 border-white text-white shadow-sm scale-105'
                      : 'bg-[#141826] border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                  }`}
                  title={av.label}
                >
                  <span className="text-base">{av.emoji}</span>
                  <span className="text-xs font-medium">{av.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION TABS */}
        <div className="flex items-center space-x-2 border-b border-white/10 pb-2 text-xs font-semibold">
          {[
            { id: 'profile', label: 'Financial Archetype & Badges', icon: Award },
            { id: 'preferences', label: 'Targets & Preferences', icon: Sliders },
            { id: 'security', label: 'Data & Security', icon: ShieldCheck }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl transition flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'bg-white/10 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-pastel-mint' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* TAB 1: ARCHETYPE & BADGES */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            {/* Financial Archetypes Selector */}
            <section className="glass-panel p-6 sm:p-7 rounded-3xl border border-white/10 space-y-4">
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  Your Financial Personality Archetype
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Select the archetype that best matches your wealth philosophy. FinTrack tailors notifications and vibe checks to your style.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {FINANCIAL_ARCHETYPES.map((arch) => {
                  const isSelected = profileData.archetypeId === arch.id
                  return (
                    <div
                      key={arch.id}
                      onClick={() => {
                        setProfileData({ ...profileData, archetypeId: arch.id })
                        showToast(`Archetype set to "${arch.name}"`)
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'bg-[#181D2E] border-pastel-mint shadow-glow-mint'
                          : 'bg-[#121524] border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{arch.emoji}</span>
                          <span className="text-sm font-bold text-white">{arch.name}</span>
                        </div>
                        {isSelected && (
                          <span className="text-xs text-pastel-mint font-bold">Active ✓</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {arch.desc}
                      </p>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Gamified Achievement Badges */}
            <section className="glass-panel p-6 sm:p-7 rounded-3xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    Unlocked Aesthetic Badges
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Earned through consistent mindful spending and goal progression.
                  </p>
                </div>
                <span className="text-xs font-mono text-pastel-yellow font-bold bg-pastel-yellow/10 px-2.5 py-1 rounded-full border border-pastel-yellow/20">
                  4 of 8 Unlocked
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
                {UNLOCKED_BADGES.map((badge, idx) => {
                  const badgeColor = {
                    mint: 'border-pastel-mint/30 bg-pastel-mint/5 text-pastel-mint',
                    yellow: 'border-pastel-yellow/30 bg-pastel-yellow/5 text-pastel-yellow',
                    purple: 'border-pastel-purple/30 bg-pastel-purple/5 text-pastel-purple',
                    sky: 'border-pastel-sky/30 bg-pastel-sky/5 text-pastel-sky'
                  }[badge.color]

                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border ${badgeColor} transition-transform hover:-translate-y-1`}
                    >
                      <span className="text-2xl mb-2 block">{badge.emoji}</span>
                      <h4 className="text-xs font-bold text-white mb-1">{badge.title}</h4>
                      <p className="text-[11px] text-slate-400">{badge.desc}</p>
                    </div>
                  )
                })}
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: TARGETS & PREFERENCES */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
              {/* Profile Details Edit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#141826] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-pastel-mint transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                    Primary Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#141826] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-pastel-mint transition"
                  />
                </div>
              </div>

              {/* Currency Selector */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-2">
                  Display Currency
                </label>
                <div className="flex flex-wrap gap-2">
                  {CURRENCIES.map((curr) => (
                    <button
                      key={curr.code}
                      type="button"
                      onClick={() => {
                        setProfileData({ ...profileData, currency: curr.code })
                        showToast(`Currency changed to ${curr.label}`)
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition border ${
                        profileData.currency === curr.code
                          ? 'bg-pastel-mint text-slate-950 border-pastel-mint shadow-glow-mint'
                          : 'bg-[#141826] border-white/10 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      {curr.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monthly Spending Ceiling */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-300">
                    Monthly Spending Ceiling
                  </label>
                  <span className="text-sm font-extrabold text-pastel-pink font-mono">
                    ${profileData.monthlyBudgetLimit.toLocaleString()} / mo
                  </span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={8000}
                  step={100}
                  value={profileData.monthlyBudgetLimit}
                  onChange={(e) => setProfileData({ ...profileData, monthlyBudgetLimit: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pastel-pink"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  FinTrack warns you when total expenses cross 80% of this amount.
                </p>
              </div>

              {/* Target Savings Rate */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-300">
                    Target Savings Rate
                  </label>
                  <span className="text-sm font-extrabold text-pastel-yellow font-mono">
                    {profileData.targetSavingsRate}% of net income
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={70}
                  step={5}
                  value={profileData.targetSavingsRate}
                  onChange={(e) => setProfileData({ ...profileData, targetSavingsRate: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pastel-yellow"
                />
              </div>

              {/* Notification & Vibe Toggles */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <p className="text-xs font-mono uppercase text-slate-400 font-bold mb-2">
                  Notification & Delight Settings:
                </p>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#121524] border border-white/5">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-white">🎉 Payday Celebrations</p>
                    <p className="text-[11px] text-slate-400">Trigger celebratory confetti when salary or income is logged</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profileData.confettiOnDeposits}
                    onChange={(e) => setProfileData({ ...profileData, confettiOnDeposits: e.target.checked })}
                    className="h-4 w-4 accent-pastel-mint cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#121524] border border-white/5">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-white">☕ Mindful Spend Alerts</p>
                    <p className="text-[11px] text-slate-400">Gentle toast notifications if daily takeout surpasses limits</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profileData.impulseAlerts}
                    onChange={(e) => setProfileData({ ...profileData, impulseAlerts: e.target.checked })}
                    className="h-4 w-4 accent-pastel-pink cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#121524] border border-white/5">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-white">📊 Weekly Aesthetic Digest</p>
                    <p className="text-[11px] text-slate-400">Receive chic pastel weekly summaries of your net cashflow</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profileData.weeklySummary}
                    onChange={(e) => setProfileData({ ...profileData, weeklySummary: e.target.checked })}
                    className="h-4 w-4 accent-pastel-purple cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSavePreferences}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-pastel-mint to-pastel-sky text-slate-950 font-bold text-xs shadow-glow-mint hover:scale-[1.01] transition"
                >
                  Save All Preferences
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DATA & SECURITY */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
              {/* Privacy Banner */}
              <div className="bg-[#131725] border border-pastel-mint/30 rounded-2xl p-4 flex items-start space-x-3 text-slate-300">
                <ShieldCheck className="h-5 w-5 text-pastel-mint flex-shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <strong className="text-white">Bank-Grade Privacy:</strong> Your financial data is securely isolated to your user profile. FinTrack never sells, brokers, or monetizes personal spending logs.
                </div>
              </div>

              {/* Data Export & Backup */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-[#121624] border border-white/5 gap-3">
                <div>
                  <h4 className="text-xs font-bold text-white">Export Financial History</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Download a full JSON backup of your transactions, active goal vaults, and profile settings.
                  </p>
                </div>
                <button
                  onClick={handleExportData}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/10 transition flex items-center justify-center space-x-1.5 flex-shrink-0"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Backup (.JSON)</span>
                </button>
              </div>

              {/* Reset Demo Data */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-[#121624] border border-white/5 gap-3">
                <div>
                  <h4 className="text-xs font-bold text-amber-300">Reset Local Demo Records</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Restore the sample transactions and goal vaults back to initial clean state.
                  </p>
                </div>
                <button
                  onClick={handleResetData}
                  className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition flex items-center justify-center space-x-1.5 flex-shrink-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Reset Demo Data</span>
                </button>
              </div>

              {/* Sign Out Section */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Session Management</p>
                  <p className="text-[11px] text-slate-400">Exit current user session</p>
                </div>
                <button
                  onClick={() => {
                    if (onLogout) onLogout()
                    onNavigate('landing')
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition flex items-center space-x-1.5"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

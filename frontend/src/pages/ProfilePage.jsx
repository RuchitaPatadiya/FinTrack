import React, { useState, useEffect } from 'react'
import {
  Landmark,
  User,
  Mail,
  ShieldCheck,
  ArrowLeft,
  DollarSign,
  Download,
  Trash2,
  Lock,
  ExternalLink,
  Sliders,
  LogOut,
  Save,
  Check,
  Bell,
  FileSpreadsheet,
  AlertTriangle,
  CreditCard
} from 'lucide-react'
import { authAPI } from '../services/api'

const CURRENCIES = [
  { code: 'INR', symbol: '₹', label: 'Indian Rupee (₹)' },
  { code: 'USD', symbol: '$', label: 'US Dollar ($)' },
  { code: 'EUR', symbol: '€', label: 'Euro (€)' },
  { code: 'GBP', symbol: '£', label: 'British Pound (£)' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen (¥)' },
  { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar (C$)' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar (A$)' }
]

export default function ProfilePage({ user, onNavigate, onLogout }) {
  // Stored preferences state defaulting to Indian Rupee
  const [profileData, setProfileData] = useState(() => {
    try {
      const saved = localStorage.getItem('fintrack_profile_prefs')
      const base = {
        fullName: user?.full_name || 'Account Holder',
        email: user?.email || 'user@fintrack.app',
        currency: 'INR',
        monthlyBudgetLimit: 50000,
        targetSavingsRate: 35,
        budgetThresholdAlert: 80,
        weeklySummaryEmail: true,
        transactionAlerts: true
      }
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.currency === 'USD') parsed.currency = 'INR'
        if (parsed.monthlyBudgetLimit < 10000) parsed.monthlyBudgetLimit = 50000
        // Always use the live user's name and email from the authenticated session
        return {
          ...parsed,
          fullName: user?.full_name || parsed.fullName || base.fullName,
          email: user?.email || parsed.email || base.email
        }
      }
      return base
    } catch {
      return {
        fullName: user?.full_name || 'Account Holder',
        email: user?.email || 'user@fintrack.app',
        currency: 'INR',
        monthlyBudgetLimit: 50000,
        targetSavingsRate: 35,
        budgetThresholdAlert: 80,
        weeklySummaryEmail: true,
        transactionAlerts: true
      }
    }
  })

  const [activeTab, setActiveTab] = useState('account') // 'account', 'budget', 'data', 'security'
  const [toastMessage, setToastMessage] = useState('')
  const [isSaved, setIsSaved] = useState(false)

  const isRealUser = Boolean(
    user &&
    user.auth_provider !== 'demo' &&
    user.auth_provider !== 'guest' &&
    localStorage.getItem('fintrack_token')
  )

  // Save to localStorage and optionally sync name to backend DB
  const handleSavePreferences = async () => {
    try {
      localStorage.setItem('fintrack_profile_prefs', JSON.stringify(profileData))
      if (isRealUser && profileData.fullName) {
        try {
          await authAPI.updateProfile({ full_name: profileData.fullName.trim() })
          // Update stored user object so header avatar/name reflects new name
          const stored = localStorage.getItem('fintrack_user')
          if (stored) {
            const u = JSON.parse(stored)
            u.full_name = profileData.fullName.trim()
            localStorage.setItem('fintrack_user', JSON.stringify(u))
          }
        } catch (apiErr) {
          console.warn('Profile name sync to DB failed (non-critical):', apiErr)
        }
      }
      setIsSaved(true)
      showToast('Settings & preferences saved successfully!')
      setTimeout(() => setIsSaved(false), 2500)
    } catch {
      showToast('Failed to save preferences.')
    }
  }

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3500)
  }

  // Export JSON backup
  const handleExportJSON = () => {
    try {
      const txs = localStorage.getItem('fintrack_tx_list') || '[]'
      const vaults = localStorage.getItem('fintrack_vaults') || '[]'
      const exportObject = {
        user: profileData,
        exportedAt: new Date().toISOString(),
        transactions: JSON.parse(txs),
        savingsGoals: JSON.parse(vaults)
      }
      const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `fintrack_backup_${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      showToast('Backup JSON downloaded successfully.')
    } catch {
      showToast('Failed to export data.')
    }
  }

  // Export CSV
  const handleExportCSV = () => {
    try {
      const txs = JSON.parse(localStorage.getItem('fintrack_tx_list') || '[]')
      if (txs.length === 0) {
        showToast('No transactions to export. Add some transactions first!')
        return
      }

      const headers = ['ID', 'Date', 'Description', 'Category', 'Type', 'Amount (INR)', 'Payment Method']
      const rows = txs.map((t) => [
        t.id,
        t.date,
        `"${(t.title || '').replace(/"/g, '""')}"`,
        `"${(t.category || '').replace(/"/g, '""')}"`,
        t.type,
        t.amount,
        `"${(t.payment_method || t.paymentMethod || '').replace(/"/g, '""')}"`
      ])

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `fintrack_transactions_${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
      showToast('Transactions CSV exported successfully.')
    } catch {
      showToast('Failed to generate CSV.')
    }
  }

  // Reset to default sample records
  const handleResetData = () => {
    if (window.confirm('Reset all transactions and savings goals back to default sample records?')) {
      localStorage.removeItem('fintrack_tx_list')
      localStorage.removeItem('fintrack_vaults')
      showToast('Sample records restored. Returning to dashboard...')
      setTimeout(() => onNavigate('home'), 1000)
    }
  }

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 bg-chic-mesh bg-grid-chic pb-24 relative selection:bg-pastel-pink selection:text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 glass-panel border border-pastel-mint/50 text-white px-4 py-3 rounded-2xl shadow-glow-mint flex items-center space-x-2 animate-float-slow">
          <Check className="h-4 w-4 text-pastel-mint" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* TOP NAVIGATION BAR (LOGGED-IN: OVERVIEW TAB REMOVED) */}
      <header className="sticky top-0 z-40 glass-panel border-b border-white/5 px-4 sm:px-8 py-3.5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Navigation */}
          <div className="flex items-center space-x-4">
            <div
              className="flex items-center space-x-2.5 cursor-pointer group"
              onClick={() => onNavigate('home')}
              title="FinTrack Dashboard"
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

            {/* Quick Page Tabs (Logged-in: only Dashboard and Profile) */}
            <div className="hidden md:flex items-center space-x-1 bg-white/5 border border-white/10 p-1 rounded-full text-xs font-medium">
              <button
                onClick={() => onNavigate('home')}
                className="px-3.5 py-1 rounded-full text-slate-400 hover:text-white transition"
              >
                Dashboard
              </button>
              <button className="px-3.5 py-1 rounded-full bg-white/10 text-pastel-purple font-semibold shadow-sm flex items-center space-x-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-pastel-purple" />
                <span>Profile & Settings</span>
              </button>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => onNavigate('home')}
              className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-xl hover:bg-white/5 transition flex items-center space-x-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
            </button>

            <button
              onClick={handleSavePreferences}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-pastel-mint to-pastel-sky text-slate-950 font-bold text-xs shadow-glow-mint hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center space-x-1.5"
            >
              {isSaved ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : <Save className="h-3.5 w-3.5" />}
              <span>{isSaved ? 'Saved!' : 'Save Changes'}</span>
            </button>

            <button
              onClick={() => {
                if (onLogout) onLogout()
                onNavigate('landing')
              }}
              className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-semibold transition flex items-center space-x-1.5 shadow-sm active:scale-95"
              title="Sign Out of Session"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* PROFILE BODY */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* ACCOUNT HEADER CARD */}
        <div className="glass-panel rounded-3xl border border-white/10 p-6 sm:p-8 relative overflow-hidden shadow-2xl backdrop-blur-2xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 relative z-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
              {/* User Avatar Circle */}
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-pastel-mint via-pastel-sky to-pastel-purple p-[1.5px] shadow-glow-mint">
                <div className="w-full h-full bg-[#121524] rounded-[14px] flex items-center justify-center text-3xl font-extrabold text-white">
                  {profileData.fullName ? profileData.fullName.charAt(0) : 'U'}
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-white font-display">
                    {profileData.fullName}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-pastel-mint/15 text-pastel-mint border border-pastel-mint/30 text-[10px] font-mono font-bold tracking-wide">
                    INR (₹) Account
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mb-3">
                  {profileData.email} • Personal Ledger
                </p>

                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
                  <ShieldCheck className="h-3.5 w-3.5 text-pastel-mint" />
                  <span>Indian Currency Financial Hub</span>
                </div>
              </div>
            </div>

            {/* Quick Summary Pill Box */}
            <div className="flex items-center space-x-4 bg-[#121624] p-3 rounded-2xl border border-white/10">
              <div className="px-3 text-center border-r border-white/10">
                <p className="text-[10px] font-mono uppercase text-slate-400">Currency</p>
                <p className="text-sm font-bold text-pastel-mint font-mono">₹ INR</p>
              </div>
              <div className="px-3 text-center border-r border-white/10">
                <p className="text-[10px] font-mono uppercase text-slate-400">Budget Limit</p>
                <p className="text-sm font-bold text-white font-mono">₹{Number(profileData.monthlyBudgetLimit).toLocaleString('en-IN')}</p>
              </div>
              <div className="px-3 text-center">
                <p className="text-[10px] font-mono uppercase text-slate-400">Savings Target</p>
                <p className="text-sm font-bold text-pastel-yellow font-mono">{profileData.targetSavingsRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION TABS */}
        <div className="flex items-center space-x-2 border-b border-white/10 pb-2 text-xs font-semibold overflow-x-auto">
          {[
            { id: 'account', label: 'Account Information', icon: User },
            { id: 'budget', label: 'Budget & Financial Targets', icon: Sliders },
            { id: 'data', label: 'Data Management & Export', icon: Download },
            { id: 'security', label: 'Security & Session', icon: ShieldCheck }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl transition flex items-center space-x-2 whitespace-nowrap ${
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

        {/* TAB 1: ACCOUNT DETAILS */}
        {activeTab === 'account' && (
          <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-white/10 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white font-display">Account Profile</h3>
              <p className="text-xs text-slate-400 mt-1">
                Your profile information and contact details associated with FinTrack.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1.5">
                  Full Legal Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#121624] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-pastel-mint"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#121624] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-pastel-mint"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSavePreferences}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pastel-mint to-pastel-sky text-slate-950 font-bold text-xs shadow-glow-mint hover:opacity-95 transition"
              >
                Update Account Information
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: BUDGET & TARGETS */}
        {activeTab === 'budget' && (
          <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-white/10 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white font-display">Financial Settings & Limits</h3>
              <p className="text-xs text-slate-400 mt-1">
                Configure your base currency, monthly spending budget limit, and target savings percentage.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1.5">
                  Base Display Currency
                </label>
                <select
                  value={profileData.currency}
                  onChange={(e) => setProfileData({ ...profileData, currency: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#121624] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-pastel-mint"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1.5">
                  Monthly Budget Ceiling (₹)
                </label>
                <input
                  type="number"
                  step="1000"
                  value={profileData.monthlyBudgetLimit}
                  onChange={(e) => setProfileData({ ...profileData, monthlyBudgetLimit: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 bg-[#121624] border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-pastel-mint"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1.5">
                  Target Savings Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={profileData.targetSavingsRate}
                  onChange={(e) => setProfileData({ ...profileData, targetSavingsRate: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 bg-[#121624] border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-pastel-mint"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSavePreferences}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pastel-mint to-pastel-sky text-slate-950 font-bold text-xs shadow-glow-mint hover:opacity-95 transition"
              >
                Save Budget Configuration
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: DATA MANAGEMENT & EXPORT */}
        {activeTab === 'data' && (
          <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-white/10 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white font-display">Data Management & Exports</h3>
              <p className="text-xs text-slate-400 mt-1">
                Export your Indian Rupee financial records for spreadsheets or local archival.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#121624] border border-white/5 space-y-3">
                <div className="flex items-center space-x-2">
                  <FileSpreadsheet className="h-5 w-5 text-pastel-mint" />
                  <h4 className="text-sm font-bold text-white">Export Transactions (CSV)</h4>
                </div>
                <p className="text-xs text-slate-400">
                  Export all logged INR transactions in CSV format compatible with Excel, Google Sheets, and accounting software.
                </p>
                <button
                  onClick={handleExportCSV}
                  className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition flex items-center justify-center space-x-1.5"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download .CSV Spreadsheet</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#121624] border border-white/5 space-y-3">
                <div className="flex items-center space-x-2">
                  <Download className="h-5 w-5 text-pastel-sky" />
                  <h4 className="text-sm font-bold text-white">Full Account Backup (JSON)</h4>
                </div>
                <p className="text-xs text-slate-400">
                  Export a complete JSON snapshot including all your transactions, savings goals, and profile preferences.
                </p>
                <button
                  onClick={handleExportJSON}
                  className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition flex items-center justify-center space-x-1.5"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download .JSON Backup</span>
                </button>
              </div>
            </div>

            {/* Reset Sample Data */}
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-amber-300">Reset to Sample Records</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Restores standard demo transactions and sample savings goals in INR.
                </p>
              </div>
              <button
                onClick={handleResetData}
                className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition flex items-center space-x-1.5 flex-shrink-0"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Reset Records</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: SECURITY & SESSION */}
        {activeTab === 'security' && (
          <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-white/10 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white font-display">Security & Session</h3>
              <p className="text-xs text-slate-400 mt-1">
                Manage your credentials, password recovery, and active login sessions.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#121624] border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Password & Authentication</h4>
                  <p className="text-xs text-slate-400">Request a secure password reset link sent to your registered email.</p>
                </div>
                <button
                  onClick={() => onNavigate('forgot-password')}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-semibold transition"
                >
                  Reset Password Link
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ALWAYS-VISIBLE SESSION & SIGN OUT CARD */}
        <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-rose-500/20 bg-rose-950/10 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <div className="h-10 w-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center flex-shrink-0">
              <LogOut className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Active Session ({profileData.email})</h4>
              <p className="text-xs text-slate-400 mt-0.5">End your current session and sign out of FinTrack safely.</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (onLogout) onLogout()
              onNavigate('landing')
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition flex items-center justify-center space-x-2 shadow-sm active:scale-95 flex-shrink-0"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out of FinTrack</span>
          </button>
        </div>
      </main>
    </div>
  )
}

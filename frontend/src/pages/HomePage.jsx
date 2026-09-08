import React, { useState, useEffect, useMemo } from 'react'
import {
  Landmark,
  Plus,
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Search,
  Filter,
  Trash2,
  Smile,
  Coffee,
  ShoppingBag,
  Plane,
  Home as HomeIcon,
  Zap,
  CheckCircle2,
  X,
  User,
  ArrowLeft,
  HelpCircle,
  BarChart3,
  Sliders,
  ChevronDown
} from 'lucide-react'

// Default sample transactions with fun mood tags and pastel color tokens
const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-1',
    title: 'Design Client Retainer',
    category: 'Income',
    emoji: '💼',
    amount: 3200.00,
    type: 'income',
    date: '2026-09-06',
    mood: '#CareerGrowth',
    moodColor: 'mint'
  },
  {
    id: 'tx-2',
    title: 'Artisan Matcha Latte & Croissant',
    category: 'Cafe',
    emoji: '🍵',
    amount: 9.50,
    type: 'expense',
    date: '2026-09-05',
    mood: '#DailyHappiness',
    moodColor: 'pink'
  },
  {
    id: 'tx-3',
    title: 'Tokyo Flight Deposit',
    category: 'Travel',
    emoji: '✈️',
    amount: 450.00,
    type: 'expense',
    date: '2026-09-04',
    mood: '#BucketList',
    moodColor: 'yellow'
  },
  {
    id: 'tx-4',
    title: 'Figma Annual Subscription',
    category: 'Tech',
    emoji: '⚡',
    amount: 144.00,
    type: 'expense',
    date: '2026-09-03',
    mood: '#Essential',
    moodColor: 'sky'
  },
  {
    id: 'tx-5',
    title: 'Zara Autumn Trench & Knit',
    category: 'Shopping',
    emoji: '🛍️',
    amount: 189.20,
    type: 'expense',
    date: '2026-09-02',
    mood: '#TreatMyself',
    moodColor: 'purple'
  },
  {
    id: 'tx-6',
    title: 'Late Night Ramen Bar',
    category: 'Dining',
    emoji: '🍜',
    amount: 32.50,
    type: 'expense',
    date: '2026-09-01',
    mood: '#WhyDidIBuyThis',
    moodColor: 'pink'
  },
  {
    id: 'tx-7',
    title: 'Stock Dividend Payout',
    category: 'Investments',
    emoji: '📈',
    amount: 285.00,
    type: 'income',
    date: '2026-08-30',
    mood: '#FutureWealth',
    moodColor: 'mint'
  }
]

const INITIAL_VAULTS = [
  {
    id: 'vault-1',
    name: 'Kyoto & Tokyo Vacation',
    emoji: '✈️',
    target: 2500,
    current: 2200,
    color: 'yellow',
    tag: 'Autumn 2026'
  },
  {
    id: 'vault-2',
    name: 'M3 MacBook Max Setup',
    emoji: '💻',
    target: 2600,
    current: 2050,
    color: 'purple',
    tag: 'Tech Upgrade'
  },
  {
    id: 'vault-3',
    name: 'Peace of Mind Cushion',
    emoji: '🛡️',
    target: 10000,
    current: 8800,
    color: 'mint',
    tag: 'Emergency Fund'
  },
  {
    id: 'vault-4',
    name: 'Lo-Fi Vinyl Collection',
    emoji: '🎵',
    target: 600,
    current: 420,
    color: 'pink',
    tag: 'Hobby & Joy'
  }
]

const CATEGORY_OPTIONS = [
  { label: 'Food & Cafe', emoji: '☕', color: 'pink' },
  { label: 'Dining Out', emoji: '🍜', color: 'peach' },
  { label: 'Shopping & Style', emoji: '🛍️', color: 'purple' },
  { label: 'Tech & Software', emoji: '⚡', color: 'sky' },
  { label: 'Travel & Trips', emoji: '✈️', color: 'yellow' },
  { label: 'Groceries & Home', emoji: '🥑', color: 'mint' },
  { label: 'Salary / Freelance', emoji: '💼', color: 'mint' },
  { label: 'Other Fun Spend', emoji: '✨', color: 'purple' }
]

const MOOD_OPTIONS = [
  { label: '#DailyHappiness', color: 'pink' },
  { label: '#TreatMyself', color: 'purple' },
  { label: '#Essential', color: 'sky' },
  { label: '#BucketList', color: 'yellow' },
  { label: '#CareerGrowth', color: 'mint' },
  { label: '#WhyDidIBuyThis', color: 'peach' }
]

export default function HomePage({ onNavigate, user }) {
  // Load stored transactions or default
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('fintrack_tx_list')
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS
    } catch {
      return INITIAL_TRANSACTIONS
    }
  })

  // Load stored vaults or default
  const [vaults, setVaults] = useState(() => {
    try {
      const saved = localStorage.getItem('fintrack_vaults')
      return saved ? JSON.parse(saved) : INITIAL_VAULTS
    } catch {
      return INITIAL_VAULTS
    }
  })

  // Persist transactions and vaults
  useEffect(() => {
    try {
      localStorage.setItem('fintrack_tx_list', JSON.stringify(transactions))
    } catch {}
  }, [transactions])

  useEffect(() => {
    try {
      localStorage.setItem('fintrack_vaults', JSON.stringify(vaults))
    } catch {}
  }, [vaults])

  // UI state
  const [activeFilter, setActiveFilter] = useState('all') // 'all', 'expense', 'income'
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
  const [isNewVaultModalOpen, setIsNewVaultModalOpen] = useState(false)
  const [selectedVault, setSelectedVault] = useState(null)
  const [depositAmount, setDepositAmount] = useState('50')
  const [toastMessage, setToastMessage] = useState('')

  // New Transaction Form State
  const [txType, setTxType] = useState('expense')
  const [txTitle, setTxTitle] = useState('')
  const [txAmount, setTxAmount] = useState('')
  const [txCategory, setTxCategory] = useState(CATEGORY_OPTIONS[0].label)
  const [txEmoji, setTxEmoji] = useState(CATEGORY_OPTIONS[0].emoji)
  const [txMood, setTxMood] = useState(MOOD_OPTIONS[0].label)
  const [txMoodColor, setTxMoodColor] = useState(MOOD_OPTIONS[0].color)

  // New Vault Form State
  const [newVaultName, setNewVaultName] = useState('')
  const [newVaultTarget, setNewVaultTarget] = useState('')
  const [newVaultEmoji, setNewVaultEmoji] = useState('🌴')
  const [newVaultColor, setNewVaultColor] = useState('yellow')

  // Toast banner trigger helper
  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3500)
  }

  // Aggregate Calculations
  const { totalIncome, totalExpenses, netBalance, savingsRate } = useMemo(() => {
    let inc = 0
    let exp = 0
    transactions.forEach((tx) => {
      if (tx.type === 'income') inc += Number(tx.amount)
      else exp += Number(tx.amount)
    })
    const balance = 21400.00 + (inc - exp) // baseline seed balance
    const rate = inc > 0 ? Math.max(0, Math.round(((inc - exp) / inc) * 100)) : 0
    return {
      totalIncome: inc,
      totalExpenses: exp,
      netBalance: balance,
      savingsRate: rate
    }
  }, [transactions])

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesType = activeFilter === 'all' || tx.type === activeFilter
      const matchesSearch =
        tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tx.mood && tx.mood.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesType && matchesSearch
    })
  }, [transactions, activeFilter, searchQuery])

  // Handle Add Transaction Submit
  const handleAddTransaction = (e) => {
    e.preventDefault()
    const numAmount = parseFloat(txAmount)
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid amount greater than $0')
      return
    }

    const newTx = {
      id: `tx-${Date.now()}`,
      title: txTitle.trim() || (txType === 'income' ? 'Income Payment' : 'Card Spend'),
      category: txCategory,
      emoji: txEmoji,
      amount: numAmount,
      type: txType,
      date: new Date().toISOString().split('T')[0],
      mood: txMood,
      moodColor: txMoodColor
    }

    setTransactions([newTx, ...transactions])
    setIsAddModalOpen(false)
    setTxTitle('')
    setTxAmount('')
    showToast(`✨ Successfully logged ${newTx.type === 'income' ? '+' : '-'}$${numAmount.toFixed(2)} (${newTx.title})`)
  }

  // Handle Vault Deposit
  const handleDepositToVault = (e) => {
    e.preventDefault()
    const dep = parseFloat(depositAmount)
    if (!selectedVault || isNaN(dep) || dep <= 0) return

    setVaults(
      vaults.map((v) =>
        v.id === selectedVault.id ? { ...v, current: Math.min(v.target, v.current + dep) } : v
      )
    )

    // Log as transaction to vault
    const newTx = {
      id: `tx-${Date.now()}`,
      title: `Deposit to ${selectedVault.name}`,
      category: 'Savings',
      emoji: selectedVault.emoji,
      amount: dep,
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
      mood: '#BucketList',
      moodColor: 'yellow'
    }
    setTransactions([newTx, ...transactions])

    setIsDepositModalOpen(false)
    showToast(`🎯 Stashed $${dep} into ${selectedVault.name}!`)
  }

  // Handle Add New Vault
  const handleCreateVault = (e) => {
    e.preventDefault()
    const targetNum = parseFloat(newVaultTarget)
    if (!newVaultName.trim() || isNaN(targetNum) || targetNum <= 0) return

    const newV = {
      id: `vault-${Date.now()}`,
      name: newVaultName.trim(),
      emoji: newVaultEmoji,
      target: targetNum,
      current: 0,
      color: newVaultColor,
      tag: 'New Goal'
    }

    setVaults([...vaults, newV])
    setIsNewVaultModalOpen(false)
    setNewVaultName('')
    setNewVaultTarget('')
    showToast(`🌱 New Vault "${newV.name}" created!`)
  }

  // Delete Transaction
  const handleDeleteTx = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id))
    showToast('Transaction removed.')
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
              <button className="px-3 py-1 rounded-full bg-white/10 text-pastel-mint font-semibold shadow-sm flex items-center space-x-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-pastel-mint animate-pulse" />
                <span>Home Dashboard</span>
              </button>
              <button
                onClick={() => onNavigate('profile')}
                className="px-3 py-1 rounded-full text-slate-400 hover:text-pastel-purple transition flex items-center space-x-1"
              >
                <span>Profile</span>
                <span className="text-[10px] bg-pastel-purple/20 text-pastel-purple px-1.5 rounded-full font-mono">Page 3</span>
              </button>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-3">
            {/* Active Streak Pill */}
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-pastel-yellow/10 border border-pastel-yellow/20 text-pastel-yellow text-xs font-semibold">
              <span>🔥</span>
              <span>12-Day Streak</span>
            </div>

            {/* + Add Transaction Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-pastel-mint to-pastel-sky text-slate-950 font-bold text-xs shadow-glow-mint hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center space-x-1.5"
            >
              <Plus className="h-3.5 w-3.5 stroke-[3]" />
              <span>Add Transaction</span>
            </button>

            {/* User Avatar */}
            <button
              onClick={() => onNavigate('profile')}
              className="h-9 w-9 rounded-xl bg-pastel-purple/20 border border-pastel-purple/30 text-pastel-purple flex items-center justify-center font-bold text-xs uppercase hover:ring-2 hover:ring-pastel-purple/50 transition"
              title="Go to User Profile (Page 3)"
            >
              {user?.full_name ? user.full_name.charAt(0) : 'F'}
            </button>
          </div>
        </div>
      </header>

      {/* DASHBOARD BODY */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-pastel-mint font-semibold uppercase tracking-wider mb-1">
              <span>✨ Live Personal Wealth Hub</span>
              <span>•</span>
              <span className="text-slate-400">September 2026</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
              Hello, {user?.full_name || 'Aesthetic Spender'} 🌿
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsNewVaultModalOpen(true)}
              className="px-3.5 py-2 rounded-xl glass-panel hover:bg-white/10 text-xs font-semibold text-slate-200 border border-white/10 transition flex items-center space-x-1.5"
            >
              <PiggyBank className="h-3.5 w-3.5 text-pastel-yellow" />
              <span>+ New Vault</span>
            </button>
            <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-400 font-mono">
              Balance Isolated 🔒
            </div>
          </div>
        </div>

        {/* METRICS SUMMARY ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Net Balance */}
          <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10 hover:border-pastel-mint/30 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-28 h-28 bg-pastel-mint/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <span className="font-semibold uppercase tracking-wider">Total Net Balance</span>
              <div className="p-2 rounded-xl bg-pastel-mint/10 text-pastel-mint group-hover:scale-110 transition">
                <Wallet className="h-4 w-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
              ${netBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="mt-3 flex items-center space-x-1.5 text-xs text-pastel-mint font-semibold">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+$3,420 vs last month (14.2%)</span>
            </div>
          </div>

          {/* Card 2: Monthly Inflow */}
          <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10 hover:border-pastel-sky/30 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-28 h-28 bg-pastel-sky/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <span className="font-semibold uppercase tracking-wider">Total Income</span>
              <div className="p-2 rounded-xl bg-pastel-sky/10 text-pastel-sky group-hover:scale-110 transition">
                <ArrowDownLeft className="h-4 w-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-pastel-sky font-display tracking-tight">
              ${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="mt-3 text-xs text-slate-400">
              Salary + Dividends + Retainers
            </div>
          </div>

          {/* Card 3: Monthly Expenses */}
          <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10 hover:border-pastel-pink/30 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-28 h-28 bg-pastel-pink/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <span className="font-semibold uppercase tracking-wider">Total Expenses</span>
              <div className="p-2 rounded-xl bg-pastel-pink/10 text-pastel-pink group-hover:scale-110 transition">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-pastel-pink font-display tracking-tight">
              ${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="mt-3 flex items-center space-x-1.5 text-xs text-pastel-mint font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Under $2,500 monthly ceiling</span>
            </div>
          </div>

          {/* Card 4: Savings Rate */}
          <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10 hover:border-pastel-yellow/30 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-28 h-28 bg-pastel-yellow/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <span className="font-semibold uppercase tracking-wider">Savings Rate</span>
              <div className="p-2 rounded-xl bg-pastel-yellow/10 text-pastel-yellow group-hover:scale-110 transition">
                <PiggyBank className="h-4 w-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-pastel-yellow font-display tracking-tight">
              {savingsRate}%
            </div>
            <div className="mt-3 text-xs text-slate-300 flex items-center space-x-1">
              <span>🎯</span>
              <span>Ahead of 35% target</span>
            </div>
          </div>
        </div>

        {/* PASTEL GOAL VAULTS SECTION */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg sm:text-xl font-bold text-white font-display">
                Pastel Goal Vaults
              </h2>
              <span className="text-xs bg-pastel-yellow/10 text-pastel-yellow border border-pastel-yellow/30 px-2 py-0.5 rounded-full font-mono">
                {vaults.length} Active
              </span>
            </div>
            <button
              onClick={() => setIsNewVaultModalOpen(true)}
              className="text-xs text-pastel-yellow hover:underline flex items-center space-x-1"
            >
              <Plus className="h-3 w-3" />
              <span>Create Goal</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {vaults.map((vault) => {
              const pct = Math.min(100, Math.round((vault.current / vault.target) * 100))
              const colorClasses = {
                yellow: { border: 'hover:border-pastel-yellow/40', fill: 'bg-pastel-yellow', text: 'text-pastel-yellow' },
                mint: { border: 'hover:border-pastel-mint/40', fill: 'bg-pastel-mint', text: 'text-pastel-mint' },
                pink: { border: 'hover:border-pastel-pink/40', fill: 'bg-pastel-pink', text: 'text-pastel-pink' },
                purple: { border: 'hover:border-pastel-purple/40', fill: 'bg-pastel-purple', text: 'text-pastel-purple' }
              }[vault.color] || { border: 'hover:border-pastel-yellow/40', fill: 'bg-pastel-yellow', text: 'text-pastel-yellow' }

              return (
                <div
                  key={vault.id}
                  className={`glass-panel p-5 rounded-3xl border border-white/10 ${colorClasses.border} transition-all duration-200 flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{vault.emoji}</span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
                        {vault.tag}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">
                      {vault.name}
                    </h3>
                    <div className="flex items-baseline justify-between text-xs mb-3">
                      <span className={`font-extrabold ${colorClasses.text} text-sm font-mono`}>
                        ${vault.current.toLocaleString()}
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        target ${vault.target.toLocaleString()}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#181D2C] h-2 rounded-full overflow-hidden mb-2">
                      <div
                        className={`${colorClasses.fill} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between mt-2">
                    <span className="text-[11px] font-bold text-slate-300">{pct}% Complete</span>
                    <button
                      onClick={() => {
                        setSelectedVault(vault)
                        setIsDepositModalOpen(true)
                      }}
                      className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-white border border-white/10 transition"
                    >
                      + Stash
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* TWO COLUMN SECTION: ANALYTICS + RECENT TRANSACTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: RECENT TRANSACTIONS FEED (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-bold text-white font-display">
                  Recent Activity
                </h2>
                <span className="text-xs text-slate-400 font-mono">
                  ({filteredTransactions.length} items)
                </span>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center space-x-1.5 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
                {['all', 'expense', 'income'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-3 py-1 rounded-lg capitalize transition font-medium ${
                      activeFilter === f
                        ? 'bg-white/10 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {f === 'all' ? 'All' : f === 'expense' ? 'Expenses 💸' : 'Income 🌿'}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search transactions by merchant, category, or #mood..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#121623] border border-white/10 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pastel-mint transition"
              />
            </div>

            {/* Transactions List */}
            <div className="space-y-2.5">
              {filteredTransactions.length === 0 ? (
                <div className="glass-panel p-8 rounded-3xl border border-white/5 text-center text-slate-400 text-xs">
                  No matching transactions found. Click <strong>+ Add Transaction</strong> to record one!
                </div>
              ) : (
                filteredTransactions.map((tx) => {
                  const isIncome = tx.type === 'income'
                  const moodBadgeColor = {
                    pink: 'bg-pastel-pink/15 text-pastel-pink border-pastel-pink/30',
                    mint: 'bg-pastel-mint/15 text-pastel-mint border-pastel-mint/30',
                    yellow: 'bg-pastel-yellow/15 text-pastel-yellow border-pastel-yellow/30',
                    purple: 'bg-pastel-purple/15 text-pastel-purple border-pastel-purple/30',
                    sky: 'bg-pastel-sky/15 text-pastel-sky border-pastel-sky/30',
                    peach: 'bg-pastel-peach/15 text-pastel-peach border-pastel-peach/30'
                  }[tx.moodColor || 'pink']

                  return (
                    <div
                      key={tx.id}
                      className="glass-panel p-4 rounded-2xl border border-white/5 hover:border-white/15 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className="h-10 w-10 rounded-xl bg-[#171B2A] border border-white/10 flex items-center justify-center text-lg flex-shrink-0">
                          {tx.emoji || (isIncome ? '💸' : '☕')}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-bold text-white group-hover:text-pastel-mint transition">
                              {tx.title}
                            </h4>
                            {tx.mood && (
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${moodBadgeColor}`}>
                                {tx.mood}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {tx.category} • {tx.date}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span
                          className={`font-mono font-extrabold text-sm sm:text-base ${
                            isIncome ? 'text-pastel-mint' : 'text-pastel-pink'
                          }`}
                        >
                          {isIncome ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleDeleteTx(tx.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition p-1"
                          title="Delete transaction"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* RIGHT: SMART INSIGHTS & CASHFLOW WAVE (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* AI Vibe & Forecast Card */}
            <div className="bg-gradient-to-br from-[#171C2E] to-[#121524] p-6 rounded-3xl border border-pastel-purple/30 shadow-glow-purple relative overflow-hidden">
              <div className="flex items-center space-x-2 mb-3 text-pastel-purple text-xs font-semibold">
                <Sparkles className="h-4 w-4" />
                <span>AI Cashflow Vibe Check</span>
              </div>
              <h3 className="text-base font-bold text-white font-display mb-1.5">
                On track for +$1,840 Monthly Surplus ✨
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                You’ve cut down on impulse deliveries by 22% this week! At your current burn rate, your <strong>Tokyo Vacation Vault</strong> will be 100% funded before next Friday.
              </p>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-pastel-mint">
                <span>Healthy Buffer: Safe</span>
                <span>Burn Rate: Calm</span>
              </div>
            </div>

            {/* Category Breakdown (Pastel Rings) */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-white font-display text-sm">Where the Money Flows</span>
                <span className="text-slate-400 font-mono">This Month</span>
              </div>

              {/* Visual Segment Bar */}
              <div className="w-full h-3 rounded-full bg-[#181C2B] overflow-hidden flex">
                <div className="bg-pastel-pink h-full" style={{ width: '42%' }} title="Food & Cafe (42%)" />
                <div className="bg-pastel-purple h-full" style={{ width: '28%' }} title="Shopping & Style (28%)" />
                <div className="bg-pastel-sky h-full" style={{ width: '18%' }} title="Tech & Subscriptions (18%)" />
                <div className="bg-pastel-yellow h-full" style={{ width: '12%' }} title="Travel (12%)" />
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                <div className="flex items-center space-x-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-pastel-pink" />
                  <span className="text-slate-300">Dining & Cafe</span>
                  <span className="text-slate-500 font-mono ml-auto">42%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-pastel-purple" />
                  <span className="text-slate-300">Shopping</span>
                  <span className="text-slate-500 font-mono ml-auto">28%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-pastel-sky" />
                  <span className="text-slate-300">Software & Tech</span>
                  <span className="text-slate-500 font-mono ml-auto">18%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-pastel-yellow" />
                  <span className="text-slate-300">Trips & Goals</span>
                  <span className="text-slate-500 font-mono ml-auto">12%</span>
                </div>
              </div>
            </div>

            {/* Fast Quick-Action Banner */}
            <div className="glass-panel p-5 rounded-3xl border border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-pastel-mint/10 text-pastel-mint">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Need to adjust your monthly target?</p>
                  <p className="text-[11px] text-slate-400">Manage profile and currency settings</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('profile')}
                className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-pastel-mint border border-pastel-mint/30 transition"
              >
                Profile →
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL: ADD TRANSACTION */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full glass-panel rounded-3xl border border-white/15 p-6 shadow-2xl relative overflow-hidden bg-[#0D101A]">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div className="flex items-center space-x-2">
                <span className="text-lg">✨</span>
                <h3 className="text-base font-bold text-white font-display">
                  Record New Transaction
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-4">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 bg-[#141826] p-1 rounded-xl border border-white/5">
                <button
                  type="button"
                  onClick={() => setTxType('expense')}
                  className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1 ${
                    txType === 'expense'
                      ? 'bg-pastel-pink/20 text-pastel-pink border border-pastel-pink/40 shadow-glow-pink'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>💸 Expense</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTxType('income')}
                  className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1 ${
                    txType === 'income'
                      ? 'bg-pastel-mint/20 text-pastel-mint border border-pastel-mint/40 shadow-glow-mint'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🌿 Income</span>
                </button>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-1">
                  Amount ($ USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-base font-bold text-slate-400">$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 bg-[#141826] border border-white/10 rounded-xl text-lg font-bold font-mono text-white placeholder-slate-600 focus:outline-none focus:border-pastel-mint"
                    autoFocus
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-1">
                  Description / Merchant
                </label>
                <input
                  type="text"
                  placeholder="e.g. Blue Bottle Coffee, Spotify, Paycheck"
                  value={txTitle}
                  onChange={(e) => setTxTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#141826] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pastel-mint"
                  required
                />
              </div>

              {/* Category Selector */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                  Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CATEGORY_OPTIONS.map((cat) => (
                    <button
                      key={cat.label}
                      type="button"
                      onClick={() => {
                        setTxCategory(cat.label)
                        setTxEmoji(cat.emoji)
                      }}
                      className={`p-2 rounded-xl border text-left text-xs transition flex items-center space-x-1.5 ${
                        txCategory === cat.label
                          ? 'bg-white/15 border-white text-white font-bold'
                          : 'bg-[#141826] border-white/5 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      <span>{cat.emoji}</span>
                      <span className="truncate">{cat.label.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood Tag Selector */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                  Vibe / Mood Tag (Optional)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {MOOD_OPTIONS.map((m) => (
                    <button
                      key={m.label}
                      type="button"
                      onClick={() => {
                        setTxMood(m.label)
                        setTxMoodColor(m.color)
                      }}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition border ${
                        txMood === m.label
                          ? 'bg-white/20 text-white border-white font-bold'
                          : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-pastel-mint to-pastel-sky text-slate-950 font-bold text-xs shadow-glow-mint hover:opacity-95 transition"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DEPOSIT TO VAULT */}
      {isDepositModalOpen && selectedVault && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-sm w-full glass-panel rounded-3xl border border-pastel-yellow/30 p-6 shadow-glow-yellow relative overflow-hidden bg-[#0D101A]">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-xl">{selectedVault.emoji}</span>
                <h3 className="text-sm font-bold text-white">
                  Stash in {selectedVault.name}
                </h3>
              </div>
              <button
                onClick={() => setIsDepositModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleDepositToVault} className="space-y-4">
              <div className="text-xs text-slate-400">
                Current: <strong className="text-white">${selectedVault.current}</strong> / Target: ${selectedVault.target}
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-1">
                  Deposit Amount ($)
                </label>
                <input
                  type="number"
                  step="10"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#141826] border border-white/10 rounded-xl text-base font-bold font-mono text-white focus:outline-none focus:border-pastel-yellow"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-pastel-yellow text-slate-950 font-bold text-xs hover:bg-yellow-300 transition"
              >
                Confirm Deposit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW VAULT */}
      {isNewVaultModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-sm w-full glass-panel rounded-3xl border border-white/15 p-6 shadow-2xl relative overflow-hidden bg-[#0D101A]">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center space-x-2">
                <span>🎯</span>
                <h3 className="text-sm font-bold text-white">Create New Pastel Vault</h3>
              </div>
              <button
                onClick={() => setIsNewVaultModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateVault} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1">
                  Goal Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Summer Eurotrip, New iPad, Concert"
                  value={newVaultName}
                  onChange={(e) => setNewVaultName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#141826] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-pastel-yellow"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1">
                  Target Amount ($)
                </label>
                <input
                  type="number"
                  placeholder="2000"
                  value={newVaultTarget}
                  onChange={(e) => setNewVaultTarget(e.target.value)}
                  className="w-full px-3 py-2 bg-[#141826] border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-pastel-yellow"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1">
                  Pick Emoji & Color
                </label>
                <div className="flex items-center space-x-2">
                  {['🌴', '✈️', '💻', '🎨', '🎸', '🏠'].map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setNewVaultEmoji(em)}
                      className={`text-lg p-1.5 rounded-lg ${newVaultEmoji === em ? 'bg-white/20' : 'hover:bg-white/5'}`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 mt-2 rounded-xl bg-pastel-yellow text-slate-950 font-bold text-xs hover:bg-yellow-300 transition"
              >
                Create Goal Vault
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

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
  CheckCircle2,
  X,
  User,
  ArrowLeft,
  BarChart3,
  CreditCard,
  AlertTriangle,
  LogOut,
  Target,
  Layers,
  Percent
} from 'lucide-react'

// Indian Rupee formatting helper
export const formatINR = (val) => {
  return Number(val || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

export const formatINRLarge = (val) => {
  return Number(val || 0).toLocaleString('en-IN')
}

// Professional financial categories
export const TRANSACTION_CATEGORIES = [
  { id: 'housing', label: 'Housing & Rent', icon: '🏠', color: 'purple' },
  { id: 'groceries', label: 'Groceries & Provisions', icon: '🛒', color: 'mint' },
  { id: 'dining', label: 'Food & Dining', icon: '🍽️', color: 'peach' },
  { id: 'utilities', label: 'Utilities & Bills', icon: '⚡', color: 'sky' },
  { id: 'transit', label: 'Transportation & Fuel', icon: '🚗', color: 'yellow' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️', color: 'pink' },
  { id: 'entertainment', label: 'Entertainment & Subscriptions', icon: '🎬', color: 'purple' },
  { id: 'health', label: 'Health & Pharmacy', icon: '💊', color: 'mint' },
  { id: 'salary', label: 'Salary & Income', icon: '💼', color: 'mint', isIncome: true },
  { id: 'investment', label: 'Investments & Dividends', icon: '📈', color: 'sky', isIncome: true },
  { id: 'other', label: 'General / Other', icon: '📦', color: 'slate' }
]

export const PAYMENT_METHODS = [
  'UPI (Google Pay / PhonePe / Paytm)',
  'Credit Card',
  'Debit Card',
  'Net Banking',
  'Cash',
  'Brokerage'
]

// Professional initial transactions in Indian Rupees
const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-1',
    title: 'Monthly Salary Deposit',
    category: 'Salary & Income',
    emoji: '💼',
    amount: 85000.00,
    type: 'income',
    date: '2026-09-01',
    paymentMethod: 'Net Banking'
  },
  {
    id: 'tx-2',
    title: 'Apartment Monthly Rent',
    category: 'Housing & Rent',
    emoji: '🏠',
    amount: 24000.00,
    type: 'expense',
    date: '2026-09-02',
    paymentMethod: 'Net Banking'
  },
  {
    id: 'tx-3',
    title: 'Blinkit & Nature Basket Groceries',
    category: 'Groceries & Provisions',
    emoji: '🛒',
    amount: 5450.00,
    type: 'expense',
    date: '2026-09-03',
    paymentMethod: 'UPI (Google Pay / PhonePe / Paytm)'
  },
  {
    id: 'tx-4',
    title: 'Freelance Consultation Retainer',
    category: 'Salary & Income',
    emoji: '💼',
    amount: 22500.00,
    type: 'income',
    date: '2026-09-04',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 'tx-5',
    title: 'Electricity & Broadband Bill',
    category: 'Utilities & Bills',
    emoji: '⚡',
    amount: 2850.00,
    type: 'expense',
    date: '2026-09-04',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'tx-6',
    title: 'Weekend Dining & Family Lunch',
    category: 'Food & Dining',
    emoji: '🍽️',
    amount: 2650.00,
    type: 'expense',
    date: '2026-09-05',
    paymentMethod: 'UPI (Google Pay / PhonePe / Paytm)'
  },
  {
    id: 'tx-7',
    title: 'Metro Smart Card & Fuel Refill',
    category: 'Transportation & Fuel',
    emoji: '🚗',
    amount: 2200.00,
    type: 'expense',
    date: '2026-09-05',
    paymentMethod: 'UPI (Google Pay / PhonePe / Paytm)'
  },
  {
    id: 'tx-8',
    title: 'Nifty 50 Index Mutual Fund Dividend',
    category: 'Investments & Dividends',
    emoji: '📈',
    amount: 3400.00,
    type: 'income',
    date: '2026-09-06',
    paymentMethod: 'Brokerage'
  }
]

// Professional initial savings goals in Indian Rupees
const INITIAL_SAVINGS_GOALS = [
  {
    id: 'goal-1',
    name: 'Emergency Fund (6 Months)',
    emoji: '🛡️',
    target: 300000,
    current: 210000,
    color: 'mint',
    deadline: 'Dec 2026'
  },
  {
    id: 'goal-2',
    name: 'Home Down Payment Fund',
    emoji: '🏠',
    target: 1500000,
    current: 850000,
    color: 'sky',
    deadline: 'Dec 2027'
  },
  {
    id: 'goal-3',
    name: 'Annual Vacation & Travel',
    emoji: '✈️',
    target: 80000,
    current: 55000,
    color: 'yellow',
    deadline: 'Nov 2026'
  },
  {
    id: 'goal-4',
    name: 'Mutual Fund SIP Booster',
    emoji: '📈',
    target: 500000,
    current: 320000,
    color: 'purple',
    deadline: 'Ongoing'
  }
]

export default function HomePage({ onNavigate, user, onLogout }) {
  // Load stored transactions or default
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('fintrack_tx_list')
      if (saved) {
        const parsed = JSON.parse(saved)
        // Upgrade legacy USD dummy seed records to INR records
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].id === 'tx-1' && parsed[0].amount < 10000) {
          localStorage.setItem('fintrack_tx_list', JSON.stringify(INITIAL_TRANSACTIONS))
          return INITIAL_TRANSACTIONS
        }
        return parsed
      }
      return INITIAL_TRANSACTIONS
    } catch {
      return INITIAL_TRANSACTIONS
    }
  })

  // Load stored savings goals or default
  const [savingsGoals, setSavingsGoals] = useState(() => {
    try {
      const saved = localStorage.getItem('fintrack_vaults')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0 && (parsed[0].target < 50000 || parsed[0].id === 'vault-1')) {
          localStorage.setItem('fintrack_vaults', JSON.stringify(INITIAL_SAVINGS_GOALS))
          return INITIAL_SAVINGS_GOALS
        }
        return parsed
      }
      return INITIAL_SAVINGS_GOALS
    } catch {
      return INITIAL_SAVINGS_GOALS
    }
  })

  // Budget settings from profile or default INR 50,000
  const [budgetLimit, setBudgetLimit] = useState(() => {
    try {
      const savedPrefs = localStorage.getItem('fintrack_profile_prefs')
      if (savedPrefs) {
        const parsed = JSON.parse(savedPrefs)
        if (parsed.monthlyBudgetLimit < 10000) return 50000
        return parsed.monthlyBudgetLimit || 50000
      }
      return 50000
    } catch {
      return 50000
    }
  })

  // Default currency is Indian Rupee ₹
  const currencySymbol = '₹'

  // Persist state
  useEffect(() => {
    try {
      localStorage.setItem('fintrack_tx_list', JSON.stringify(transactions))
    } catch {}
  }, [transactions])

  useEffect(() => {
    try {
      localStorage.setItem('fintrack_vaults', JSON.stringify(savingsGoals))
    } catch {}
  }, [savingsGoals])

  // UI state
  const [activeFilter, setActiveFilter] = useState('all') // 'all', 'expense', 'income'
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState(null)
  const [depositAmount, setDepositAmount] = useState('5000')
  const [toastMessage, setToastMessage] = useState('')

  // New Transaction Form State
  const [txType, setTxType] = useState('expense')
  const [txTitle, setTxTitle] = useState('')
  const [txAmount, setTxAmount] = useState('')
  const [txCategory, setTxCategory] = useState(TRANSACTION_CATEGORIES[0].label)
  const [txEmoji, setTxEmoji] = useState(TRANSACTION_CATEGORIES[0].icon)
  const [txPaymentMethod, setTxPaymentMethod] = useState(PAYMENT_METHODS[0])
  const [txDate, setTxDate] = useState(() => new Date().toISOString().split('T')[0])

  // New Goal Form State
  const [newGoalName, setNewGoalName] = useState('')
  const [newGoalTarget, setNewGoalTarget] = useState('')
  const [newGoalInitial, setNewGoalInitial] = useState('')
  const [newGoalDeadline, setNewGoalDeadline] = useState('')
  const [newGoalEmoji, setNewGoalEmoji] = useState('🎯')
  const [newGoalColor, setNewGoalColor] = useState('mint')

  // Toast trigger
  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3000)
  }

  // Aggregate Financial Calculations in INR
  const { totalIncome, totalExpenses, netBalance, netSavings, savingsRate } = useMemo(() => {
    let inc = 0
    let exp = 0
    transactions.forEach((tx) => {
      const amt = Number(tx.amount) || 0
      if (tx.type === 'income') inc += amt
      else exp += amt
    })
    const baseBalance = 250000.00
    const calculatedBalance = baseBalance + (inc - exp)
    const savings = inc - exp
    const rate = inc > 0 ? Math.max(0, Math.round((savings / inc) * 100)) : 0

    return {
      totalIncome: inc,
      totalExpenses: exp,
      netBalance: calculatedBalance,
      netSavings: savings,
      savingsRate: rate
    }
  }, [transactions])

  // Dynamic Category Breakdown from actual expenses
  const categoryBreakdown = useMemo(() => {
    const expenseMap = {}
    let totalExp = 0

    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const amt = Number(t.amount) || 0
        totalExp += amt
        const cat = t.category || 'General / Other'
        expenseMap[cat] = (expenseMap[cat] || 0) + amt
      })

    if (totalExp === 0) return []

    return Object.entries(expenseMap)
      .map(([category, amount]) => {
        const pct = Math.round((amount / totalExp) * 100)
        const catObj = TRANSACTION_CATEGORIES.find((c) => c.label === category)
        return {
          category,
          amount,
          percentage: pct,
          color: catObj?.color || 'slate',
          icon: catObj?.icon || '📦'
        }
      })
      .sort((a, b) => b.amount - a.amount)
  }, [transactions])

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesType = activeFilter === 'all' || tx.type === activeFilter
      const matchesCategory =
        selectedCategoryFilter === 'all' || tx.category === selectedCategoryFilter
      const matchesSearch =
        tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tx.paymentMethod && tx.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesType && matchesCategory && matchesSearch
    })
  }, [transactions, activeFilter, selectedCategoryFilter, searchQuery])

  // Handle Add Transaction Submit
  const handleAddTransaction = (e) => {
    e.preventDefault()
    const numAmount = parseFloat(txAmount)
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid amount greater than ₹0')
      return
    }

    const newTx = {
      id: `tx-${Date.now()}`,
      title: txTitle.trim() || (txType === 'income' ? 'Income Deposit' : 'Expense Payment'),
      category: txCategory,
      emoji: txEmoji,
      amount: numAmount,
      type: txType,
      date: txDate || new Date().toISOString().split('T')[0],
      paymentMethod: txPaymentMethod
    }

    setTransactions([newTx, ...transactions])
    setIsAddModalOpen(false)
    setTxTitle('')
    setTxAmount('')
    showToast(`Logged ${newTx.type === 'income' ? '+' : '-'}${currencySymbol}${formatINR(numAmount)} (${newTx.title})`)
  }

  // Handle Goal Deposit
  const handleDepositToGoal = (e) => {
    e.preventDefault()
    const dep = parseFloat(depositAmount)
    if (!selectedGoal || isNaN(dep) || dep <= 0) return

    setSavingsGoals(
      savingsGoals.map((g) => {
        if (g.id === selectedGoal.id) {
          return { ...g, current: Number(g.current) + dep }
        }
        return g
      })
    )

    // Also record as a savings transfer expense
    const savingsTx = {
      id: `tx-${Date.now()}`,
      title: `Transfer to ${selectedGoal.name}`,
      category: 'Investments & Dividends',
      emoji: selectedGoal.emoji || '🎯',
      amount: dep,
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Bank Transfer'
    }
    setTransactions([savingsTx, ...transactions])

    setIsDepositModalOpen(false)
    setDepositAmount('5000')
    showToast(`Deposited ${currencySymbol}${formatINR(dep)} to ${selectedGoal.name}`)
  }

  // Handle Create New Goal
  const handleCreateGoal = (e) => {
    e.preventDefault()
    const target = parseFloat(newGoalTarget)
    const initial = parseFloat(newGoalInitial) || 0

    if (!newGoalName.trim() || isNaN(target) || target <= 0) {
      alert('Please enter a valid goal name and target amount')
      return
    }

    const created = {
      id: `goal-${Date.now()}`,
      name: newGoalName.trim(),
      emoji: newGoalEmoji,
      target: target,
      current: initial,
      color: newGoalColor,
      deadline: newGoalDeadline.trim() || 'Flexible'
    }

    setSavingsGoals([...savingsGoals, created])
    setIsNewGoalModalOpen(false)
    setNewGoalName('')
    setNewGoalTarget('')
    setNewGoalInitial('')
    setNewGoalDeadline('')
    showToast(`Created savings goal: "${created.name}"`)
  }

  // Delete transaction
  const handleDeleteTx = (id) => {
    if (window.confirm('Delete this transaction record?')) {
      setTransactions(transactions.filter((t) => t.id !== id))
      showToast('Transaction removed')
    }
  }

  // Budget calculations
  const budgetSpentPct = budgetLimit > 0 ? Math.min(100, Math.round((totalExpenses / budgetLimit) * 100)) : 0
  const budgetRemaining = Math.max(0, budgetLimit - totalExpenses)

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 bg-chic-mesh bg-grid-chic pb-24 relative selection:bg-pastel-pink selection:text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 glass-panel border border-pastel-mint/50 text-white px-4 py-3 rounded-2xl shadow-glow-mint flex items-center space-x-2 animate-float-slow">
          <Sparkles className="h-4 w-4 text-pastel-mint" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* TOP DASHBOARD NAVIGATION BAR (LOGGED-IN: NO OVERVIEW DEMO SECTION) */}
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

            {/* Logged-In Navigation Tabs: Only Dashboard and Profile (Overview removed) */}
            <div className="hidden md:flex items-center space-x-1 bg-white/5 border border-white/10 p-1 rounded-full text-xs font-medium">
              <button className="px-3.5 py-1 rounded-full bg-white/10 text-pastel-mint font-semibold shadow-sm flex items-center space-x-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-pastel-mint" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => onNavigate('profile')}
                className="px-3.5 py-1 rounded-full text-slate-400 hover:text-white transition flex items-center space-x-1"
              >
                <span>Profile & Settings</span>
              </button>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* + Add Transaction Button */}
            <button
              onClick={() => {
                setTxType('expense')
                setTxCategory(TRANSACTION_CATEGORIES[0].label)
                setTxEmoji(TRANSACTION_CATEGORIES[0].icon)
                setIsAddModalOpen(true)
              }}
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-pastel-mint to-pastel-sky text-slate-950 font-bold text-xs shadow-glow-mint hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center space-x-1.5"
            >
              <Plus className="h-3.5 w-3.5 stroke-[3]" />
              <span>Add Transaction</span>
            </button>

            {/* User Profile Avatar */}
            <button
              onClick={() => onNavigate('profile')}
              className="h-9 w-9 rounded-xl bg-pastel-purple/20 border border-pastel-purple/30 text-pastel-purple flex items-center justify-center font-bold text-xs uppercase hover:ring-2 hover:ring-pastel-purple/50 transition"
              title="Go to User Profile & Settings"
            >
              {user?.full_name ? user.full_name.charAt(0) : 'U'}
            </button>

            {/* Sign Out Button */}
            {onLogout && (
              <button
                onClick={() => {
                  onLogout()
                  onNavigate('landing')
                }}
                className="h-9 px-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 flex items-center space-x-1 text-xs font-semibold transition active:scale-95"
                title="Sign Out of Session"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* DASHBOARD BODY */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-pastel-mint font-semibold uppercase tracking-wider mb-1">
              <span>Financial Dashboard</span>
              <span>•</span>
              <span className="text-slate-400">INR (₹) Ledger</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
              Welcome back, {user?.full_name || 'Account Holder'}
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsNewGoalModalOpen(true)}
              className="px-3.5 py-2 rounded-xl glass-panel hover:bg-white/10 text-xs font-semibold text-slate-200 border border-white/10 transition flex items-center space-x-1.5"
            >
              <Target className="h-3.5 w-3.5 text-pastel-yellow" />
              <span>+ New Savings Goal</span>
            </button>
          </div>
        </div>

        {/* METRICS SUMMARY ROW (INDIAN RUPEES) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Net Balance */}
          <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10 hover:border-pastel-mint/30 transition-all duration-300 relative overflow-hidden group">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <span className="font-semibold uppercase tracking-wider">Total Net Balance</span>
              <div className="p-2 rounded-xl bg-pastel-mint/10 text-pastel-mint">
                <Wallet className="h-4 w-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white font-display tracking-tight">
              {currencySymbol}{formatINR(netBalance)}
            </div>
            <div className="mt-3 flex items-center space-x-1.5 text-xs text-slate-400">
              <span>Total Available Liquid Funds</span>
            </div>
          </div>

          {/* Card 2: Total Monthly Income */}
          <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10 hover:border-pastel-sky/30 transition-all duration-300 relative overflow-hidden group">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <span className="font-semibold uppercase tracking-wider">Monthly Income</span>
              <div className="p-2 rounded-xl bg-pastel-sky/10 text-pastel-sky">
                <ArrowDownLeft className="h-4 w-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-pastel-sky font-display tracking-tight">
              {currencySymbol}{formatINR(totalIncome)}
            </div>
            <div className="mt-3 flex items-center space-x-1.5 text-xs text-pastel-mint font-medium">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>{transactions.filter((t) => t.type === 'income').length} deposits credited</span>
            </div>
          </div>

          {/* Card 3: Total Expenses */}
          <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10 hover:border-pastel-pink/30 transition-all duration-300 relative overflow-hidden group">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <span className="font-semibold uppercase tracking-wider">Monthly Expenses</span>
              <div className="p-2 rounded-xl bg-pastel-pink/10 text-pastel-pink">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-pastel-pink font-display tracking-tight">
              {currencySymbol}{formatINR(totalExpenses)}
            </div>
            <div className="mt-3 text-xs text-slate-400">
              {transactions.filter((t) => t.type === 'expense').length} debits recorded this cycle
            </div>
          </div>

          {/* Card 4: Net Savings & Rate */}
          <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10 hover:border-pastel-yellow/30 transition-all duration-300 relative overflow-hidden group">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <span className="font-semibold uppercase tracking-wider">Monthly Net Savings</span>
              <div className="p-2 rounded-xl bg-pastel-yellow/10 text-pastel-yellow">
                <PiggyBank className="h-4 w-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-pastel-yellow font-display tracking-tight">
              {currencySymbol}{formatINR(netSavings)}
            </div>
            <div className="mt-3 flex items-center space-x-1 text-xs text-slate-300">
              <Percent className="h-3.5 w-3.5 text-pastel-yellow" />
              <span>{savingsRate}% Savings Rate</span>
            </div>
          </div>
        </div>

        {/* MONTHLY BUDGET PROGRESS BAR */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-2">
                <span>Monthly Spending Budget</span>
                {budgetSpentPct >= 90 && (
                  <span className="inline-flex items-center space-x-1 text-xs text-rose-400 font-semibold bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Near Ceiling</span>
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {currencySymbol}{formatINR(totalExpenses)} spent of {currencySymbol}{formatINR(budgetLimit)} monthly budget limit
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-slate-400">Remaining Buffer: </span>
              <span className="text-sm font-bold font-mono text-pastel-mint">
                {currencySymbol}{formatINR(budgetRemaining)}
              </span>
            </div>
          </div>

          <div className="w-full h-3 rounded-full bg-white/5 border border-white/10 overflow-hidden relative">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                budgetSpentPct > 90 ? 'bg-rose-500' : budgetSpentPct > 75 ? 'bg-pastel-yellow' : 'bg-pastel-mint'
              }`}
              style={{ width: `${budgetSpentPct}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>0%</span>
            <span>{budgetSpentPct}% Utilized</span>
            <span>100% ({currencySymbol}{formatINRLarge(budgetLimit)})</span>
          </div>
        </div>

        {/* SAVINGS GOALS SECTION */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg sm:text-xl font-bold text-white font-display">
                Savings Goals
              </h2>
              <span className="text-xs bg-pastel-mint/10 text-pastel-mint border border-pastel-mint/30 px-2 py-0.5 rounded-full font-mono">
                {savingsGoals.length} Active Goals
              </span>
            </div>
            <button
              onClick={() => setIsNewGoalModalOpen(true)}
              className="text-xs text-pastel-mint hover:underline flex items-center space-x-1 font-semibold"
            >
              <Plus className="h-3 w-3" />
              <span>New Goal</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {savingsGoals.map((goal) => {
              const pct = Math.min(100, Math.round((goal.current / goal.target) * 100))
              const colorClasses = {
                mint: { border: 'hover:border-pastel-mint/40', fill: 'bg-pastel-mint', text: 'text-pastel-mint' },
                sky: { border: 'hover:border-pastel-sky/40', fill: 'bg-pastel-sky', text: 'text-pastel-sky' },
                yellow: { border: 'hover:border-pastel-yellow/40', fill: 'bg-pastel-yellow', text: 'text-pastel-yellow' },
                purple: { border: 'hover:border-pastel-purple/40', fill: 'bg-pastel-purple', text: 'text-pastel-purple' }
              }[goal.color] || { border: 'hover:border-pastel-mint/40', fill: 'bg-pastel-mint', text: 'text-pastel-mint' }

              return (
                <div
                  key={goal.id}
                  className={`glass-panel p-5 rounded-3xl border border-white/10 ${colorClasses.border} transition-all duration-200 flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{goal.emoji}</span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
                        {goal.deadline}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">
                      {goal.name}
                    </h3>
                    <div className="flex items-baseline justify-between text-xs mb-3">
                      <span className={`font-extrabold ${colorClasses.text} text-sm font-mono`}>
                        {currencySymbol}{formatINRLarge(goal.current)}
                      </span>
                      <span className="text-slate-400 text-[11px] font-mono">
                        Target: {currencySymbol}{formatINRLarge(goal.target)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-white/5 border border-white/10 overflow-hidden mb-3">
                      <div
                        className={`h-full ${colorClasses.fill} transition-all duration-300 rounded-full`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-xs font-mono text-slate-400">{pct}% Funded</span>
                    <button
                      onClick={() => {
                        setSelectedGoal(goal)
                        setIsDepositModalOpen(true)
                      }}
                      className="text-[11px] font-bold px-3 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-white border border-white/10 transition"
                    >
                      + Deposit
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* TWO COLUMN SECTION: TRANSACTIONS & REAL EXPENSE BREAKDOWN */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: RECENT TRANSACTIONS LEDGER (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-bold text-white font-display">
                  Recent Transactions
                </h2>
                <span className="text-xs text-slate-400 font-mono">
                  ({filteredTransactions.length} records)
                </span>
              </div>

              {/* Type Filter Pills */}
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
                    {f === 'all' ? 'All' : f === 'expense' ? 'Expenses' : 'Income'}
                  </button>
                ))}
              </div>
            </div>

            {/* Search & Category Filter Row */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-7 relative">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by description or merchant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#121623] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pastel-mint transition"
                />
              </div>

              <div className="sm:col-span-5">
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#121623] border border-white/10 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-pastel-mint transition"
                >
                  <option value="all">All Categories</option>
                  {TRANSACTION_CATEGORIES.map((c) => (
                    <option key={c.label} value={c.label}>
                      {c.icon} {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Transactions List */}
            <div className="space-y-2.5">
              {filteredTransactions.length === 0 ? (
                <div className="glass-panel p-8 rounded-3xl border border-white/5 text-center text-slate-400 text-xs">
                  No matching transactions recorded. Click <strong>+ Add Transaction</strong> to log one!
                </div>
              ) : (
                filteredTransactions.map((tx) => {
                  const isIncome = tx.type === 'income'

                  return (
                    <div
                      key={tx.id}
                      className="glass-panel p-4 rounded-2xl border border-white/5 hover:border-white/15 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className="h-10 w-10 rounded-xl bg-[#171B2A] border border-white/10 flex items-center justify-center text-lg flex-shrink-0">
                          {tx.emoji || (isIncome ? '💼' : '🛒')}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white group-hover:text-pastel-mint transition">
                            {tx.title}
                          </h4>
                          <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                            <span>{tx.category}</span>
                            <span>•</span>
                            <span>{tx.date}</span>
                            {tx.paymentMethod && (
                              <>
                                <span>•</span>
                                <span className="font-mono text-slate-400">{tx.paymentMethod}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span
                          className={`font-mono font-extrabold text-sm sm:text-base ${
                            isIncome ? 'text-pastel-mint' : 'text-pastel-pink'
                          }`}
                        >
                          {isIncome ? '+' : '-'}{currencySymbol}{formatINR(tx.amount)}
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

          {/* RIGHT: DYNAMIC CATEGORY BREAKDOWN & SUMMARY (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Category Expense Breakdown */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-white font-display text-sm">Expense Breakdown by Category</span>
                <span className="text-slate-400 font-mono">Real-Time</span>
              </div>

              {categoryBreakdown.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">
                  No expense records to analyze yet.
                </p>
              ) : (
                <>
                  {/* Dynamic Segmented Bar */}
                  <div className="w-full h-3 rounded-full bg-[#181C2B] overflow-hidden flex">
                    {categoryBreakdown.map((cat, idx) => {
                      const bgClasses = {
                        mint: 'bg-pastel-mint',
                        sky: 'bg-pastel-sky',
                        yellow: 'bg-pastel-yellow',
                        pink: 'bg-pastel-pink',
                        purple: 'bg-pastel-purple',
                        peach: 'bg-pastel-peach',
                        slate: 'bg-slate-400'
                      }[cat.color] || 'bg-slate-400'

                      return (
                        <div
                          key={idx}
                          className={`${bgClasses} h-full`}
                          style={{ width: `${cat.percentage}%` }}
                          title={`${cat.category}: ${currencySymbol}${formatINR(cat.amount)} (${cat.percentage}%)`}
                        />
                      )
                    })}
                  </div>

                  {/* Category Legend List */}
                  <div className="space-y-2.5 pt-2">
                    {categoryBreakdown.map((item, idx) => {
                      const dotClasses = {
                        mint: 'bg-pastel-mint',
                        sky: 'bg-pastel-sky',
                        yellow: 'bg-pastel-yellow',
                        pink: 'bg-pastel-pink',
                        purple: 'bg-pastel-purple',
                        peach: 'bg-pastel-peach',
                        slate: 'bg-slate-400'
                      }[item.color] || 'bg-slate-400'

                      return (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            <div className={`h-2.5 w-2.5 rounded-full ${dotClasses}`} />
                            <span className="text-slate-300">{item.icon} {item.category}</span>
                          </div>
                          <div className="flex items-center space-x-2 font-mono">
                            <span className="text-slate-400">{currencySymbol}{formatINR(item.amount)}</span>
                            <span className="text-slate-500 font-bold">({item.percentage}%)</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Financial Health Summary Card */}
            <div className="bg-gradient-to-br from-[#171C2E] to-[#121524] p-6 rounded-3xl border border-white/10 relative overflow-hidden">
              <div className="flex items-center space-x-2 mb-3 text-pastel-sky text-xs font-semibold">
                <BarChart3 className="h-4 w-4" />
                <span>Monthly Cashflow Overview</span>
              </div>
              <h3 className="text-base font-bold text-white font-display mb-1.5">
                {netSavings >= 0 ? `Net Monthly Surplus: +${currencySymbol}${formatINR(netSavings)}` : `Net Deficit: -${currencySymbol}${formatINR(Math.abs(netSavings))}`}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                You are saving <strong>{savingsRate}%</strong> of your income this cycle. 
                {budgetRemaining > 0 
                  ? ` You have ${currencySymbol}${formatINR(budgetRemaining)} remaining before hitting your monthly budget ceiling.` 
                  : ` You have exceeded your monthly budget ceiling by ${currencySymbol}${formatINR(Math.abs(budgetRemaining))}.`}
              </p>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Budget Status: <strong className="text-white">{budgetSpentPct}%</strong></span>
                <span>Active Goals: <strong className="text-pastel-mint">{savingsGoals.length}</strong></span>
              </div>
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
                <span className="text-base font-bold text-pastel-mint">₹</span>
                <h3 className="text-base font-bold text-white font-display">
                  Record Transaction
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
                  onClick={() => {
                    setTxType('expense')
                    setTxCategory('Food & Dining')
                    setTxEmoji('🍽️')
                  }}
                  className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                    txType === 'expense'
                      ? 'bg-pastel-pink/20 text-pastel-pink border border-pastel-pink/40 shadow-glow-pink'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  <span>Expense</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTxType('income')
                    setTxCategory('Salary & Income')
                    setTxEmoji('💼')
                  }}
                  className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                    txType === 'income'
                      ? 'bg-pastel-mint/20 text-pastel-mint border border-pastel-mint/40 shadow-glow-mint'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ArrowDownLeft className="h-3.5 w-3.5" />
                  <span>Income</span>
                </button>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-1">
                  Amount (₹ INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-base font-bold text-slate-400">{currencySymbol}</span>
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

              {/* Description / Merchant */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-1">
                  Description / Merchant
                </label>
                <input
                  type="text"
                  placeholder="e.g. Grocery Market, Rent, Salary Deposit"
                  value={txTitle}
                  onChange={(e) => setTxTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#141826] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pastel-mint"
                  required
                />
              </div>

              {/* Category Dropdown */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={txCategory}
                  onChange={(e) => {
                    const catObj = TRANSACTION_CATEGORIES.find((c) => c.label === e.target.value)
                    setTxCategory(e.target.value)
                    if (catObj) setTxEmoji(catObj.icon)
                  }}
                  className="w-full px-3 py-2 bg-[#141826] border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-pastel-mint"
                >
                  {TRANSACTION_CATEGORIES.filter((c) => (txType === 'income' ? c.isIncome : !c.isIncome)).map((cat) => (
                    <option key={cat.label} value={cat.label}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Method & Date Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={txPaymentMethod}
                    onChange={(e) => setTxPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 bg-[#141826] border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-pastel-mint"
                  >
                    {PAYMENT_METHODS.map((method) => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={txDate}
                    onChange={(e) => setTxDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#141826] border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-pastel-mint"
                    required
                  />
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

      {/* MODAL: DEPOSIT TO SAVINGS GOAL */}
      {isDepositModalOpen && selectedGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-sm w-full glass-panel rounded-3xl border border-pastel-mint/30 p-6 shadow-glow-mint relative overflow-hidden bg-[#0D101A]">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-xl">{selectedGoal.emoji}</span>
                <h3 className="text-sm font-bold text-white">
                  Deposit to {selectedGoal.name}
                </h3>
              </div>
              <button
                onClick={() => setIsDepositModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleDepositToGoal} className="space-y-4">
              <div className="text-xs text-slate-400">
                Current Balance: <strong className="text-white">{currencySymbol}{formatINRLarge(selectedGoal.current)}</strong> / Target: {currencySymbol}{formatINRLarge(selectedGoal.target)}
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-1">
                  Deposit Amount ({currencySymbol})
                </label>
                <input
                  type="number"
                  step="500"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#141826] border border-white/10 rounded-xl text-base font-bold font-mono text-white focus:outline-none focus:border-pastel-mint"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-pastel-mint text-slate-950 font-bold text-xs hover:bg-emerald-300 transition"
              >
                Confirm Deposit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW SAVINGS GOAL */}
      {isNewGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-sm w-full glass-panel rounded-3xl border border-white/15 p-6 shadow-2xl relative overflow-hidden bg-[#0D101A]">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-pastel-mint" />
                <h3 className="text-sm font-bold text-white">New Savings Goal</h3>
              </div>
              <button
                onClick={() => setIsNewGoalModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1">
                  Goal Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Wedding, Emergency Fund, New Car"
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#141826] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-pastel-mint"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1">
                  Target Amount ({currencySymbol})
                </label>
                <input
                  type="number"
                  placeholder="100000"
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(e.target.value)}
                  className="w-full px-3 py-2 bg-[#141826] border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-pastel-mint"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1">
                  Initial Deposit (Optional)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={newGoalInitial}
                  onChange={(e) => setNewGoalInitial(e.target.value)}
                  className="w-full px-3 py-2 bg-[#141826] border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-pastel-mint"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1">
                  Target Date / Deadline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dec 2026, Diwali 2027"
                  value={newGoalDeadline}
                  onChange={(e) => setNewGoalDeadline(e.target.value)}
                  className="w-full px-3 py-2 bg-[#141826] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-pastel-mint"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1">
                  Goal Icon
                </label>
                <div className="flex items-center space-x-2">
                  {['🛡️', '🏠', '🚗', '✈️', '💻', '📈', '🎓', '🎯'].map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setNewGoalEmoji(em)}
                      className={`text-lg p-1.5 rounded-lg ${newGoalEmoji === em ? 'bg-white/20' : 'hover:bg-white/5'}`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-pastel-mint text-slate-950 font-bold text-xs hover:bg-emerald-300 transition"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

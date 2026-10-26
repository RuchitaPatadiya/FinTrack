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
  Percent,
  Loader2,
  Pencil,
  Tag,
  Sliders
} from 'lucide-react'
import { transactionsAPI, goalsAPI, categoriesAPI, budgetsAPI } from '../services/api'

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
  const isRealUser = Boolean(
    user &&
    user.auth_provider !== 'demo' &&
    user.auth_provider !== 'guest' &&
    localStorage.getItem('fintrack_token')
  )

  // Load stored transactions or default
  const [transactions, setTransactions] = useState(() => {
    if (user && user.auth_provider !== 'demo' && user.auth_provider !== 'guest' && localStorage.getItem('fintrack_token')) {
      return []
    }
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

  const [loadingTransactions, setLoadingTransactions] = useState(false)
  const [isSubmittingTx, setIsSubmittingTx] = useState(false)
  // Categories state
  const [categories, setCategories] = useState(TRANSACTION_CATEGORIES)
  const [isManageCategoriesModalOpen, setIsManageCategoriesModalOpen] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [newCatIcon, setNewCatIcon] = useState('🏷️')
  const [newCatColor, setNewCatColor] = useState('mint')
  const [newCatType, setNewCatType] = useState('expense')
  const [isCreatingCat, setIsCreatingCat] = useState(false)

  // Budgets state
  const [budgetOverview, setBudgetOverview] = useState(null)
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)
  const [isSubmittingBudget, setIsSubmittingBudget] = useState(false)
  const [showCategoryBudgets, setShowCategoryBudgets] = useState(true)
  const [budgetCeilingInput, setBudgetCeilingInput] = useState('50000')
  const [catBudgetLimitsInput, setCatBudgetLimitsInput] = useState({})

  // Pagination
  const [txLimit] = useState(50)
  const [txOffset, setTxOffset] = useState(0)
  const [hasMoreTx, setHasMoreTx] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  // Fetch transactions from backend database for authenticated users
  useEffect(() => {
    if (isRealUser) {
      if (txOffset === 0) {
        setLoadingTransactions(true)
      } else {
        setIsLoadingMore(true)
      }
      transactionsAPI
        .list({ limit: txLimit, offset: txOffset })
        .then((res) => {
          if (Array.isArray(res.data)) {
            if (txOffset === 0) {
              setTransactions(res.data)
            } else {
              setTransactions((prev) => [...prev, ...res.data])
            }
            setHasMoreTx(res.data.length === txLimit)
          }
        })
        .catch((err) => {
          console.error('Failed to load transactions from backend database:', err)
        })
        .finally(() => {
          setLoadingTransactions(false)
          setIsLoadingMore(false)
        })
    }
  }, [isRealUser, user?.id, txOffset])

  // Load stored savings goals or default
  const [savingsGoals, setSavingsGoals] = useState(() => {
    if (user && user.auth_provider !== 'demo' && user.auth_provider !== 'guest' && localStorage.getItem('fintrack_token')) {
      return []
    }
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

  const [loadingGoals, setLoadingGoals] = useState(false)
  const [isSubmittingGoal, setIsSubmittingGoal] = useState(false)
  const [isDepositingGoal, setIsDepositingGoal] = useState(false)

  // Fetch savings goals from backend database for authenticated users
  useEffect(() => {
    if (isRealUser) {
      setLoadingGoals(true)
      goalsAPI
        .list()
        .then((res) => {
          if (Array.isArray(res.data)) {
            setSavingsGoals(res.data)
          }
        })
        .catch((err) => {
          console.error('Failed to load savings goals from backend database:', err)
        })
        .finally(() => {
          setLoadingGoals(false)
        })
    }
  }, [isRealUser, user?.id])

  // Load dynamic categories from backend
  useEffect(() => {
    if (isRealUser) {
      categoriesAPI
        .list()
        .then((res) => {
          if (Array.isArray(res.data) && res.data.length > 0) {
            const mapped = res.data.map((c) => ({
              id: c.id,
              label: c.name,
              icon: c.icon || '📦',
              color: c.color || 'slate',
              isIncome: c.type === 'income',
              isCustom: !c.is_system
            }))
            setCategories(mapped)
          }
        })
        .catch((err) => {
          console.warn('Could not load categories from DB, using fallback:', err)
        })
    }
  }, [isRealUser])

  // Load live monthly budget overview
  const loadBudgetOverview = () => {
    if (isRealUser) {
      budgetsAPI
        .getOverview()
        .then((res) => {
          if (res.data) {
            setBudgetOverview(res.data)
            if (res.data.overall_budget?.amount_limit) {
              setBudgetLimit(res.data.overall_budget.amount_limit)
              setBudgetCeilingInput(String(res.data.overall_budget.amount_limit))
            }
            const inputs = {}
            if (Array.isArray(res.data.category_budgets)) {
              res.data.category_budgets.forEach((cb) => {
                inputs[cb.category_name] = String(cb.amount_limit)
              })
            }
            setCatBudgetLimitsInput(inputs)
          }
        })
        .catch((err) => {
          console.warn('Could not load budget overview from DB:', err)
        })
    }
  }

  useEffect(() => {
    loadBudgetOverview()
  }, [isRealUser, transactions])

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

  // Persist state to localStorage only for guest / demo mode
  useEffect(() => {
    if (!isRealUser) {
      try {
        localStorage.setItem('fintrack_tx_list', JSON.stringify(transactions))
      } catch {}
    }
  }, [transactions, isRealUser])

  useEffect(() => {
    if (!isRealUser) {
      try {
        localStorage.setItem('fintrack_vaults', JSON.stringify(savingsGoals))
      } catch {}
    }
  }, [savingsGoals, isRealUser])

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

  // Edit Transaction state
  const [isEditTxModalOpen, setIsEditTxModalOpen] = useState(false)
  const [editingTx, setEditingTx] = useState(null)
  const [editTxTitle, setEditTxTitle] = useState('')
  const [editTxAmount, setEditTxAmount] = useState('')
  const [editTxType, setEditTxType] = useState('expense')
  const [editTxCategory, setEditTxCategory] = useState(TRANSACTION_CATEGORIES[0].label)
  const [editTxEmoji, setEditTxEmoji] = useState(TRANSACTION_CATEGORIES[0].icon)
  const [editTxPaymentMethod, setEditTxPaymentMethod] = useState(PAYMENT_METHODS[0])
  const [editTxDate, setEditTxDate] = useState('')
  const [isUpdatingTx, setIsUpdatingTx] = useState(false)

  // Edit Goal state
  const [isEditGoalModalOpen, setIsEditGoalModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [editGoalName, setEditGoalName] = useState('')
  const [editGoalTarget, setEditGoalTarget] = useState('')
  const [editGoalDeadline, setEditGoalDeadline] = useState('')
  const [editGoalEmoji, setEditGoalEmoji] = useState('🎯')
  const [editGoalColor, setEditGoalColor] = useState('mint')
  const [isUpdatingGoal, setIsUpdatingGoal] = useState(false)

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
    const baseBalance = isRealUser ? 0 : 250000.00
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
  }, [transactions, isRealUser])

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
      const methodStr = tx.payment_method || tx.paymentMethod || ''
      const matchesSearch =
        tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        methodStr.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesType && matchesCategory && matchesSearch
    })
  }, [transactions, activeFilter, selectedCategoryFilter, searchQuery])

  // Handle Add Transaction Submit
  const handleAddTransaction = async (e) => {
    e.preventDefault()
    const numAmount = parseFloat(txAmount)
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid amount greater than ₹0')
      return
    }

    const payload = {
      title: txTitle.trim() || (txType === 'income' ? 'Income Deposit' : 'Expense Payment'),
      category: txCategory,
      emoji: txEmoji,
      amount: numAmount,
      type: txType,
      date: txDate || new Date().toISOString().split('T')[0],
      payment_method: txPaymentMethod,
      paymentMethod: txPaymentMethod
    }

    if (isRealUser) {
      setIsSubmittingTx(true)
      try {
        const res = await transactionsAPI.create(payload)
        const createdTx = {
          ...res.data,
          paymentMethod: res.data.payment_method || txPaymentMethod
        }
        setTransactions((prev) => [createdTx, ...prev])
        setIsAddModalOpen(false)
        setTxTitle('')
        setTxAmount('')
        showToast(`Logged ${createdTx.type === 'income' ? '+' : '-'}${currencySymbol}${formatINR(numAmount)} (${createdTx.title})`)
      } catch (err) {
        console.error('Failed to create transaction on server:', err)
        alert('Failed to save transaction: ' + (err.response?.data?.detail || err.message))
      } finally {
        setIsSubmittingTx(false)
      }
      return
    }

    // Guest / Demo fallback
    const newTx = {
      id: `tx-${Date.now()}`,
      ...payload
    }

    setTransactions([newTx, ...transactions])
    setIsAddModalOpen(false)
    setTxTitle('')
    setTxAmount('')
    showToast(`Logged ${newTx.type === 'income' ? '+' : '-'}${currencySymbol}${formatINR(numAmount)} (${newTx.title})`)
  }

  // Handle Goal Deposit
  const handleDepositToGoal = async (e) => {
    e.preventDefault()
    const dep = parseFloat(depositAmount)
    if (!selectedGoal || isNaN(dep) || dep <= 0) return

    if (isRealUser) {
      setIsDepositingGoal(true)
      try {
        const res = await goalsAPI.update(selectedGoal.id, { deposit: dep })
        setSavingsGoals((prev) =>
          prev.map((g) => (g.id === selectedGoal.id ? res.data : g))
        )

        // Also record as a savings transfer expense in database
        const savingsTxData = {
          title: `Transfer to ${selectedGoal.name}`,
          category: 'Investments & Dividends',
          emoji: selectedGoal.emoji || '🎯',
          amount: dep,
          type: 'expense',
          date: new Date().toISOString().split('T')[0],
          payment_method: 'Bank Transfer'
        }

        try {
          const txRes = await transactionsAPI.create(savingsTxData)
          const createdTx = {
            ...txRes.data,
            paymentMethod: txRes.data.payment_method || 'Bank Transfer'
          }
          setTransactions((prev) => [createdTx, ...prev])
        } catch (txErr) {
          console.error('Failed to record transfer in database:', txErr)
        }

        setIsDepositModalOpen(false)
        setDepositAmount('5000')
        showToast(`Deposited ${currencySymbol}${formatINR(dep)} to ${selectedGoal.name}`)
      } catch (err) {
        console.error('Failed to deposit to savings goal:', err)
        alert('Failed to deposit: ' + (err.response?.data?.detail || err.message))
      } finally {
        setIsDepositingGoal(false)
      }
      return
    }

    // Guest / Demo fallback
    setSavingsGoals(
      savingsGoals.map((g) => {
        if (g.id === selectedGoal.id) {
          return { ...g, current: Number(g.current) + dep }
        }
        return g
      })
    )

    const savingsTxData = {
      id: `tx-${Date.now()}`,
      title: `Transfer to ${selectedGoal.name}`,
      category: 'Investments & Dividends',
      emoji: selectedGoal.emoji || '🎯',
      amount: dep,
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Bank Transfer'
    }
    setTransactions([savingsTxData, ...transactions])
    setIsDepositModalOpen(false)
    setDepositAmount('5000')
    showToast(`Deposited ${currencySymbol}${formatINR(dep)} to ${selectedGoal.name}`)
  }

  // Handle Create New Goal
  const handleCreateGoal = async (e) => {
    e.preventDefault()
    const target = parseFloat(newGoalTarget)
    const initial = parseFloat(newGoalInitial) || 0

    if (!newGoalName.trim() || isNaN(target) || target <= 0) {
      alert('Please enter a valid goal name and target amount')
      return
    }

    const goalPayload = {
      name: newGoalName.trim(),
      emoji: newGoalEmoji || '🎯',
      target: target,
      current: initial,
      color: newGoalColor || 'mint',
      deadline: newGoalDeadline.trim() || 'Flexible'
    }

    if (isRealUser) {
      setIsSubmittingGoal(true)
      try {
        const res = await goalsAPI.create(goalPayload)
        setSavingsGoals((prev) => [...prev, res.data])
        setIsNewGoalModalOpen(false)
        setNewGoalName('')
        setNewGoalTarget('')
        setNewGoalInitial('')
        setNewGoalDeadline('')
        showToast(`Created savings goal: "${res.data.name}"`)
      } catch (err) {
        console.error('Failed to create savings goal:', err)
        alert('Failed to create goal: ' + (err.response?.data?.detail || err.message))
      } finally {
        setIsSubmittingGoal(false)
      }
      return
    }

    // Guest / Demo fallback
    const created = {
      id: `goal-${Date.now()}`,
      ...goalPayload
    }

    setSavingsGoals([...savingsGoals, created])
    setIsNewGoalModalOpen(false)
    setNewGoalName('')
    setNewGoalTarget('')
    setNewGoalInitial('')
    setNewGoalDeadline('')
    showToast(`Created savings goal: "${created.name}"`)
  }

  // Handle Delete Savings Goal
  const handleDeleteGoal = async (id, name) => {
    if (!window.confirm(`Delete savings goal "${name || 'this goal'}"?`)) return

    if (isRealUser && typeof id === 'number') {
      try {
        await goalsAPI.delete(id)
        setSavingsGoals((prev) => prev.filter((g) => g.id !== id))
        showToast('Savings goal deleted')
        return
      } catch (err) {
        console.error('Failed to delete savings goal:', err)
        alert('Failed to delete goal: ' + (err.response?.data?.detail || err.message))
        return
      }
    }

    setSavingsGoals((prev) => prev.filter((g) => g.id !== id))
    showToast('Savings goal deleted')
  }

  // Delete transaction
  const handleDeleteTx = async (id) => {
    if (!window.confirm('Delete this transaction record?')) return

    if (isRealUser && typeof id === 'number') {
      try {
        await transactionsAPI.delete(id)
        setTransactions((prev) => prev.filter((t) => t.id !== id))
        showToast('Transaction removed')
        return
      } catch (err) {
        console.error('Failed to delete transaction:', err)
        alert('Failed to delete transaction: ' + (err.response?.data?.detail || err.message))
        return
      }
    }

    setTransactions((prev) => prev.filter((t) => t.id !== id))
    showToast('Transaction removed')
  }

  // Open edit transaction modal pre-filled
  const handleOpenEditTx = (tx) => {
    setEditingTx(tx)
    setEditTxTitle(tx.title || '')
    setEditTxAmount(String(tx.amount || ''))
    setEditTxType(tx.type || 'expense')
    setEditTxCategory(tx.category || TRANSACTION_CATEGORIES[0].label)
    setEditTxEmoji(tx.emoji || TRANSACTION_CATEGORIES[0].icon)
    setEditTxPaymentMethod(tx.payment_method || tx.paymentMethod || PAYMENT_METHODS[0])
    setEditTxDate(tx.date || new Date().toISOString().split('T')[0])
    setIsEditTxModalOpen(true)
  }

  // Submit transaction edit
  const handleUpdateTransaction = async (e) => {
    e.preventDefault()
    const numAmount = parseFloat(editTxAmount)
    if (!editingTx || isNaN(numAmount) || numAmount <= 0) return

    const payload = {
      title: editTxTitle.trim(),
      amount: numAmount,
      type: editTxType,
      category: editTxCategory,
      emoji: editTxEmoji,
      payment_method: editTxPaymentMethod,
      paymentMethod: editTxPaymentMethod,
      date: editTxDate
    }

    if (isRealUser && typeof editingTx.id === 'number') {
      setIsUpdatingTx(true)
      try {
        const res = await transactionsAPI.update(editingTx.id, payload)
        setTransactions((prev) =>
          prev.map((t) => (t.id === editingTx.id ? { ...res.data, paymentMethod: res.data.payment_method } : t))
        )
        setIsEditTxModalOpen(false)
        showToast('Transaction updated successfully')
      } catch (err) {
        console.error('Failed to update transaction:', err)
        alert('Failed to update: ' + (err.response?.data?.detail || err.message))
      } finally {
        setIsUpdatingTx(false)
      }
      return
    }

    // Guest / demo fallback
    setTransactions((prev) =>
      prev.map((t) => (t.id === editingTx.id ? { ...t, ...payload } : t))
    )
    setIsEditTxModalOpen(false)
    showToast('Transaction updated')
  }

  // Open edit goal modal pre-filled
  const handleOpenEditGoal = (goal) => {
    setEditingGoal(goal)
    setEditGoalName(goal.name || '')
    setEditGoalTarget(String(goal.target || ''))
    setEditGoalDeadline(goal.deadline || '')
    setEditGoalEmoji(goal.emoji || '🎯')
    setEditGoalColor(goal.color || 'mint')
    setIsEditGoalModalOpen(true)
  }

  // Submit goal edit
  const handleUpdateGoal = async (e) => {
    e.preventDefault()
    const target = parseFloat(editGoalTarget)
    if (!editingGoal || !editGoalName.trim() || isNaN(target) || target <= 0) return

    const payload = {
      name: editGoalName.trim(),
      target,
      deadline: editGoalDeadline.trim() || null,
      emoji: editGoalEmoji,
      color: editGoalColor
    }

    if (isRealUser && typeof editingGoal.id === 'number') {
      setIsUpdatingGoal(true)
      try {
        const res = await goalsAPI.update(editingGoal.id, payload)
        setSavingsGoals((prev) =>
          prev.map((g) => (g.id === editingGoal.id ? res.data : g))
        )
        setIsEditGoalModalOpen(false)
        showToast('Savings goal updated')
      } catch (err) {
        console.error('Failed to update goal:', err)
        alert('Failed to update: ' + (err.response?.data?.detail || err.message))
      } finally {
        setIsUpdatingGoal(false)
      }
      return
    }

    // Guest / demo fallback
    setSavingsGoals((prev) =>
      prev.map((g) => (g.id === editingGoal.id ? { ...g, ...payload } : g))
    )
    setIsEditGoalModalOpen(false)
    showToast('Savings goal updated')
  }

  // Category Handlers
  const handleCreateCategory = async (e) => {
    e.preventDefault()
    if (!newCatName.trim()) return

    const payload = {
      name: newCatName.trim(),
      icon: newCatIcon || '🏷️',
      color: newCatColor || 'mint',
      type: newCatType
    }

    if (isRealUser) {
      setIsCreatingCat(true)
      try {
        const res = await categoriesAPI.create(payload)
        const createdCat = {
          id: res.data.id,
          label: res.data.name,
          icon: res.data.icon,
          color: res.data.color,
          isIncome: res.data.type === 'income',
          isCustom: true
        }
        setCategories((prev) => [...prev, createdCat])
        setNewCatName('')
        showToast(`Category "${res.data.name}" created!`)
      } catch (err) {
        console.error('Failed to create category:', err)
        alert('Failed to create category: ' + (err.response?.data?.detail || err.message))
      } finally {
        setIsCreatingCat(false)
      }
      return
    }

    // Demo/guest fallback
    const custom = {
      id: `cat-${Date.now()}`,
      label: newCatName.trim(),
      icon: newCatIcon || '🏷️',
      color: newCatColor || 'mint',
      isIncome: newCatType === 'income',
      isCustom: true
    }
    setCategories((prev) => [...prev, custom])
    setNewCatName('')
    showToast(`Category "${custom.label}" added!`)
  }

  const handleDeleteCategory = async (catId, catLabel) => {
    if (!window.confirm(`Delete custom category "${catLabel}"?`)) return

    if (isRealUser && typeof catId === 'number') {
      try {
        await categoriesAPI.delete(catId)
        setCategories((prev) => prev.filter((c) => c.id !== catId))
        showToast('Category deleted')
        return
      } catch (err) {
        console.error('Failed to delete category:', err)
        alert('Failed to delete: ' + (err.response?.data?.detail || err.message))
        return
      }
    }

    setCategories((prev) => prev.filter((c) => c.id !== catId))
    showToast('Category deleted')
  }

  // Save Budgets Handler
  const handleSaveBudgets = async (e) => {
    e.preventDefault()
    const ceiling = parseFloat(budgetCeilingInput)
    if (isNaN(ceiling) || ceiling <= 0) {
      alert('Please enter a valid monthly ceiling amount.')
      return
    }

    const monthStr = new Date().toISOString().substring(0, 7)

    if (isRealUser) {
      setIsSubmittingBudget(true)
      try {
        // 1. Save master ceiling
        await budgetsAPI.setBudget({
          amount_limit: ceiling,
          month_year: monthStr,
          category_name: null
        })
        setBudgetLimit(ceiling)

        // 2. Save configured category limits
        for (const [catName, limitStr] of Object.entries(catBudgetLimitsInput)) {
          const numLimit = parseFloat(limitStr)
          if (!isNaN(numLimit) && numLimit > 0) {
            await budgetsAPI.setBudget({
              amount_limit: numLimit,
              month_year: monthStr,
              category_name: catName
            })
          }
        }

        loadBudgetOverview()
        setIsBudgetModalOpen(false)
        showToast('Monthly & category budgets saved to database!')
      } catch (err) {
        console.error('Failed to save budgets:', err)
        alert('Failed to save budget: ' + (err.response?.data?.detail || err.message))
      } finally {
        setIsSubmittingBudget(false)
      }
      return
    }

    // Demo/guest fallback
    setBudgetLimit(ceiling)
    try {
      const prefs = JSON.parse(localStorage.getItem('fintrack_profile_prefs') || '{}')
      prefs.monthlyBudgetLimit = ceiling
      localStorage.setItem('fintrack_profile_prefs', JSON.stringify(prefs))
    } catch {}
    setIsBudgetModalOpen(false)
    showToast('Monthly budget updated!')
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
                onClick={() => onNavigate('analytics')}
                className="px-3.5 py-1 rounded-full text-slate-400 hover:text-white transition flex items-center space-x-1"
              >
                <span>Analytics</span>
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

        {/* MONTHLY BUDGET PROGRESS BAR & CATEGORY LIMITS */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-2">
                  <span>Monthly Spending Budget</span>
                  {budgetSpentPct >= 90 && (
                    <span className="inline-flex items-center space-x-1 text-xs text-rose-400 font-semibold bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Near Ceiling</span>
                    </span>
                  )}
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {currencySymbol}{formatINR(totalExpenses)} spent of {currencySymbol}{formatINR(budgetLimit)} monthly budget limit
              </p>
            </div>

            {/* Budget Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsBudgetModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-pastel-sky transition flex items-center space-x-1.5"
                title="Configure monthly and category budget limits"
              >
                <Sliders className="h-3 w-3" />
                <span>Set Budgets</span>
              </button>
              <button
                onClick={() => setIsManageCategoriesModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-pastel-mint transition flex items-center space-x-1.5"
                title="Manage custom expense and income categories"
              >
                <Tag className="h-3 w-3" />
                <span>Categories</span>
              </button>
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
            <span>{budgetSpentPct}% Utilized (Buffer: {currencySymbol}{formatINR(budgetRemaining)})</span>
            <span>100% ({currencySymbol}{formatINRLarge(budgetLimit)})</span>
          </div>

          {/* Category-Level Budget Limit Meters */}
          {budgetOverview?.category_budgets && budgetOverview.category_budgets.length > 0 && (
            <div className="pt-3 border-t border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Configured Category Limits ({budgetOverview.category_budgets.length})
                </span>
                <button
                  onClick={() => setShowCategoryBudgets(!showCategoryBudgets)}
                  className="text-[11px] text-pastel-sky hover:underline font-mono"
                >
                  {showCategoryBudgets ? 'Collapse' : 'Expand'}
                </button>
              </div>

              {showCategoryBudgets && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {budgetOverview.category_budgets.map((cb) => (
                    <div
                      key={cb.id}
                      className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-2 hover:border-white/10 transition"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white truncate max-w-[140px]">{cb.category_name}</span>
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            cb.is_over_budget
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : cb.is_near_ceiling
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-pastel-mint/15 text-pastel-mint'
                          }`}
                        >
                          {cb.percentage_spent}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          style={{ width: `${Math.min(100, cb.percentage_spent)}%` }}
                          className={`h-full rounded-full transition-all duration-300 ${
                            cb.is_over_budget ? 'bg-rose-500' : cb.is_near_ceiling ? 'bg-amber-400' : 'bg-pastel-mint'
                          }`}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>Spent: {currencySymbol}{formatINRLarge(cb.spent_amount)}</span>
                        <span>Limit: {currencySymbol}{formatINRLarge(cb.amount_limit)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
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
            {loadingGoals ? (
              <div className="col-span-full glass-panel p-8 rounded-3xl border border-white/5 flex flex-col items-center justify-center space-y-2 text-slate-400 text-xs">
                <Loader2 className="h-5 w-5 text-pastel-mint animate-spin" />
                <span>Loading savings goals from PostgreSQL database...</span>
              </div>
            ) : savingsGoals.length === 0 ? (
              <div className="col-span-full glass-panel p-8 rounded-3xl border border-white/5 text-center text-slate-400 text-xs">
                No active savings goals recorded. Click <strong>+ New Goal</strong> to launch your first vault!
              </div>
            ) : (
              savingsGoals.map((goal) => {
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
                    className={`glass-panel p-5 rounded-3xl border border-white/10 ${colorClasses.border} transition-all duration-200 flex flex-col justify-between group`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{goal.emoji}</span>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
                            {goal.deadline}
                          </span>
                          <button
                            onClick={() => handleOpenEditGoal(goal)}
                            className="text-slate-500 hover:text-pastel-sky transition p-1 rounded-lg hover:bg-white/10 opacity-70 group-hover:opacity-100"
                            title="Edit savings goal"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteGoal(goal.id, goal.name)}
                            className="text-slate-500 hover:text-rose-400 transition p-1 rounded-lg hover:bg-white/10 opacity-70 group-hover:opacity-100"
                            title="Delete savings goal"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
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
              })
            )}
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
              {loadingTransactions ? (
                <div className="glass-panel p-8 rounded-3xl border border-white/5 flex flex-col items-center justify-center space-y-2 text-slate-400 text-xs">
                  <Loader2 className="h-5 w-5 text-pastel-mint animate-spin" />
                  <span>Loading transactions from PostgreSQL database...</span>
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="glass-panel p-8 rounded-3xl border border-white/5 text-center text-slate-400 text-xs">
                  No matching transactions recorded. Click <strong>+ Add Transaction</strong> to log one!
                </div>
              ) : (
                filteredTransactions.map((tx) => {
                  const isIncome = tx.type === 'income'
                  const method = tx.payment_method || tx.paymentMethod

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
                            {method && (
                              <>
                                <span>•</span>
                                <span className="font-mono text-slate-400">{method}</span>
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
                          onClick={() => handleOpenEditTx(tx)}
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-pastel-sky transition p-1"
                          title="Edit transaction"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
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

            {/* Load More Transactions */}
            {isRealUser && hasMoreTx && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => setTxOffset((prev) => prev + txLimit)}
                  disabled={isLoadingMore}
                  className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 transition flex items-center space-x-2 disabled:opacity-50"
                >
                  {isLoadingMore && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{isLoadingMore ? 'Loading...' : 'Load More Transactions'}</span>
                </button>
              </div>
            )}
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
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300">
                    Category
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsManageCategoriesModalOpen(true)}
                    className="text-[10px] text-pastel-sky hover:underline flex items-center space-x-1"
                  >
                    <Tag className="h-2.5 w-2.5" />
                    <span>+ Custom Category</span>
                  </button>
                </div>
                <select
                  value={txCategory}
                  onChange={(e) => {
                    const catObj = categories.find((c) => c.label === e.target.value)
                    setTxCategory(e.target.value)
                    if (catObj) setTxEmoji(catObj.icon)
                  }}
                  className="w-full px-3 py-2 bg-[#141826] border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-pastel-mint"
                >
                  {categories.filter((c) => (txType === 'income' ? c.isIncome : !c.isIncome)).map((cat) => (
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
                  disabled={isSubmittingTx}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-pastel-mint to-pastel-sky text-slate-950 font-bold text-xs shadow-glow-mint hover:opacity-95 transition flex items-center justify-center space-x-2 disabled:opacity-60"
                >
                  {isSubmittingTx && <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-950" />}
                  <span>{isSubmittingTx ? 'Saving to Database...' : 'Save Transaction'}</span>
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
                disabled={isDepositingGoal}
                className="w-full py-2.5 rounded-xl bg-pastel-mint text-slate-950 font-bold text-xs hover:bg-emerald-300 transition flex items-center justify-center space-x-2 disabled:opacity-60"
              >
                {isDepositingGoal && <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-950" />}
                <span>{isDepositingGoal ? 'Depositing to Vault...' : 'Confirm Deposit'}</span>
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
                  disabled={isSubmittingGoal}
                  className="w-full py-2.5 rounded-xl bg-pastel-mint text-slate-950 font-bold text-xs hover:bg-emerald-300 transition flex items-center justify-center space-x-2 disabled:opacity-60"
                >
                  {isSubmittingGoal && <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-950" />}
                  <span>{isSubmittingGoal ? 'Saving Goal to Database...' : 'Create Goal'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT TRANSACTION */}
      {isEditTxModalOpen && editingTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full glass-panel rounded-3xl border border-white/15 p-6 shadow-2xl relative overflow-hidden bg-[#0D101A]">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div className="flex items-center space-x-2">
                <Pencil className="h-4 w-4 text-pastel-sky" />
                <h3 className="text-base font-bold text-white font-display">
                  Edit Transaction
                </h3>
              </div>
              <button
                onClick={() => setIsEditTxModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateTransaction} className="space-y-4">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 bg-[#141826] p-1 rounded-xl border border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    setEditTxType('expense')
                    setEditTxCategory('Food & Dining')
                    setEditTxEmoji('🍽️')
                  }}
                  className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                    editTxType === 'expense'
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
                    setEditTxType('income')
                    setEditTxCategory('Salary & Income')
                    setEditTxEmoji('💼')
                  }}
                  className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                    editTxType === 'income'
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
                    value={editTxAmount}
                    onChange={(e) => setEditTxAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 bg-[#141826] border border-white/10 rounded-xl text-lg font-bold font-mono text-white placeholder-slate-600 focus:outline-none focus:border-pastel-mint"
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
                  value={editTxTitle}
                  onChange={(e) => setEditTxTitle(e.target.value)}
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
                  value={editTxCategory}
                  onChange={(e) => {
                    const catObj = categories.find((c) => c.label === e.target.value)
                    setEditTxCategory(e.target.value)
                    if (catObj) setEditTxEmoji(catObj.icon)
                  }}
                  className="w-full px-3 py-2 bg-[#141826] border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-pastel-mint"
                >
                  {categories.filter((c) => (editTxType === 'income' ? c.isIncome : !c.isIncome)).map((cat) => (
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
                    value={editTxPaymentMethod}
                    onChange={(e) => setEditTxPaymentMethod(e.target.value)}
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
                    value={editTxDate}
                    onChange={(e) => setEditTxDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#141826] border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-pastel-mint"
                    required
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isUpdatingTx}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-pastel-sky to-pastel-mint text-slate-950 font-bold text-xs shadow-glow-sky hover:opacity-95 transition flex items-center justify-center space-x-2 disabled:opacity-60"
                >
                  {isUpdatingTx && <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-950" />}
                  <span>{isUpdatingTx ? 'Updating Transaction...' : 'Update Transaction'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT SAVINGS GOAL */}
      {isEditGoalModalOpen && editingGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-sm w-full glass-panel rounded-3xl border border-white/15 p-6 shadow-2xl relative overflow-hidden bg-[#0D101A]">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center space-x-2">
                <Pencil className="h-4 w-4 text-pastel-sky" />
                <h3 className="text-sm font-bold text-white">Edit Savings Goal</h3>
              </div>
              <button
                onClick={() => setIsEditGoalModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateGoal} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1">
                  Goal Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Wedding, Emergency Fund, New Car"
                  value={editGoalName}
                  onChange={(e) => setEditGoalName(e.target.value)}
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
                  value={editGoalTarget}
                  onChange={(e) => setEditGoalTarget(e.target.value)}
                  className="w-full px-3 py-2 bg-[#141826] border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-pastel-mint"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1">
                  Target Date / Deadline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dec 2026, Diwali 2027"
                  value={editGoalDeadline}
                  onChange={(e) => setEditGoalDeadline(e.target.value)}
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
                      onClick={() => setEditGoalEmoji(em)}
                      className={`text-lg p-1.5 rounded-lg ${editGoalEmoji === em ? 'bg-white/20' : 'hover:bg-white/5'}`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUpdatingGoal}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pastel-sky to-pastel-mint text-slate-950 font-bold text-xs hover:opacity-95 transition flex items-center justify-center space-x-2 disabled:opacity-60"
                >
                  {isUpdatingGoal && <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-950" />}
                  <span>{isUpdatingGoal ? 'Saving Changes...' : 'Update Goal'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* MODAL: MANAGE CATEGORIES */}
      {isManageCategoriesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-lg w-full glass-panel rounded-3xl border border-white/15 p-6 shadow-2xl relative overflow-hidden bg-[#0D101A] max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4 flex-shrink-0">
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-pastel-mint" />
                <h3 className="text-base font-bold text-white font-display">Manage Categories</h3>
              </div>
              <button
                onClick={() => setIsManageCategoriesModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-5 pr-1">
              {/* Add Category Form */}
              <form onSubmit={handleCreateCategory} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <span className="text-xs font-bold text-white">Create Custom Category</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-300 mb-1">Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Pet Care, Gym"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#141826] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-pastel-mint"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-300 mb-1">Type</label>
                    <div className="grid grid-cols-2 gap-1 bg-[#141826] p-1 rounded-xl border border-white/10 text-xs">
                      <button
                        type="button"
                        onClick={() => setNewCatType('expense')}
                        className={`py-1 rounded-lg font-bold ${newCatType === 'expense' ? 'bg-pastel-pink/20 text-pastel-pink' : 'text-slate-400'}`}
                      >
                        Expense
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewCatType('income')}
                        className={`py-1 rounded-lg font-bold ${newCatType === 'income' ? 'bg-pastel-mint/20 text-pastel-mint' : 'text-slate-400'}`}
                      >
                        Income
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-300 mb-1">Emoji Icon</label>
                  <div className="flex flex-wrap gap-1.5">
                    {['🐾', '🏋️', '📚', '👶', '🎮', '💡', '🎁', '☕', '💅', '✈️', '💻', '🏷️'].map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => setNewCatIcon(em)}
                        className={`text-base p-1.5 rounded-lg ${newCatIcon === em ? 'bg-white/20 scale-110' : 'hover:bg-white/5'}`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isCreatingCat}
                  className="w-full py-2 rounded-xl bg-pastel-mint text-slate-950 font-bold text-xs hover:bg-emerald-300 transition flex items-center justify-center space-x-1.5 disabled:opacity-50"
                >
                  {isCreatingCat && <Loader2 className="h-3 w-3 animate-spin text-slate-950" />}
                  <span>{isCreatingCat ? 'Adding Category...' : '+ Add Category'}</span>
                </button>
              </form>

              {/* Existing Categories List */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  Active Categories ({categories.length})
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {categories.map((cat) => (
                    <div
                      key={cat.id || cat.label}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-base">{cat.icon}</span>
                        <span className="font-semibold text-white">{cat.label}</span>
                        <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${cat.isIncome ? 'bg-pastel-mint/15 text-pastel-mint' : 'bg-pastel-pink/15 text-pastel-pink'}`}>
                          {cat.isIncome ? 'Income' : 'Expense'}
                        </span>
                      </div>
                      {cat.isCustom && (
                        <button
                          onClick={() => handleDeleteCategory(cat.id, cat.label)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                          title="Delete custom category"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CONFIGURE BUDGETS */}
      {isBudgetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-lg w-full glass-panel rounded-3xl border border-white/15 p-6 shadow-2xl relative overflow-hidden bg-[#0D101A] max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4 flex-shrink-0">
              <div className="flex items-center space-x-2">
                <Sliders className="h-4 w-4 text-pastel-sky" />
                <h3 className="text-base font-bold text-white font-display">Configure Monthly Budgets</h3>
              </div>
              <button
                onClick={() => setIsBudgetModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBudgets} className="overflow-y-auto space-y-4 pr-1">
              {/* Master Monthly Spending Ceiling */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <label className="block text-xs font-bold text-white">
                  Overall Monthly Spending Ceiling ({currencySymbol} INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-sm font-bold text-slate-400">{currencySymbol}</span>
                  <input
                    type="number"
                    step="500"
                    placeholder="50000"
                    value={budgetCeilingInput}
                    onChange={(e) => setBudgetCeilingInput(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 bg-[#141826] border border-white/10 rounded-xl text-sm font-bold font-mono text-white focus:outline-none focus:border-pastel-sky"
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Global spending threshold used for top dashboard warnings and alerts.
                </p>
              </div>

              {/* Category-Specific Limits */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-white">
                  Category Limits (Optional)
                </span>
                <p className="text-[11px] text-slate-400">
                  Set specific monthly spending caps for individual categories.
                </p>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {categories.filter((c) => !c.isIncome).map((cat) => (
                    <div
                      key={cat.label}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <span>{cat.icon}</span>
                        <span className="text-slate-200 font-medium truncate">{cat.label}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 flex-shrink-0">
                        <span className="text-slate-500 font-mono">₹</span>
                        <input
                          type="number"
                          step="500"
                          placeholder="e.g. 8000"
                          value={catBudgetLimitsInput[cat.label] || ''}
                          onChange={(e) =>
                            setCatBudgetLimitsInput({
                              ...catBudgetLimitsInput,
                              [cat.label]: e.target.value
                            })
                          }
                          className="w-24 px-2 py-1 bg-[#141826] border border-white/10 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-pastel-sky"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingBudget}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pastel-sky to-pastel-mint text-slate-950 font-bold text-xs shadow-glow-sky hover:opacity-95 transition flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isSubmittingBudget && <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-950" />}
                  <span>{isSubmittingBudget ? 'Saving Budgets...' : 'Save Budgets'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

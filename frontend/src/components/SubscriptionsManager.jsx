import React, { useState, useEffect, useMemo } from 'react'
import {
  Repeat,
  Plus,
  Calendar,
  CreditCard,
  AlertTriangle,
  Clock,
  Sparkles,
  Pencil,
  Trash2,
  CheckCircle2,
  PauseCircle,
  XCircle,
  X,
  Loader2,
  Layers,
  Tag
} from 'lucide-react'
import { subscriptionsAPI } from '../services/api'
import { formatINR, TRANSACTION_CATEGORIES, PAYMENT_METHODS } from '../pages/HomePage'

// Popular Indian & Global subscription presets
const SUBSCRIPTION_PRESETS = [
  { name: 'Netflix', amount: 499, cycle: 'monthly', category: 'Entertainment & Subscriptions', method: 'UPI (Google Pay / PhonePe / Paytm)', icon: '🍿' },
  { name: 'Spotify Premium', amount: 119, cycle: 'monthly', category: 'Entertainment & Subscriptions', method: 'Credit Card', icon: '🎵' },
  { name: 'Amazon Prime', amount: 1499, cycle: 'annual', category: 'Shopping', method: 'Credit Card', icon: '📦' },
  { name: 'YouTube Premium', amount: 129, cycle: 'monthly', category: 'Entertainment & Subscriptions', method: 'UPI (Google Pay / PhonePe / Paytm)', icon: '▶️' },
  { name: 'Cult.fit Gym & Fitness', amount: 1800, cycle: 'monthly', category: 'Health & Pharmacy', method: 'UPI (Google Pay / PhonePe / Paytm)', icon: '🏋️' },
  { name: 'Airtel / Jio Fiber WiFi', amount: 999, cycle: 'monthly', category: 'Utilities & Bills', method: 'Net Banking', icon: '⚡' },
  { name: 'Google One / Cloud', amount: 130, cycle: 'monthly', category: 'Utilities & Bills', method: 'Credit Card', icon: '☁️' },
  { name: 'Disney+ Hotstar', amount: 899, cycle: 'annual', category: 'Entertainment & Subscriptions', method: 'UPI (Google Pay / PhonePe / Paytm)', icon: '⭐' },
  { name: 'ChatGPT Plus / AI', amount: 1999, cycle: 'monthly', category: 'General / Other', method: 'Credit Card', icon: '🤖' }
]

// Initial sample subscriptions in INR for demo
const INITIAL_DEMO_SUBS = [
  {
    id: 1,
    name: 'Netflix 4K Ultra',
    amount: 649,
    billing_cycle: 'monthly',
    next_billing_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    category: 'Entertainment & Subscriptions',
    payment_method: 'Credit Card',
    status: 'active'
  },
  {
    id: 2,
    name: 'Spotify Premium Family',
    amount: 179,
    billing_cycle: 'monthly',
    next_billing_date: new Date(Date.now() + 86400000 * 8).toISOString().split('T')[0],
    category: 'Entertainment & Subscriptions',
    payment_method: 'UPI (Google Pay / PhonePe / Paytm)',
    status: 'active'
  },
  {
    id: 3,
    name: 'Airtel Xstream Fiber WiFi',
    amount: 999,
    billing_cycle: 'monthly',
    next_billing_date: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
    category: 'Utilities & Bills',
    payment_method: 'Net Banking',
    status: 'active'
  },
  {
    id: 4,
    name: 'Amazon Prime Annual',
    amount: 1499,
    billing_cycle: 'annual',
    next_billing_date: new Date(Date.now() + 86400000 * 85).toISOString().split('T')[0],
    category: 'Shopping',
    payment_method: 'Credit Card',
    status: 'active'
  }
]

export default function SubscriptionsManager({ isRealUser, onToast }) {
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSub, setEditingSub] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form State
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [nextBillingDate, setNextBillingDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 15)
    return d.toISOString().split('T')[0]
  })
  const [category, setCategory] = useState(TRANSACTION_CATEGORIES[6]?.label || 'Entertainment & Subscriptions')
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0])
  const [status, setStatus] = useState('active')

  // Load subscriptions from backend database or demo localStorage
  const loadSubscriptions = async () => {
    if (isRealUser) {
      setLoading(true)
      try {
        const res = await subscriptionsAPI.list()
        if (Array.isArray(res.data)) {
          setSubscriptions(res.data)
        }
      } catch (err) {
        console.error('Failed to load subscriptions from server:', err)
      } finally {
        setLoading(false)
      }
    } else {
      try {
        const saved = localStorage.getItem('fintrack_demo_subscriptions')
        if (saved) {
          setSubscriptions(JSON.parse(saved))
        } else {
          localStorage.setItem('fintrack_demo_subscriptions', JSON.stringify(INITIAL_DEMO_SUBS))
          setSubscriptions(INITIAL_DEMO_SUBS)
        }
      } catch {
        setSubscriptions(INITIAL_DEMO_SUBS)
      }
    }
  }

  useEffect(() => {
    loadSubscriptions()
  }, [isRealUser])

  // Monthly Recurring Burn calculation
  const totalMonthlyBurn = useMemo(() => {
    return subscriptions
      .filter((s) => s.status === 'active')
      .reduce((acc, s) => {
        const amt = Number(s.amount) || 0
        const cycle = (s.billing_cycle || 'monthly').toLowerCase()
        if (cycle === 'annual' || cycle === 'yearly') {
          return acc + amt / 12
        } else if (cycle === 'weekly') {
          return acc + amt * 4.33
        }
        return acc + amt
      }, 0)
  }, [subscriptions])

  // Count active services
  const activeCount = useMemo(() => {
    return subscriptions.filter((s) => s.status === 'active').length
  }, [subscriptions])

  // Calculate upcoming renewal countdowns
  const calculateDaysUntil = (dateStr) => {
    if (!dateStr) return null
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const renewal = new Date(dateStr)
      renewal.setHours(0, 0, 0, 0)
      const diffTime = renewal - today
      return Math.round(diffTime / (1000 * 60 * 60 * 24))
    } catch {
      return null
    }
  }

  // Find nearest upcoming renewal
  const nearestRenewal = useMemo(() => {
    const activeSubs = subscriptions.filter((s) => s.status === 'active')
    if (activeSubs.length === 0) return null

    let nearest = null
    let minDays = Infinity

    activeSubs.forEach((s) => {
      const days = calculateDaysUntil(s.next_billing_date)
      if (days !== null && days >= 0 && days < minDays) {
        minDays = days
        nearest = { ...s, daysUntil: days }
      }
    })

    return nearest
  }, [subscriptions])

  // Open Add modal with clean state
  const handleOpenAddModal = () => {
    setEditingSub(null)
    setName('')
    setAmount('')
    setBillingCycle('monthly')
    const d = new Date()
    d.setDate(d.getDate() + 14)
    setNextBillingDate(d.toISOString().split('T')[0])
    setCategory(TRANSACTION_CATEGORIES[6]?.label || 'Entertainment & Subscriptions')
    setPaymentMethod(PAYMENT_METHODS[0])
    setStatus('active')
    setIsModalOpen(true)
  }

  // Open Edit modal with pre-filled state
  const handleOpenEditModal = (sub) => {
    setEditingSub(sub)
    setName(sub.name || '')
    setAmount(String(sub.amount || ''))
    setBillingCycle(sub.billing_cycle || 'monthly')
    setNextBillingDate(sub.next_billing_date || '')
    setCategory(sub.category || TRANSACTION_CATEGORIES[6]?.label || 'Entertainment & Subscriptions')
    setPaymentMethod(sub.payment_method || PAYMENT_METHODS[0])
    setStatus(sub.status || 'active')
    setIsModalOpen(true)
  }

  // Apply a preset
  const handleApplyPreset = (preset) => {
    setName(preset.name)
    setAmount(String(preset.amount))
    setBillingCycle(preset.cycle)
    setCategory(preset.category)
    setPaymentMethod(preset.method)
  }

  // Save (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault()
    const numAmount = parseFloat(amount)
    if (!name.trim() || isNaN(numAmount) || numAmount <= 0 || !nextBillingDate) {
      alert('Please enter a valid subscription name, positive amount, and next renewal date.')
      return
    }

    const payload = {
      name: name.trim(),
      amount: numAmount,
      billing_cycle: billingCycle,
      next_billing_date: nextBillingDate,
      category,
      payment_method: paymentMethod,
      status
    }

    setIsSubmitting(true)

    if (isRealUser) {
      try {
        if (editingSub) {
          const res = await subscriptionsAPI.update(editingSub.id, payload)
          setSubscriptions((prev) =>
            prev.map((s) => (s.id === editingSub.id ? res.data : s))
          )
          if (onToast) onToast(`Updated "${res.data.name}" subscription`)
        } else {
          const res = await subscriptionsAPI.create(payload)
          setSubscriptions((prev) => [...prev, res.data])
          if (onToast) onToast(`Added "${res.data.name}" committed recurring subscription`)
        }
        setIsModalOpen(false)
      } catch (err) {
        console.error('Failed to save subscription:', err)
        alert('Failed to save subscription: ' + (err.response?.data?.detail || err.message))
      } finally {
        setIsSubmitting(false)
      }
      return
    }

    // Guest / Demo mode fallback
    if (editingSub) {
      const updatedList = subscriptions.map((s) =>
        s.id === editingSub.id ? { ...s, ...payload } : s
      )
      setSubscriptions(updatedList)
      localStorage.setItem('fintrack_demo_subscriptions', JSON.stringify(updatedList))
      if (onToast) onToast(`Updated "${payload.name}"`)
    } else {
      const newSub = {
        id: Date.now(),
        ...payload
      }
      const updatedList = [...subscriptions, newSub]
      setSubscriptions(updatedList)
      localStorage.setItem('fintrack_demo_subscriptions', JSON.stringify(updatedList))
      if (onToast) onToast(`Added "${payload.name}"`)
    }

    setIsSubmitting(false)
    setIsModalOpen(false)
  }

  // Delete / Cancel subscription
  const handleDeleteSub = async (id, subName) => {
    if (!window.confirm(`Are you sure you want to remove "${subName}" from your subscriptions?`)) {
      return
    }

    if (isRealUser) {
      try {
        await subscriptionsAPI.delete(id)
        setSubscriptions((prev) => prev.filter((s) => s.id !== id))
        if (onToast) onToast(`Removed "${subName}" subscription`)
      } catch (err) {
        console.error('Failed to delete subscription:', err)
        alert('Failed to delete: ' + (err.response?.data?.detail || err.message))
      }
    } else {
      const updated = subscriptions.filter((s) => s.id !== id)
      setSubscriptions(updated)
      localStorage.setItem('fintrack_demo_subscriptions', JSON.stringify(updated))
      if (onToast) onToast(`Removed "${subName}"`)
    }
  }

  // Quick toggle status (e.g. pause / resume)
  const handleToggleStatus = async (sub) => {
    const nextStatus = sub.status === 'active' ? 'paused' : 'active'
    if (isRealUser) {
      try {
        const res = await subscriptionsAPI.update(sub.id, { status: nextStatus })
        setSubscriptions((prev) =>
          prev.map((s) => (s.id === sub.id ? res.data : s))
        )
        if (onToast) onToast(`Marked ${sub.name} as ${nextStatus}`)
      } catch (err) {
        console.error('Failed to toggle status:', err)
      }
    } else {
      const updated = subscriptions.map((s) =>
        s.id === sub.id ? { ...s, status: nextStatus } : s
      )
      setSubscriptions(updated)
      localStorage.setItem('fintrack_demo_subscriptions', JSON.stringify(updated))
      if (onToast) onToast(`Marked ${sub.name} as ${nextStatus}`)
    }
  }

  return (
    <section className="space-y-4">
      {/* SECTION HEADER & METRIC SUMMARY */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-pastel-purple/15 text-pastel-purple border border-pastel-purple/20">
            <Repeat className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg sm:text-xl font-bold text-white font-display">
                Recurring Subscriptions
              </h2>
              <span className="text-xs bg-pastel-purple/15 text-pastel-purple border border-pastel-purple/30 px-2 py-0.5 rounded-full font-mono">
                {activeCount} Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated recurring commitments, streaming services, and utility bills
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleOpenAddModal}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-pastel-purple to-pastel-pink text-slate-950 font-bold text-xs shadow-glow-purple hover:scale-[1.02] active:scale-[0.98] transition flex items-center space-x-1.5"
          >
            <Plus className="h-3.5 w-3.5 stroke-[3]" />
            <span>Add Subscription</span>
          </button>
        </div>
      </div>

      {/* RECURRING BURN & UPCOMING RENEWAL BANNER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1: Monthly Recurring Burn */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-pastel-purple/30 transition flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">Total Monthly Burn</span>
            <span className="px-2 py-0.5 rounded-full bg-pastel-purple/10 text-pastel-purple font-mono text-[10px] font-bold">
              Committed
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
            ₹{formatINR(totalMonthlyBurn)}
            <span className="text-xs font-normal text-slate-400 font-mono ml-1.5">/ month</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center space-x-1">
            <span>Projected Annual:</span>
            <span className="font-mono text-pastel-purple font-semibold">
              ₹{formatINR(totalMonthlyBurn * 12)} / yr
            </span>
          </div>
        </div>

        {/* Metric 2: Upcoming Renewal Countdown */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-pastel-sky/30 transition flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">Upcoming Renewal</span>
            <Clock className="h-4 w-4 text-pastel-sky" />
          </div>
          {nearestRenewal ? (
            <div>
              <div className="text-lg font-bold text-white truncate flex items-center space-x-1.5">
                <span>{nearestRenewal.name}</span>
              </div>
              <div className="text-xs font-mono text-pastel-sky font-semibold mt-1">
                {nearestRenewal.daysUntil === 0
                  ? '⚡ Renews Today!'
                  : nearestRenewal.daysUntil === 1
                  ? '⏰ Renews Tomorrow'
                  : `📅 Renews in ${nearestRenewal.daysUntil} days (${nearestRenewal.next_billing_date})`}
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400">No active renewals scheduled</div>
          )}
          <div className="text-[11px] text-slate-400 mt-2">
            {nearestRenewal ? `Auto-debit of ₹${formatINR(nearestRenewal.amount)} via ${nearestRenewal.payment_method || 'Saved Card'}` : 'All subscriptions are up to date'}
          </div>
        </div>

        {/* Metric 3: Optimization / Burn Insight */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-pastel-mint/30 transition flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">Commitment Ratio</span>
            <Sparkles className="h-4 w-4 text-pastel-mint" />
          </div>
          <div className="text-2xl font-bold text-white font-display">
            {activeCount} Subscriptions
          </div>
          <div className="text-[11px] text-slate-300 mt-2 leading-relaxed">
            Recurring commitments make up a predictable baseline. Review dormant subscriptions every 30 days to optimize savings.
          </div>
        </div>
      </div>

      {/* SUBSCRIPTIONS CARDS GRID */}
      {loading ? (
        <div className="glass-panel p-8 rounded-2xl border border-white/5 flex flex-col items-center justify-center space-y-2 text-slate-400 text-xs">
          <Loader2 className="h-5 w-5 text-pastel-purple animate-spin" />
          <span>Loading subscriptions...</span>
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="glass-panel p-8 rounded-2xl border border-white/5 text-center text-slate-400 text-xs flex flex-col items-center space-y-3">
          <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500">
            <Repeat className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-white">No recurring subscriptions tracked yet</p>
            <p className="text-slate-400 mt-0.5">Keep tabs on your Netflix, Spotify, Gym, WiFi, and cloud services in one place.</p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition"
          >
            + Add First Subscription
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {subscriptions.map((sub) => {
            const daysUntil = calculateDaysUntil(sub.next_billing_date)
            const isNear = daysUntil !== null && daysUntil >= 0 && daysUntil <= 3
            const isOverdue = daysUntil !== null && daysUntil < 0

            return (
              <div
                key={sub.id}
                className={`glass-panel p-4.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between group relative overflow-hidden ${
                  sub.status === 'paused'
                    ? 'border-white/5 opacity-60 bg-white/[0.01]'
                    : isNear
                    ? 'border-amber-500/40 bg-amber-500/[0.03]'
                    : 'border-white/10 hover:border-pastel-purple/40'
                }`}
              >
                <div>
                  {/* Top Bar: Category & Status */}
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 truncate max-w-[130px]">
                      {sub.category || 'Subscription'}
                    </span>
                    <div className="flex items-center space-x-1">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold capitalize ${
                          sub.status === 'active'
                            ? 'bg-pastel-mint/15 text-pastel-mint border border-pastel-mint/30'
                            : sub.status === 'paused'
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>
                  </div>

                  {/* Title & Amount */}
                  <h3 className="text-sm font-bold text-white group-hover:text-pastel-purple transition truncate">
                    {sub.name}
                  </h3>

                  <div className="mt-1 flex items-baseline space-x-1">
                    <span className="text-lg font-extrabold text-white font-mono">
                      ₹{formatINR(sub.amount)}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      /{sub.billing_cycle === 'annual' ? 'yr' : sub.billing_cycle === 'weekly' ? 'wk' : 'mo'}
                    </span>
                  </div>

                  {/* Payment Method */}
                  <div className="mt-2.5 flex items-center space-x-1.5 text-[11px] text-slate-400 truncate">
                    <CreditCard className="h-3 w-3 flex-shrink-0 text-slate-500" />
                    <span className="truncate">{sub.payment_method || 'Standard Payment'}</span>
                  </div>
                </div>

                {/* Footer: Countdown & Actions */}
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-mono uppercase">Next Renewal</span>
                    <span
                      className={`text-[11px] font-mono font-semibold ${
                        isOverdue
                          ? 'text-rose-400'
                          : isNear
                          ? 'text-amber-300'
                          : 'text-slate-300'
                      }`}
                    >
                      {daysUntil === 0
                        ? 'Today'
                        : daysUntil === 1
                        ? 'Tomorrow'
                        : daysUntil !== null && daysUntil > 1
                        ? `In ${daysUntil}d`
                        : isOverdue
                        ? 'Overdue'
                        : sub.next_billing_date}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleToggleStatus(sub)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
                      title={sub.status === 'active' ? 'Pause subscription' : 'Activate subscription'}
                    >
                      {sub.status === 'active' ? (
                        <PauseCircle className="h-3.5 w-3.5 text-amber-400" />
                      ) : (
                        <CheckCircle2 className="h-3.5 w-3.5 text-pastel-mint" />
                      )}
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(sub)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
                      title="Edit Subscription"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSub(sub.id, sub.name)}
                      className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition"
                      title="Cancel / Delete Subscription"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ADD / EDIT / CANCEL MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-lg glass-panel p-6 sm:p-7 rounded-3xl border border-white/15 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center space-x-2.5 mb-4">
              <div className="p-2 rounded-xl bg-pastel-purple/15 text-pastel-purple border border-pastel-purple/20">
                <Repeat className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  {editingSub ? 'Edit Subscription' : 'Add Recurring Subscription'}
                </h3>
                <p className="text-xs text-slate-400">
                  Track recurring service payments and receive automated 3-day renewal alerts
                </p>
              </div>
            </div>

            {/* Quick Presets (Only in Add mode) */}
            {!editingSub && (
              <div className="mb-4 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-2">
                  Quick Presets
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SUBSCRIPTION_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-medium text-slate-200 border border-white/5 transition flex items-center space-x-1"
                    >
                      <span>{preset.icon}</span>
                      <span>{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1.5">
                  Subscription Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Netflix, Spotify, Gym, WiFi, Cloud"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#121624] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pastel-purple"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1.5">
                    Amount (₹ INR) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 499"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121624] border border-white/10 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-pastel-purple"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1.5">
                    Billing Cycle
                  </label>
                  <select
                    value={billingCycle}
                    onChange={(e) => setBillingCycle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121624] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-pastel-purple"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="annual">Annual / Yearly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1.5">
                    Next Billing Date *
                  </label>
                  <input
                    type="date"
                    value={nextBillingDate}
                    onChange={(e) => setNextBillingDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121624] border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-pastel-purple"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1.5">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121624] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-pastel-purple"
                  >
                    <option value="active">Active (Ongoing)</option>
                    <option value="paused">Paused (Temporary hold)</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121624] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-pastel-purple"
                  >
                    {TRANSACTION_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.label}>
                        {c.icon} {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1.5">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121624] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-pastel-purple"
                  >
                    {PAYMENT_METHODS.map((pm) => (
                      <option key={pm} value={pm}>
                        {pm}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pastel-purple to-pastel-pink text-slate-950 font-bold text-xs shadow-glow-purple hover:opacity-95 transition flex items-center space-x-1.5 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{editingSub ? 'Update Subscription' : 'Save Subscription'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

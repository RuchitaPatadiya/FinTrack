import React, { useState, useEffect, useMemo } from 'react'
import {
  Landmark,
  ArrowLeft,
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart,
  Calendar,
  Wallet,
  PiggyBank,
  ArrowUpRight,
  ArrowDownLeft,
  Percent,
  Layers,
  LogOut,
  Loader2,
  CalendarDays
} from 'lucide-react'
import { transactionsAPI, categoriesAPI } from '../services/api'
import { formatINR, formatINRLarge, TRANSACTION_CATEGORIES } from './HomePage'

export default function AnalyticsPage({ user, onNavigate, onLogout }) {
  const isRealUser = Boolean(
    user &&
    user.auth_provider !== 'demo' &&
    user.auth_provider !== 'guest' &&
    localStorage.getItem('fintrack_token')
  )

  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState(TRANSACTION_CATEGORIES)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('all') // 'all', '30d', '90d', '1y'

  useEffect(() => {
    if (isRealUser) {
      setLoading(true)
      categoriesAPI
        .list()
        .then((res) => {
          if (Array.isArray(res.data) && res.data.length > 0) {
            setCategories(
              res.data.map((c) => ({
                id: c.id,
                label: c.name,
                icon: c.icon || '📦',
                color: c.color || 'slate',
                isIncome: c.type === 'income'
              }))
            )
          }
        })
        .catch(() => {})

      transactionsAPI
        .list({ limit: 500 })
        .then((res) => {
          if (Array.isArray(res.data)) {
            setTransactions(res.data)
          }
        })
        .catch((err) => {
          console.error('Failed to load transactions for analytics:', err)
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      try {
        const saved = localStorage.getItem('fintrack_tx_list')
        if (saved) {
          setTransactions(JSON.parse(saved))
        }
      } catch {}
      setLoading(false)
    }
  }, [isRealUser])

  // Filter transactions by timeframe
  const filteredTx = useMemo(() => {
    if (timeframe === 'all') return transactions

    const now = new Date()
    let daysToSubtract = 30
    if (timeframe === '90d') daysToSubtract = 90
    if (timeframe === '1y') daysToSubtract = 365

    const cutoff = new Date(now.getTime() - daysToSubtract * 24 * 60 * 60 * 1000)
    const cutoffStr = cutoff.toISOString().split('T')[0]

    return transactions.filter((tx) => (tx.date || '') >= cutoffStr)
  }, [transactions, timeframe])

  // Aggregate metrics
  const { totalIncome, totalExpenses, netSavings, savingsRate, avgTx } = useMemo(() => {
    let inc = 0
    let exp = 0
    filteredTx.forEach((tx) => {
      const amt = Number(tx.amount) || 0
      if (tx.type === 'income') inc += amt
      else exp += amt
    })
    const savings = inc - exp
    const rate = inc > 0 ? Math.max(0, Math.round((savings / inc) * 100)) : 0
    const avg = filteredTx.length > 0 ? (inc + exp) / filteredTx.length : 0

    return {
      totalIncome: inc,
      totalExpenses: exp,
      netSavings: savings,
      savingsRate: rate,
      avgTx: avg
    }
  }, [filteredTx])

  // Monthly Income vs Expense Breakdown
  const monthlyData = useMemo(() => {
    const map = {}
    filteredTx.forEach((tx) => {
      const month = (tx.date || '').substring(0, 7) // YYYY-MM
      if (!month) return
      if (!map[month]) {
        map[month] = { month, income: 0, expense: 0 }
      }
      const amt = Number(tx.amount) || 0
      if (tx.type === 'income') map[month].income += amt
      else map[month].expense += amt
    })

    const sorted = Object.values(map).sort((a, b) => a.month.localeCompare(b.month))
    const maxVal = Math.max(...sorted.map((m) => Math.max(m.income, m.expense)), 1)

    return { sorted, maxVal }
  }, [filteredTx])

  // Category Expense Breakdown
  const categoryData = useMemo(() => {
    const expenseMap = {}
    let totalExp = 0

    filteredTx
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
        const catObj = categories.find((c) => c.label === category)
        return {
          category,
          amount,
          percentage: pct,
          color: catObj?.color || 'slate',
          icon: catObj?.icon || '📦'
        }
      })
      .sort((a, b) => b.amount - a.amount)
  }, [filteredTx])

  // Top Merchants / Items
  const topMerchants = useMemo(() => {
    const map = {}
    filteredTx
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const title = (t.title || 'Other').trim()
        map[title] = (map[title] || 0) + (Number(t.amount) || 0)
      })

    return Object.entries(map)
      .map(([title, amount]) => ({ title, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
  }, [filteredTx])

  // Day of Week Distribution
  const dayOfWeekData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const counts = [0, 0, 0, 0, 0, 0, 0]

    filteredTx
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        if (!t.date) return
        const d = new Date(t.date).getDay()
        if (!isNaN(d)) {
          counts[d] += Number(t.amount) || 0
        }
      })

    const maxDay = Math.max(...counts, 1)
    return days.map((day, idx) => ({
      day,
      amount: counts[idx],
      heightPct: Math.round((counts[idx] / maxDay) * 100)
    }))
  }, [filteredTx])

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 bg-chic-mesh bg-grid-chic pb-24 relative selection:bg-pastel-pink selection:text-black">
      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 glass-panel border-b border-white/5 px-4 sm:px-8 py-3.5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
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

            {/* Quick Page Tabs */}
            <div className="hidden md:flex items-center space-x-1 bg-white/5 border border-white/10 p-1 rounded-full text-xs font-medium">
              <button
                onClick={() => onNavigate('home')}
                className="px-3.5 py-1 rounded-full text-slate-400 hover:text-white transition"
              >
                Dashboard
              </button>
              <button className="px-3.5 py-1 rounded-full bg-white/10 text-pastel-sky font-semibold shadow-sm flex items-center space-x-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-pastel-sky" />
                <span>Analytics</span>
              </button>
              <button
                onClick={() => onNavigate('profile')}
                className="px-3.5 py-1 rounded-full text-slate-400 hover:text-white transition"
              >
                Profile & Settings
              </button>
            </div>
          </div>

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
              onClick={() => {
                if (onLogout) onLogout()
                onNavigate('landing')
              }}
              className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-semibold transition flex items-center space-x-1.5 shadow-sm active:scale-95"
              title="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* BODY */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* HEADER TITLE & TIMEFRAME FILTER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <BarChart3 className="h-5 w-5 text-pastel-sky" />
              <h1 className="text-2xl font-extrabold text-white font-display tracking-tight">
                Financial Insights & Analytics
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Deep dive into your cashflow trends, spending velocity, and category allocations.
            </p>
          </div>

          {/* Timeframe selector pills */}
          <div className="flex items-center space-x-1 bg-white/5 p-1 rounded-2xl border border-white/10 text-xs self-start sm:self-auto">
            {[
              { id: '30d', label: '30 Days' },
              { id: '90d', label: '90 Days' },
              { id: '1y', label: '1 Year' },
              { id: 'all', label: 'All Time' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTimeframe(t.id)}
                className={`px-3.5 py-1.5 rounded-xl font-medium transition ${
                  timeframe === t.id
                    ? 'bg-pastel-sky text-slate-950 font-bold shadow-glow-sky'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="glass-panel p-16 rounded-3xl border border-white/5 flex flex-col items-center justify-center space-y-3 text-slate-400 text-xs">
            <Loader2 className="h-8 w-8 text-pastel-sky animate-spin" />
            <span>Analyzing your financial activity...</span>
          </div>
        ) : filteredTx.length === 0 ? (
          <div className="glass-panel p-16 rounded-3xl border border-white/5 text-center text-slate-400 text-sm">
            No transactions found for the selected timeframe. Log transactions to see full analytics!
          </div>
        ) : (
          <>
            {/* STATS OVERVIEW CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Inflow</span>
                <div className="text-2xl font-extrabold text-pastel-sky font-display mt-2">
                  ₹{formatINR(totalIncome)}
                </div>
                <div className="mt-2 text-xs text-pastel-mint flex items-center space-x-1">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>{filteredTx.filter((t) => t.type === 'income').length} income records</span>
                </div>
              </div>

              <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Outflow</span>
                <div className="text-2xl font-extrabold text-pastel-pink font-display mt-2">
                  ₹{formatINR(totalExpenses)}
                </div>
                <div className="mt-2 text-xs text-slate-400 flex items-center space-x-1">
                  <TrendingDown className="h-3.5 w-3.5 text-pastel-pink" />
                  <span>{filteredTx.filter((t) => t.type === 'expense').length} expense debits</span>
                </div>
              </div>

              <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Net Surplus / Savings</span>
                <div
                  className={`text-2xl font-extrabold font-display mt-2 ${
                    netSavings >= 0 ? 'text-pastel-mint' : 'text-rose-400'
                  }`}
                >
                  {netSavings >= 0 ? '+' : '-'}₹{formatINR(Math.abs(netSavings))}
                </div>
                <div className="mt-2 text-xs text-slate-300 flex items-center space-x-1">
                  <Percent className="h-3.5 w-3.5 text-pastel-yellow" />
                  <span>{savingsRate}% Savings Rate</span>
                </div>
              </div>

              <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Avg Transaction</span>
                <div className="text-2xl font-extrabold text-white font-display mt-2">
                  ₹{formatINR(avgTx)}
                </div>
                <div className="mt-2 text-xs text-slate-400">
                  Across {filteredTx.length} total entries
                </div>
              </div>
            </div>

            {/* MONTHLY BAR CHART */}
            <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-white/10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    Monthly Cashflow (Income vs Expense)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Month-over-month comparison of your total earnings and spending.
                  </p>
                </div>
                <div className="flex items-center space-x-4 text-xs font-mono">
                  <div className="flex items-center space-x-1.5">
                    <span className="h-3 w-3 rounded-full bg-pastel-sky" />
                    <span className="text-slate-300">Income</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="h-3 w-3 rounded-full bg-pastel-pink" />
                    <span className="text-slate-300">Expense</span>
                  </div>
                </div>
              </div>

              {monthlyData.sorted.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Not enough monthly data to render graph.
                </div>
              ) : (
                <div className="pt-4 pb-2">
                  <div className="h-56 flex items-end justify-around gap-2 sm:gap-6 border-b border-white/10 pb-2">
                    {monthlyData.sorted.map((m) => {
                      const incHeight = Math.round((m.income / monthlyData.maxVal) * 100)
                      const expHeight = Math.round((m.expense / monthlyData.maxVal) * 100)

                      return (
                        <div key={m.month} className="flex-1 flex flex-col items-center h-full justify-end group">
                          <div className="w-full flex items-end justify-center space-x-1 sm:space-x-2 h-full">
                            {/* Income Bar */}
                            <div
                              style={{ height: `${Math.max(incHeight, 4)}%` }}
                              className="w-1/2 max-w-[28px] bg-pastel-sky rounded-t-lg transition-all duration-300 hover:brightness-110 relative"
                              title={`Income: ₹${formatINR(m.income)}`}
                            />
                            {/* Expense Bar */}
                            <div
                              style={{ height: `${Math.max(expHeight, 4)}%` }}
                              className="w-1/2 max-w-[28px] bg-pastel-pink rounded-t-lg transition-all duration-300 hover:brightness-110 relative"
                              title={`Expense: ₹${formatINR(m.expense)}`}
                            />
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 mt-2 whitespace-nowrap">
                            {m.month}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* TWO COLUMNS: CATEGORY BREAKDOWN & TOP SPENDERS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Category Allocations (7 cols) */}
              <div className="lg:col-span-7 glass-panel p-6 sm:p-7 rounded-3xl border border-white/10 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white font-display">
                      Expense Distribution by Category
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Where your funds were deployed in this timeframe.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {categoryData.length} Categories
                  </span>
                </div>

                {categoryData.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No expense entries found.</p>
                ) : (
                  <>
                    {/* Visual Segmented Bar */}
                    <div className="w-full h-3 rounded-full bg-[#181C2B] overflow-hidden flex">
                      {categoryData.map((cat, idx) => {
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
                            title={`${cat.category}: ₹${formatINR(cat.amount)} (${cat.percentage}%)`}
                          />
                        )
                      })}
                    </div>

                    <div className="space-y-3 pt-2">
                      {categoryData.map((cat, idx) => {
                        const dotClasses = {
                          mint: 'bg-pastel-mint',
                          sky: 'bg-pastel-sky',
                          yellow: 'bg-pastel-yellow',
                          pink: 'bg-pastel-pink',
                          purple: 'bg-pastel-purple',
                          peach: 'bg-pastel-peach',
                          slate: 'bg-slate-400'
                        }[cat.color] || 'bg-slate-400'

                        return (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2.5">
                              <span className={`h-2.5 w-2.5 rounded-full ${dotClasses}`} />
                              <span className="text-slate-200">
                                {cat.icon} {cat.category}
                              </span>
                            </div>
                            <div className="flex items-center space-x-3 font-mono">
                              <span className="text-white font-semibold">₹{formatINR(cat.amount)}</span>
                              <span className="text-slate-400 font-bold w-10 text-right">
                                {cat.percentage}%
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Day of Week & Top Spenders (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                {/* Day of Week Spend Intensity */}
                <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white font-display">
                      Daily Spending Intensity
                    </h3>
                    <CalendarDays className="h-4 w-4 text-pastel-mint" />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Distribution of expenses across days of the week.
                  </p>

                  <div className="h-28 flex items-end justify-between gap-2 pt-2 border-b border-white/10 pb-2">
                    {dayOfWeekData.map((d) => (
                      <div key={d.day} className="flex-1 flex flex-col items-center h-full justify-end">
                        <div
                          style={{ height: `${Math.max(d.heightPct, 8)}%` }}
                          className="w-full max-w-[20px] bg-gradient-to-t from-pastel-mint/40 to-pastel-mint rounded-t-md hover:brightness-125 transition"
                          title={`${d.day}: ₹${formatINR(d.amount)}`}
                        />
                        <span className="text-[10px] font-mono text-slate-400 mt-1">{d.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top 5 Merchant / Title Spends */}
                <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white font-display">
                      Top Expense Outlets
                    </h3>
                    <span className="text-[10px] font-mono uppercase text-slate-400">Ranked</span>
                  </div>

                  {topMerchants.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No expense entries found.</p>
                  ) : (
                    <div className="space-y-2.5">
                      {topMerchants.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="h-5 w-5 rounded-lg bg-pastel-sky/15 text-pastel-sky font-bold font-mono text-[10px] flex items-center justify-center">
                              #{idx + 1}
                            </span>
                            <span className="text-slate-200 font-medium truncate max-w-[150px] sm:max-w-[180px]">
                              {item.title}
                            </span>
                          </div>
                          <span className="font-mono font-bold text-white">
                            ₹{formatINR(item.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

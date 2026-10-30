import React from 'react'
import {
  Printer,
  X,
  Landmark,
  Download,
  Calendar,
  User,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  FileText
} from 'lucide-react'
import { formatINR } from '../pages/HomePage'

export default function StatementPreviewModal({
  isOpen,
  onClose,
  user,
  transactions = [],
  startDate,
  endDate,
  periodName = 'Financial Statement'
}) {
  if (!isOpen) return null

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0)

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0)

  const netSavings = totalIncome - totalExpense
  const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0

  // Category breakdown
  const categoryMap = {}
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const cat = t.category || 'General'
      categoryMap[cat] = (categoryMap[cat] || 0) + (Number(t.amount) || 0)
    })

  const sortedCategories = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])

  const handlePrint = () => {
    window.print()
  }

  const statementRef = `FT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`
  const generatedDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      {/* Control Floating Header (Hidden when printing) */}
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-2 no-print">
        <button
          onClick={handlePrint}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pastel-mint to-pastel-sky text-slate-950 font-bold text-xs shadow-glow-mint hover:scale-[1.02] active:scale-[0.98] transition flex items-center space-x-2"
        >
          <Printer className="h-4 w-4 stroke-[2.5]" />
          <span>Print / Save as PDF</span>
        </button>
        <button
          onClick={onClose}
          className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
          title="Close Preview"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Printable Document Paper */}
      <div className="w-full max-w-4xl bg-white text-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl printable-statement-container my-8 max-h-[92vh] overflow-y-auto">
        {/* STATEMENT HEADER */}
        <div className="border-b-2 border-slate-200 pb-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="h-11 w-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md">
                <Landmark className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight font-display">
                  FinTrack
                </h1>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Personal Financial Statement & Cashflow Ledger
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-500 space-y-0.5">
              <div className="font-mono font-bold text-slate-900 text-sm">
                Ref: #{statementRef}
              </div>
              <div>Generated: {generatedDate}</div>
              <div>Currency: Indian Rupee (INR ₹)</div>
            </div>
          </div>
        </div>

        {/* METADATA BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 mb-6 text-xs">
          <div>
            <span className="font-mono uppercase text-[10px] text-slate-400 font-bold block mb-1">
              Account Holder
            </span>
            <div className="font-bold text-slate-900 text-sm">{user?.full_name || 'FinTrack Client'}</div>
            <div className="text-slate-600 font-mono text-[11px]">{user?.email || 'user@fintrack.app'}</div>
          </div>

          <div className="sm:text-right">
            <span className="font-mono uppercase text-[10px] text-slate-400 font-bold block mb-1">
              Statement Reporting Period
            </span>
            <div className="font-bold text-slate-900">{periodName}</div>
            <div className="text-slate-600 font-mono text-[11px]">
              {startDate || 'Beginning'} &rarr; {endDate || 'Present'}
            </div>
          </div>
        </div>

        {/* EXECUTIVE CASHFLOW SUMMARY */}
        <div className="mb-6">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2.5">
            Executive Cashflow Summary
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Total Inflow</span>
              <span className="text-base sm:text-lg font-bold text-emerald-600 font-mono">
                +₹{formatINR(totalIncome)}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Total Outflow</span>
              <span className="text-base sm:text-lg font-bold text-rose-600 font-mono">
                -₹{formatINR(totalExpense)}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Net Savings</span>
              <span className={`text-base sm:text-lg font-bold font-mono ${netSavings >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
                {netSavings >= 0 ? '+' : ''}₹{formatINR(netSavings)}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Savings Rate</span>
              <span className="text-base sm:text-lg font-bold text-blue-600 font-mono">
                {savingsRate}%
              </span>
            </div>
          </div>
        </div>

        {/* TOP SPENDING CATEGORIES BREAKDOWN */}
        {sortedCategories.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Expense Distribution By Category
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {sortedCategories.slice(0, 6).map(([cat, amt]) => {
                const pct = totalExpense > 0 ? Math.round((amt / totalExpense) * 100) : 0
                return (
                  <div key={cat} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex justify-between items-center">
                    <span className="font-medium text-slate-700 truncate pr-2">{cat}</span>
                    <span className="font-mono font-bold text-slate-900 whitespace-nowrap">
                      ₹{formatINR(amt)} <span className="text-[10px] text-slate-500 font-normal">({pct}%)</span>
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ITEMIZED TRANSACTION STATEMENT TABLE */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              Transaction Statement Records ({transactions.length} items)
            </h2>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-mono uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Payment Method</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400">
                      No transaction records found for this period.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50 transition">
                      <td className="py-2 px-3 font-mono whitespace-nowrap text-slate-600">
                        {tx.date || '—'}
                      </td>
                      <td className="py-2 px-3 font-semibold text-slate-900 max-w-[200px] truncate">
                        {tx.title}
                      </td>
                      <td className="py-2 px-3 text-slate-600 truncate max-w-[140px]">
                        {tx.category || '—'}
                      </td>
                      <td className="py-2 px-3 text-slate-600 text-[11px] truncate max-w-[130px]">
                        {tx.payment_method || tx.paymentMethod || '—'}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            tx.type === 'income'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td
                        className={`py-2 px-3 text-right font-mono font-bold whitespace-nowrap ${
                          tx.type === 'income' ? 'text-emerald-700' : 'text-slate-900'
                        }`}
                      >
                        {tx.type === 'income' ? '+' : '-'}₹{formatINR(tx.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* STATEMENT FOOTER & AUTHENTICATION */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 gap-2">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Official FinTrack Encrypted Financial Ledger Record</span>
          </div>
          <div>Page 1 of 1 • Generated via FinTrack Financial Operating System</div>
        </div>
      </div>
    </div>
  )
}

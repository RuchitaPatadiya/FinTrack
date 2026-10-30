import React, { useState, useMemo } from 'react'
import {
  FileText,
  Calendar,
  Download,
  Printer,
  FileSpreadsheet,
  X,
  CheckCircle2,
  Filter,
  ArrowRight
} from 'lucide-react'
import { formatINR } from '../pages/HomePage'
import StatementPreviewModal from './StatementPreviewModal'

export default function ReportModal({
  isOpen,
  onClose,
  user,
  allTransactions = [],
  onToast
}) {
  const [timeframePreset, setTimeframePreset] = useState('current-month')
  const [startDate, setStartDate] = useState(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
  })
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0]
  })
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // Handle Preset selection
  const handleSelectPreset = (preset) => {
    setTimeframePreset(preset)
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() // 0-indexed

    if (preset === 'current-month') {
      const s = `${year}-${String(month + 1).padStart(2, '0')}-01`
      const e = now.toISOString().split('T')[0]
      setStartDate(s)
      setEndDate(e)
    } else if (preset === 'last-month') {
      const prevMonth = month === 0 ? 11 : month - 1
      const prevYear = month === 0 ? year - 1 : year
      const lastDay = new Date(prevYear, prevMonth + 1, 0).getDate()
      const s = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-01`
      const e = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
      setStartDate(s)
      setEndDate(e)
    } else if (preset === 'q3-2026') {
      setStartDate('2026-07-01')
      setEndDate('2026-09-30')
    } else if (preset === 'last-3m') {
      const past = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      setStartDate(past.toISOString().split('T')[0])
      setEndDate(now.toISOString().split('T')[0])
    } else if (preset === 'last-6m') {
      const past = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000)
      setStartDate(past.toISOString().split('T')[0])
      setEndDate(now.toISOString().split('T')[0])
    } else if (preset === 'year-2026') {
      setStartDate(`${year}-01-01`)
      setEndDate(now.toISOString().split('T')[0])
    } else if (preset === 'all') {
      setStartDate('2020-01-01')
      setEndDate('2030-12-31')
    }
  }

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((tx) => {
      const txDate = tx.date || ''
      if (startDate && txDate < startDate) return false
      if (endDate && txDate > endDate) return false
      return true
    })
  }, [allTransactions, startDate, endDate])

  // Aggregate metrics for selected timeframe
  const { totalInflow, totalOutflow, netCashflow } = useMemo(() => {
    let inc = 0
    let exp = 0
    filteredTransactions.forEach((t) => {
      const amt = Number(t.amount) || 0
      if (t.type === 'income') inc += amt
      else exp += amt
    })
    return {
      totalInflow: inc,
      totalOutflow: exp,
      netCashflow: inc - exp
    }
  }, [filteredTransactions])

  // Export CSV
  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      if (onToast) onToast('No transactions found in selected date range.')
      return
    }

    const headers = ['ID', 'Date', 'Description', 'Category', 'Type', 'Amount (INR)', 'Payment Method']
    const rows = filteredTransactions.map((t) => [
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
    a.download = `fintrack_report_${startDate}_to_${endDate}.csv`
    a.click()
    URL.revokeObjectURL(url)
    if (onToast) onToast('Report CSV spreadsheet downloaded successfully.')
  }

  // Export JSON
  const handleExportJSON = () => {
    if (filteredTransactions.length === 0) {
      if (onToast) onToast('No transactions found in selected date range.')
      return
    }

    const reportObj = {
      reportType: 'FinTrack Custom Date Range Statement',
      period: { startDate, endDate, preset: timeframePreset },
      accountHolder: user,
      exportedAt: new Date().toISOString(),
      summary: {
        totalInflow,
        totalOutflow,
        netCashflow,
        transactionCount: filteredTransactions.length
      },
      transactions: filteredTransactions
    }

    const blob = new Blob([JSON.stringify(reportObj, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fintrack_report_${startDate}_to_${endDate}.json`
    a.click()
    URL.revokeObjectURL(url)
    if (onToast) onToast('Report JSON snapshot downloaded.')
  }

  // Preset labels map
  const getPeriodLabel = () => {
    switch (timeframePreset) {
      case 'current-month':
        return 'Current Month Financial Statement'
      case 'last-month':
        return 'Last Month Financial Statement'
      case 'q3-2026':
        return 'Q3 2026 Financial Statement'
      case 'last-3m':
        return 'Past 90 Days Statement'
      case 'last-6m':
        return 'Last 6 Months Statement'
      case 'year-2026':
        return 'Annual 2026 Statement'
      case 'all':
        return 'All-Time Financial Statement'
      default:
        return `Custom Period Statement (${startDate} to ${endDate})`
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <div className="w-full max-w-xl glass-panel p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl relative max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center space-x-3 mb-5">
            <div className="p-2.5 rounded-2xl bg-pastel-mint/15 text-pastel-mint border border-pastel-mint/20">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">
                Date-Range Financial Reports & PDF Generator
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Generate official financial statements, CSV spreadsheets, and JSON archives
              </p>
            </div>
          </div>

          {/* Timeframe Presets */}
          <div className="space-y-3 mb-5">
            <label className="block text-[11px] font-mono uppercase text-slate-300">
              Select Timeframe Preset
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { id: 'current-month', label: 'Current Month' },
                { id: 'last-month', label: 'Last Month' },
                { id: 'q3-2026', label: 'Q3 2026' },
                { id: 'last-3m', label: 'Last 90 Days' },
                { id: 'last-6m', label: 'Last 6 Months' },
                { id: 'year-2026', label: 'Year 2026' },
                { id: 'all', label: 'All Records' },
                { id: 'custom', label: 'Custom Range' }
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPreset(p.id)}
                  className={`py-2 px-2.5 rounded-xl border text-center transition font-medium ${
                    timeframePreset === p.id
                      ? 'bg-pastel-mint/15 text-pastel-mint border-pastel-mint/40 font-bold'
                      : 'bg-white/5 text-slate-300 border-white/5 hover:bg-white/10'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Picker Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1.5">
                From Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setTimeframePreset('custom')
                  setStartDate(e.target.value)
                }}
                className="w-full px-3.5 py-2.5 bg-[#121624] border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-pastel-mint"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1.5">
                To Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setTimeframePreset('custom')
                  setEndDate(e.target.value)
                }}
                className="w-full px-3.5 py-2.5 bg-[#121624] border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-pastel-mint"
              />
            </div>
          </div>

          {/* Real-time Summary Card */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 mb-6 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono uppercase text-[10px]">Filtered Snapshot</span>
              <span className="font-mono text-white font-bold">{filteredTransactions.length} Transactions</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-xl bg-pastel-mint/10 border border-pastel-mint/20">
                <span className="text-[10px] text-pastel-mint uppercase font-mono block">Inflow</span>
                <span className="text-xs sm:text-sm font-bold text-white font-mono">+₹{formatINR(totalInflow)}</span>
              </div>
              <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <span className="text-[10px] text-rose-300 uppercase font-mono block">Outflow</span>
                <span className="text-xs sm:text-sm font-bold text-white font-mono">-₹{formatINR(totalOutflow)}</span>
              </div>
              <div className="p-2 rounded-xl bg-pastel-sky/10 border border-pastel-sky/20">
                <span className="text-[10px] text-pastel-sky uppercase font-mono block">Net Cashflow</span>
                <span className={`text-xs sm:text-sm font-bold font-mono ${netCashflow >= 0 ? 'text-pastel-mint' : 'text-rose-400'}`}>
                  {netCashflow >= 0 ? '+' : ''}₹{formatINR(netCashflow)}
                </span>
              </div>
            </div>
          </div>

          {/* Export Action Buttons */}
          <div className="space-y-2.5">
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pastel-mint to-pastel-sky text-slate-950 font-bold text-xs shadow-glow-mint hover:opacity-95 transition flex items-center justify-center space-x-2"
            >
              <Printer className="h-4 w-4 stroke-[2.5]" />
              <span>Generate Printable PDF Statement</span>
            </button>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={handleExportCSV}
                className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition flex items-center justify-center space-x-1.5"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-pastel-mint" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={handleExportJSON}
                className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition flex items-center justify-center space-x-1.5"
              >
                <Download className="h-3.5 w-3.5 text-pastel-sky" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded PDF Statement Preview & Print Trigger */}
      <StatementPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        user={user}
        transactions={filteredTransactions}
        startDate={startDate}
        endDate={endDate}
        periodName={getPeriodLabel()}
      />
    </>
  )
}

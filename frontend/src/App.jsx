import React, { useState, useEffect } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Landmark, LogOut, User, ShieldCheck, CreditCard, TrendingUp, TrendingDown, PiggyBank, Loader2 } from 'lucide-react'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

// You can replace this with your actual Google Client ID from Google Cloud Console
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ""

function MainDashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* App Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-500 text-white p-2 rounded-xl shadow-sm">
              <Landmark className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-800 tracking-tight">FinTrack</span>
              <span className="hidden sm:inline-block ml-3 px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                Module 1 Active
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* User Badge */}
            <div className="flex items-center space-x-2.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
              <div className="h-7 w-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs uppercase">
                {user?.full_name ? user.full_name.charAt(0) : user?.email.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-tight">
                  {user?.full_name || user?.email.split('@')[0]}
                </p>
                <p className="text-[10px] text-slate-500 font-mono leading-tight">
                  {user?.email} {user?.auth_provider === 'google' && '(Google)'}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 px-3 py-2 rounded-xl transition duration-150"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Body */}
      <main className="flex-grow max-w-6xl w-full mx-auto p-6 space-y-6">
        {/* Module 1 Success Banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-start space-x-3.5 text-emerald-900">
          <div className="bg-emerald-500 text-white p-2 rounded-xl flex-shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-emerald-900">Authentication & Security Ready</h2>
            <p className="text-emerald-700 text-sm mt-0.5">
              Welcome, <strong>{user?.full_name || user?.email}</strong>! You are securely signed in using{' '}
              <span className="font-semibold capitalize">{user?.auth_provider || 'local'}</span> authentication. Your user ID is{' '}
              <code className="font-mono bg-emerald-100 px-1.5 py-0.5 rounded text-xs">{user?.id}</code>. All subsequent modules will automatically isolate transactions to your account.
            </p>
          </div>
        </div>

        {/* Quick Stat Cards Preview for Next Modules */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Balance</span>
              <CreditCard className="h-5 w-5 text-slate-400" />
            </div>
            <div className="text-2xl font-extrabold text-slate-800">$0.00</div>
            <div className="text-xs text-slate-400 mt-1">Ready for Module 2 & 3</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Monthly Income</span>
              <TrendingUp className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-600">$0.00</div>
            <div className="text-xs text-slate-400 mt-1">Income Tracker</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Monthly Expenses</span>
              <TrendingDown className="h-5 w-5 text-rose-500" />
            </div>
            <div className="text-2xl font-extrabold text-rose-600">$0.00</div>
            <div className="text-xs text-slate-400 mt-1">Expense Tracker</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Savings Goals</span>
              <PiggyBank className="h-5 w-5 text-indigo-500" />
            </div>
            <div className="text-2xl font-extrabold text-indigo-600">0 Active</div>
            <div className="text-xs text-slate-400 mt-1">Goal Management</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-400">
        <p>&copy; {new Date().getFullYear()} FinTrack. Built with React + FastAPI + PostgreSQL.</p>
      </footer>
    </div>
  )
}

function AppContent({ googleClientId }) {
  const { isAuthenticated, loading } = useAuth()
  const [view, setView] = useState(() => {
    // If URL has ?token=..., open reset-password view directly
    const params = new URLSearchParams(window.location.search)
    return params.get('token') ? 'reset-password' : 'login'
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
          <span className="text-sm text-slate-600 font-medium">Loading FinTrack...</span>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <MainDashboard />
  }

  switch (view) {
    case 'register':
      return <RegisterPage onNavigate={setView} googleClientId={googleClientId} />
    case 'forgot-password':
      return <ForgotPasswordPage onNavigate={setView} />
    case 'reset-password':
      return <ResetPasswordPage onNavigate={setView} />
    case 'login':
    default:
      return <LoginPage onNavigate={setView} googleClientId={googleClientId} />
  }
}

export default function App() {
  const [googleClientId, setGoogleClientId] = useState(GOOGLE_CLIENT_ID)

  useEffect(() => {
    if (!googleClientId) {
      fetch('/api/v1/auth/config')
        .then((res) => res.json())
        .then((data) => {
          if (data?.google_client_id) {
            setGoogleClientId(data.google_client_id)
          }
        })
        .catch(() => {})
    }
  }, [googleClientId])

  return (
    <GoogleOAuthProvider clientId={googleClientId || "dummy-client-id"}>
      <AuthProvider>
        <AppContent googleClientId={googleClientId} />
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}

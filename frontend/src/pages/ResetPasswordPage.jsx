import React, { useState, useEffect } from 'react'
import { Landmark, Lock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function ResetPasswordPage({ onNavigate }) {
  const { resetPassword } = useAuth()
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Read ?token=... from browser URL query
    const params = new URLSearchParams(window.location.search)
    const tokenFromUrl = params.get('token')
    if (tokenFromUrl) {
      setToken(tokenFromUrl)
    } else {
      setError('No password reset token was found in the link.')
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!token) {
      setError('Invalid or missing password reset token.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      setLoading(true)
      await resetPassword(token, password)
      setSuccess(true)
      // Clean up URL query
      window.history.replaceState({}, document.title, window.location.pathname)
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to reset password. The link may have expired.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-emerald-500 text-white p-3 rounded-xl mb-3 shadow-sm">
            <Landmark className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800">Set New Password</h1>
          <p className="text-slate-500 text-sm mt-1 text-center">
            Enter your new password below
          </p>
        </div>

        {success ? (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-emerald-100 text-emerald-600 p-3 rounded-full">
                <CheckCircle2 className="h-10 w-10" />
              </div>
            </div>
            <h2 className="text-lg font-bold text-slate-800">Password Updated!</h2>
            <p className="text-slate-500 text-sm">
              Your password has been successfully reset. You can now log in with your new password.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-xl transition duration-150 text-sm shadow-sm"
            >
              Sign In Now
            </button>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-5 bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-start space-x-2.5 text-rose-700 text-sm">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  New Password (min. 6 characters)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-5 w-5 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-5 w-5 text-slate-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !token}
                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-xl transition duration-150 flex items-center justify-center space-x-2 text-sm shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import { Landmark, Mail, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function ForgotPasswordPage({ onNavigate }) {
  const { forgotPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email) {
      setError('Please enter your email address.')
      return
    }

    try {
      setLoading(true)
      await forgotPassword(email)
      setSubmitted(true)
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to send reset link. Please try again.'
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
          <h1 className="text-2xl font-extrabold text-slate-800">Reset Password</h1>
          <p className="text-slate-500 text-sm mt-1 text-center">
            Enter your email to receive a password reset link
          </p>
        </div>

        {submitted ? (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-emerald-100 text-emerald-600 p-3 rounded-full">
                <CheckCircle2 className="h-10 w-10" />
              </div>
            </div>
            <h2 className="text-lg font-bold text-slate-800">Check Your Inbox</h2>
            <p className="text-slate-500 text-sm">
              If an account with <span className="font-semibold text-slate-700">{email}</span> exists, we have sent instructions to reset your password.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-500 text-left">
              💡 <strong>Development Tip:</strong> If Brevo SMTP is not configured yet, the reset link is printed directly in your backend terminal!
            </div>
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="w-full mt-4 bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2.5 px-4 rounded-xl transition duration-150 text-sm"
            >
              Return to Sign In
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
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-xl transition duration-150 flex items-center justify-center space-x-2 text-sm shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  <span>Send Reset Link</span>
                )}
              </button>
            </form>

            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="mt-6 w-full flex items-center justify-center space-x-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Sign In</span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}

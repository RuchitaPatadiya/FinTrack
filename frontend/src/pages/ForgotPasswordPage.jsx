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
      const msg = err.response?.data?.detail || 'Failed to send reset link. Please check backend status.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col justify-center items-center p-4 bg-chic-mesh relative selection:bg-pastel-pink selection:text-black">
      <div className="w-full max-w-md mb-4">
        <button
          onClick={() => onNavigate('landing')}
          className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition py-1 px-2.5 rounded-lg hover:bg-white/5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to FinTrack</span>
        </button>
      </div>

      <div className="max-w-md w-full glass-panel rounded-3xl border border-white/10 p-8 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-pastel-sky via-pastel-purple to-pastel-pink p-[1.5px] shadow-glow-sky mb-3">
            <div className="w-full h-full bg-[#0E1017] rounded-[14px] flex items-center justify-center">
              <Landmark className="h-6 w-6 text-pastel-sky" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white font-display">Reset Password</h1>
          <p className="text-slate-400 text-xs mt-1 text-center">
            Enter your email to receive a password recovery link
          </p>
        </div>

        {submitted ? (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-pastel-mint/20 text-pastel-mint p-3 rounded-2xl">
                <CheckCircle2 className="h-8 w-8" />
              </div>
            </div>
            <h2 className="text-base font-bold text-white">Check Your Inbox</h2>
            <p className="text-slate-300 text-xs leading-relaxed">
              If an account with <span className="font-semibold text-pastel-mint">{email}</span> exists, we have sent instructions to reset your password.
            </p>
            <button
              onClick={() => onNavigate('login')}
              className="w-full mt-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-2.5 px-4 rounded-xl transition text-xs"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-5 bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 flex items-start space-x-2.5 text-rose-300 text-xs">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                  Registered Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#121623] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pastel-sky transition"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-pastel-sky hover:bg-pastel-sky/90 text-slate-950 font-bold py-2.5 px-4 rounded-xl transition duration-150 flex items-center justify-center space-x-2 text-xs shadow-glow-sky"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  <span>Send Recovery Instructions</span>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="text-xs text-slate-400 hover:text-white transition inline-flex items-center space-x-1"
              >
                <ArrowLeft className="h-3 w-3" />
                <span>Back to Sign In</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

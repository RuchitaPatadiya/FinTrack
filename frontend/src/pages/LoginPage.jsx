import React, { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { Landmark, Mail, Lock, AlertCircle, Loader2, ArrowLeft, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage({ onNavigate, googleClientId, onDemoMode }) {
  const { login, loginWithGoogle } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please fill in both email and password.')
      return
    }

    try {
      setLoading(true)
      await login(email, password)
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to sign in. Please check your credentials (or launch Demo Mode if your PostgreSQL backend is not running yet).'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('')
    try {
      setLoading(true)
      await loginWithGoogle(credentialResponse.credential)
    } catch (err) {
      const msg = err.response?.data?.detail || 'Google sign-in failed. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col justify-center items-center p-4 bg-chic-mesh relative selection:bg-pastel-pink selection:text-black">
      {/* Top back button */}
      <div className="w-full max-w-md mb-4 flex justify-between items-center">
        <button
          onClick={() => onNavigate('landing')}
          className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition py-1 px-2.5 rounded-lg hover:bg-white/5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to FinTrack</span>
        </button>

        {onDemoMode && (
          <button
            onClick={onDemoMode}
            className="text-[11px] font-semibold text-pastel-yellow hover:text-yellow-200 flex items-center space-x-1 bg-pastel-yellow/10 px-2.5 py-1 rounded-full border border-pastel-yellow/20"
          >
            <Sparkles className="h-3 w-3" />
            <span>Instant Demo Mode</span>
          </button>
        )}
      </div>

      <div className="max-w-md w-full glass-panel rounded-3xl border border-white/10 p-8 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-pastel-mint/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-pastel-purple/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="flex flex-col items-center mb-7">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-pastel-mint via-pastel-sky to-pastel-purple p-[1.5px] shadow-glow-mint mb-3">
            <div className="w-full h-full bg-[#0E1017] rounded-[14px] flex items-center justify-center">
              <Landmark className="h-6 w-6 text-pastel-mint" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white font-display">Welcome Back</h1>
          <p className="text-slate-400 text-xs mt-1">Sign in to access your FinTrack vaults</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 flex items-start space-x-2.5 text-rose-300 text-xs">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#121623] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pastel-mint focus:ring-1 focus:ring-pastel-mint/30 transition"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 font-mono">
                Password
              </label>
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                className="text-[11px] text-pastel-sky hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#121623] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pastel-mint focus:ring-1 focus:ring-pastel-mint/30 transition"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-pastel-mint to-pastel-sky hover:opacity-95 text-slate-950 font-bold py-2.5 px-4 rounded-xl transition duration-150 flex items-center justify-center space-x-2 text-xs shadow-glow-mint active:scale-[0.99]"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In to FinTrack</span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
            <span className="bg-[#141721] px-2 text-slate-500">Or continue with</span>
          </div>
        </div>

        {/* Google OAuth Button */}
        <div className="flex justify-center">
          {googleClientId ? (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google sign-in was unsuccessful.')}
              shape="pill"
              theme="filled_black"
              size="large"
              text="signin_with"
            />
          ) : (
            <div className="w-full bg-[#121623] border border-dashed border-white/10 rounded-xl p-2.5 text-center text-[11px] text-slate-400">
              Google OAuth available once client ID is configured.
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => onNavigate('register')}
            className="font-semibold text-pastel-mint hover:underline"
          >
            Create one free
          </button>
        </p>
      </div>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Loader2 } from 'lucide-react'
import { AuthProvider, useAuth } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ""

function AppContent({ googleClientId }) {
  const { user, isAuthenticated, loading, logout } = useAuth()
  const [view, setView] = useState(() => {
    // If URL has ?token=..., open reset-password view directly
    const params = new URLSearchParams(window.location.search)
    return params.get('token') ? 'reset-password' : 'landing'
  })
  const [isDemoMode, setIsDemoMode] = useState(false)

  // If user is authenticated, default to home dashboard unless explicitly navigating
  useEffect(() => {
    if (isAuthenticated && view === 'landing') {
      setView('home')
    }
  }, [isAuthenticated])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090A0F] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="h-8 w-8 text-pastel-mint animate-spin" />
          <span className="text-sm text-slate-400 font-medium font-mono">Loading FinTrack...</span>
        </div>
      </div>
    )
  }

  const activeUser = isDemoMode
    ? { full_name: 'Demo Explorer', email: 'explorer@fintrack.app', auth_provider: 'demo' }
    : user || { full_name: 'Aesthetic Spender', email: 'hello@fintrack.app', auth_provider: 'guest' }

  // Views switch
  switch (view) {
    case 'home':
      return (
        <HomePage
          user={activeUser}
          onNavigate={(targetView) => {
            if (targetView === 'landing') {
              setIsDemoMode(false)
            }
            setView(targetView)
          }}
        />
      )

    case 'profile':
      return (
        <ProfilePage
          user={activeUser}
          onNavigate={(targetView) => {
            if (targetView === 'landing') {
              setIsDemoMode(false)
            }
            setView(targetView)
          }}
          onLogout={() => {
            setIsDemoMode(false)
            if (logout) logout()
          }}
        />
      )

    case 'login':
      return (
        <LoginPage
          onNavigate={setView}
          googleClientId={googleClientId}
          onDemoMode={() => {
            setIsDemoMode(true)
            setView('home')
          }}
        />
      )

    case 'register':
      return (
        <RegisterPage
          onNavigate={setView}
          googleClientId={googleClientId}
          onDemoMode={() => {
            setIsDemoMode(true)
            setView('home')
          }}
        />
      )

    case 'forgot-password':
      return <ForgotPasswordPage onNavigate={setView} />

    case 'reset-password':
      return <ResetPasswordPage onNavigate={setView} />

    case 'landing':
    default:
      return (
        <LandingPage
          onNavigate={setView}
          onDemoMode={() => {
            setIsDemoMode(true)
            setView('home')
          }}
        />
      )
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

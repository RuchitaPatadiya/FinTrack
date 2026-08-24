import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Activity, ShieldAlert, CheckCircle2, RefreshCw, Landmark, Coins, Receipt } from 'lucide-react'

function App() {
  const [status, setStatus] = useState('loading')
  const [backendData, setBackendData] = useState(null)

  const checkConnection = async () => {
    setStatus('loading')
    try {
      // Due to the Vite dev server proxy setting, this maps to http://127.0.0.1:8000/api/v1/health
      const response = await axios.get('/api/v1/health')
      setBackendData(response.data)
      setStatus('connected')
    } catch (error) {
      console.error("Connection error: ", error)
      setStatus('failed')
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-emerald-500 text-white p-2 rounded-lg">
              <Landmark className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold text-slate-800">FinTrack</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-500">2-Member Team Dev Template</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          <h1 className="text-2xl font-extrabold text-slate-800 mb-2">FinTrack Workspace Initialized</h1>
          <p className="text-slate-500 text-sm mb-6">
            The project structure is ready. Let's verify the connection between your React frontend and FastAPI backend.
          </p>

          {/* Connection Status Card */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Backend Server Link
            </h2>

            {status === 'loading' && (
              <div className="flex flex-col items-center space-y-2">
                <RefreshCw className="h-8 w-8 text-emerald-500 animate-spin" />
                <span className="text-slate-600 font-medium text-sm">Pinging Backend...</span>
              </div>
            )}

            {status === 'connected' && (
              <div className="flex flex-col items-center space-y-2">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                <span className="text-slate-800 font-bold text-sm">Connected!</span>
                <span className="text-xs text-slate-500 font-mono">
                  Status: {backendData?.status} | DB: {backendData?.database}
                </span>
              </div>
            )}

            {status === 'failed' && (
              <div className="flex flex-col items-center space-y-2">
                <ShieldAlert className="h-8 w-8 text-rose-500" />
                <span className="text-slate-800 font-bold text-sm text-rose-600">Failed to Connect</span>
                <span className="text-xs text-slate-500 max-w-xs">
                  Make sure you have started your FastAPI server on port 8000.
                </span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={checkConnection}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2.5 px-4 rounded-xl transition duration-150 flex items-center justify-center space-x-2 text-sm"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Retry Connection</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-400">
        <p>&copy; {new Date().getFullYear()} FinTrack Team. Built with React + FastAPI + TailwindCSS.</p>
      </footer>
    </div>
  )
}

export default App

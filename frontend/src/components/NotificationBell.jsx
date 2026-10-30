import React, { useState, useEffect, useRef } from 'react'
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCheck,
  Trash2,
  X,
  Loader2
} from 'lucide-react'
import { notificationsAPI } from '../services/api'

// Relative time formatting helper
function formatRelativeTime(dateString) {
  if (!dateString) return 'Recent'
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
  } catch {
    return 'Recent'
  }
}

export default function NotificationBell({ isRealUser }) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all') // 'all' or 'unread'
  const dropdownRef = useRef(null)

  // Fetch notifications from server or local demo store
  const fetchNotifications = async () => {
    if (isRealUser) {
      try {
        const res = await notificationsAPI.list()
        if (res.data) {
          setNotifications(res.data.notifications || [])
          setUnreadCount(res.data.unread_count || 0)
        }
      } catch (err) {
        console.warn('Could not fetch notifications:', err)
      }
    } else {
      // Demo / Guest mode fallback
      try {
        const saved = localStorage.getItem('fintrack_demo_notifications')
        if (saved) {
          const parsed = JSON.parse(saved)
          setNotifications(parsed)
          setUnreadCount(parsed.filter((n) => !n.is_read).length)
        } else {
          const sample = [
            {
              id: 1,
              title: 'Upcoming Renewal: Netflix Standard',
              message: 'Netflix Standard is scheduled to renew in 2 days on Oct 31 for ₹499.00 (monthly).',
              type: 'warning',
              is_read: false,
              created_at: new Date(Date.now() - 3600000 * 2).toISOString()
            },
            {
              id: 2,
              title: 'Goal Achieved: Emergency Fund 🎉',
              message: 'Congratulations! You reached 100% of your savings goal for "Emergency Fund" (Target: ₹3,00,000).',
              type: 'success',
              is_read: false,
              created_at: new Date(Date.now() - 3600000 * 24).toISOString()
            },
            {
              id: 3,
              title: 'Nearing Budget Ceiling: Food & Dining',
              message: 'You have reached 84% of your "Food & Dining" monthly budget ceiling.',
              type: 'alert',
              is_read: true,
              created_at: new Date(Date.now() - 3600000 * 48).toISOString()
            }
          ]
          localStorage.setItem('fintrack_demo_notifications', JSON.stringify(sample))
          setNotifications(sample)
          setUnreadCount(2)
        }
      } catch {}
    }
  }

  // Initial fetch and auto-refresh every 35 seconds
  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 35000)
    return () => clearInterval(interval)
  }, [isRealUser])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Mark single notification as read
  const handleMarkAsRead = async (id) => {
    if (isRealUser) {
      try {
        await notificationsAPI.markAsRead(id)
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
      } catch (err) {
        console.error('Failed to mark notification as read:', err)
      }
    } else {
      setNotifications((prev) => {
        const updated = prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        localStorage.setItem('fintrack_demo_notifications', JSON.stringify(updated))
        return updated
      })
      setUnreadCount((prev) => Math.max(0, prev - 1))
    }
  }

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return
    setLoading(true)
    if (isRealUser) {
      try {
        await notificationsAPI.markAllAsRead()
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
        setUnreadCount(0)
      } catch (err) {
        console.error('Failed to mark all as read:', err)
      } finally {
        setLoading(false)
      }
    } else {
      setNotifications((prev) => {
        const updated = prev.map((n) => ({ ...n, is_read: true }))
        localStorage.setItem('fintrack_demo_notifications', JSON.stringify(updated))
        return updated
      })
      setUnreadCount(0)
      setLoading(false)
    }
  }

  // Delete notification
  const handleDeleteNotification = async (e, id) => {
    e.stopPropagation()
    if (isRealUser) {
      try {
        await notificationsAPI.delete(id)
        setNotifications((prev) => {
          const removed = prev.find((n) => n.id === id)
          if (removed && !removed.is_read) {
            setUnreadCount((c) => Math.max(0, c - 1))
          }
          return prev.filter((n) => n.id !== id)
        })
      } catch (err) {
        console.error('Failed to delete notification:', err)
      }
    } else {
      setNotifications((prev) => {
        const removed = prev.find((n) => n.id === id)
        if (removed && !removed.is_read) {
          setUnreadCount((c) => Math.max(0, c - 1))
        }
        const updated = prev.filter((n) => n.id !== id)
        localStorage.setItem('fintrack_demo_notifications', JSON.stringify(updated))
        return updated
      })
    }
  }

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.is_read
    return true
  })

  // Render type-specific badge/icon
  const renderIcon = (type) => {
    switch (type) {
      case 'alert':
        return (
          <div className="h-8 w-8 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="h-4 w-4" />
          </div>
        )
      case 'warning':
        return (
          <div className="h-8 w-8 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="h-4 w-4" />
          </div>
        )
      case 'success':
        return (
          <div className="h-8 w-8 rounded-xl bg-pastel-mint/15 border border-pastel-mint/30 text-pastel-mint flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        )
      case 'info':
      default:
        return (
          <div className="h-8 w-8 rounded-xl bg-pastel-sky/15 border border-pastel-sky/30 text-pastel-sky flex items-center justify-center flex-shrink-0">
            <Info className="h-4 w-4" />
          </div>
        )
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen)
          if (!isOpen) fetchNotifications()
        }}
        className="h-9 w-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center relative transition active:scale-95"
        title="Notifications & Alerts"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-glow-rose animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Drawer / Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-80 sm:w-96 rounded-2xl glass-panel border border-white/15 shadow-2xl z-50 overflow-hidden backdrop-blur-2xl">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white text-sm font-display">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={loading}
                  className="text-[11px] text-pastel-mint hover:underline font-medium flex items-center space-x-1"
                  title="Mark all as read"
                >
                  <CheckCheck className="h-3 w-3" />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="px-4 py-2 bg-white/[0.02] border-b border-white/5 flex items-center space-x-2 text-[11px]">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                filter === 'all'
                  ? 'bg-white/10 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                filter === 'unread'
                  ? 'bg-white/10 text-rose-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center space-y-2">
                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500">
                  <Bell className="h-5 w-5" />
                </div>
                <span>{filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}</span>
                <span className="text-[10px] text-slate-500">
                  You'll be alerted about budget ceilings, goal milestones, and renewing subscriptions.
                </span>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => !notif.is_read && handleMarkAsRead(notif.id)}
                  className={`p-3.5 flex items-start space-x-3 transition cursor-pointer hover:bg-white/5 group relative ${
                    !notif.is_read ? 'bg-white/[0.04]' : 'opacity-75'
                  }`}
                >
                  {renderIcon(notif.type)}

                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center space-x-1.5">
                      <h4 className={`text-xs font-semibold truncate ${!notif.is_read ? 'text-white' : 'text-slate-300'}`}>
                        {notif.title}
                      </h4>
                      {!notif.is_read && (
                        <span className="h-1.5 w-1.5 rounded-full bg-pastel-mint flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="text-[10px] font-mono text-slate-500 mt-1 inline-block">
                      {formatRelativeTime(notif.created_at)}
                    </span>
                  </div>

                  {/* Actions on hover */}
                  <div className="absolute right-3 top-3 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleDeleteNotification(e, notif.id)}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

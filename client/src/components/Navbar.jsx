import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Zap, Menu, X, Home, Users, MessageCircle, BookOpen,
  Star, Settings, LogOut, Shield, ChevronDown
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PRESENTATION_DEMO_MODE } from '../config/demoMode'

const navItems = [
  { to: '/dashboard', label: 'Ana Sayfa', icon: Home },
  { to: '/matches', label: 'Eşleşmeler', icon: Users },
  { to: '/messages', label: 'Mesajlar', icon: MessageCircle },
  { to: '/requests', label: 'Talepler', icon: BookOpen },
  { to: '/reviews', label: 'Yorumlar', icon: Star },
]

const visibleNavItems = PRESENTATION_DEMO_MODE
  ? navItems.filter((item) => item.to === '/dashboard')
  : navItems

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-900/50">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg gradient-text hidden sm:block">Skill Swap</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {visibleNavItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive(to)
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
            {!PRESENTATION_DEMO_MODE && user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive('/admin')
                    ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30'
                    : 'text-white/60 hover:text-amber-300 hover:bg-amber-600/10'
                  }`}
              >
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            )}
          </div>

          {/* Desktop profile */}
          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl glass hover:bg-white/10 transition-all duration-200"
              >
                <img
                  src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                  alt={user?.name}
                  className="w-7 h-7 rounded-full object-cover bg-purple-900"
                />
                <span className="text-sm font-medium text-white/80 max-w-[120px] truncate">{user?.name}</span>
                <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 glass-dark rounded-xl border border-white/10 shadow-2xl overflow-hidden"
                  >
                    {!PRESENTATION_DEMO_MODE && (
                      <Link
                        to="/profile/edit"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Profili Düzenle
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Çıkış Yap
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg glass hover:bg-white/10 transition-all"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-white/10 glass-dark"
          >
            <div className="px-4 py-3 space-y-1">
              {/* Mobile user info */}
              <div className="flex items-center gap-3 px-3 py-3 mb-2 border-b border-white/10">
                <img
                  src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                  alt={user?.name}
                  className="w-9 h-9 rounded-full bg-purple-900"
                />
                <div>
                  <p className="text-sm font-semibold text-white">{user?.name}</p>
                  <p className="text-xs text-white/50">{user?.email}</p>
                </div>
              </div>

              {visibleNavItems.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                    ${isActive(to)
                      ? 'bg-purple-600/20 text-purple-300'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}

              {!PRESENTATION_DEMO_MODE && user?.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-amber-400 hover:bg-amber-600/10 transition-all"
                >
                  <Shield className="w-4 h-4" />
                  Admin Panel
                </Link>
              )}

              {!PRESENTATION_DEMO_MODE && (
                <Link
                  to="/profile/edit"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
                >
                  <Settings className="w-4 h-4" />
                  Profili Düzenle
                </Link>
              )}

              <button
                onClick={() => { handleLogout(); setMobileOpen(false) }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Çıkış Yap
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar

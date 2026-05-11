import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { motion } from 'framer-motion'
import {
  Shield, Users, Zap, MessageCircle, BookOpen,
  Star, Clock, CheckCircle, MapPin
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

const StatCard = ({ icon: Icon, label, value, gradient, sub, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass rounded-2xl p-5"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-3xl font-black text-white">{value ?? '—'}</p>
        <p className="text-sm text-white/50 mt-1">{label}</p>
        {sub && <p className="text-xs text-white/30 mt-0.5">{sub}</p>}
      </div>
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg shrink-0`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
  </motion.div>
)

export default function AdminPage() {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('overview')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users'),
        ])
        setStats(statsRes.data.stats)
        setUsers(usersRes.data.users || [])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <LoadingSpinner size="lg" />
    </div>
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-white/40 text-sm">Platform yönetimi ve istatistikler</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 glass rounded-xl p-1 w-fit">
        {[
          { key: 'overview', label: 'Genel Bakış' },
          { key: 'users', label: 'Kullanıcılar' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === key ? 'bg-amber-600 text-white' : 'text-white/50 hover:text-white'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'overview' && stats && (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Users} label="Toplam Kullanıcı" value={stats.totalUsers} gradient="from-purple-600 to-pink-600" delay={0} />
            <StatCard icon={Zap} label="Toplam Beceri" value={stats.totalSkills} gradient="from-cyan-600 to-blue-600" delay={0.05} sub={`${stats.totalUserSkills} kullanıcı-beceri bağlantısı`} />
            <StatCard icon={MessageCircle} label="Toplam Mesaj" value={stats.totalMessages} gradient="from-green-600 to-teal-600" delay={0.1} />
            <StatCard icon={BookOpen} label="Toplam Talep" value={stats.totalRequests} gradient="from-amber-600 to-orange-600" delay={0.15} />
            <StatCard icon={Star} label="Toplam Yorum" value={stats.totalReviews} gradient="from-yellow-600 to-amber-600" delay={0.2} />
            <StatCard icon={Clock} label="Bekleyen Talepler" value={stats.pendingRequests} gradient="from-rose-600 to-red-600" delay={0.25} />
            <StatCard icon={CheckCircle} label="Tamamlanan" value={stats.completedRequests} gradient="from-emerald-600 to-green-600" delay={0.3} />
          </div>

          {/* Summary */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Platform Özeti</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-white/60">
              <div className="glass rounded-xl p-4">
                <p className="text-xs text-white/30 mb-1">Tamamlanma Oranı</p>
                <p className="text-xl font-bold text-white">
                  {stats.totalRequests > 0
                    ? `${Math.round((stats.completedRequests / stats.totalRequests) * 100)}%`
                    : '—'}
                </p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-xs text-white/30 mb-1">Ort. Beceri / Kullanıcı</p>
                <p className="text-xl font-bold text-white">
                  {stats.totalUsers > 0
                    ? (stats.totalUserSkills / stats.totalUsers).toFixed(1)
                    : '—'}
                </p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-xs text-white/30 mb-1">Ort. Mesaj / Kullanıcı</p>
                <p className="text-xl font-bold text-white">
                  {stats.totalUsers > 0
                    ? (stats.totalMessages / stats.totalUsers).toFixed(1)
                    : '—'}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {tab === 'users' && (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <p className="text-sm text-white/50">{users.length} kullanıcı</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-xs font-medium text-white/40 uppercase tracking-wider">Kullanıcı</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-white/40 uppercase tracking-wider hidden sm:table-cell">E-posta</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-white/40 uppercase tracking-wider hidden md:table-cell">Konum</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-white/40 uppercase tracking-wider">Rol</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-white/40 uppercase tracking-wider hidden lg:table-cell">Beceriler</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-white/40 uppercase tracking-wider">Katılım</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <Link to={`/users/${u.id}`} className="flex items-center gap-2.5 group">
                        <img
                          src={u.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`}
                          alt={u.name}
                          className="w-8 h-8 rounded-full bg-purple-900 shrink-0"
                        />
                        <span className="font-medium text-white group-hover:text-purple-300 transition-colors">{u.name}</span>
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-white/50 hidden sm:table-cell">{u.email}</td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      {u.profile?.city ? (
                        <span className="flex items-center gap-1 text-white/50">
                          <MapPin className="w-3 h-3" />
                          {u.profile.city}
                        </span>
                      ) : <span className="text-white/20">—</span>}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        u.role === 'ADMIN'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <span className="text-white/50">{u.userSkills?.length || 0}</span>
                    </td>
                    <td className="py-3 px-4 text-white/30 text-xs">
                      {new Date(u.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

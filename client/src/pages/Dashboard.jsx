import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { motion } from 'framer-motion'
import {
  Users, MessageCircle, BookOpen, Star, ArrowRight,
  Zap, MapPin, TrendingUp, Bell, Plus, CheckCircle2, AlertTriangle
} from 'lucide-react'
import MatchCard from '../components/MatchCard'
import LoadingSpinner from '../components/LoadingSpinner'

const StatCard = ({ icon: Icon, label, value, gradient, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3 }}
    className="glass rounded-2xl p-5 flex items-center gap-4"
  >
    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg shrink-0`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-white/50">{label}</p>
    </div>
  </motion.div>
)

const statusMap = {
  PENDING: { label: 'Bekliyor', cls: 'status-pending' },
  ACCEPTED: { label: 'Kabul Edildi', cls: 'status-accepted' },
  REJECTED: { label: 'Reddedildi', cls: 'status-rejected' },
  COMPLETED: { label: 'Tamamlandı', cls: 'status-completed' },
  CANCELLED: { label: 'İptal', cls: 'status-cancelled' },
}

export default function Dashboard() {
  const { user } = useAuth()
  const [matches, setMatches] = useState([])
  const [conversations, setConversations] = useState([])
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [matchRes, convRes, reqRes] = await Promise.all([
          api.get('/matches'),
          api.get('/conversations'),
          api.get('/requests'),
        ])
        setMatches(matchRes.data.matches || [])
        setConversations(convRes.data.conversations || [])
        setRequests(reqRes.data.requests || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const profile = user?.profile
  const teachSkills = user?.userSkills?.filter((s) => s.type === 'TEACH') || []
  const learnSkills = user?.userSkills?.filter((s) => s.type === 'LEARN') || []

  const profileChecklist = [
    { label: 'Profil fotoğrafı', done: Boolean(user?.avatarUrl) },
    { label: 'Bio', done: Boolean(profile?.bio?.trim()) },
    { label: 'Şehir / ilçe', done: Boolean(profile?.city?.trim() && profile?.district?.trim()) },
    { label: 'Öğretebildiği beceriler', done: teachSkills.length > 0 },
    { label: 'Öğrenmek istediği beceriler', done: learnSkills.length > 0 },
    { label: 'Uygunluk açıklaması', done: Boolean(profile?.availabilityText?.trim()) },
    {
      label: 'Takas veya ücretli ders tercihi',
      done: Boolean(profile?.isSwapAvailable || profile?.isPaidLessonAvailable),
    },
  ]

  const profileComplete = profileChecklist.filter((item) => item.done).length
  const profilePct = Math.round((profileComplete / profileChecklist.length) * 100)

  const pendingRequests = requests.filter((r) => r.status === 'PENDING' && r.receiverId === user?.id)

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <LoadingSpinner size="lg" />
    </div>
  )

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 sm:p-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-transparent to-pink-600/10 pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 relative z-10">
          <img
            src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover bg-purple-900"
          />
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Hoş geldin, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            {profile?.city && (
              <div className="flex items-center gap-1.5 mt-1 text-white/50 text-sm">
                <MapPin className="w-3.5 h-3.5" />
                <span>{profile.district ? `${profile.district}, ` : ''}{profile.city}</span>
              </div>
            )}
          </div>

          {/* Profile completion */}
          <div className="w-full sm:w-72">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-white/50">Profil Tamamlama</span>
              <span className="text-xs font-semibold text-purple-400">{profilePct}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-700"
                style={{ width: `${profilePct}%` }}
              />
            </div>
            {profilePct < 100 && (
              <Link to="/profile/edit" className="text-xs text-purple-400 hover:text-purple-300 mt-1 inline-flex items-center gap-1">
                Profili tamamla <ArrowRight className="w-3 h-3" />
              </Link>
            )}
            <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-white/70">Eksik Alanlar</p>
                <span className="text-[11px] text-white/40">{profileComplete}/{profileChecklist.length}</span>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {profileChecklist.map((item) => {
                  const Icon = item.done ? CheckCircle2 : AlertTriangle
                  return (
                    <div
                      key={item.label}
                      className={`flex items-center gap-2 text-xs ${item.done ? 'text-emerald-300' : 'text-rose-300'}`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className={item.done ? 'text-white/60' : 'text-white/80'}>{item.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Eşleşme" value={matches.length} gradient="from-purple-600 to-pink-600" delay={0} />
        <StatCard icon={MessageCircle} label="Konuşma" value={conversations.length} gradient="from-cyan-600 to-blue-600" delay={0.1} />
        <StatCard icon={BookOpen} label="Talep" value={requests.length} gradient="from-amber-600 to-orange-600" delay={0.2} />
        <StatCard icon={Bell} label="Bekleyen" value={pendingRequests.length} gradient="from-green-600 to-teal-600" delay={0.3} />
      </div>

      {/* Skills summary */}
      {(teachSkills.length > 0 || learnSkills.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Becerilerim</h2>
            <Link to="/profile/edit" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Ekle
            </Link>
          </div>
          <div className="space-y-3">
            {teachSkills.length > 0 && (
              <div>
                <p className="text-xs text-white/40 mb-2 uppercase tracking-wider">Öğrettiklerim</p>
                <div className="flex flex-wrap gap-2">
                  {teachSkills.map((us) => (
                    <span key={us.id} className="skill-badge-teach">{us.skill.name}</span>
                  ))}
                </div>
              </div>
            )}
            {learnSkills.length > 0 && (
              <div>
                <p className="text-xs text-white/40 mb-2 uppercase tracking-wider">Öğrenmek İstediklerim</p>
                <div className="flex flex-wrap gap-2">
                  {learnSkills.map((us) => (
                    <span key={us.id} className="skill-badge-learn">{us.skill.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top matches */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              Önerilen Eşleşmeler
            </h2>
            <Link to="/matches" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
              Tümü <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {matches.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center">
              <Users className="w-10 h-10 text-white/20 mx-auto mb-3" />
              <p className="text-white/40 text-sm">Eşleşme bulunamadı. Profil bilgilerini tamamla!</p>
              <Link to="/profile/edit" className="btn-primary text-sm mt-4 inline-flex items-center gap-2">
                Profili Düzenle
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {matches.slice(0, 3).map((match, i) => (
                <MatchCard key={match.user.id} match={match} index={i} />
              ))}
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div className="space-y-4">
          {/* Recent conversations */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-cyan-400" />
                Mesajlar
              </h2>
              <Link to="/messages" className="text-sm text-purple-400 hover:text-purple-300">
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {conversations.length === 0 ? (
              <div className="glass rounded-2xl p-5 text-center">
                <p className="text-white/40 text-sm">Henüz mesaj yok</p>
              </div>
            ) : (
              <div className="space-y-2">
                {conversations.slice(0, 3).map((conv) => (
                  <Link key={conv.id} to={`/messages/${conv.id}`}>
                    <div className="glass rounded-xl p-4 hover:border-white/20 transition-all flex items-center gap-3">
                      <img
                        src={conv.otherUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.otherUser.name}`}
                        alt={conv.otherUser.name}
                        className="w-9 h-9 rounded-full bg-purple-900 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{conv.otherUser.name}</p>
                        <p className="text-xs text-white/40 truncate">
                          {conv.lastMessage?.text || 'Konuşma başladı'}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Pending requests */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                Son Talepler
              </h2>
              <Link to="/requests" className="text-sm text-purple-400 hover:text-purple-300">
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {requests.length === 0 ? (
              <div className="glass rounded-2xl p-5 text-center">
                <p className="text-white/40 text-sm">Henüz talep yok</p>
              </div>
            ) : (
              <div className="space-y-2">
                {requests.slice(0, 3).map((req) => {
                  const s = statusMap[req.status] || { label: req.status, cls: '' }
                  const other = req.senderId === user?.id ? req.receiver : req.sender
                  return (
                    <div key={req.id} className="glass rounded-xl p-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={other?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${other?.name}`}
                            alt={other?.name}
                            className="w-7 h-7 rounded-full bg-purple-900 shrink-0"
                          />
                          <p className="text-sm text-white truncate">{other?.name}</p>
                        </div>
                        <span className={`${s.cls} shrink-0`}>{s.label}</span>
                      </div>
                      <p className="text-xs text-white/40 mt-1.5">
                        {req.type === 'SWAP' ? '🔄 Takas' : '💰 Ücretli Ders'}
                        {req.skillWanted && ` · ${req.skillWanted.name}`}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

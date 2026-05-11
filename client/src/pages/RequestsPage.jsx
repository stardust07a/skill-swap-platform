import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { motion } from 'framer-motion'
import {
  BookOpen, CheckCircle, XCircle, Clock, Link2,
  ArrowUpRight, ArrowDownLeft, Star, AlertCircle
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

const statusMap = {
  PENDING: { label: 'Bekliyor', cls: 'status-pending' },
  ACCEPTED: { label: 'Kabul Edildi', cls: 'status-accepted' },
  REJECTED: { label: 'Reddedildi', cls: 'status-rejected' },
  COMPLETED: { label: 'Tamamlandı', cls: 'status-completed' },
  CANCELLED: { label: 'İptal', cls: 'status-cancelled' },
}

export default function RequestsPage() {
  const { user } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('incoming')
  const [meetingLink, setMeetingLink] = useState({})
  const [error, setError] = useState('')

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/requests')
      setRequests(data.requests || [])
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id, status) => {
    setError('')
    try {
      const { data } = await api.put(`/requests/${id}/status`, { status })
      setRequests((prev) => prev.map((r) => (r.id === id ? data.request : r)))
    } catch (err) {
      setError(err.response?.data?.error || 'İşlem başarısız.')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleMeetingLink = async (id) => {
    const link = meetingLink[id]?.trim()
    if (!link) return
    try {
      await api.put(`/requests/${id}/meeting-link`, { meetingLink: link })
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, meetingLink: link } : r)))
      setMeetingLink((prev) => ({ ...prev, [id]: '' }))
    } catch {}
  }

  const incoming = requests.filter((r) => r.receiverId === user?.id)
  const outgoing = requests.filter((r) => r.senderId === user?.id)
  const shown = tab === 'incoming' ? incoming : outgoing

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <LoadingSpinner size="lg" />
    </div>
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-amber-400" /> Talepler
        </h1>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 glass rounded-xl p-1 w-fit">
        {[
          { key: 'incoming', label: 'Gelen Talepler', icon: ArrowDownLeft, count: incoming.length },
          { key: 'outgoing', label: 'Gönderilen Talepler', icon: ArrowUpRight, count: outgoing.length },
        ].map(({ key, label, icon: Icon, count }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${tab === key ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30' : 'text-white/50 hover:text-white'}`}
          >
            <Icon className="w-4 h-4" />
            {label}
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${tab === key ? 'bg-white/20' : 'bg-white/10'}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Request list */}
      {shown.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">
            {tab === 'incoming' ? 'Gelen talep yok.' : 'Gönderilen talep yok.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {shown.map((req, i) => {
            const s = statusMap[req.status]
            const other = tab === 'incoming' ? req.sender : req.receiver
            const canAcceptReject = tab === 'incoming' && req.status === 'PENDING'
            const canCancel = tab === 'outgoing' && req.status === 'PENDING'
            const canComplete = req.status === 'ACCEPTED'
            const canReview = req.status === 'COMPLETED' && !req.review

            return (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-5 space-y-4"
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <img
                      src={other?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${other?.name}`}
                      alt={other?.name}
                      className="w-10 h-10 rounded-full bg-purple-900 shrink-0"
                    />
                    <div>
                      <Link to={`/users/${other?.id}`} className="text-sm font-semibold text-white hover:text-purple-300 transition-colors">
                        {other?.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-white/40">
                          {req.type === 'SWAP' ? '🔄 Takas' : '💰 Ücretli Ders'}
                        </span>
                        {req.price && <span className="text-xs text-white/40">· ₺{req.price}</span>}
                      </div>
                    </div>
                  </div>
                  <span className={s.cls}>{s.label}</span>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-3 text-sm">
                  {req.skillOffered && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-white/40 text-xs">Sunulan:</span>
                      <span className="skill-badge-teach text-xs">{req.skillOffered.name}</span>
                    </div>
                  )}
                  {req.skillWanted && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-white/40 text-xs">İstenen:</span>
                      <span className="skill-badge-learn text-xs">{req.skillWanted.name}</span>
                    </div>
                  )}
                </div>

                {req.note && (
                  <p className="text-sm text-white/50 bg-white/5 rounded-xl px-4 py-2.5">{req.note}</p>
                )}

                {req.scheduledAt && (
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(req.scheduledAt).toLocaleString('tr-TR')}
                  </div>
                )}

                {/* Meeting link */}
                {req.meetingLink && (
                  <a
                    href={req.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <Link2 className="w-4 h-4" />
                    Meeting Linki
                  </a>
                )}

                {/* Meeting link input */}
                {req.status === 'ACCEPTED' && !req.meetingLink && (
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={meetingLink[req.id] || ''}
                      onChange={(e) => setMeetingLink((prev) => ({ ...prev, [req.id]: e.target.value }))}
                      placeholder="Meeting linki ekle (Google Meet, Zoom...)"
                      className="input-field text-sm flex-1 py-2"
                    />
                    <button
                      onClick={() => handleMeetingLink(req.id)}
                      disabled={!meetingLink[req.id]?.trim()}
                      className="btn-primary text-sm px-4 py-2"
                    >
                      <Link2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {canAcceptReject && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(req.id, 'ACCEPTED')}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-all"
                      >
                        <CheckCircle className="w-4 h-4" /> Kabul Et
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(req.id, 'REJECTED')}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all"
                      >
                        <XCircle className="w-4 h-4" /> Reddet
                      </button>
                    </>
                  )}
                  {canCancel && (
                    <button
                      onClick={() => handleStatusUpdate(req.id, 'CANCELLED')}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30 hover:bg-gray-500/30 transition-all"
                    >
                      <XCircle className="w-4 h-4" /> İptal Et
                    </button>
                  )}
                  {canComplete && (
                    <button
                      onClick={() => handleStatusUpdate(req.id, 'COMPLETED')}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-all"
                    >
                      <CheckCircle className="w-4 h-4" /> Tamamlandı
                    </button>
                  )}
                  {canReview && (
                    <Link
                      to="/reviews"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30 transition-all"
                    >
                      <Star className="w-4 h-4" /> Yorum Yap
                    </Link>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

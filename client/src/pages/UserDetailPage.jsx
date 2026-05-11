import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { motion } from 'framer-motion'
import {
  MapPin, Star, Clock, DollarSign, MessageCircle,
  GitMerge, BookOpen, GraduationCap, ArrowLeft,
  Send, AlertCircle, CheckCircle
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

const RequestModal = ({ user, skills, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    type: 'SWAP', skillOfferedId: '', skillWantedId: '', price: '', note: '', scheduledAt: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/requests', { ...form, receiverId: user.id })
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.error || 'Talep gönderilemedi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md glass-dark rounded-2xl p-6 border border-white/10"
      >
        <h3 className="text-xl font-bold text-white mb-5">Talep Gönder</h3>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-white/70 mb-1.5">Talep Türü</label>
            <div className="grid grid-cols-2 gap-2">
              {['SWAP', 'PAID'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm({ ...form, type: t })}
                  className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                    form.type === t
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'glass text-white/60 hover:text-white'
                  }`}
                >
                  {t === 'SWAP' ? '🔄 Ücretsiz Takas' : '💰 Ücretli Ders'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1.5">Sunacağım Beceri</label>
            <select value={form.skillOfferedId} onChange={(e) => setForm({ ...form, skillOfferedId: e.target.value })} className="input-field text-sm">
              <option value="">Seçiniz...</option>
              {skills.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1.5">İstediğim Beceri</label>
            <select value={form.skillWantedId} onChange={(e) => setForm({ ...form, skillWantedId: e.target.value })} className="input-field text-sm">
              <option value="">Seçiniz...</option>
              {user.userSkills?.filter(us => us.type === 'TEACH').map((us) => (
                <option key={us.skillId} value={us.skillId}>{us.skill?.name}</option>
              ))}
            </select>
          </div>

          {form.type === 'PAID' && (
            <div>
              <label className="block text-sm text-white/70 mb-1.5">Teklif Edilen Ücret (₺)</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="150" min="0" className="input-field text-sm" />
            </div>
          )}

          <div>
            <label className="block text-sm text-white/70 mb-1.5">Not</label>
            <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Kısa bir not ekleyebilirsiniz..." rows={2} className="input-field text-sm resize-none" />
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1.5">Tarih (İsteğe bağlı)</label>
            <input type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
              className="input-field text-sm" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send className="w-4 h-4" /> Gönder</>}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1 text-sm">İptal</button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default function UserDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: me } = useAuth()
  const [userData, setUserData] = useState(null)
  const [allSkills, setAllSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [requestSuccess, setRequestSuccess] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, skillsRes] = await Promise.all([
          api.get(`/users/${id}`),
          api.get('/skills'),
        ])
        setUserData(userRes.data.user)
        setAllSkills(skillsRes.data.skills || [])
      } catch {
        navigate('/matches')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleStartConversation = async () => {
    try {
      const { data } = await api.post('/conversations', { userId: id })
      navigate(`/messages/${data.conversation.id}`)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <LoadingSpinner size="lg" />
    </div>
  )

  if (!userData) return null

  const teachSkills = userData.userSkills?.filter((us) => us.type === 'TEACH') || []
  const learnSkills = userData.userSkills?.filter((us) => us.type === 'LEARN') || []
  const reviews = userData.receivedReviews || []
  const avgRating = userData.avgRating

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {showModal && (
        <RequestModal
          user={userData}
          skills={allSkills}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false)
            setRequestSuccess(true)
            setTimeout(() => setRequestSuccess(false), 4000)
          }}
        />
      )}

      {requestSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm"
        >
          <CheckCircle className="w-4 h-4 shrink-0" />
          Talep başarıyla gönderildi!
        </motion.div>
      )}

      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" /> Geri
      </button>

      {/* Profile card */}
      <div className="glass rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="relative shrink-0">
              <img
                src={userData.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`}
                alt={userData.name}
                className="w-24 h-24 rounded-2xl object-cover bg-purple-900"
              />
              {userData.profile?.isSwapAvailable && (
                <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-xs bg-green-500/20 border border-green-500/40 text-green-400">
                  Hazır
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{userData.name}</h1>

              <div className="flex flex-wrap items-center gap-3 mt-2">
                {userData.profile?.city && (
                  <div className="flex items-center gap-1.5 text-white/50 text-sm">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{userData.profile.district ? `${userData.profile.district}, ` : ''}{userData.profile.city}</span>
                  </div>
                )}
                {avgRating && (
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white/70 text-sm font-medium">{avgRating.toFixed(1)}</span>
                    <span className="text-white/30 text-xs">({reviews.length} yorum)</span>
                  </div>
                )}
              </div>

              {userData.profile?.bio && (
                <p className="text-white/60 text-sm mt-3 leading-relaxed">{userData.profile.bio}</p>
              )}

              <div className="flex flex-wrap gap-2 mt-4">
                {userData.profile?.isSwapAvailable && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400">
                    🔄 Ücretsiz Takas
                  </span>
                )}
                {userData.profile?.isPaidLessonAvailable && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    💰 {userData.profile.hourlyRate ? `₺${userData.profile.hourlyRate}/sa` : 'Ücretli Ders'}
                  </span>
                )}
              </div>

              {userData.profile?.availabilityText && (
                <div className="flex items-center gap-2 mt-2 text-white/40 text-sm">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{userData.profile.availabilityText}</span>
                </div>
              )}
            </div>
          </div>

          {/* CTA buttons */}
          {me?.id !== id && (
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button onClick={handleStartConversation} className="btn-secondary flex items-center justify-center gap-2 flex-1 text-sm">
                <MessageCircle className="w-4 h-4" /> Mesaj Gönder
              </button>
              <button onClick={() => setShowModal(true)} className="btn-primary flex items-center justify-center gap-2 flex-1 text-sm">
                <Send className="w-4 h-4" /> Talep Gönder
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Skills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {teachSkills.length > 0 && (
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-purple-400" /> Öğrettiği Beceriler
            </h3>
            <div className="flex flex-wrap gap-2">
              {teachSkills.map((us) => (
                <span key={us.id} className="skill-badge-teach">{us.skill?.name}</span>
              ))}
            </div>
          </div>
        )}
        {learnSkills.length > 0 && (
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" /> Öğrenmek İstedikleri
            </h3>
            <div className="flex flex-wrap gap-2">
              {learnSkills.map((us) => (
                <span key={us.id} className="skill-badge-learn">{us.skill?.name}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reviews */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400" />
          Yorumlar
          {avgRating && (
            <span className="text-sm font-normal text-white/50 ml-1">
              · {avgRating.toFixed(1)} puan ({reviews.length})
            </span>
          )}
        </h2>

        {reviews.length === 0 ? (
          <p className="text-white/30 text-sm text-center py-4">Henüz yorum yok</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-white/5 pb-4 last:border-0">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={review.reviewer.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.reviewer.name}`}
                      alt={review.reviewer.name}
                      className="w-8 h-8 rounded-full bg-purple-900"
                    />
                    <span className="text-sm font-medium text-white">{review.reviewer.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`} />
                    ))}
                  </div>
                </div>
                {review.comment && <p className="text-white/60 text-sm pl-10">{review.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

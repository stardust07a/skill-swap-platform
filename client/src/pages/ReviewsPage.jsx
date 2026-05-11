import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { motion } from 'framer-motion'
import { Star, Send, AlertCircle, CheckCircle } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

const StarRating = ({ value, onChange }) => (
  <div className="flex gap-1.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onChange(star)}
        className="transition-transform hover:scale-110"
      >
        <Star className={`w-7 h-7 transition-colors ${star <= value ? 'text-yellow-400 fill-yellow-400' : 'text-white/20 hover:text-yellow-400/50'}`} />
      </button>
    ))}
  </div>
)

export default function ReviewsPage() {
  const { user } = useAuth()
  const [requests, setRequests] = useState([])
  const [myReviews, setMyReviews] = useState([])
  const [receivedReviews, setReceivedReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('give')
  const [form, setForm] = useState({ lessonRequestId: '', reviewedUserId: '', rating: 0, comment: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [reqRes, myRevRes, recRevRes] = await Promise.all([
        api.get('/requests'),
        api.get(`/reviews/users/${user?.id}/reviews`).catch(() => ({ data: { reviews: [] } })),
        api.get(`/reviews/users/${user?.id}/reviews`).catch(() => ({ data: { reviews: [] } })),
      ])
      const completedReqs = (reqRes.data.requests || []).filter(
        (r) => r.status === 'COMPLETED' && !r.review
      )
      setRequests(completedReqs)
      setMyReviews(myRevRes.data.reviews || [])
      setReceivedReviews(recRevRes.data.reviews || [])
    } finally {
      setLoading(false)
    }
  }

  const handleReviewableSelect = (req) => {
    const reviewedUserId = req.senderId === user?.id ? req.receiverId : req.senderId
    setForm({ lessonRequestId: req.id, reviewedUserId, rating: 0, comment: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.rating) return setError('Puan seçiniz.')
    setSubmitting(true)
    setError('')
    try {
      await api.post('/reviews', form)
      setSuccess('Yorumunuz eklendi!')
      setRequests((prev) => prev.filter((r) => r.id !== form.lessonRequestId))
      setForm({ lessonRequestId: '', reviewedUserId: '', rating: 0, comment: '' })
      setTimeout(() => setSuccess(''), 3000)
      fetchData()
    } catch (err) {
      setError(err.response?.data?.error || 'Yorum eklenemedi.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <LoadingSpinner size="lg" />
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <Star className="w-6 h-6 text-yellow-400" /> Yorumlar & Puanlama
      </h1>

      {/* Tabs */}
      <div className="flex gap-2 glass rounded-xl p-1 w-fit">
        {[
          { key: 'give', label: 'Yorum Yap' },
          { key: 'received', label: 'Aldığım Yorumlar' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === key ? 'bg-purple-600 text-white' : 'text-white/50 hover:text-white'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm"
        >
          <CheckCircle className="w-4 h-4 shrink-0" />
          {success}
        </motion.div>
      )}

      {tab === 'give' && (
        <div className="space-y-5">
          {/* Reviewable requests */}
          {requests.length > 0 && (
            <div className="glass rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-white/70">Yorum Bekleyen Tamamlanmış Dersler</h3>
              {requests.map((req) => {
                const other = req.senderId === user?.id ? req.receiver : req.sender
                const isSelected = form.lessonRequestId === req.id
                return (
                  <button
                    key={req.id}
                    onClick={() => handleReviewableSelect(req)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                      isSelected ? 'bg-purple-600/20 border border-purple-500/40' : 'glass hover:bg-white/5'
                    }`}
                  >
                    <img
                      src={other?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${other?.name}`}
                      alt={other?.name}
                      className="w-9 h-9 rounded-full bg-purple-900 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">{other?.name}</p>
                      <p className="text-xs text-white/40">
                        {req.type === 'SWAP' ? '🔄 Takas' : '💰 Ücretli Ders'}
                        {req.skillWanted && ` · ${req.skillWanted.name}`}
                      </p>
                    </div>
                    {isSelected && <CheckCircle className="w-4 h-4 text-purple-400 shrink-0" />}
                  </button>
                )
              })}
            </div>
          )}

          {/* Review form */}
          {form.lessonRequestId ? (
            <div className="glass rounded-2xl p-6 space-y-5">
              <h3 className="text-lg font-semibold text-white">Değerlendirmeni Yap</h3>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-white/70 mb-2">Puan</label>
                  <StarRating value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
                  {form.rating > 0 && (
                    <p className="text-xs text-white/40 mt-1">
                      {['', 'Çok Kötü', 'Kötü', 'Orta', 'İyi', 'Mükemmel'][form.rating]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-1.5">Yorumunuz</label>
                  <textarea
                    value={form.comment}
                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                    placeholder="Deneyiminizi paylaşın..."
                    rows={3}
                    className="input-field resize-none"
                  />
                </div>

                <button type="submit" disabled={submitting || !form.rating} className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><Send className="w-4 h-4" /> Yorumu Gönder</>
                  )}
                </button>
              </form>
            </div>
          ) : requests.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center">
              <Star className="w-10 h-10 text-white/20 mx-auto mb-3" />
              <p className="text-white/40 text-sm">Yorum yapılacak tamamlanan ders yok.</p>
              <Link to="/requests" className="text-purple-400 text-sm mt-2 inline-block hover:text-purple-300">
                Taleplere git →
              </Link>
            </div>
          ) : (
            <div className="glass rounded-2xl p-6 text-center">
              <p className="text-white/40 text-sm">Yorum yapmak için bir ders seçin.</p>
            </div>
          )}
        </div>
      )}

      {tab === 'received' && (
        <div className="space-y-4">
          {receivedReviews.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center">
              <Star className="w-10 h-10 text-white/20 mx-auto mb-3" />
              <p className="text-white/40 text-sm">Henüz yorum almadınız.</p>
            </div>
          ) : (
            receivedReviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-5"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={review.reviewer.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.reviewer.name}`}
                      alt={review.reviewer.name}
                      className="w-9 h-9 rounded-full bg-purple-900"
                    />
                    <Link to={`/users/${review.reviewer.id}`} className="text-sm font-medium text-white hover:text-purple-300 transition-colors">
                      {review.reviewer.name}
                    </Link>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`} />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-white/60 text-sm leading-relaxed">{review.comment}</p>
                )}
                <p className="text-xs text-white/30 mt-2">
                  {new Date(review.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

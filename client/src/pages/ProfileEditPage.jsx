import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { motion } from 'framer-motion'
import {
  User, MapPin, DollarSign, FileText, Clock, Save,
  Plus, Trash2, AlertCircle, CheckCircle, GraduationCap, BookOpen
} from 'lucide-react'

export default function ProfileEditPage() {
  const { user, fetchMe } = useAuth()
  const [form, setForm] = useState({
    name: '', avatarUrl: '', bio: '', city: '', district: '',
    hourlyRate: '', isSwapAvailable: true, isPaidLessonAvailable: false, availabilityText: '',
  })
  const [skills, setSkills] = useState([])
  const [userSkills, setUserSkills] = useState([])
  const [newSkillId, setNewSkillId] = useState('')
  const [newSkillType, setNewSkillType] = useState('TEACH')
  const [newSkillName, setNewSkillName] = useState('')
  const [loading, setLoading] = useState(false)
  const [skillLoading, setSkillLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        avatarUrl: user.avatarUrl || '',
        bio: user.profile?.bio || '',
        city: user.profile?.city || '',
        district: user.profile?.district || '',
        hourlyRate: user.profile?.hourlyRate || '',
        isSwapAvailable: user.profile?.isSwapAvailable ?? true,
        isPaidLessonAvailable: user.profile?.isPaidLessonAvailable ?? false,
        availabilityText: user.profile?.availabilityText || '',
      })
      setUserSkills(user.userSkills || [])
    }
    fetchSkills()
  }, [user])

  const fetchSkills = async () => {
    try {
      const { data } = await api.get('/skills')
      setSkills(data.skills || [])
    } catch {}
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await api.put('/profile/me', form)
      await fetchMe()
      setSuccess('Profil başarıyla güncellendi!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Profil güncellenemedi.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddSkill = async () => {
    if (!newSkillId && !newSkillName.trim()) return
    setSkillLoading(true)
    setError('')
    try {
      let skillId = newSkillId
      if (!skillId && newSkillName.trim()) {
        const { data } = await api.post('/skills', { name: newSkillName.trim() })
        skillId = data.skill.id
      }
      const { data } = await api.post('/profile/skills', { skillId, type: newSkillType })
      setUserSkills((prev) => [...prev, data.userSkill])
      setNewSkillId('')
      setNewSkillName('')
    } catch (err) {
      setError(err.response?.data?.error || 'Beceri eklenemedi.')
    } finally {
      setSkillLoading(false)
    }
  }

  const handleRemoveSkill = async (id) => {
    try {
      await api.delete(`/profile/skills/${id}`)
      setUserSkills((prev) => prev.filter((us) => us.id !== id))
    } catch (err) {
      setError(err.response?.data?.error || 'Beceri kaldırılamadı.')
    }
  }

  const teachSkills = userSkills.filter((us) => us.type === 'TEACH')
  const learnSkills = userSkills.filter((us) => us.type === 'LEARN')

  const availableSkills = skills.filter(
    (s) => !userSkills.some((us) => us.skillId === s.id && us.type === newSkillType)
  )

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-white">Profili Düzenle</h1>

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

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic info */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-purple-400" /> Temel Bilgiler
          </h2>

          {/* Avatar preview */}
          <div className="flex items-center gap-4">
            <img
              src={form.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.name}`}
              alt="Avatar"
              className="w-16 h-16 rounded-2xl object-cover bg-purple-900"
            />
            <div className="flex-1">
              <label className="block text-sm font-medium text-white/70 mb-1.5">Profil Foto URL</label>
              <input
                type="url"
                value={form.avatarUrl}
                onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
                placeholder="https://..."
                className="input-field text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Ad Soyad</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Bio
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Kendin hakkında kısa bir tanıtım yaz..."
              rows={3}
              className="input-field resize-none"
            />
          </div>
        </div>

        {/* Location */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-pink-400" /> Konum
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Şehir</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="İstanbul"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">İlçe</label>
              <input
                type="text"
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                placeholder="Kadıköy"
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Lesson settings */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-cyan-400" /> Ders Ayarları
          </h2>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => setForm({ ...form, isSwapAvailable: !form.isSwapAvailable })}
                className={`w-12 h-6 rounded-full transition-all duration-200 relative shrink-0 ${form.isSwapAvailable ? 'bg-green-500' : 'bg-white/20'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${form.isSwapAvailable ? 'translate-x-7' : 'translate-x-1'}`} />
              </div>
              <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                Ücretsiz takas için müsaitim
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => setForm({ ...form, isPaidLessonAvailable: !form.isPaidLessonAvailable })}
                className={`w-12 h-6 rounded-full transition-all duration-200 relative shrink-0 ${form.isPaidLessonAvailable ? 'bg-purple-500' : 'bg-white/20'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${form.isPaidLessonAvailable ? 'translate-x-7' : 'translate-x-1'}`} />
              </div>
              <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                Ücretli ders veriyorum
              </span>
            </label>
          </div>

          {form.isPaidLessonAvailable && (
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Saatlik Ücret (₺)</label>
              <input
                type="number"
                value={form.hourlyRate}
                onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })}
                placeholder="150"
                min="0"
                className="input-field"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Uygunluk Açıklaması
            </label>
            <input
              type="text"
              value={form.availabilityText}
              onChange={(e) => setForm({ ...form, availabilityText: e.target.value })}
              placeholder="Hafta içi akşamları ve hafta sonları..."
              className="input-field"
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <><Save className="w-4 h-4" /> Kaydet</>
          )}
        </button>
      </form>

      {/* Skills section */}
      <div className="glass rounded-2xl p-6 space-y-5">
        <h2 className="text-lg font-semibold text-white">Becerilerim</h2>

        {/* Teach skills */}
        <div>
          <p className="text-sm font-medium text-white/60 mb-2 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-purple-400" /> Öğrettiğim Beceriler
          </p>
          <div className="flex flex-wrap gap-2">
            {teachSkills.length === 0 && (
              <span className="text-sm text-white/30">Henüz eklenmedi</span>
            )}
            {teachSkills.map((us) => (
              <div key={us.id} className="flex items-center gap-1.5 skill-badge-teach">
                <span>{us.skill?.name}</span>
                <button onClick={() => handleRemoveSkill(us.id)} className="hover:text-red-400 transition-colors">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Learn skills */}
        <div>
          <p className="text-sm font-medium text-white/60 mb-2 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-cyan-400" /> Öğrenmek İstediğim Beceriler
          </p>
          <div className="flex flex-wrap gap-2">
            {learnSkills.length === 0 && (
              <span className="text-sm text-white/30">Henüz eklenmedi</span>
            )}
            {learnSkills.map((us) => (
              <div key={us.id} className="flex items-center gap-1.5 skill-badge-learn">
                <span>{us.skill?.name}</span>
                <button onClick={() => handleRemoveSkill(us.id)} className="hover:text-red-400 transition-colors">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add skill */}
        <div className="border-t border-white/10 pt-4 space-y-3">
          <p className="text-sm font-medium text-white/70">Yeni Beceri Ekle</p>
          <div className="flex gap-2">
            <select
              value={newSkillType}
              onChange={(e) => setNewSkillType(e.target.value)}
              className="input-field w-40 text-sm"
            >
              <option value="TEACH">Öğreteceğim</option>
              <option value="LEARN">Öğreneceğim</option>
            </select>
            <select
              value={newSkillId}
              onChange={(e) => { setNewSkillId(e.target.value); setNewSkillName('') }}
              className="input-field flex-1 text-sm"
            >
              <option value="">Mevcut beceri seç...</option>
              {availableSkills.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => { setNewSkillName(e.target.value); setNewSkillId('') }}
              placeholder="Ya da yeni beceri yaz..."
              className="input-field flex-1 text-sm"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              disabled={skillLoading || (!newSkillId && !newSkillName.trim())}
              className="btn-primary px-4 py-2.5 text-sm"
            >
              {skillLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { motion } from 'framer-motion'
import {
  User, MapPin, DollarSign, FileText, Clock, Save,
  Plus, Trash2, AlertCircle, CheckCircle, GraduationCap, BookOpen
} from 'lucide-react'

const urlRegex = /^https?:\/\/.+/i

const getProfileErrors = (form) => {
  const errors = {}

  if (!form.name.trim()) {
    errors.name = 'Ad soyad alanı zorunludur.'
  }

  if (form.avatarUrl.trim() && !urlRegex.test(form.avatarUrl.trim())) {
    errors.avatarUrl = 'Profil fotoğrafı için geçerli bir URL giriniz.'
  }

  if (form.isPaidLessonAvailable && form.hourlyRate && Number(form.hourlyRate) < 0) {
    errors.hourlyRate = 'Saatlik ücret negatif olamaz.'
  }

  return errors
}

export default function ProfileEditPage() {
  const { user, fetchMe } = useAuth()
  const [form, setForm] = useState({
    name: '',
    avatarUrl: '',
    bio: '',
    city: '',
    district: '',
    hourlyRate: '',
    isSwapAvailable: true,
    isPaidLessonAvailable: false,
    availabilityText: '',
  })
  const [touched, setTouched] = useState({})
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

  const profileErrors = useMemo(() => getProfileErrors(form), [form])

  const fieldError = (field) => (touched[field] ? profileErrors[field] : '')

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    if (error) setError('')
    if (success) setSuccess('')
  }

  const markTouched = (field) => {
    setTouched((current) => ({ ...current, [field]: true }))
  }

  const fetchSkills = async () => {
    try {
      const { data } = await api.get('/skills')
      setSkills(data.skills || [])
    } catch {}
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    const errors = getProfileErrors(form)
    if (Object.keys(errors).length > 0) {
      setTouched({ name: true, avatarUrl: true, hourlyRate: true })
      setError(Object.values(errors)[0])
      return
    }

    setLoading(true)
    try {
      await api.put('/profile/me', {
        ...form,
        name: form.name.trim(),
        avatarUrl: form.avatarUrl.trim(),
        bio: form.bio.trim(),
        city: form.city.trim(),
        district: form.district.trim(),
        availabilityText: form.availabilityText.trim(),
      })
      await fetchMe()
      setSuccess('Profil başarıyla güncellendi.')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Profil güncellenemedi.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddSkill = async () => {
    const skillName = newSkillName.trim()
    if (!newSkillId && !skillName) return

    const selectedSkill = newSkillId
      ? skills.find((skill) => skill.id === newSkillId)
      : skills.find((skill) => skill.name.toLocaleLowerCase('tr-TR') === skillName.toLocaleLowerCase('tr-TR'))

    if (selectedSkill && userSkills.some((userSkill) => userSkill.skillId === selectedSkill.id && userSkill.type === newSkillType)) {
      setError('Bu beceri zaten aynı listeye eklenmiş.')
      return
    }

    setSkillLoading(true)
    setError('')
    try {
      let skillId = newSkillId || selectedSkill?.id
      if (!skillId && skillName) {
        const { data } = await api.post('/skills', { name: skillName })
        skillId = data.skill.id
      }
      const { data } = await api.post('/profile/skills', { skillId, type: newSkillType })
      setUserSkills((current) => [...current, data.userSkill])
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
      setUserSkills((current) => current.filter((userSkill) => userSkill.id !== id))
    } catch (err) {
      setError(err.response?.data?.error || 'Beceri kaldırılamadı.')
    }
  }

  const teachSkills = userSkills.filter((userSkill) => userSkill.type === 'TEACH')
  const learnSkills = userSkills.filter((userSkill) => userSkill.type === 'LEARN')

  const availableSkills = skills.filter(
    (skill) => !userSkills.some((userSkill) => userSkill.skillId === skill.id && userSkill.type === newSkillType)
  )

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-white">Profili Düzenle</h1>

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm"
          role="status"
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
          role="alert"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSave} className="space-y-6" noValidate>
        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-purple-400" /> Temel Bilgiler
          </h2>

          <div className="flex items-center gap-4">
            <img
              src={form.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(form.name || 'Skill Swap')}`}
              alt="Profil avatarı"
              className="w-16 h-16 rounded-2xl object-cover bg-purple-900"
            />
            <div className="flex-1">
              <label className="block text-sm font-medium text-white/70 mb-1.5" htmlFor="profile-avatar">
                Profil Fotoğrafı URL
              </label>
              <input
                id="profile-avatar"
                type="url"
                value={form.avatarUrl}
                onChange={(event) => updateForm('avatarUrl', event.target.value)}
                onBlur={() => markTouched('avatarUrl')}
                placeholder="https://..."
                className="input-field text-sm"
                aria-invalid={Boolean(fieldError('avatarUrl'))}
                aria-describedby={fieldError('avatarUrl') ? 'profile-avatar-error' : undefined}
              />
              {fieldError('avatarUrl') && (
                <p id="profile-avatar-error" className="mt-1 text-xs text-red-400">
                  {fieldError('avatarUrl')}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5" htmlFor="profile-name">
              Ad Soyad
            </label>
            <input
              id="profile-name"
              type="text"
              value={form.name}
              onChange={(event) => updateForm('name', event.target.value)}
              onBlur={() => markTouched('name')}
              className="input-field"
              aria-invalid={Boolean(fieldError('name'))}
              aria-describedby={fieldError('name') ? 'profile-name-error' : undefined}
              required
            />
            {fieldError('name') && (
              <p id="profile-name-error" className="mt-1 text-xs text-red-400">
                {fieldError('name')}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5 flex items-center gap-1.5" htmlFor="profile-bio">
              <FileText className="w-3.5 h-3.5" /> Bio
            </label>
            <textarea
              id="profile-bio"
              value={form.bio}
              onChange={(event) => updateForm('bio', event.target.value)}
              placeholder="Kendin hakkında kısa bir tanıtım yaz..."
              rows={3}
              className="input-field resize-none"
            />
          </div>
        </div>

        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-pink-400" /> Konum
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5" htmlFor="profile-city">
                Şehir
              </label>
              <input
                id="profile-city"
                type="text"
                value={form.city}
                onChange={(event) => updateForm('city', event.target.value)}
                placeholder="İstanbul"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5" htmlFor="profile-district">
                İlçe
              </label>
              <input
                id="profile-district"
                type="text"
                value={form.district}
                onChange={(event) => updateForm('district', event.target.value)}
                placeholder="Kadıköy"
                className="input-field"
              />
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-cyan-400" /> Ders Tercihleri
          </h2>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => updateForm('isSwapAvailable', !form.isSwapAvailable)}
              className="w-full flex items-center gap-3 cursor-pointer group text-left"
              aria-pressed={form.isSwapAvailable}
            >
              <span className={`w-12 h-6 rounded-full transition-all duration-200 relative shrink-0 ${form.isSwapAvailable ? 'bg-green-500' : 'bg-white/20'}`}>
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${form.isSwapAvailable ? 'translate-x-7' : 'translate-x-1'}`} />
              </span>
              <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                Ücretsiz takas için uygunum
              </span>
            </button>

            <button
              type="button"
              onClick={() => updateForm('isPaidLessonAvailable', !form.isPaidLessonAvailable)}
              className="w-full flex items-center gap-3 cursor-pointer group text-left"
              aria-pressed={form.isPaidLessonAvailable}
            >
              <span className={`w-12 h-6 rounded-full transition-all duration-200 relative shrink-0 ${form.isPaidLessonAvailable ? 'bg-purple-500' : 'bg-white/20'}`}>
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${form.isPaidLessonAvailable ? 'translate-x-7' : 'translate-x-1'}`} />
              </span>
              <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                Ücretli ders veriyorum
              </span>
            </button>
          </div>

          {form.isPaidLessonAvailable && (
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5" htmlFor="profile-hourly-rate">
                Saatlik Ücret (TL)
              </label>
              <input
                id="profile-hourly-rate"
                type="number"
                value={form.hourlyRate}
                onChange={(event) => updateForm('hourlyRate', event.target.value)}
                onBlur={() => markTouched('hourlyRate')}
                placeholder="150"
                min="0"
                className="input-field"
                aria-invalid={Boolean(fieldError('hourlyRate'))}
                aria-describedby={fieldError('hourlyRate') ? 'profile-hourly-rate-error' : undefined}
              />
              {fieldError('hourlyRate') && (
                <p id="profile-hourly-rate-error" className="mt-1 text-xs text-red-400">
                  {fieldError('hourlyRate')}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5 flex items-center gap-1.5" htmlFor="profile-availability">
              <Clock className="w-3.5 h-3.5" /> Uygunluk Açıklaması
            </label>
            <input
              id="profile-availability"
              type="text"
              value={form.availabilityText}
              onChange={(event) => updateForm('availabilityText', event.target.value)}
              placeholder="Hafta içi akşamları ve hafta sonları..."
              className="input-field"
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <><Save className="w-4 h-4" /> Değişiklikleri Kaydet</>
          )}
        </button>
      </form>

      <div className="glass rounded-2xl p-6 space-y-5">
        <h2 className="text-lg font-semibold text-white">Becerilerim</h2>

        <div>
          <p className="text-sm font-medium text-white/60 mb-2 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-purple-400" /> Öğrettiğim Beceriler
          </p>
          <div className="flex flex-wrap gap-2">
            {teachSkills.length === 0 && (
              <span className="text-sm text-white/30">Henüz eklenmedi</span>
            )}
            {teachSkills.map((userSkill) => (
              <div key={userSkill.id} className="flex items-center gap-1.5 skill-badge-teach">
                <span>{userSkill.skill?.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(userSkill.id)}
                  className="hover:text-red-400 transition-colors"
                  aria-label={`${userSkill.skill?.name} becerisini kaldır`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-white/60 mb-2 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-cyan-400" /> Öğrenmek İstediğim Beceriler
          </p>
          <div className="flex flex-wrap gap-2">
            {learnSkills.length === 0 && (
              <span className="text-sm text-white/30">Henüz eklenmedi</span>
            )}
            {learnSkills.map((userSkill) => (
              <div key={userSkill.id} className="flex items-center gap-1.5 skill-badge-learn">
                <span>{userSkill.skill?.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(userSkill.id)}
                  className="hover:text-red-400 transition-colors"
                  aria-label={`${userSkill.skill?.name} becerisini kaldır`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-4 space-y-3">
          <p className="text-sm font-medium text-white/70">Yeni Beceri Ekle</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={newSkillType}
              onChange={(event) => setNewSkillType(event.target.value)}
              className="input-field sm:w-40 text-sm"
            >
              <option value="TEACH">Öğreteceğim</option>
              <option value="LEARN">Öğreneceğim</option>
            </select>
            <select
              value={newSkillId}
              onChange={(event) => { setNewSkillId(event.target.value); setNewSkillName('') }}
              className="input-field flex-1 text-sm"
            >
              <option value="">Mevcut beceri seç...</option>
              {availableSkills.map((skill) => (
                <option key={skill.id} value={skill.id}>{skill.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkillName}
              onChange={(event) => { setNewSkillName(event.target.value); setNewSkillId('') }}
              placeholder="Ya da yeni beceri yaz..."
              className="input-field flex-1 text-sm"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              disabled={skillLoading || (!newSkillId && !newSkillName.trim())}
              className="btn-primary px-4 py-2.5 text-sm"
              aria-label="Beceri ekle"
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

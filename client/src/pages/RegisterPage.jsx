import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { Zap, User, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react'

const initialForm = {
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const getPasswordStrength = (password) => {
  if (!password) return 0

  let score = 0
  if (password.length >= 6) score += 1
  if (password.length >= 10) score += 1
  if (/[A-ZÇĞİÖŞÜ]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1

  return score
}

const getValidationErrors = (form) => {
  const name = form.name.trim()
  const email = form.email.trim()
  const errors = {}

  if (!name) {
    errors.name = 'Ad soyad alanı zorunludur.'
  } else if (name.length < 2) {
    errors.name = 'Ad soyad en az 2 karakter olmalıdır.'
  }

  if (!email) {
    errors.email = 'E-posta alanı zorunludur.'
  } else if (!emailRegex.test(email)) {
    errors.email = 'Geçerli bir e-posta adresi giriniz.'
  }

  if (!form.password) {
    errors.password = 'Şifre alanı zorunludur.'
  } else if (form.password.length < 6) {
    errors.password = 'Şifre en az 6 karakter olmalıdır.'
  }

  if (!form.passwordConfirm) {
    errors.passwordConfirm = 'Şifre tekrar alanı zorunludur.'
  } else if (form.password !== form.passwordConfirm) {
    errors.passwordConfirm = 'Şifreler eşleşmiyor.'
  }

  return errors
}

export default function RegisterPage() {
  const [form, setForm] = useState(initialForm)
  const [touched, setTouched] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const validationErrors = useMemo(() => getValidationErrors(form), [form])
  const visibleErrors = Object.keys(validationErrors).filter((field) => touched[field])
  const strength = getPasswordStrength(form.password)
  const strengthLabels = ['', 'Zayıf', 'Orta', 'İyi', 'Güçlü']
  const strengthColors = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    if (error) setError('')
  }

  const markTouched = (field) => {
    setTouched((current) => ({ ...current, [field]: true }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const errors = getValidationErrors(form)
    if (Object.keys(errors).length > 0) {
      setTouched({
        name: true,
        email: true,
        password: true,
        passwordConfirm: true,
      })
      setError(Object.values(errors)[0])
      return
    }

    setLoading(true)
    try {
      await register(form.name.trim(), form.email.trim(), form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Kayıt oluşturulamadı. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  const fieldError = (field) => (touched[field] ? validationErrors[field] : '')

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-900/50">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">Skill Swap</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Hesap Oluştur</h1>
          <p className="text-white/50">Becerilerini paylaş, yeni şeyler öğren</p>
        </div>

        <div className="glass rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {(error || visibleErrors.length > 0) && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error || validationErrors[visibleErrors[0]]}</span>
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2" htmlFor="register-name">
                Ad Soyad
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  id="register-name"
                  type="text"
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  onBlur={() => markTouched('name')}
                  placeholder="Adınız Soyadınız"
                  className="input-field pl-10"
                  aria-invalid={Boolean(fieldError('name'))}
                  aria-describedby={fieldError('name') ? 'register-name-error' : undefined}
                  autoComplete="name"
                />
              </div>
              {fieldError('name') && (
                <p id="register-name-error" className="mt-1 text-xs text-red-400">
                  {fieldError('name')}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2" htmlFor="register-email">
                E-posta
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  id="register-email"
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  onBlur={() => markTouched('email')}
                  placeholder="ornek@mail.com"
                  className="input-field pl-10"
                  aria-invalid={Boolean(fieldError('email'))}
                  aria-describedby={fieldError('email') ? 'register-email-error' : undefined}
                  autoComplete="email"
                />
              </div>
              {fieldError('email') && (
                <p id="register-email-error" className="mt-1 text-xs text-red-400">
                  {fieldError('email')}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2" htmlFor="register-password">
                Şifre
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(event) => updateField('password', event.target.value)}
                  onBlur={() => markTouched('password')}
                  placeholder="En az 6 karakter"
                  className="input-field pl-10 pr-12"
                  aria-invalid={Boolean(fieldError('password'))}
                  aria-describedby={fieldError('password') ? 'register-password-error' : undefined}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldError('password') && (
                <p id="register-password-error" className="mt-1 text-xs text-red-400">
                  {fieldError('password')}
                </p>
              )}
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1" aria-hidden="true">
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          item <= strength ? strengthColors[strength] : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs ${
                    strength <= 1
                      ? 'text-red-400'
                      : strength === 2
                        ? 'text-yellow-400'
                        : strength === 3
                          ? 'text-blue-400'
                          : 'text-green-400'
                  }`}>
                    Şifre gücü: {strengthLabels[strength]}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2" htmlFor="register-password-confirm">
                Şifre Tekrar
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  id="register-password-confirm"
                  type={showPassword ? 'text' : 'password'}
                  value={form.passwordConfirm}
                  onChange={(event) => updateField('passwordConfirm', event.target.value)}
                  onBlur={() => markTouched('passwordConfirm')}
                  placeholder="Şifrenizi tekrar girin"
                  className="input-field pl-10 pr-12"
                  aria-invalid={Boolean(fieldError('passwordConfirm'))}
                  aria-describedby={fieldError('passwordConfirm') ? 'register-password-confirm-error' : undefined}
                  autoComplete="new-password"
                />
                {form.passwordConfirm && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    {form.password === form.passwordConfirm
                      ? <CheckCircle className="w-4 h-4 text-green-400" />
                      : <AlertCircle className="w-4 h-4 text-red-400" />
                    }
                  </div>
                )}
              </div>
              {fieldError('passwordConfirm') && (
                <p id="register-password-confirm-error" className="mt-1 text-xs text-red-400">
                  {fieldError('passwordConfirm')}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 text-base py-3.5"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Hesap Oluştur
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-white/50 text-sm">
              Zaten hesabın var mı?{' '}
              <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Giriş yap
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

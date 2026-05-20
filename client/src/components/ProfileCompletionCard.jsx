import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react'

const buildProfileChecklist = ({ user, profile, teachSkills, learnSkills }) => [
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

export const getProfileCompletion = ({ user, profile, teachSkills = [], learnSkills = [] }) => {
  const checklist = buildProfileChecklist({ user, profile, teachSkills, learnSkills })
  const completedCount = checklist.filter((item) => item.done).length
  const percentage = Math.round((completedCount / checklist.length) * 100)

  return {
    checklist,
    completedCount,
    percentage,
    totalCount: checklist.length,
  }
}

export default function ProfileCompletionCard({ user, profile, teachSkills = [], learnSkills = [] }) {
  const { checklist, completedCount, percentage, totalCount } = getProfileCompletion({
    user,
    profile,
    teachSkills,
    learnSkills,
  })
  const missingCount = totalCount - completedCount

  return (
    <section className="w-full sm:w-80" aria-labelledby="profile-completion-title">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 id="profile-completion-title" className="text-sm font-semibold text-white">
            Profil Tamamlama
          </h2>
          <p className="text-xs text-white/45">
            {missingCount === 0 ? 'Profilin tamamlandı' : `${missingCount} alan eksik`}
          </p>
        </div>
        <span className="text-2xl font-bold text-purple-300">{percentage}%</span>
      </div>

      <div
        className="h-2.5 bg-white/10 rounded-full overflow-hidden"
        role="progressbar"
        aria-label="Profil tamamlama yüzdesi"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={percentage}
      >
        <div
          className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-700"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {percentage < 100 && (
        <Link to="/profile/edit" className="text-xs text-purple-400 hover:text-purple-300 mt-2 inline-flex items-center gap-1">
          Profili tamamla <ArrowRight className="w-3 h-3" />
        </Link>
      )}

      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-white/70">Eksik Alanlar</p>
          <span className="text-[11px] text-white/40">{completedCount}/{totalCount}</span>
        </div>
        <div className="grid grid-cols-1 gap-1.5">
          {checklist.map((item) => {
            const Icon = item.done ? CheckCircle2 : AlertTriangle
            return (
              <div
                key={item.label}
                className={`flex items-center gap-2 text-xs ${item.done ? 'text-emerald-300' : 'text-rose-300'}`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span className={item.done ? 'text-white/60' : 'text-white/80'}>{item.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

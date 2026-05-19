import { Link } from 'react-router-dom'
import { MapPin, Star, ArrowRight, BookOpen, GraduationCap, BadgeCheck } from 'lucide-react'
import { motion } from 'framer-motion'

const ScoreRing = ({ score = 0 }) => {
  const normalizedScore = Math.max(0, Math.min(score, 100))
  const color = normalizedScore >= 80 ? '#10b981' : normalizedScore >= 60 ? '#8b5cf6' : normalizedScore >= 40 ? '#f59e0b' : '#6b7280'
  const radius = 22
  const circumference = 2 * Math.PI * radius

  return (
    <div className="relative w-14 h-14 shrink-0" aria-label={`Uyum oranı yüzde ${normalizedScore}`}>
      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56" aria-hidden="true">
        <circle cx="28" cy="28" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
        <circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - normalizedScore / 100)}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-white">{normalizedScore}%</span>
      </div>
    </div>
  )
}

const SkillRow = ({ icon: Icon, label, skills, badgeClass, textClass }) => {
  if (!skills?.length) return null

  return (
    <div className="flex items-start gap-2 flex-wrap">
      <div className={`flex items-center gap-1 text-xs ${textClass}`}>
        <Icon className="w-3 h-3" />
        <span className="shrink-0">{label}</span>
      </div>
      {skills.slice(0, 3).map((skill) => (
        <span key={skill} className={`${badgeClass} text-xs px-2 py-0.5`}>{skill}</span>
      ))}
    </div>
  )
}

const MatchCard = ({ match, index = 0 }) => {
  const { user, score, matchingTeachSkills = [], matchingLearnSkills = [] } = match
  const teachSkills = user.userSkills?.filter((userSkill) => userSkill.type === 'TEACH') || []
  const learnSkills = user.userSkills?.filter((userSkill) => userSkill.type === 'LEARN') || []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link to={`/users/${user.id}`} className="block h-full">
        <article className="glass rounded-2xl p-5 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/20 group h-full">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <img
                src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`}
                alt={user.name}
                className="w-14 h-14 rounded-2xl object-cover bg-purple-900/50"
              />
              {user.profile?.isSwapAvailable && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0a0a1a]" title="Takas için hazır" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors truncate">
                    {user.name}
                  </h3>
                  {user.profile?.city && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-white/40" />
                      <span className="text-xs text-white/40 truncate">
                        {user.profile.district ? `${user.profile.district}, ` : ''}{user.profile.city}
                      </span>
                    </div>
                  )}
                  {user.avgRating && (
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs text-white/60">{user.avgRating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                <ScoreRing score={score} />
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
            <SkillRow
              icon={GraduationCap}
              label="Sana öğretebilir:"
              skills={matchingTeachSkills}
              badgeClass="skill-badge-teach"
              textClass="text-green-400"
            />
            <SkillRow
              icon={BookOpen}
              label="Senden öğrenmek ister:"
              skills={matchingLearnSkills}
              badgeClass="skill-badge-learn"
              textClass="text-cyan-400"
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {teachSkills.slice(0, 3).map((userSkill) => (
              <span key={userSkill.id} className="skill-badge-teach text-xs">{userSkill.skill.name}</span>
            ))}
            {learnSkills.slice(0, 2).map((userSkill) => (
              <span key={userSkill.id} className="skill-badge-learn text-xs">{userSkill.skill.name}</span>
            ))}
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex flex-wrap gap-2">
              {user.profile?.isSwapAvailable && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 inline-flex items-center gap-1">
                  <BadgeCheck className="w-3 h-3" /> Ücretsiz Takas
                </span>
              )}
              {user.profile?.isPaidLessonAvailable && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {user.profile.hourlyRate ? `${user.profile.hourlyRate} TL/sa` : 'Ücretli Ders'}
                </span>
              )}
            </div>
            <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-purple-400 group-hover:translate-x-1 transition-all shrink-0" />
          </div>
        </article>
      </Link>
    </motion.div>
  )
}

export default MatchCard

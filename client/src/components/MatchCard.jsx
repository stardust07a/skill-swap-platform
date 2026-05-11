import { Link } from 'react-router-dom'
import { MapPin, Star, ArrowRight, BookOpen, GraduationCap } from 'lucide-react'
import { motion } from 'framer-motion'

const ScoreRing = ({ score }) => {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#8b5cf6' : score >= 40 ? '#f59e0b' : '#6b7280'
  return (
    <div className="relative w-14 h-14 shrink-0">
      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
        <circle
          cx="28" cy="28" r="22" fill="none"
          stroke={color} strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 22}`}
          strokeDashoffset={`${2 * Math.PI * 22 * (1 - score / 100)}`}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-white">{score}%</span>
      </div>
    </div>
  )
}

const MatchCard = ({ match, index = 0 }) => {
  const { user, score, matchingTeachSkills, matchingLearnSkills } = match

  const teachSkills = user.userSkills?.filter((us) => us.type === 'TEACH') || []
  const learnSkills = user.userSkills?.filter((us) => us.type === 'LEARN') || []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link to={`/users/${user.id}`} className="block">
        <div className="glass rounded-2xl p-5 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/20 group">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative shrink-0">
              <img
                src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                alt={user.name}
                className="w-14 h-14 rounded-2xl object-cover bg-purple-900/50"
              />
              {user.profile?.isSwapAvailable && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0a0a1a]" title="Takas için hazır" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors truncate">
                    {user.name}
                  </h3>
                  {user.profile?.city && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-white/40" />
                      <span className="text-xs text-white/40">
                        {user.profile.district ? `${user.profile.district}, ` : ''}{user.profile.city}
                      </span>
                    </div>
                  )}
                </div>
                <ScoreRing score={score} />
              </div>

              {/* Rating */}
              {user.avgRating && (
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-white/60">{user.avgRating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Match tags */}
          {(matchingTeachSkills.length > 0 || matchingLearnSkills.length > 0) && (
            <div className="mt-3 pt-3 border-t border-white/5 space-y-1.5">
              {matchingTeachSkills.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1 text-xs text-green-400">
                    <GraduationCap className="w-3 h-3" />
                    <span className="shrink-0">Sana öğretebilir:</span>
                  </div>
                  {matchingTeachSkills.slice(0, 3).map((s) => (
                    <span key={s} className="skill-badge-teach text-xs px-2 py-0.5">{s}</span>
                  ))}
                </div>
              )}
              {matchingLearnSkills.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1 text-xs text-cyan-400">
                    <BookOpen className="w-3 h-3" />
                    <span className="shrink-0">Senden öğrenmek ister:</span>
                  </div>
                  {matchingLearnSkills.slice(0, 3).map((s) => (
                    <span key={s} className="skill-badge-learn text-xs px-2 py-0.5">{s}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Skills preview */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {teachSkills.slice(0, 3).map((us) => (
              <span key={us.id} className="skill-badge-teach text-xs">{us.skill.name}</span>
            ))}
            {learnSkills.slice(0, 2).map((us) => (
              <span key={us.id} className="skill-badge-learn text-xs">{us.skill.name}</span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex gap-2">
              {user.profile?.isSwapAvailable && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                  Ücretsiz Takas
                </span>
              )}
              {user.profile?.isPaidLessonAvailable && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {user.profile.hourlyRate ? `₺${user.profile.hourlyRate}/sa` : 'Ücretli Ders'}
                </span>
              )}
            </div>
            <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default MatchCard

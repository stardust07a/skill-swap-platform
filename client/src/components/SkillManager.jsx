import { useMemo, useState } from 'react'
import { BookOpen, GraduationCap, Plus, Trash2 } from 'lucide-react'
import api from '../services/api'

const skillTypeLabels = {
  TEACH: 'Öğreteceğim',
  LEARN: 'Öğreneceğim',
}

const normalizeSkillName = (value) => value.trim().toLocaleLowerCase('tr-TR')

const SkillList = ({ title, icon: Icon, emptyText, skills, badgeClass, onRemove }) => (
  <div>
    <p className="text-sm font-medium text-white/60 mb-2 flex items-center gap-1.5">
      <Icon className="w-4 h-4" /> {title}
    </p>
    <div className="flex flex-wrap gap-2">
      {skills.length === 0 && (
        <span className="text-sm text-white/30">{emptyText}</span>
      )}
      {skills.map((userSkill) => (
        <div key={userSkill.id} className={`flex items-center gap-1.5 ${badgeClass}`}>
          <span>{userSkill.skill?.name}</span>
          <button
            type="button"
            onClick={() => onRemove(userSkill.id)}
            className="hover:text-red-400 transition-colors"
            aria-label={`${userSkill.skill?.name} becerisini kaldır`}
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  </div>
)

export default function SkillManager({ skills, userSkills, onChange, onError }) {
  const [newSkillId, setNewSkillId] = useState('')
  const [newSkillType, setNewSkillType] = useState('TEACH')
  const [newSkillName, setNewSkillName] = useState('')
  const [skillLoading, setSkillLoading] = useState(false)

  const teachSkills = useMemo(
    () => userSkills.filter((userSkill) => userSkill.type === 'TEACH'),
    [userSkills]
  )
  const learnSkills = useMemo(
    () => userSkills.filter((userSkill) => userSkill.type === 'LEARN'),
    [userSkills]
  )
  const availableSkills = useMemo(
    () => skills.filter(
      (skill) => !userSkills.some((userSkill) => userSkill.skillId === skill.id && userSkill.type === newSkillType)
    ),
    [skills, userSkills, newSkillType]
  )

  const handleAddSkill = async () => {
    const skillName = newSkillName.trim()
    if (!newSkillId && !skillName) {
      onError('Lütfen bir beceri seçin veya yeni beceri adı yazın.')
      return
    }

    const selectedSkill = newSkillId
      ? skills.find((skill) => skill.id === newSkillId)
      : skills.find((skill) => normalizeSkillName(skill.name) === normalizeSkillName(skillName))

    if (selectedSkill && userSkills.some((userSkill) => userSkill.skillId === selectedSkill.id && userSkill.type === newSkillType)) {
      onError('Bu beceri aynı listeye zaten eklenmiş.')
      return
    }

    setSkillLoading(true)
    onError('')
    try {
      let skillId = newSkillId || selectedSkill?.id
      if (!skillId && skillName) {
        const { data } = await api.post('/skills', { name: skillName })
        skillId = data.skill.id
      }
      const { data } = await api.post('/profile/skills', { skillId, type: newSkillType })
      onChange([...userSkills, data.userSkill])
      setNewSkillId('')
      setNewSkillName('')
    } catch (err) {
      onError(err.response?.data?.error || 'Beceri eklenemedi.')
    } finally {
      setSkillLoading(false)
    }
  }

  const handleRemoveSkill = async (id) => {
    try {
      await api.delete(`/profile/skills/${id}`)
      onChange(userSkills.filter((userSkill) => userSkill.id !== id))
    } catch (err) {
      onError(err.response?.data?.error || 'Beceri kaldırılamadı.')
    }
  }

  return (
    <div className="glass rounded-2xl p-6 space-y-5">
      <h2 className="text-lg font-semibold text-white">Becerilerim</h2>

      <SkillList
        title="Öğretebildiğim Beceriler"
        icon={GraduationCap}
        emptyText="Henüz öğretilecek beceri eklenmedi"
        skills={teachSkills}
        badgeClass="skill-badge-teach"
        onRemove={handleRemoveSkill}
      />

      <SkillList
        title="Öğrenmek İstediğim Beceriler"
        icon={BookOpen}
        emptyText="Henüz öğrenilecek beceri eklenmedi"
        skills={learnSkills}
        badgeClass="skill-badge-learn"
        onRemove={handleRemoveSkill}
      />

      <div className="border-t border-white/10 pt-4 space-y-3">
        <p className="text-sm font-medium text-white/70">Yeni Beceri Ekle</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={newSkillType}
            onChange={(event) => setNewSkillType(event.target.value)}
            className="input-field sm:w-40 text-sm"
            aria-label="Beceri türü"
          >
            {Object.entries(skillTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <select
            value={newSkillId}
            onChange={(event) => { setNewSkillId(event.target.value); setNewSkillName('') }}
            className="input-field flex-1 text-sm"
            aria-label="Mevcut beceri seç"
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
            aria-label="Yeni beceri adı"
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
        <p className="text-xs text-white/35">
          Aynı beceri aynı listeye ikinci kez eklenemez; öğretme ve öğrenme listeleri ayrı tutulur.
        </p>
      </div>
    </div>
  )
}

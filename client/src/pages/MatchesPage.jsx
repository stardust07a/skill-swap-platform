import { useState, useEffect } from 'react'
import api from '../services/api'
import { motion } from 'framer-motion'
import { Search, Filter, X, Users, SlidersHorizontal } from 'lucide-react'
import MatchCard from '../components/MatchCard'
import LoadingSpinner from '../components/LoadingSpinner'

export default function MatchesPage() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ skill: '', city: '', mode: '' })
  const [applied, setApplied] = useState({})
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchMatches(applied)
  }, [])

  const fetchMatches = async (params = {}) => {
    setLoading(true)
    try {
      const query = new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, value]) => value))
      ).toString()
      const { data } = await api.get(`/matches${query ? `?${query}` : ''}`)
      setMatches(data.matches || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = () => {
    setApplied({ ...filters })
    fetchMatches(filters)
    setShowFilters(false)
  }

  const handleReset = () => {
    const empty = { skill: '', city: '', mode: '' }
    setFilters(empty)
    setApplied(empty)
    fetchMatches(empty)
    setShowFilters(false)
  }

  const removeFilter = (key) => {
    const nextFilters = { ...applied, [key]: '' }
    setApplied(nextFilters)
    setFilters((current) => ({ ...current, [key]: '' }))
    fetchMatches(nextFilters)
  }

  const hasFilters = Object.values(applied).some(Boolean)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" />
            Eşleşme Önerileri
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Öğrettiğin ve öğrenmek istediğin becerilere göre {matches.length} uygun kişi bulundu.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowFilters((current) => !current)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
            ${hasFilters ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40' : 'glass hover:bg-white/10 text-white/70'}`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtrele
          {hasFilters && (
            <span className="w-5 h-5 bg-purple-600 rounded-full text-xs text-white flex items-center justify-center">
              {Object.values(applied).filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      <motion.div
        initial={false}
        animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className="glass rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Filter className="w-4 h-4 text-purple-400" /> Filtreler
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1.5" htmlFor="match-skill-filter">Beceri</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  id="match-skill-filter"
                  type="text"
                  value={filters.skill}
                  onChange={(event) => setFilters({ ...filters, skill: event.target.value })}
                  placeholder="Gitar, Kod..."
                  className="input-field pl-9 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5" htmlFor="match-city-filter">Şehir</label>
              <input
                id="match-city-filter"
                type="text"
                value={filters.city}
                onChange={(event) => setFilters({ ...filters, city: event.target.value })}
                placeholder="İstanbul..."
                className="input-field text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5" htmlFor="match-mode-filter">Mod</label>
              <select
                id="match-mode-filter"
                value={filters.mode}
                onChange={(event) => setFilters({ ...filters, mode: event.target.value })}
                className="input-field text-sm"
              >
                <option value="">Tümü</option>
                <option value="swap">Sadece Ücretsiz Takas</option>
                <option value="paid">Sadece Ücretli Ders</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={handleApply} className="btn-primary text-sm px-5 py-2.5">
              Uygula
            </button>
            {hasFilters && (
              <button type="button" onClick={handleReset} className="btn-secondary text-sm px-5 py-2.5 flex items-center gap-2">
                <X className="w-3.5 h-3.5" /> Temizle
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {hasFilters && (
        <div className="flex flex-wrap gap-2">
          {applied.skill && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs glass border border-purple-500/30 text-purple-300">
              Beceri: {applied.skill}
              <button type="button" onClick={() => removeFilter('skill')} aria-label="Beceri filtresini kaldır">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {applied.city && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs glass border border-cyan-500/30 text-cyan-300">
              Şehir: {applied.city}
              <button type="button" onClick={() => removeFilter('city')} aria-label="Şehir filtresini kaldır">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {applied.mode && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs glass border border-green-500/30 text-green-300">
              {applied.mode === 'swap' ? 'Ücretsiz Takas' : 'Ücretli Ders'}
              <button type="button" onClick={() => removeFilter('mode')} aria-label="Mod filtresini kaldır">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : matches.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white/60 mb-2">Eşleşme bulunamadı</h3>
          <p className="text-white/40 text-sm">
            {hasFilters
              ? 'Filtreleri değiştirerek tekrar deneyebilirsin.'
              : 'Öğrettiğin ve öğrenmek istediğin becerileri profilinde güncelleyerek daha uygun öneriler alabilirsin.'}
          </p>
          {hasFilters && (
            <button type="button" onClick={handleReset} className="btn-secondary text-sm mt-4">
              Filtreleri Temizle
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {matches.map((match, index) => (
            <MatchCard key={match.user.id} match={match} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}

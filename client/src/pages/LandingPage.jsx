import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Users, MessageCircle, Star, ArrowRight, CheckCircle, GitMerge, Shield } from 'lucide-react'

const skillBubbles = [
  { name: 'Gitar 🎸', delay: 0, x: '10%', color: 'from-purple-600/20 to-pink-600/20 border-purple-500/30' },
  { name: 'Kod 💻', delay: 0.5, x: '80%', color: 'from-cyan-600/20 to-blue-600/20 border-cyan-500/30' },
  { name: 'İngilizce 🌍', delay: 1, x: '25%', color: 'from-green-600/20 to-teal-600/20 border-green-500/30' },
  { name: 'Yoga 🧘', delay: 1.5, x: '65%', color: 'from-orange-600/20 to-amber-600/20 border-orange-500/30' },
  { name: 'Resim 🎨', delay: 2, x: '45%', color: 'from-pink-600/20 to-rose-600/20 border-pink-500/30' },
  { name: 'Müzik 🎵', delay: 2.5, x: '90%', color: 'from-indigo-600/20 to-violet-600/20 border-indigo-500/30' },
]

const features = [
  {
    icon: GitMerge,
    title: 'Akıllı Eşleşme',
    desc: 'Algoritma, öğrettiğin ve öğrenmek istediğin becerilere göre en uygun kişileri bulur.',
    gradient: 'from-purple-600 to-pink-600',
  },
  {
    icon: MessageCircle,
    title: 'Anlık Mesajlaşma',
    desc: 'Eşleştiğin kişilerle doğrudan iletişim kur, ders programını belirle.',
    gradient: 'from-cyan-600 to-blue-600',
  },
  {
    icon: Star,
    title: 'Puanlama Sistemi',
    desc: 'Her tamamlanan dersten sonra yorum yap, güvenilir profiller oluştur.',
    gradient: 'from-amber-600 to-orange-600',
  },
  {
    icon: Shield,
    title: 'Güvenli Platform',
    desc: 'JWT tabanlı kimlik doğrulama ile hesabın her zaman güvende.',
    gradient: 'from-green-600 to-teal-600',
  },
]

const steps = [
  { step: '01', title: 'Profil Oluştur', desc: 'Öğrettiğin ve öğrenmek istediğin becerileri profile ekle.' },
  { step: '02', title: 'Eşleş', desc: 'Algoritma sana en uygun kullanıcıları puanlayarak listeler.' },
  { step: '03', title: 'Takas Yap', desc: 'Ücretsiz takas veya ücretli ders talebi gönder.' },
  { step: '04', title: 'Öğren & Öğret', desc: 'Video call ile ders ver, yeni beceriler kazan.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg gradient-text">Skill Swap</span>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm text-white/70 hover:text-white transition-colors px-4 py-2">
                Giriş Yap
              </Link>
              <Link to="/register" className="btn-primary text-sm py-2">
                Başla
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-600/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }} />
        </div>

        {/* Floating skill bubbles */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block">
          {skillBubbles.map((bubble, i) => (
            <motion.div
              key={bubble.name}
              className={`absolute px-4 py-2 rounded-full glass border bg-gradient-to-r ${bubble.color} text-sm font-medium text-white/80`}
              style={{ left: bubble.x, top: `${20 + (i % 3) * 25}%` }}
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4 + i * 0.5, delay: bubble.delay, repeat: Infinity, ease: 'easeInOut' }}
            >
              {bubble.name}
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-purple-500/30 text-sm text-purple-300 mb-6">
              <Zap className="w-3.5 h-3.5" />
              <span>Türkiye'nin Beceri Takası Platformu</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              <span className="text-white">Becerini </span>
              <span className="gradient-text">Takas Et</span>
              <br />
              <span className="text-white">Yeni Bir Şey </span>
              <span className="gradient-text">Öğren</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/60 mb-8 max-w-2xl mx-auto leading-relaxed">
              Gitar çalmayı, kod yazmayı, İngilizce konuşmayı veya yoga yapmayı öğren.
              Kendi becerilerini öğreterek karşılıklı takas yap ya da ücretli ders al.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary flex items-center justify-center gap-2 text-base px-8 py-4">
                <Zap className="w-5 h-5" />
                Hemen Başla
              </Link>
              <Link to="/login" className="btn-secondary flex items-center justify-center gap-2 text-base px-8 py-4">
                <Users className="w-5 h-5" />
                Eşleşmeleri Gör
              </Link>
            </div>

            <div className="flex items-center justify-center gap-8 mt-12 text-sm text-white/40">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Ücretsiz Takas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Konum Bazlı</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Güvenli Platform</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 relative">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Nasıl Çalışır?</h2>
            <p className="text-white/50 text-lg">4 adımda beceri takasına başla</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="glass rounded-2xl p-6 h-full hover:border-purple-500/30 transition-all duration-300">
                  <div className="text-5xl font-black gradient-text mb-4">{s.step}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-5 h-5 text-purple-500/50" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 relative">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Platform Özellikleri</h2>
            <p className="text-white/50 text-lg">Modern teknoloji ile güçlendirilmiş özellikler</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 hover:border-white/20 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing comparison */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">İki Farklı Yol</h2>
            <p className="text-white/50 text-lg">Sana en uygun olanı seç</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8 hover:border-green-500/30 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center mb-5 shadow-lg shadow-green-900/30">
                <GitMerge className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Ücretsiz Takas</h3>
              <div className="text-4xl font-black text-green-400 mb-4">₺0</div>
              <ul className="space-y-2.5">
                {['Karşılıklı beceri takası', 'Esnek program', 'Topluluk desteği', 'Sınırsız eşleşme'].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-white/70 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 text-xs px-2 py-1 rounded-full bg-purple-600/30 text-purple-300 border border-purple-500/30">
                Premium
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-5 shadow-lg shadow-purple-900/30">
                <Star className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Ücretli Ders</h3>
              <div className="text-4xl font-black gradient-text mb-4">₺/saat</div>
              <ul className="space-y-2.5">
                {['Profesyonel eğitmenler', 'Saatlik ücret belirleme', 'Meeting linki entegrasyonu', 'Puanlama & yorum sistemi'].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-white/70 text-sm">
                    <CheckCircle className="w-4 h-4 text-purple-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="glass rounded-3xl p-10 sm:p-14 border border-purple-500/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10 pointer-events-none" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 relative z-10">
                Hemen Katıl, <span className="gradient-text">Ücretsiz</span>
              </h2>
              <p className="text-white/50 mb-8 relative z-10">
                Binlerce kullanıcı zaten beceri takası yapıyor. Sen de başla!
              </p>
              <Link to="/register" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-4 relative z-10">
                <Zap className="w-5 h-5" />
                Ücretsiz Hesap Oluştur
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold gradient-text">Skill Swap</span>
          </div>
          <p className="text-white/30 text-sm">© 2024 Skill Swap. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  )
}

# Skill Swap 🚀

**Becerini Takas Et, Yeni Bir Şey Öğren**

Modern, full-stack beceri takası ve öğrenme platformu. SQLite ile tamamen local çalışır — PostgreSQL gerekmez.

---

## Teknoloji Yığını

**Frontend:** React 18 + Vite + Tailwind CSS + Framer Motion + React Router v6 + Axios + Lucide React

**Backend:** Node.js + Express.js + Prisma ORM + **SQLite** + JWT + bcryptjs

---

## Kurulum & Çalıştırma

### Ön Gereksinimler
- Node.js >= 18
- npm (Node ile birlikte gelir)
- PostgreSQL **gerekmez** — SQLite kullanılıyor

---

### Terminal 1 — Backend

```bash
cd server
npm install
npx prisma db push
npm run db:seed
npm run dev
```

> Backend `http://localhost:5000` adresinde başlar.
> SQLite veritabanı `server/prisma/dev.db` olarak oluşur.

---

### Terminal 2 — Frontend

```bash
cd client
npm install
npm run dev
```

> Frontend `http://localhost:5173` adresinde açılır.

---

### Tek komutla sıfırdan kurulum (backend)

```bash
cd server
npm install
npm run db:setup
npm run dev
```

---

## Test Kullanıcıları

| Rol   | E-posta               | Şifre  | Öğretir        | Öğrenir   | Şehir             |
|-------|-----------------------|--------|----------------|-----------|-------------------|
| Admin | admin@skillswap.com   | 123456 | —              | —         | İstanbul/Kadıköy  |
| User  | ahmet@skillswap.com   | 123456 | Kod, React     | Gitar     | İstanbul/Kadıköy  |
| User  | selin@skillswap.com   | 123456 | Gitar, Müzik   | Kod       | İstanbul/Kadıköy  |
| User  | merve@skillswap.com   | 123456 | İngilizce      | Yoga      | İstanbul/Beşiktaş |
| User  | kerem@skillswap.com   | 123456 | Yoga, Pilates  | İngilizce | İstanbul/Şişli    |
| User  | deniz@skillswap.com   | 123456 | Resim, Grafik  | Müzik     | İzmir/Konak       |

---

## Veritabanını Sıfırlamak

```bash
cd server
npm run db:reset
```

Bu komut veritabanını siler, yeniden oluşturur ve seed verilerini yükler.

---

## Prisma Studio (Veritabanı Görüntüleyici)

```bash
cd server
npx prisma studio
```

---

## API Endpoints

### Auth
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Profile
```
GET  /api/profile/me
PUT  /api/profile/me
POST /api/profile/skills
DEL  /api/profile/skills/:id
GET  /api/users/:id
```

### Skills
```
GET  /api/skills
POST /api/skills
```

### Matches
```
GET  /api/matches?skill=&city=&mode=
```

### Messages
```
GET  /api/conversations
POST /api/conversations
GET  /api/conversations/:id/messages
POST /api/conversations/:id/messages
```

### Requests
```
GET  /api/requests
POST /api/requests
PUT  /api/requests/:id/status
PUT  /api/requests/:id/meeting-link
```

### Reviews
```
GET  /api/reviews/users/:id/reviews
POST /api/reviews
```

### Admin
```
GET  /api/admin/stats
GET  /api/admin/users
```

---

## Eşleşme Algoritması

| Kriter | Puan |
|--------|------|
| Kullanıcının öğrenmek istediği beceri karşı tarafta var | +40 |
| Kullanıcının öğrettiği beceri karşı taraf öğrenmek istiyor | +40 |
| Aynı şehir | +10 |
| Aynı ilçe | +10 |
| Karşılıklı takas mümkün (bonus) | +10 |
| **Maksimum** | **100** |

---

## Proje Yapısı

```
skill-swap/
├── client/
│   ├── src/
│   │   ├── components/      # Navbar, MatchCard, LoadingSpinner
│   │   ├── context/         # AuthContext (JWT)
│   │   ├── layouts/         # Layout (Navbar wrapper)
│   │   ├── pages/           # 11 sayfa
│   │   ├── services/        # axios instance
│   │   ├── App.jsx          # Router + Protected routes
│   │   └── index.css        # Tailwind + custom classes
│   ├── index.html
│   ├── vite.config.js       # Proxy: /api → localhost:5000
│   ├── tailwind.config.js
│   └── package.json
│
└── server/
    ├── src/
    │   ├── controllers/     # 8 controller
    │   ├── middleware/      # JWT auth + admin guard
    │   ├── routes/          # 9 route dosyası
    │   └── index.js         # Express app
    ├── prisma/
    │   ├── schema.prisma    # SQLite şeması
    │   ├── seed.js          # Demo veriler
    │   └── dev.db           # SQLite dosyası (db push sonrası oluşur)
    ├── .env                 # DATABASE_URL=file:./dev.db
    └── package.json
```

---

## Özellikler

- ✅ JWT Authentication (register/login/me)
- ✅ bcrypt şifre hashleme
- ✅ SQLite — kurulum gerektirmez
- ✅ Kullanıcı profil yönetimi
- ✅ Beceri ekleme/çıkarma (TEACH/LEARN)
- ✅ Akıllı eşleşme algoritması (maks 100 puan)
- ✅ Konum bazlı filtreleme
- ✅ Mesajlaşma sistemi (5s polling)
- ✅ Ders/Takas talep sistemi (5 durum)
- ✅ Meeting linki ekleme
- ✅ Puanlama & yorum sistemi
- ✅ Admin paneli
- ✅ Dark mode glassmorphism tasarım
- ✅ Tam responsive (mobil/tablet/desktop)
- ✅ Framer Motion animasyonları
- ✅ Demo seed data (6 kullanıcı)

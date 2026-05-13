# SCRUM-7 Backend Kayit Akisi

Bu dokuman, Skill Swap projesindeki kullanici kayit fonksiyonunun backend tarafinda nasil calistigini aciklar.

## Ilgili dosyalar

- `server/src/index.js`
- `server/src/routes/auth.js`
- `server/src/controllers/authController.js`
- `server/src/middleware/auth.js`
- `server/prisma/schema.prisma`

## Endpoint

Kullanici kaydi icin kullanilan endpoint:

```http
POST /api/auth/register
```

Frontend bu endpoint'e kullanicinin adini, e-posta adresini ve sifresini gonderir.

Ornek request body:

```json
{
  "name": "Test Kullanici",
  "email": "test@example.com",
  "password": "123456"
}
```

## Backend akis sirasi

1. `server/src/index.js` icinde `/api/auth` route'u tanimlanir.
2. `server/src/routes/auth.js` dosyasi `POST /register` istegini `register` controller fonksiyonuna yonlendirir.
3. `register` fonksiyonu `name`, `email` ve `password` alanlarini request body icinden alir.
4. Zorunlu alanlar kontrol edilir.
5. Sifre uzunlugu kontrol edilir. Sifre en az 6 karakter olmalidir.
6. E-posta formati regex ile kontrol edilir.
7. Prisma ile ayni e-posta adresine sahip kullanici var mi diye veritabani sorgulanir.
8. Kullanici yoksa sifre `bcrypt` ile hashlenir.
9. Prisma ile yeni `User` kaydi olusturulur.
10. Kullanici kaydi olusurken temel `Profile` kaydi da otomatik olusturulur.
11. Kullanici icin JWT token uretilir.
12. Backend, frontend'e token ve kullanici bilgilerini JSON olarak dondurur.

## Validasyonlar

Backend tarafinda yapilan kontroller:

- Ad, e-posta ve sifre bos olamaz.
- Sifre en az 6 karakter olmalidir.
- E-posta gecerli formatta olmalidir.
- Ayni e-posta ile ikinci kez kayit yapilamaz.

## Guvenlik

Sifreler veritabanina duz metin olarak kaydedilmez. `bcrypt.hash(password, 10)` ile hashlenerek saklanir.

Kayit basarili olduktan sonra `jsonwebtoken` paketi ile JWT token uretilir. Bu token, kullanicinin daha sonra korumali endpointlere erismesi icin kullanilir.

## Veritabani etkisi

Kayit islemi sonucunda iki temel kayit olusur:

- `User`: kullanicinin ad, e-posta, sifre hash'i, rol ve avatar bilgileri
- `Profile`: kullanicinin temel profil ayarlari

Bu iliski `server/prisma/schema.prisma` dosyasinda `User` ve `Profile` modelleriyle tanimlanir.

## Manuel test

Backend calistirilir:

```powershell
cd server
npm run dev
```

Health check:

```http
GET http://localhost:5000/api/health
```

Kayit testi:

```http
POST http://localhost:5000/api/auth/register
```

Basarili cevapta `message`, `token` ve `user` alanlari donmelidir.

## Sunumda anlatilacak kisa ozet

Kayit fonksiyonunda backend once gelen verileri kontrol eder. Eksik alan, gecersiz e-posta, kisa sifre veya ayni e-posta varsa hata doner. Her sey dogruysa sifre bcrypt ile hashlenir, Prisma uzerinden SQLite veritabanina kullanici kaydi eklenir ve kullanici icin temel profil kaydi olusturulur. Son olarak JWT token uretilerek frontend'e gonderilir.

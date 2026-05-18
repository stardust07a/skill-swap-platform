# SCRUM-8 Kullanici Giris Backend Akisi

Bu dokuman, Skill Swap projesindeki kullanici giris fonksiyonunun backend tarafinda nasil calistigini aciklar.

## Ilgili dosyalar

- `client/src/pages/LoginPage.jsx`
- `client/src/context/AuthContext.jsx`
- `client/src/services/api.js`
- `server/src/index.js`
- `server/src/routes/auth.js`
- `server/src/controllers/authController.js`
- `server/src/middleware/auth.js`
- `server/prisma/schema.prisma`

## Fonksiyonun amaci

Kullanici e-posta ve sifresiyle sisteme giris yapar. Giris basarili olursa backend JWT token uretir ve frontend bu token ile korumali sayfalara erisir.

Bu akis kullanicinin kendi dashboard ekranina ulasmasini saglar.

## Endpoint

Kullanici girisi icin kullanilan endpoint:

```http
POST /api/auth/login
```

Frontend bu endpoint'e e-posta ve sifre bilgisini gonderir.

Ornek request body:

```json
{
  "email": "ahmet@skillswap.com",
  "password": "123456"
}
```

## Backend akis sirasi

1. `server/src/index.js` icinde `/api/auth` route'u tanimlanir.
2. `server/src/routes/auth.js` dosyasi `POST /login` istegini `login` controller fonksiyonuna yonlendirir.
3. `login` fonksiyonu `email` ve `password` alanlarini request body icinden alir.
4. E-posta veya sifre bos ise backend `400 Bad Request` hatasi dondurur.
5. Prisma ile e-posta adresine ait kullanici veritabaninda aranir.
6. Kullanici bulunamazsa backend `401 Unauthorized` hatasi dondurur.
7. Kullanici bulunursa gelen sifre, veritabanindaki hashlenmis sifre ile `bcrypt.compare` kullanilarak karsilastirilir.
8. Sifre yanlissa backend `401 Unauthorized` hatasi dondurur.
9. Bilgiler dogruysa kullanici icin JWT token uretilir.
10. Backend token ve kullanici bilgilerini frontend'e JSON olarak dondurur.
11. Frontend token'i `localStorage` icine kaydeder.
12. Kullanici dashboard sayfasina yonlendirilir.

## Validasyon ve hata durumlari

Backend tarafinda yapilan kontroller:

- E-posta alani bos olamaz.
- Sifre alani bos olamaz.
- E-posta veritabaninda kayitli olmalidir.
- Sifre dogru olmalidir.

Bos alan durumunda donen hata:

```json
{
  "error": "E-posta ve sifre zorunludur."
}
```

Hatali e-posta veya hatali sifre durumunda donen hata:

```json
{
  "error": "E-posta veya sifre hatali."
}
```

Giris hatalarinda ayni genel mesaj kullanilir. Bu yaklasim guvenlik acisindan daha sagliklidir, cunku sistem e-postanin kayitli olup olmadigini acik etmez.

## Sifre dogrulama

Kullanici sifreleri veritabaninda duz metin olarak tutulmaz. Kayit sirasinda sifre `bcrypt` ile hashlenir.

Giris sirasinda backend su kontrolu yapar:

```js
bcrypt.compare(password, user.passwordHash)
```

Bu kontrol, kullanicinin girdigi sifre ile veritabanindaki hash degerinin eslesip eslesmedigini belirler.

## JWT token uretimi

Giris basarili olursa backend `jsonwebtoken` paketi ile token uretir.

Token icinde kullanici id bilgisi bulunur:

```js
jwt.sign({ userId }, process.env.JWT_SECRET)
```

Bu token daha sonra korumali endpointlere erismek icin kullanilir.

## Frontend token kullanimi

`client/src/context/AuthContext.jsx` icinde login islemi yapilir.

Basarili giristen sonra:

- Token `localStorage` icine kaydedilir.
- Axios default header icine `Authorization` bilgisi eklenir.
- Kullanici state'i guncellenir.

Her API isteginde token su formatta gonderilir:

```http
Authorization: Bearer <token>
```

## Korumali sayfalara erisim

Dashboard gibi korumali sayfalarda backend token kontrolu yapar.

`server/src/middleware/auth.js` icindeki `authenticate` middleware'i:

1. Authorization header icinden token'i okur.
2. Token yoksa `401 Unauthorized` dondurur.
3. Token gecersizse `401 Unauthorized` dondurur.
4. Token gecerliyse kullaniciyi veritabaninda arar.
5. Kullanici bulunursa `req.user` icine kullanici bilgisini ekler.
6. Istege devam edilmesine izin verir.

Bu sayede giris yapmamis kullanici korumali backend verilerine erisemez.

## Kabul kriterleri ile backend eslesmesi

### Kullanici e-posta ve sifre alanlarini doldurabilmelidir

Form alanlari frontend tarafinda `LoginPage.jsx` icinde bulunur. Backend bu alanlari `req.body` icinden alir.

### Bos alan birakildiginda sistem uyari vermelidir

Frontend inputlarda `required` kullanir. Backend de e-posta veya sifre bos ise `400` hatasi dondurur.

### Girilen bilgiler dogruysa kullanici sisteme alinmalidir

Backend kullaniciyi e-posta ile bulur, sifreyi `bcrypt.compare` ile dogrular ve basarili olursa JWT token dondurur.

### Hatali e-posta veya sifre durumunda hata mesaji gosterilmelidir

Backend `401` durum kodu ile hata mesaji dondurur. Frontend bu mesaji login formunda gosterir.

### Basarili giris sonrasi kullanici dashboard sayfasina yonlendirilmelidir

Frontend login fonksiyonu basarili olunca `navigate('/dashboard')` ile dashboard sayfasina yonlendirir.

### Giris yapmamis kullanici korumali sayfalara erisememelidir

Backend korumali endpointlerde `authenticate` middleware'ini kullanir. Token yoksa veya gecersizse istek reddedilir.

## Manuel test

Backend calistirilir:

```powershell
cd server
npm run dev
```

Frontend calistirilir:

```powershell
cd client
npm run dev
```

Demo kullanici ile giris denenir:

```text
ahmet@skillswap.com
123456
```

Kontrol edilecek durumlar:

- Dogru e-posta ve sifre ile giris yapiliyor mu?
- Basarili giris sonrasi dashboard aciliyor mu?
- Bos alan birakildiginda uyari veriliyor mu?
- Hatali sifre girildiginde hata mesaji gorunuyor mu?
- Token olmadan korumali endpointlere erisim engelleniyor mu?

## Postman veya API test ornegi

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json
```

Body:

```json
{
  "email": "ahmet@skillswap.com",
  "password": "123456"
}
```

Basarili cevapta `message`, `token` ve `user` alanlari donmelidir.

## Sunumda anlatilacak kisa ozet

Kullanici giris fonksiyonunda frontend e-posta ve sifreyi backend'e gonderir. Backend once alanlarin bos olup olmadigini kontrol eder. Sonra Prisma ile kullaniciyi e-posta adresine gore bulur. Kullanici varsa girilen sifre `bcrypt.compare` ile veritabanindaki hashlenmis sifreyle karsilastirilir. Bilgiler dogruysa JWT token uretilir ve frontend'e gonderilir. Frontend bu token'i saklar ve dashboard gibi korumali sayfalara erismek icin kullanir. Token yoksa veya hataliysa backend korumali endpointlere erisimi engeller.

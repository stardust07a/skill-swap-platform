# SCRUM-10 Profil Tamamlama Backend Akisi

Bu dokuman, Skill Swap projesindeki profil tamamlama takibi fonksiyonunun backend tarafinda hangi verilerle desteklendigini aciklar.

## Ilgili dosyalar

- `client/src/pages/Dashboard.jsx`
- `client/src/context/AuthContext.jsx`
- `client/src/services/api.js`
- `server/src/controllers/authController.js`
- `server/src/controllers/profileController.js`
- `server/src/routes/profile.js`
- `server/src/middleware/auth.js`
- `server/prisma/schema.prisma`

## Fonksiyonun amaci

Dashboard ekraninda kullanicinin profilini ne kadar tamamladigi yuzde olarak gosterilir. Ayrica tamamlanan alanlar ve eksik alanlar ayri durumlarla gosterilir.

Bu ozellik kullanicinin profilini tamamlamasini tesvik eder. Profil ne kadar dolu olursa eslesme kalitesi de o kadar artar.

## Backend tarafindan saglanan veriler

Profil tamamlama yuzdesi frontend tarafinda hesaplanir. Ancak hesaplamada kullanilan tum temel veriler backend tarafindan saglanir.

Backend'in sagladigi alanlar:

- `user.avatarUrl`
- `user.profile.bio`
- `user.profile.city`
- `user.profile.district`
- `user.profile.availabilityText`
- `user.profile.isSwapAvailable`
- `user.profile.isPaidLessonAvailable`
- `user.userSkills`

Bu veriler kullaniciya ait oldugu icin korumali endpointler uzerinden alinir.

## Kullanilan endpointler

### Giris yapan kullanici bilgisi

```http
GET /api/auth/me
```

Bu endpoint giris yapan kullanicinin temel bilgilerini, profilini ve becerilerini dondurur.

`server/src/controllers/authController.js` icinde `getMe` fonksiyonu ile calisir.

Donen veri dashboard tarafinda profil tamamlama hesabina temel olusturur.

### Profil bilgisi

```http
GET /api/profile/me
```

Bu endpoint kullanicinin profil detaylarini, becerilerini ve aldigi yorumlari dondurur.

`server/src/controllers/profileController.js` icinde `getMyProfile` fonksiyonu ile calisir.

### Profil guncelleme

```http
PUT /api/profile/me
```

Kullanici profilindeki su alanlari guncelleyebilir:

- Ad
- Avatar
- Bio
- Sehir
- Ilce
- Saatlik ucret
- Takas tercihi
- Ucretli ders tercihi
- Uygunluk aciklamasi

Backend bu alanlari Prisma ile `User` ve `Profile` tablolarina kaydeder.

### Beceri ekleme

```http
POST /api/profile/skills
```

Kullanici ogretebildigi veya ogrenmek istedigi becerileri ekler.

Backend tarafinda `type` alaninin sadece `TEACH` veya `LEARN` olmasina izin verilir.

### Beceri silme

```http
DELETE /api/profile/skills/:id
```

Kullanici kendi profilinden beceri silebilir. Backend, silinecek becerinin giris yapan kullaniciya ait olup olmadigini kontrol eder.

## Profil tamamlama kriterleri

Dashboard tarafinda su 7 alan kontrol edilir:

1. Profil fotografi
2. Bio
3. Sehir ve ilce
4. Ogretebildigi beceriler
5. Ogrenmek istedigi beceriler
6. Uygunluk aciklamasi
7. Takas veya ucretli ders tercihi

Bu alanlar doluysa tamamlanmis sayilir.

## Yuzde hesaplama mantigi

Frontend tarafinda tamamlanan alan sayisi toplam alan sayisina bolunur.

Mantik:

```text
profil yuzdesi = tamamlanan alan sayisi / toplam alan sayisi * 100
```

Bu projede toplam alan sayisi 7'dir.

Ornek:

```text
5 alan tamamlandiysa:
5 / 7 * 100 = 71
```

Sonuc yuvarlanarak dashboard uzerinde yuzde olarak gosterilir.

## Durum gosterimi

Dashboard'da her alan icin durum bilgisi gosterilir.

Tamamlanan alanlar:

- Yesil durum rengiyle gosterilir.
- Check ikonu kullanilir.

Eksik alanlar:

- Kirmizi/uyari rengiyle gosterilir.
- Uyari ikonu kullanilir.

Bu gorsel durumlar frontend tarafinda yapilir, ancak hangi alanin dolu veya bos oldugu backend'den gelen veriye gore belirlenir.

## Backend dogrulama ve yetki

Profil endpointleri korumalidir. Bu nedenle isteklerde JWT token bulunmalidir.

`server/src/middleware/auth.js` dosyasindaki `authenticate` middleware'i:

1. Authorization header icinden token'i alir.
2. Token'i `JWT_SECRET` ile dogrular.
3. Kullanici veritabaninda var mi kontrol eder.
4. Kullanici bilgisini `req.user` icine ekler.

Boylece kullanici sadece kendi profil bilgilerini okuyup guncelleyebilir.

## Veritabani modelleri

Bu ozellik icin en onemli modeller:

- `User`
- `Profile`
- `Skill`
- `UserSkill`

`User` temel kullanici bilgilerini tutar.

`Profile` bio, sehir, ilce, uygunluk ve ders tercihlerini tutar.

`Skill` sistemdeki beceri listesini tutar.

`UserSkill` kullanicinin hangi beceriyi ogrettigini veya ogrenmek istedigini tutar.

## Kabul kriterleri ile backend eslesmesi

### Profil tamamlama yuzdesi dashboard uzerinde gosterilmelidir

Backend gerekli profil ve beceri verilerini dondurur. Frontend bu verilere gore yuzde hesaplar.

### Yuzde bilgisi profil alanlarinin doluluk durumuna gore hesaplanmalidir

Doluluk kontrolunde backend'den gelen avatar, bio, sehir, ilce, beceri, uygunluk ve tercih alanlari kullanilir.

### Ilerleme bari ile desteklenmelidir

Ilerleme bari frontend tarafinda hesaplanan yuzdeye gore genisler.

### Profil fotografi kontrol edilmelidir

`user.avatarUrl` alani kontrol edilir.

### Bio alani kontrol edilmelidir

`user.profile.bio` alani kontrol edilir.

### Sehir / ilce bilgisi kontrol edilmelidir

`user.profile.city` ve `user.profile.district` alanlari kontrol edilir.

### Ogretebildigi beceriler kontrol edilmelidir

`user.userSkills` icinde `type === "TEACH"` olan kayitlar kontrol edilir.

### Ogrenmek istedigi beceriler kontrol edilmelidir

`user.userSkills` icinde `type === "LEARN"` olan kayitlar kontrol edilir.

### Uygunluk aciklamasi kontrol edilmelidir

`user.profile.availabilityText` alani kontrol edilir.

### Takas veya ucretli ders tercihi kontrol edilmelidir

`user.profile.isSwapAvailable` veya `user.profile.isPaidLessonAvailable` alanlarindan en az biri true olmalidir.

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

Demo kullanici ile giris yapilir:

```text
ahmet@skillswap.com
123456
```

Dashboard uzerinde kontrol edilir:

- Profil tamamlama yuzdesi gorunuyor mu?
- Ilerleme bari yuzdeye gore doluyor mu?
- Tamamlanan alanlar yesil gosteriliyor mu?
- Eksik alanlar uyari rengiyle gosteriliyor mu?
- Profil duzenleme ekraninda alanlar degistirilince dashboard yuzdesi degisiyor mu?

## Sunumda anlatilacak kisa ozet

Profil tamamlama fonksiyonunda backend kullanicinin profil, avatar, beceri ve tercih verilerini saglar. Dashboard bu verileri okuyarak 7 maddelik bir kontrol listesi olusturur. Dolu alan sayisi toplam alan sayisina bolunerek profil tamamlama yuzdesi hesaplanir. Tamamlanan alanlar yesil, eksik alanlar uyari rengiyle gosterilir. Profil verileri kullaniciya ait oldugu icin endpointler JWT token ile korunur.

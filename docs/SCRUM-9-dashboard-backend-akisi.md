# SCRUM-9 Dashboard Backend Akisi

Bu dokuman, Skill Swap projesindeki dashboard goruntuleme fonksiyonunun backend tarafinda hangi API'ler ile desteklendigini aciklar.

## Ilgili dosyalar

- `client/src/pages/Dashboard.jsx`
- `client/src/services/api.js`
- `server/src/index.js`
- `server/src/middleware/auth.js`
- `server/src/controllers/authController.js`
- `server/src/controllers/matchController.js`
- `server/src/controllers/messageController.js`
- `server/src/controllers/requestController.js`
- `server/src/controllers/profileController.js`
- `server/prisma/schema.prisma`

## Dashboard'un kullandigi backend verileri

Dashboard ekrani kullanici giris yaptiktan sonra acilir. Bu nedenle backend tarafinda korumali endpointler kullanilir.

Dashboard ekraninda kullanilan temel veriler:

- Kullanici adi ve avatar bilgisi
- Profil bilgileri
- Kullanicinin ogrettigi ve ogrenmek istedigi beceriler
- Onerilen eslesmeler
- Konusma sayisi ve son mesajlar
- Talep sayisi ve son talepler
- Bekleyen talep sayisi

## Kimlik dogrulama akisi

Dashboard verileri herkese acik degildir. Kullanici login veya register olduktan sonra frontend tarafinda JWT token saklanir.

`client/src/services/api.js` dosyasinda her API istegine token eklenir:

```http
Authorization: Bearer <token>
```

Backend tarafinda `server/src/middleware/auth.js` dosyasindaki `authenticate` middleware'i token'i dogrular.

Token gecerliyse:

- Kullanici veritabaninda aranir.
- Kullanici bilgisi `req.user` icine eklenir.
- Istenen endpoint calismaya devam eder.

Token yoksa veya gecersizse backend `401 Unauthorized` hatasi dondurur.

## Dashboard icin kullanilan endpointler

### Kullanici bilgisi

```http
GET /api/auth/me
```

Bu endpoint giris yapan kullanicinin temel bilgilerini, profilini ve becerilerini dondurur.

Dashboard'da su alanlar icin kullanilir:

- Kullanici adi
- Avatar
- Profil bilgileri
- Ogretilecek beceriler
- Ogrenilecek beceriler

### Onerilen eslesmeler

```http
GET /api/matches
```

Bu endpoint kullanicinin becerilerine ve lokasyon bilgilerine gore eslesme onerileri dondurur.

`server/src/controllers/matchController.js` icinde eslesme puani hesaplanir:

- Kullanicinin ogrenmek istedigi beceriyi karsi taraf ogretebiliyorsa puan artar.
- Kullanicinin ogretebildigi beceriyi karsi taraf ogrenmek istiyorsa puan artar.
- Ayni sehir ve ayni ilce bilgileri puana etki eder.
- Karsilikli takas mumkunse ekstra puan verilir.

Dashboard'da eslesme sayisi ve ilk onerilen eslesmeler bu endpointten gelir.

### Konusmalar

```http
GET /api/conversations
```

Bu endpoint giris yapan kullanicinin dahil oldugu konusmalari dondurur.

Backend tarafinda:

- Sadece kullanicinin taraf oldugu konusmalar listelenir.
- Karsi kullanici bilgisi secilir.
- Son mesaj bilgisi eklenir.
- Konusmalar guncellenme tarihine gore siralanir.

Dashboard'da konusma sayisi ve son mesajlar bu endpointten gelir.

### Talepler

```http
GET /api/requests
```

Bu endpoint kullanicinin gonderdigi veya aldigi ders/takas taleplerini dondurur.

Backend tarafinda:

- `senderId` veya `receiverId` giris yapan kullanici olan talepler listelenir.
- Gonderen ve alici kullanici bilgileri eklenir.
- Istenen ve sunulan beceri bilgileri eklenir.
- Talepler olusturulma tarihine gore siralanir.

Dashboard'da toplam talep sayisi, son talepler ve bekleyen talep sayisi bu endpointten hesaplanir.

## Kabul kriterleri ile backend eslesmesi

### Kullanici adi gosterilmelidir

Kullanici adi `GET /api/auth/me` cevabindaki `user.name` alanindan gelir.

### Profil fotografi veya varsayilan avatar gosterilmelidir

Avatar bilgisi `user.avatarUrl` alanindan gelir. Kayit sirasinda kullaniciya varsayilan avatar uretilir.

### Eslesme, konusma, talep ve bekleyen talep sayilari gosterilmelidir

Bu sayilar frontend tarafinda endpoint cevaplarinin uzunluklarindan hesaplanir:

- `matches.length`
- `conversations.length`
- `requests.length`
- `pendingRequests.length`

Backend bu verileri korumali endpointler ile saglar.

### Kullanicinin becerileri listelenmelidir

Beceriler `user.userSkills` alanindan gelir. Her beceri `TEACH` veya `LEARN` tipine gore ayrilir.

### Onerilen eslesmeler alani gosterilmelidir

Onerilen eslesmeler `GET /api/matches` endpointinden gelir ve puana gore siralanir.

### Son mesajlar ve son talepler bulunmalidir

Son mesajlar `GET /api/conversations`, son talepler ise `GET /api/requests` endpointi ile gelir.

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

Dashboard sayfasinda kontrol edilir:

- Kullanici adi gorunuyor mu?
- Avatar gorunuyor mu?
- Eslesme, konusma, talep ve bekleyen talep sayilari gorunuyor mu?
- Beceriler listeleniyor mu?
- Onerilen eslesmeler gorunuyor mu?
- Mesajlar ve son talepler gorunuyor mu?

## Sunumda anlatilacak kisa ozet

Dashboard ekrani backend'den birden fazla veri alarak calisir. Kullanici giris yaptiktan sonra JWT token ile korumali endpointlere istek atilir. Backend token'i dogrular ve kullanicinin profil, beceri, eslesme, konusma ve talep verilerini dondurur. Frontend bu verilerle dashboard uzerinde kullanici adini, avatarini, becerilerini, onerilen eslesmeleri, son mesajlari ve talepleri gosterir.

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seed başlıyor...');

  // Skills oluştur
  const skills = [
    { name: 'Kod', category: 'Teknoloji' },
    { name: 'React', category: 'Teknoloji' },
    { name: 'JavaScript', category: 'Teknoloji' },
    { name: 'Python', category: 'Teknoloji' },
    { name: 'Gitar', category: 'Müzik' },
    { name: 'Müzik', category: 'Müzik' },
    { name: 'Piyano', category: 'Müzik' },
    { name: 'İngilizce', category: 'Dil' },
    { name: 'Almanca', category: 'Dil' },
    { name: 'Yoga', category: 'Sağlık' },
    { name: 'Pilates', category: 'Sağlık' },
    { name: 'Resim', category: 'Sanat' },
    { name: 'Fotoğrafçılık', category: 'Sanat' },
    { name: 'Grafik Tasarım', category: 'Tasarım' },
  ];

  const createdSkills = {};
  for (const skill of skills) {
    const s = await prisma.skill.upsert({
      where: { name: skill.name },
      update: {},
      create: skill,
    });
    createdSkills[skill.name] = s;
  }
  console.log('✅ Skills oluşturuldu');

  const password = await bcrypt.hash('123456', 10);

  // Admin kullanıcı
  const admin = await prisma.user.upsert({
    where: { email: 'admin@skillswap.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@skillswap.com',
      passwordHash: password,
      role: 'ADMIN',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      profile: {
        create: {
          bio: 'Skill Swap platform yöneticisi.',
          city: 'İstanbul',
          district: 'Kadıköy',
          isSwapAvailable: false,
          isPaidLessonAvailable: false,
        },
      },
    },
  });
  console.log('✅ Admin oluşturuldu');

  // Ahmet
  const ahmet = await prisma.user.upsert({
    where: { email: 'ahmet@skillswap.com' },
    update: {},
    create: {
      name: 'Ahmet Yılmaz',
      email: 'ahmet@skillswap.com',
      passwordHash: password,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ahmet',
      profile: {
        create: {
          bio: 'Frontend geliştirici. React ve JavaScript konularında 5 yıllık deneyimim var. Gitar öğrenmek istiyorum!',
          city: 'İstanbul',
          district: 'Kadıköy',
          hourlyRate: 150,
          isSwapAvailable: true,
          isPaidLessonAvailable: true,
          availabilityText: 'Hafta içi akşamları ve hafta sonları uygunum.',
        },
      },
    },
  });

  await prisma.userSkill.createMany({
    data: [
      { userId: ahmet.id, skillId: createdSkills['Kod'].id, type: 'TEACH' },
      { userId: ahmet.id, skillId: createdSkills['React'].id, type: 'TEACH' },
      { userId: ahmet.id, skillId: createdSkills['JavaScript'].id, type: 'TEACH' },
      { userId: ahmet.id, skillId: createdSkills['Gitar'].id, type: 'LEARN' },
      { userId: ahmet.id, skillId: createdSkills['Müzik'].id, type: 'LEARN' },
    ],
    skipDuplicates: true,
  });

  // Selin
  const selin = await prisma.user.upsert({
    where: { email: 'selin@skillswap.com' },
    update: {},
    create: {
      name: 'Selin Kaya',
      email: 'selin@skillswap.com',
      passwordHash: password,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=selin',
      profile: {
        create: {
          bio: 'Profesyonel gitarist ve müzik öğretmeni. Kodlama öğrenmek istiyorum, takas yapalım!',
          city: 'İstanbul',
          district: 'Kadıköy',
          hourlyRate: 120,
          isSwapAvailable: true,
          isPaidLessonAvailable: true,
          availabilityText: 'Hafta sonları ve salı-perşembe akşamları.',
        },
      },
    },
  });

  await prisma.userSkill.createMany({
    data: [
      { userId: selin.id, skillId: createdSkills['Gitar'].id, type: 'TEACH' },
      { userId: selin.id, skillId: createdSkills['Müzik'].id, type: 'TEACH' },
      { userId: selin.id, skillId: createdSkills['Piyano'].id, type: 'TEACH' },
      { userId: selin.id, skillId: createdSkills['Kod'].id, type: 'LEARN' },
      { userId: selin.id, skillId: createdSkills['JavaScript'].id, type: 'LEARN' },
    ],
    skipDuplicates: true,
  });

  // Merve
  const merve = await prisma.user.upsert({
    where: { email: 'merve@skillswap.com' },
    update: {},
    create: {
      name: 'Merve Demir',
      email: 'merve@skillswap.com',
      passwordHash: password,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=merve',
      profile: {
        create: {
          bio: 'İngilizce öğretmeniyim, IELTS ve Cambridge sınavlarında uzmanlığım var. Yoga öğrenmek istiyorum.',
          city: 'İstanbul',
          district: 'Beşiktaş',
          hourlyRate: 200,
          isSwapAvailable: true,
          isPaidLessonAvailable: true,
          availabilityText: 'Hafta içi öğleden sonra ve hafta sonları.',
        },
      },
    },
  });

  await prisma.userSkill.createMany({
    data: [
      { userId: merve.id, skillId: createdSkills['İngilizce'].id, type: 'TEACH' },
      { userId: merve.id, skillId: createdSkills['Yoga'].id, type: 'LEARN' },
      { userId: merve.id, skillId: createdSkills['Pilates'].id, type: 'LEARN' },
    ],
    skipDuplicates: true,
  });

  // Kerem
  const kerem = await prisma.user.upsert({
    where: { email: 'kerem@skillswap.com' },
    update: {},
    create: {
      name: 'Kerem Şahin',
      email: 'kerem@skillswap.com',
      passwordHash: password,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kerem',
      profile: {
        create: {
          bio: 'Sertifikalı yoga eğitmeni. İngilizce öğrenmek istiyorum, takas yapalım!',
          city: 'İstanbul',
          district: 'Şişli',
          hourlyRate: 180,
          isSwapAvailable: true,
          isPaidLessonAvailable: false,
          availabilityText: 'Sabah 7-10 ve akşam 18-21 arası uygunum.',
        },
      },
    },
  });

  await prisma.userSkill.createMany({
    data: [
      { userId: kerem.id, skillId: createdSkills['Yoga'].id, type: 'TEACH' },
      { userId: kerem.id, skillId: createdSkills['Pilates'].id, type: 'TEACH' },
      { userId: kerem.id, skillId: createdSkills['İngilizce'].id, type: 'LEARN' },
    ],
    skipDuplicates: true,
  });

  // Deniz
  const deniz = await prisma.user.upsert({
    where: { email: 'deniz@skillswap.com' },
    update: {},
    create: {
      name: 'Deniz Arslan',
      email: 'deniz@skillswap.com',
      passwordHash: password,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=deniz',
      profile: {
        create: {
          bio: 'Ressam ve grafik tasarımcı. Müzik öğrenmek istiyorum, takas için buradayım.',
          city: 'İzmir',
          district: 'Konak',
          hourlyRate: 160,
          isSwapAvailable: true,
          isPaidLessonAvailable: true,
          availabilityText: 'Hafta sonu tüm gün, hafta içi akşamları.',
        },
      },
    },
  });

  await prisma.userSkill.createMany({
    data: [
      { userId: deniz.id, skillId: createdSkills['Resim'].id, type: 'TEACH' },
      { userId: deniz.id, skillId: createdSkills['Grafik Tasarım'].id, type: 'TEACH' },
      { userId: deniz.id, skillId: createdSkills['Fotoğrafçılık'].id, type: 'TEACH' },
      { userId: deniz.id, skillId: createdSkills['Müzik'].id, type: 'LEARN' },
      { userId: deniz.id, skillId: createdSkills['Gitar'].id, type: 'LEARN' },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Demo kullanıcılar oluşturuldu');

  // Demo yorumlar
  const request1 = await prisma.lessonRequest.create({
    data: {
      senderId: ahmet.id,
      receiverId: selin.id,
      type: 'SWAP',
      skillOfferedId: createdSkills['Kod'].id,
      skillWantedId: createdSkills['Gitar'].id,
      status: 'COMPLETED',
      note: 'React dersi karşılığında gitar dersi almak istiyorum.',
    },
  });

  await prisma.review.create({
    data: {
      reviewerId: ahmet.id,
      reviewedUserId: selin.id,
      lessonRequestId: request1.id,
      rating: 5,
      comment: 'Selin harika bir öğretmen! Gitar derslerinde çok şey öğrendim. Kesinlikle tavsiye ederim.',
    },
  });

  const request2 = await prisma.lessonRequest.create({
    data: {
      senderId: selin.id,
      receiverId: ahmet.id,
      type: 'SWAP',
      skillOfferedId: createdSkills['Gitar'].id,
      skillWantedId: createdSkills['Kod'].id,
      status: 'COMPLETED',
      note: 'Kod öğrenmek istiyorum, gitar öğretebilirim.',
    },
  });

  await prisma.review.create({
    data: {
      reviewerId: selin.id,
      reviewedUserId: ahmet.id,
      lessonRequestId: request2.id,
      rating: 5,
      comment: 'Ahmet çok sabırlı ve açıklayıcı bir öğretmen. React konusunda çok şey öğrendim!',
    },
  });

  const request3 = await prisma.lessonRequest.create({
    data: {
      senderId: merve.id,
      receiverId: kerem.id,
      type: 'SWAP',
      skillOfferedId: createdSkills['İngilizce'].id,
      skillWantedId: createdSkills['Yoga'].id,
      status: 'ACCEPTED',
      note: 'İngilizce dersi karşılığında yoga öğrenmek istiyorum.',
    },
  });

  console.log('✅ Demo talepler ve yorumlar oluşturuldu');

  // Demo mesajlaşmalar
  const conv1 = await prisma.conversation.create({
    data: {
      user1Id: ahmet.id,
      user2Id: selin.id,
    },
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: conv1.id,
        senderId: ahmet.id,
        text: 'Merhaba Selin! Gitar dersi için takas yapmak ister misin?',
        isRead: true,
      },
      {
        conversationId: conv1.id,
        senderId: selin.id,
        text: 'Merhaba Ahmet! Evet, React öğrenmek istiyordum zaten. Ne zaman başlayalım?',
        isRead: true,
      },
      {
        conversationId: conv1.id,
        senderId: ahmet.id,
        text: 'Harika! Bu hafta sonu uygun musun? Zoom üzerinden yapabiliriz.',
        isRead: false,
      },
    ],
  });

  const conv2 = await prisma.conversation.create({
    data: {
      user1Id: merve.id,
      user2Id: kerem.id,
    },
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: conv2.id,
        senderId: merve.id,
        text: 'Kerem Bey, yoga derslerin için takas yapmayı düşünüyor musun?',
        isRead: true,
      },
      {
        conversationId: conv2.id,
        senderId: kerem.id,
        text: 'Tabii ki! İngilizce öğrenmek istiyordum. Haftada kaç saat düşünüyorsunuz?',
        isRead: true,
      },
    ],
  });

  console.log('✅ Demo konuşmalar oluşturuldu');
  console.log('');
  console.log('🎉 Seed tamamlandı!');
  console.log('');
  console.log('📋 Test Kullanıcıları:');
  console.log('   Admin:  admin@skillswap.com  / 123456');
  console.log('   User 1: ahmet@skillswap.com  / 123456');
  console.log('   User 2: selin@skillswap.com  / 123456');
  console.log('   User 3: merve@skillswap.com  / 123456');
  console.log('   User 4: kerem@skillswap.com  / 123456');
  console.log('   User 5: deniz@skillswap.com  / 123456');
}

main()
  .catch((e) => {
    console.error('❌ Seed hatası:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const calculateMatchScore = (currentUser, otherUser) => {
  let score = 0;

  const myTeachSkills = currentUser.userSkills
    .filter((us) => us.type === 'TEACH')
    .map((us) => us.skillId);
  const myLearnSkills = currentUser.userSkills
    .filter((us) => us.type === 'LEARN')
    .map((us) => us.skillId);

  const otherTeachSkills = otherUser.userSkills
    .filter((us) => us.type === 'TEACH')
    .map((us) => us.skillId);
  const otherLearnSkills = otherUser.userSkills
    .filter((us) => us.type === 'LEARN')
    .map((us) => us.skillId);

  // Kullanıcının öğrenmek istediği beceriyi karşı taraf öğretebiliyor mu?
  const learnMatch = myLearnSkills.some((skillId) => otherTeachSkills.includes(skillId));
  if (learnMatch) score += 40;

  // Kullanıcının öğretebildiği beceriyi karşı taraf öğrenmek istiyor mu?
  const teachMatch = myTeachSkills.some((skillId) => otherLearnSkills.includes(skillId));
  if (teachMatch) score += 40;

  // Lokasyon puanları
  const myCity = currentUser.profile?.city?.toLowerCase();
  const otherCity = otherUser.profile?.city?.toLowerCase();
  const myDistrict = currentUser.profile?.district?.toLowerCase();
  const otherDistrict = otherUser.profile?.district?.toLowerCase();

  if (myCity && otherCity && myCity === otherCity) {
    score += 10;
    if (myDistrict && otherDistrict && myDistrict === otherDistrict) {
      score += 10;
    }
  }

  // Karşılıklı takas bonusu
  if (learnMatch && teachMatch) score += 10;

  return Math.min(score, 100);
};

const getMatches = async (req, res) => {
  try {
    const { skill, city, mode } = req.query;

    const currentUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        profile: true,
        userSkills: { include: { skill: true } },
      },
    });

    const whereClause = {
      id: { not: req.user.id },
      role: 'USER',
    };

    if (city) {
      whereClause.profile = {
        city: { contains: city, mode: 'insensitive' },
      };
    }

    if (mode === 'swap') {
      whereClause.profile = { ...whereClause.profile, isSwapAvailable: true };
    } else if (mode === 'paid') {
      whereClause.profile = { ...whereClause.profile, isPaidLessonAvailable: true };
    }

    const allUsers = await prisma.user.findMany({
      where: whereClause,
      include: {
        profile: true,
        userSkills: { include: { skill: true } },
        receivedReviews: { select: { rating: true } },
      },
    });

    let matches = allUsers.map((user) => {
      const score = calculateMatchScore(currentUser, user);
      const avgRating = user.receivedReviews.length > 0
        ? user.receivedReviews.reduce((sum, r) => sum + r.rating, 0) / user.receivedReviews.length
        : null;

      const myLearnSkillIds = currentUser.userSkills
        .filter((us) => us.type === 'LEARN')
        .map((us) => us.skillId);
      const myTeachSkillIds = currentUser.userSkills
        .filter((us) => us.type === 'TEACH')
        .map((us) => us.skillId);

      const matchingTeachSkills = user.userSkills
        .filter((us) => us.type === 'TEACH' && myLearnSkillIds.includes(us.skillId))
        .map((us) => us.skill.name);

      const matchingLearnSkills = user.userSkills
        .filter((us) => us.type === 'LEARN' && myTeachSkillIds.includes(us.skillId))
        .map((us) => us.skill.name);

      return {
        user: {
          id: user.id,
          name: user.name,
          avatarUrl: user.avatarUrl,
          profile: user.profile,
          userSkills: user.userSkills,
          avgRating,
        },
        score,
        matchingTeachSkills,
        matchingLearnSkills,
      };
    });

    matches = matches.filter((match) => match.score > 0);

    // Beceri filtresi
    if (skill) {
      matches = matches.filter((m) =>
        m.user.userSkills.some((us) =>
          us.skill.name.toLowerCase().includes(skill.toLowerCase())
        )
      );
    }

    // Sıralama: önce score, sonra rating
    matches.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (b.user.avgRating || 0) - (a.user.avgRating || 0);
    });

    res.json({ matches });
  } catch (error) {
    console.error('getMatches error:', error);
    res.status(500).json({ error: 'Eşleşmeler alınamadı.' });
  }
};

module.exports = { getMatches };

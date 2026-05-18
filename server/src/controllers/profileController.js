const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const cleanText = (value) => {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const trimmed = String(value).trim();
  return trimmed || null;
};

const isValidHttpUrl = (value) => {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const parseHourlyRate = (value) => {
  if (value === undefined || value === null || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : NaN;
};

const getMyProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        profile: true,
        userSkills: { include: { skill: true } },
        receivedReviews: {
          include: { reviewer: { select: { id: true, name: true, avatarUrl: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    res.json({ user });
  } catch (error) {
    console.error('getMyProfile error:', error);
    res.status(500).json({ error: 'Profil bilgisi alınamadı.' });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const {
      name, avatarUrl, bio, city, district,
      hourlyRate, isSwapAvailable, isPaidLessonAvailable, availabilityText,
    } = req.body;

    const cleanedName = cleanText(name);
    const cleanedAvatarUrl = cleanText(avatarUrl);
    const cleanedBio = cleanText(bio);
    const cleanedCity = cleanText(city);
    const cleanedDistrict = cleanText(district);
    const cleanedAvailabilityText = cleanText(availabilityText);
    const parsedHourlyRate = parseHourlyRate(hourlyRate);

    if (name !== undefined && !cleanedName) {
      return res.status(400).json({ error: 'Ad soyad bos olamaz.' });
    }

    if (!isValidHttpUrl(cleanedAvatarUrl)) {
      return res.status(400).json({ error: 'Profil foto URL gecerli bir http/https adresi olmalidir.' });
    }

    if (Number.isNaN(parsedHourlyRate)) {
      return res.status(400).json({ error: 'Saatlik ucret 0 veya daha buyuk bir sayi olmalidir.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(cleanedName && { name: cleanedName }),
        ...(avatarUrl !== undefined && { avatarUrl: cleanedAvatarUrl }),
      },
    });

    const updatedProfile = await prisma.profile.upsert({
      where: { userId: req.user.id },
      update: {
        ...(bio !== undefined && { bio: cleanedBio }),
        ...(city !== undefined && { city: cleanedCity }),
        ...(district !== undefined && { district: cleanedDistrict }),
        ...(hourlyRate !== undefined && { hourlyRate: parsedHourlyRate }),
        ...(isSwapAvailable !== undefined && { isSwapAvailable }),
        ...(isPaidLessonAvailable !== undefined && { isPaidLessonAvailable }),
        ...(availabilityText !== undefined && { availabilityText: cleanedAvailabilityText }),
      },
      create: {
        userId: req.user.id,
        bio: cleanedBio,
        city: cleanedCity,
        district: cleanedDistrict,
        hourlyRate: parsedHourlyRate,
        isSwapAvailable: isSwapAvailable ?? true,
        isPaidLessonAvailable: isPaidLessonAvailable ?? false,
        availabilityText: cleanedAvailabilityText,
      },
    });

    res.json({ message: 'Profil güncellendi.', user: updatedUser, profile: updatedProfile });
  } catch (error) {
    console.error('updateMyProfile error:', error);
    res.status(500).json({ error: 'Profil güncellenemedi.' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        createdAt: true,
        profile: true,
        userSkills: { include: { skill: true } },
        receivedReviews: {
          include: { reviewer: { select: { id: true, name: true, avatarUrl: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
    }

    const avgRating = user.receivedReviews.length > 0
      ? user.receivedReviews.reduce((sum, r) => sum + r.rating, 0) / user.receivedReviews.length
      : null;

    res.json({ user: { ...user, avgRating } });
  } catch (error) {
    console.error('getUserById error:', error);
    res.status(500).json({ error: 'Kullanıcı bilgisi alınamadı.' });
  }
};

const addSkill = async (req, res) => {
  try {
    const { skillId, type } = req.body;

    if (!skillId || !type) {
      return res.status(400).json({ error: 'skillId ve type zorunludur.' });
    }

    if (!['TEACH', 'LEARN'].includes(type)) {
      return res.status(400).json({ error: 'Type TEACH veya LEARN olmalıdır.' });
    }

    const skill = await prisma.skill.findUnique({ where: { id: skillId } });
    if (!skill) {
      return res.status(404).json({ error: 'Beceri bulunamadı.' });
    }

    const userSkill = await prisma.userSkill.create({
      data: {
        userId: req.user.id,
        skillId,
        type,
      },
      include: { skill: true },
    });

    res.status(201).json({ message: 'Beceri eklendi.', userSkill });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Bu beceri zaten eklenmiş.' });
    }
    console.error('addSkill error:', error);
    res.status(500).json({ error: 'Beceri eklenemedi.' });
  }
};

const removeSkill = async (req, res) => {
  try {
    const { id } = req.params;

    const userSkill = await prisma.userSkill.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!userSkill) {
      return res.status(404).json({ error: 'Beceri bulunamadı.' });
    }

    await prisma.userSkill.delete({ where: { id } });

    res.json({ message: 'Beceri kaldırıldı.' });
  } catch (error) {
    console.error('removeSkill error:', error);
    res.status(500).json({ error: 'Beceri kaldırılamadı.' });
  }
};

module.exports = { getMyProfile, updateMyProfile, getUserById, addSkill, removeSkill };

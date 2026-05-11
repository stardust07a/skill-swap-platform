const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalSkills,
      totalUserSkills,
      totalMessages,
      totalRequests,
      totalReviews,
      pendingRequests,
      completedRequests,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.skill.count(),
      prisma.userSkill.count(),
      prisma.message.count(),
      prisma.lessonRequest.count(),
      prisma.review.count(),
      prisma.lessonRequest.count({ where: { status: 'PENDING' } }),
      prisma.lessonRequest.count({ where: { status: 'COMPLETED' } }),
    ]);

    res.json({
      stats: {
        totalUsers,
        totalSkills,
        totalUserSkills,
        totalMessages,
        totalRequests,
        totalReviews,
        pendingRequests,
        completedRequests,
      },
    });
  } catch (error) {
    console.error('getStats error:', error);
    res.status(500).json({ error: 'İstatistikler alınamadı.' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        profile: {
          select: { city: true, district: true, isSwapAvailable: true, isPaidLessonAvailable: true },
        },
        userSkills: { include: { skill: true } },
        _count: {
          select: {
            sentRequests: true,
            receivedRequests: true,
            receivedReviews: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ users });
  } catch (error) {
    console.error('getUsers error:', error);
    res.status(500).json({ error: 'Kullanıcılar alınamadı.' });
  }
};

module.exports = { getStats, getUsers };

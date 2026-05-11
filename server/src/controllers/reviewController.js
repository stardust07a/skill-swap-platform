const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getUserReviews = async (req, res) => {
  try {
    const { id } = req.params;

    const reviews = await prisma.review.findMany({
      where: { reviewedUserId: id },
      include: {
        reviewer: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

    res.json({ reviews, avgRating });
  } catch (error) {
    console.error('getUserReviews error:', error);
    res.status(500).json({ error: 'Yorumlar alınamadı.' });
  }
};

const createReview = async (req, res) => {
  try {
    const { reviewedUserId, lessonRequestId, rating, comment } = req.body;

    if (!reviewedUserId || !lessonRequestId || !rating) {
      return res.status(400).json({ error: 'reviewedUserId, lessonRequestId ve rating zorunludur.' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Puan 1-5 arasında olmalıdır.' });
    }

    if (reviewedUserId === req.user.id) {
      return res.status(400).json({ error: 'Kendinizi değerlendiremezsiniz.' });
    }

    // Talep kontrolü
    const request = await prisma.lessonRequest.findUnique({
      where: { id: lessonRequestId },
    });

    if (!request) {
      return res.status(404).json({ error: 'Talep bulunamadı.' });
    }

    if (request.status !== 'COMPLETED') {
      return res.status(400).json({ error: 'Yalnızca tamamlanan talepler için yorum yapılabilir.' });
    }

    if (request.senderId !== req.user.id && request.receiverId !== req.user.id) {
      return res.status(403).json({ error: 'Bu talep için yorum yapma yetkiniz yok.' });
    }

    const review = await prisma.review.create({
      data: {
        reviewerId: req.user.id,
        reviewedUserId,
        lessonRequestId,
        rating: parseInt(rating),
        comment,
      },
      include: {
        reviewer: { select: { id: true, name: true, avatarUrl: true } },
        reviewedUser: { select: { id: true, name: true, avatarUrl: true } },
      },
    });

    res.status(201).json({ message: 'Yorum eklendi.', review });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Bu talep için zaten yorum yapıldı.' });
    }
    console.error('createReview error:', error);
    res.status(500).json({ error: 'Yorum eklenemedi.' });
  }
};

module.exports = { getUserReviews, createReview };

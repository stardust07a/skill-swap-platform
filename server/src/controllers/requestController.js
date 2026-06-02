const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const allowedStatusTransitions = {
  PENDING: ['ACCEPTED', 'REJECTED', 'CANCELLED'],
  ACCEPTED: ['COMPLETED', 'CANCELLED'],
  REJECTED: [],
  COMPLETED: [],
  CANCELLED: [],
};

const canChangeStatus = (currentStatus, nextStatus) =>
  allowedStatusTransitions[currentStatus]?.includes(nextStatus);

const getRequests = async (req, res) => {
  try {
    const requests = await prisma.lessonRequest.findMany({
      where: {
        OR: [
          { senderId: req.user.id },
          { receiverId: req.user.id },
        ],
      },
      include: {
        sender: { select: { id: true, name: true, avatarUrl: true } },
        receiver: { select: { id: true, name: true, avatarUrl: true } },
        skillOffered: true,
        skillWanted: true,
        review: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ requests });
  } catch (error) {
    console.error('getRequests error:', error);
    res.status(500).json({ error: 'Talepler alınamadı.' });
  }
};

const createRequest = async (req, res) => {
  try {
    const {
      receiverId, type, skillOfferedId, skillWantedId,
      price, note, scheduledAt,
    } = req.body;

    if (!receiverId || !type) {
      return res.status(400).json({ error: 'receiverId ve type zorunludur.' });
    }

    if (!['SWAP', 'PAID'].includes(type)) {
      return res.status(400).json({ error: 'Type SWAP veya PAID olmalıdır.' });
    }

    if (receiverId === req.user.id) {
      return res.status(400).json({ error: 'Kendinize talep gönderemezsiniz.' });
    }

    const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
    if (!receiver) {
      return res.status(404).json({ error: 'Alıcı kullanıcı bulunamadı.' });
    }

    const request = await prisma.lessonRequest.create({
      data: {
        senderId: req.user.id,
        receiverId,
        type,
        skillOfferedId: skillOfferedId || null,
        skillWantedId: skillWantedId || null,
        price: price ? parseFloat(price) : null,
        note,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      },
      include: {
        sender: { select: { id: true, name: true, avatarUrl: true } },
        receiver: { select: { id: true, name: true, avatarUrl: true } },
        skillOffered: true,
        skillWanted: true,
      },
    });

    res.status(201).json({ message: 'Talep gönderildi.', request });
  } catch (error) {
    console.error('createRequest error:', error);
    res.status(500).json({ error: 'Talep gönderilemedi.' });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Geçersiz durum.' });
    }

    const request = await prisma.lessonRequest.findUnique({ where: { id } });
    if (!request) {
      return res.status(404).json({ error: 'Talep bulunamadı.' });
    }

    // Yetki kontrolü
    if (!canChangeStatus(request.status, status)) {
      return res.status(400).json({ error: 'Bu talep durumu bu sekilde guncellenemez.' });
    }

    if (status === 'ACCEPTED' || status === 'REJECTED') {
      if (request.receiverId !== req.user.id) {
        return res.status(403).json({ error: 'Bu talebi yalnızca alıcı kabul/reddedebilir.' });
      }
    }

    if (status === 'CANCELLED') {
      if (request.senderId !== req.user.id) {
        return res.status(403).json({ error: 'Bu talebi yalnızca gönderen iptal edebilir.' });
      }
    }

    if (status === 'COMPLETED') {
      if (request.receiverId !== req.user.id && request.senderId !== req.user.id) {
        return res.status(403).json({ error: 'Yetersiz yetki.' });
      }
    }

    const updated = await prisma.lessonRequest.update({
      where: { id },
      data: { status },
      include: {
        sender: { select: { id: true, name: true, avatarUrl: true } },
        receiver: { select: { id: true, name: true, avatarUrl: true } },
        skillOffered: true,
        skillWanted: true,
      },
    });

    res.json({ message: 'Talep güncellendi.', request: updated });
  } catch (error) {
    console.error('updateRequestStatus error:', error);
    res.status(500).json({ error: 'Talep güncellenemedi.' });
  }
};

const updateMeetingLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { meetingLink } = req.body;

    const request = await prisma.lessonRequest.findUnique({ where: { id } });
    if (!request) {
      return res.status(404).json({ error: 'Talep bulunamadı.' });
    }

    if (request.senderId !== req.user.id && request.receiverId !== req.user.id) {
      return res.status(403).json({ error: 'Yetersiz yetki.' });
    }

    const updated = await prisma.lessonRequest.update({
      where: { id },
      data: { meetingLink },
    });

    res.json({ message: 'Meeting linki güncellendi.', request: updated });
  } catch (error) {
    console.error('updateMeetingLink error:', error);
    res.status(500).json({ error: 'Meeting linki güncellenemedi.' });
  }
};

module.exports = { getRequests, createRequest, updateRequestStatus, updateMeetingLink };

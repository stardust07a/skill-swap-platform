const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getConversations = async (req, res) => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { user1Id: req.user.id },
          { user2Id: req.user.id },
        ],
      },
      include: {
        user1: { select: { id: true, name: true, avatarUrl: true } },
        user2: { select: { id: true, name: true, avatarUrl: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const result = await Promise.all(conversations.map(async (conv) => {
      const otherUser = conv.user1Id === req.user.id ? conv.user2 : conv.user1;
      const lastMessage = conv.messages[0] || null;
      const unreadCount = await prisma.message.count({
        where: {
          conversationId: conv.id,
          senderId: { not: req.user.id },
          isRead: false,
        },
      });

      return {
        id: conv.id,
        otherUser,
        lastMessage,
        unreadCount,
        updatedAt: conv.updatedAt,
      };
    }));

    res.json({ conversations: result });
  } catch (error) {
    console.error('getConversations error:', error);
    res.status(500).json({ error: 'Konuşmalar alınamadı.' });
  }
};

const createConversation = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId zorunludur.' });
    }

    if (userId === req.user.id) {
      return res.status(400).json({ error: 'Kendinizle konuşma başlatamazsınız.' });
    }

    const otherUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!otherUser) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
    }

    // Mevcut konuşmayı bul
    const existing = await prisma.conversation.findFirst({
      where: {
        OR: [
          { user1Id: req.user.id, user2Id: userId },
          { user1Id: userId, user2Id: req.user.id },
        ],
      },
    });

    if (existing) {
      return res.json({ conversation: existing });
    }

    const conversation = await prisma.conversation.create({
      data: {
        user1Id: req.user.id,
        user2Id: userId,
      },
      include: {
        user1: { select: { id: true, name: true, avatarUrl: true } },
        user2: { select: { id: true, name: true, avatarUrl: true } },
      },
    });

    res.status(201).json({ conversation });
  } catch (error) {
    console.error('createConversation error:', error);
    res.status(500).json({ error: 'Konuşma başlatılamadı.' });
  }
};

const getMessages = async (req, res) => {
  try {
    const { id } = req.params;

    const conversation = await prisma.conversation.findUnique({
      where: { id },
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Konuşma bulunamadı.' });
    }

    if (conversation.user1Id !== req.user.id && conversation.user2Id !== req.user.id) {
      return res.status(403).json({ error: 'Bu konuşmaya erişim yetkiniz yok.' });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId: id },
      include: {
        sender: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Okunmamış mesajları okundu yap
    await prisma.message.updateMany({
      where: {
        conversationId: id,
        senderId: { not: req.user.id },
        isRead: false,
      },
      data: { isRead: true },
    });

    res.json({ messages });
  } catch (error) {
    console.error('getMessages error:', error);
    res.status(500).json({ error: 'Mesajlar alınamadı.' });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Mesaj içeriği zorunludur.' });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id },
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Konuşma bulunamadı.' });
    }

    if (conversation.user1Id !== req.user.id && conversation.user2Id !== req.user.id) {
      return res.status(403).json({ error: 'Bu konuşmaya erişim yetkiniz yok.' });
    }

    const message = await prisma.message.create({
      data: {
        conversationId: id,
        senderId: req.user.id,
        text: text.trim(),
      },
      include: {
        sender: { select: { id: true, name: true, avatarUrl: true } },
      },
    });

    // updatedAt güncelle
    await prisma.conversation.update({
      where: { id },
      data: { updatedAt: new Date() },
    });

    res.status(201).json({ message });
  } catch (error) {
    console.error('sendMessage error:', error);
    res.status(500).json({ error: 'Mesaj gönderilemedi.' });
  }
};

module.exports = { getConversations, createConversation, getMessages, sendMessage };

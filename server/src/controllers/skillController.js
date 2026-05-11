const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllSkills = async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { name: 'asc' },
    });
    res.json({ skills });
  } catch (error) {
    res.status(500).json({ error: 'Beceriler alınamadı.' });
  }
};

const createSkill = async (req, res) => {
  try {
    const { name, category } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Beceri adı zorunludur.' });
    }

    const skill = await prisma.skill.upsert({
      where: { name },
      update: {},
      create: { name, category },
    });

    res.status(201).json({ skill });
  } catch (error) {
    console.error('createSkill error:', error);
    res.status(500).json({ error: 'Beceri oluşturulamadı.' });
  }
};

module.exports = { getAllSkills, createSkill };

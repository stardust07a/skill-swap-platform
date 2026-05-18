const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const cleanSkillText = (value) => {
  if (value === undefined || value === null) return null;
  return String(value).trim().replace(/\s+/g, ' ');
};

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
    const cleanedName = cleanSkillText(name);
    const cleanedCategory = cleanSkillText(category);

    if (!cleanedName) {
      return res.status(400).json({ error: 'Beceri adı zorunludur.' });
    }

    if (cleanedName.length < 2) {
      return res.status(400).json({ error: 'Beceri adi en az 2 karakter olmalidir.' });
    }

    const skills = await prisma.skill.findMany();
    const existingSkill = skills.find(
      (skill) => skill.name.toLowerCase() === cleanedName.toLowerCase()
    );

    if (existingSkill) {
      return res.json({ skill: existingSkill });
    }

    const skill = await prisma.skill.create({
      data: {
        name: cleanedName,
        category: cleanedCategory,
      },
    });

    res.status(201).json({ skill });
  } catch (error) {
    console.error('createSkill error:', error);
    res.status(500).json({ error: 'Beceri oluşturulamadı.' });
  }
};

module.exports = { getAllSkills, createSkill };

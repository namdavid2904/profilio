import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Delete existing skills
  await prisma.skill.deleteMany({});
  
  // Languages
  await prisma.skill.createMany({
    data: [
      { name: 'C#', category: 'Language', level: 90 },
      { name: 'TypeScript', category: 'Language', level: 92 },
      { name: 'JavaScript', category: 'Language', level: 95 },
      { name: 'Python', category: 'Language', level: 85 },
      { name: 'Java', category: 'Language', level: 80 },
      { name: 'SQL', category: 'Language', level: 88 },
      { name: 'HTML', category: 'Language', level: 95 },
      { name: 'CSS', category: 'Language', level: 90 },
      { name: 'C', category: 'Language', level: 75 },
    ],
  });

  // Backend
  await prisma.skill.createMany({
    data: [
      { name: '.NET Core', category: 'Backend', level: 85 },
      { name: '.NET Framework', category: 'Backend', level: 82 },
      { name: 'Entity Framework Core', category: 'Backend', level: 88 },
      { name: 'Node.js', category: 'Backend', level: 90 },
      { name: 'Express', category: 'Backend', level: 88 },
      { name: 'Flask', category: 'Backend', level: 78 },
    ],
  });

  // Frontend
  await prisma.skill.createMany({
    data: [
      { name: 'React', category: 'Frontend', level: 92 },
      { name: 'Three.js', category: 'Frontend', level: 85 },
      { name: 'Framer Motion', category: 'Frontend', level: 82 },
      { name: 'Tailwind CSS', category: 'Frontend', level: 90 },
      { name: 'Bootstrap', category: 'Frontend', level: 88 },
      { name: 'GSAP', category: 'Frontend', level: 78 },
    ],
  });

  // Database
  await prisma.skill.createMany({
    data: [
      { name: 'MS SQL Server', category: 'Database', level: 85 },
      { name: 'PostgreSQL', category: 'Database', level: 88 },
      { name: 'MySQL', category: 'Database', level: 82 },
      { name: 'MongoDB', category: 'Database', level: 78 },
      { name: 'Prisma ORM', category: 'Database', level: 85 },
    ],
  });

  // DevOps
  await prisma.skill.createMany({
    data: [
      { name: 'MS Azure', category: 'DevOps', level: 82 },
      { name: 'Docker', category: 'DevOps', level: 85 },
      { name: 'GitHub Actions', category: 'DevOps', level: 80 },
      { name: 'GitLab CI/CD', category: 'DevOps', level: 78 },
    ],
  });

  console.log('Database has been seeded with skills');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
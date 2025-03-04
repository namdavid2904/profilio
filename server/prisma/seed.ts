import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Delete existing skills and experiences
  await prisma.skill.deleteMany({});
  await prisma.experience.deleteMany({});
  
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

  // Work Experience
  await prisma.experience.create({
    data: {
      company: "FPT Corporation",
      position: "Software Engineer Intern",
      startDate: new Date("2024-05-27"),
      endDate: new Date("2024-08-28"),
      current: false,
      description: "• Built Asset Allocation module of a Human Resource Management System for 5000+ employees, containerizing with Docker, automating deployment with GitLab CI/CD, and hosting the server on Microsoft Azure.\n• Created 6 REST APIs for inventory management, allocation history, and utilization reports with .NET Core, establishing a real-time alert system with WebSocket to streamline inventory updates.\n• Boosted data retrieval 1.5x by replacing CTEs with indexed temp tables and analyzing execution in SQL Server.\n• Wrote comprehensive unit and integration tests following Test-Driven Development principles with xUnit and Swagger, boosting code quality and minimizing production incidents by 20%.",
      skills: [".NET Core", "SQL Server", "Docker", "Azure", "GitLab CI/CD", "WebSocket", "xUnit", "Swagger"],
      location: "Vietnam",
      logo: "/assets/companies/fpt.png"
    }
  });

  await prisma.experience.create({
    data: {
      company: "CodSoft",
      position: "Software Engineer Intern",
      startDate: new Date("2024-03-01"),
      endDate: new Date("2024-04-30"),
      current: false,
      description: "• Developed a bookstore e-commerce website in MVC architecture with Node.js and Express, using MongoDB Atlas for data management, and handling 1000+ concurrent users through request queuing.\n• Reduced payment processing failures by 10% through implementing robust handling and retry mechanisms in Stripe integration, utilizing JWT authentication for secure transactions.\n• Integrated Cloudinary to store 2300+ books, enhancing storage cost through automated image compression.\n• Collaborated with a cross-functional team to design responsive web components with React.js and Bootstrap.",
      skills: ["Node.js", "Express", "MongoDB", "React.js", "Bootstrap", "Stripe", "JWT", "Cloudinary"],
      location: "United States",
      logo: "/assets/companies/codsoft.png"
    }
  });

  // Add this at the end of your main() function
  const experienceCount = await prisma.experience.count();
  const skillCount = await prisma.skill.count();
  console.log(`Verification: Database now contains ${experienceCount} experiences and ${skillCount} skills`);
  console.log('Database has been seeded with skills and experiences');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const courses = [
  {
    title: "Digital Journalism Fundamentals",
    description: "Learn the basics of modern digital journalism, from writing compelling stories to understanding multimedia storytelling techniques.",
    price: 4999,
    duration: "6 weeks",
    level: "Beginner",
    students: 1200,
    rating: 4.8,
    highlights: JSON.stringify(["News Writing", "Research Skills", "Interview Techniques", "Ethics in Journalism"])
  },
  {
    title: "Video Production & Editing",
    description: "Master video production from concept to final cut. Learn professional editing techniques using industry-standard tools.",
    price: 6999,
    duration: "8 weeks",
    level: "Intermediate",
    students: 850,
    rating: 4.9,
    highlights: JSON.stringify(["Camera Techniques", "Adobe Premiere Pro", "Sound Design", "Color Grading"])
  },
  {
    title: "Social Media Management",
    description: "Build and grow your brand on social platforms. Learn content strategy, analytics, and engagement tactics.",
    price: 3499,
    duration: "4 weeks",
    level: "Beginner",
    students: 2100,
    rating: 4.7,
    highlights: JSON.stringify(["Content Strategy", "Analytics", "Community Building", "Paid Advertising"])
  },
  {
    title: "Investigative Reporting",
    description: "Deep dive into investigative journalism. Learn research methodologies, source protection, and impactful storytelling.",
    price: 8999,
    duration: "10 weeks",
    level: "Advanced",
    students: 450,
    rating: 4.9,
    highlights: JSON.stringify(["Data Analysis", "FOIA Requests", "Source Protection", "Long-form Writing"])
  },
  {
    title: "Photography for Journalists",
    description: "Capture compelling images that tell stories. Learn composition, lighting, and photojournalism ethics.",
    price: 4499,
    duration: "5 weeks",
    level: "Beginner",
    students: 980,
    rating: 4.6,
    highlights: JSON.stringify(["Composition", "Street Photography", "Photo Editing", "Documentary Style"])
  },
  {
    title: "Podcast Production",
    description: "Create professional podcasts from scratch. Learn recording, editing, and distribution strategies.",
    price: 5499,
    duration: "6 weeks",
    level: "Intermediate",
    students: 720,
    rating: 4.8,
    highlights: JSON.stringify(["Audio Recording", "Podcast Editing", "Distribution", "Monetization"])
  }
];

async function main() {
  console.log('🌱 Seeding courses...');

  for (const course of courses) {
    const created = await prisma.course.create({
      data: course,
    });
    console.log(`✅ Created course: ${created.title} (ID: ${created.id})`);
  }

  console.log('✨ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding courses:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function main() {
  console.log('🔄 Adding slugs to existing courses...');

  const courses = await prisma.course.findMany();

  for (const course of courses) {
    const slug = generateSlug(course.title);
    
    await prisma.course.update({
      where: { id: course.id },
      data: { 
        slug,
        shortDesc: course.description.substring(0, 150) + '...',
      },
    });
    
    console.log(`✅ Updated: ${course.title} → ${slug}`);
  }

  console.log('✨ Migration complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

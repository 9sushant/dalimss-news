const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const courseModules = {
  'digital-journalism-fundamentals': [
    {
      title: 'Introduction to Digital Journalism',
      description: 'Understanding the fundamentals of modern journalism',
      lessons: [
        { title: 'What is Digital Journalism?', duration: 420, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', isFree: true },
        { title: 'Evolution of News Media', duration: 360, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'},
        { title: 'Ethics in Journalism', duration: 540, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      ]
    },
    {
      title: 'News Writing Fundamentals',
      description: 'Learn how to write compelling news stories',
      lessons: [
        { title: 'The Inverted Pyramid', duration: 300, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { title: 'Writing Headlines', duration: 240, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { title: 'Interviewing Techniques', duration: 480, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      ]
    },
    {
      title: 'Digital Tools & Platforms',
      description: 'Master the tools used in modern newsrooms',
      lessons: [
        { title: 'Content Management Systems', duration: 360, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { title: 'Social Media for Journalists', duration: 420, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { title: 'Fact-Checking Tools', duration: 300, videoUrl: 'https://www. youtube.com/watch?v=dQw4w9WgXcQ' },
      ]
    }
  ],
  'video-production-editing': [
    {
      title: 'Camera Fundamentals',
      description: 'Understanding camera basics and techniques',
      lessons: [
        { title: 'Camera Types and Settings', duration: 480, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', isFree: true },
        { title: 'Composition and Framing', duration: 360, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { title: 'Lighting Techniques', duration: 420, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      ]
    },
    {
      title: 'Video Editing with Adobe Premiere',
      description: 'Master Adobe Premiere Pro for professional editing',
      lessons: [
        { title: 'Interface Overview', duration: 300, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { title: 'Basic Editing Techniques', duration: 540, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { title: 'Color Grading Basics', duration: 480, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { title: 'Sound Design', duration: 420, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      ]
    }
  ],
  'social-media-management': [
    {
      title: 'Social Media Strategy',
      description: 'Building a winning social media strategy',
      lessons: [
        { title: 'Platform Overview', duration: 300, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', isFree: true },
        { title: 'Content Planning', duration: 360, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { title: 'Audience Analysis', duration: 420, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      ]
    },
    {
      title: 'Content Creation',
      description: 'Creating engaging social media content',
      lessons: [
        { title: 'Visual Content Creation', duration: 480, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { title: 'Copywriting for Social', duration: 360, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { title: 'Video Content Strategy', duration: 420, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      ]
    }
  ]
};

async function main() {
  console.log('🌱 Seeding course modules and lessons...\n');

  const courses = await prisma.course.findMany();

  for (const course of courses) {
    if (!course.slug || !courseModules[course.slug]) {
      console.log(`⏭️  Skipping ${course.title} (no modules defined)`);
      continue;
    }

    console.log(`📚 Adding modules to: ${course.title}`);
    
    const modules = courseModules[course.slug];
    
    for (let i = 0; i < modules.length; i++) {
      const moduleData = modules[i];
      
      const module = await prisma.courseModule.create({
        data: {
          courseId: course.id,
          title: moduleData.title,
          description: moduleData.description,
          order: i + 1,
        },
      });
      
      console.log(`  ✅ Module: ${module.title}`);
      
      for (let j = 0; j < moduleData.lessons.length; j++) {
        const lessonData = moduleData.lessons[j];
        
        await prisma.lesson.create({
          data: {
            moduleId: module.id,
            title: lessonData.title,
            duration: lessonData.duration,
            videoUrl: lessonData.videoUrl,
            isFree: lessonData.isFree || false,
            order: j + 1,
          },
        });
        
        console.log(`    → Lesson: ${lessonData.title}`);
      }
    }
    
    console.log('');
  }

  console.log('✨ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding modules:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

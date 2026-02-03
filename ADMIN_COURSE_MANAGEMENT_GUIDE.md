# 🎓 Admin Course Management Guide

## Overview

You now have a complete admin panel to upload and manage course videos. This guide will help you understand how to use it.

## Features Implemented

### 1. ✅ Admin Panel (`/admin/courses`)
- View all courses and their modules
- See all lessons within each module
- Upload videos for each lesson
- Track which lessons have videos uploaded

### 2. ✅ Enrollment-Based Content Access
- **Non-enrolled users**: Can only see free preview lessons
- **Enrolled users**: Can see all lesson content
- Locked lessons show 🔒 icon for non-enrolled users

### 3. ✅ Video Upload System
- Videos upload to Cloudinary
- Automatic duration extraction
- Updates database with video URL

## How to Use the Admin Panel

### Step 1: Access the Admin Panel

**URL**: http://localhost:3000/admin/courses

**Requirements**:
- You must be logged in
- Your account must have `role = "admin"` in the database

### Step 2: Make Yourself an Admin

Run this in your database or use Prisma Studio:

```sql
UPDATE "User" SET role = 'admin' WHERE email = 'your@email.com';
```

Or using Prisma Studio:
```bash
npx prisma studio
```
1. Open the User table
2. Find your user
3. Change `role` from "user" to "admin"
4. Save

### Step 3: Upload Videos

1. Go to http://localhost:3000/admin/courses
2. Click on a course to expand it
3. Click on a module to see its lessons
4. Click **"Upload Video"** button for any lesson
5. Select a video file (supports all video formats)
6. Wait for upload to complete
7. The video URL and duration will be saved automatically

## Content Visibility Rules

### For Non-Enrolled Users:
- ✅ Can see course title and description
- ✅ Can see module titles
- ✅ Can see lesson titles
- ✅ Can view "FREE" lessons
- ❌ Cannot see locked lesson durations
- ❌ Locked lessons show "🔒 Locked" badge
- ❌ Shows "Enroll to access" message

### For Enrolled Users:
- ✅ Can see ALL lessons
- ✅ Can see all lesson durations
- ✅ Can access video player (when built)
- ✅ Can track progress

## Cloudinary Setup for Video Upload

The admin panel uploads videos to Cloudinary. You need to set this up:

### 1. Get Cloudinary Credentials

1. Go to https://cloudinary.com and sign up
2. Get your **Cloud Name** from the dashboard
3. Add to `.env.local`:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
```

### 2. Create Upload Preset

1. Go to Cloudinary Dashboard → Settings → Upload
2. Scroll to "Upload presets"
3. Click "Add upload preset"
4. Name it: `course_videos`
5. Set **Signing Mode** to "Unsigned"
6. **Folder**: `courses/videos`
7. **Resource type**: Video
8. Save

## API Endpoints Created

### POST `/api/admin/lessons/update-video`
Updates a lesson with uploaded video URL

**Request**:
```json
{
  "lessonId": 1,
  "videoUrl": "https://res.cloudinary.com/...",
  "duration": 420
}
```

**Response**:
```json
{
  "success": true,
  "lesson": { ... }
}
```

**Authorization**: Requires admin role

## How Enrollment Check Works

In `pages/courses/[slug].tsx`:

```typescript
// Check if user is enrolled
const session = await getSession({ req });

if (session?.user) {
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      courseId: course.id,
      OR: [
        { userId: session.user.id },
        { userEmail: session.user.email },
      ],
      status: 'paid',
    },
  });
  
  isEnrolled = !!enrollment;
}
```

Then in the UI:
```typescript
const canView = isEnrolled || lesson.isFree;
```

## Current Database State

You have:
- ✅ 6 courses in database
- ✅ 3 courses with full curriculum (22 lessons total)
- ✅ First lesson of each module is marked as "FREE"
- ✅ All lessons ready for video upload

## Testing the Feature

### Test as Non-Enrolled User:
1. Go to http://localhost:3000/courses/digital-journalism-fundamentals
2. Expand a module
3. You'll see:
   - First lesson marked "FREE" ✅
   - Other lessons marked "🔒 Locked" ❌
   - Locked lessons show "Enroll to access"

### Test as Enrolled User:
1. Make a test payment (or manually create enrollment in DB)
2. Go to same course page
3. You'll see:
   - All lessons unlocked ✅
   - All durations visible ✅
   - "Continue Learning" button

###Test Admin Panel:
1. Make yourself admin (`role = "admin"`)
2. Go to http://localhost:3000/admin/courses
3. Upload a video to any lesson
4. Refresh course details page to see duration updated

## Next Steps

After uploading videos, you need to build:

1. **Learning Player** (`/learn/[courseSlug]`)
   - Video player component
   - Lesson navigation
   - Mark as complete functionality
   
2. **My Courses Dashboard** (`/my-courses`)
   - List all enrolled courses
   - Show progress percentages
   - Quick access to continue learning

3. **Progress Tracking API**
   - Update UserProgress table
   - Calculate overall course progress
   - Save watched time

## Troubleshooting

### "Unauthorized" when accessing admin panel
- Make sure you're logged in
- Check your user role is "admin" in database
- Use: `npx prisma studio` to verify

### Video upload fails
- Check Cloudinary credentials in `.env.local`
- Verify upload preset is created and set to "unsigned"
- Check browser console for errors

### Lessons still showing as locked after enrollment
- Check enrollment status is "paid" in database
- Verify userEmail or userId matches session
- Clear cache and refresh page

## File Structure

```
pages/
├── admin/
│   └── courses.tsx          # Admin panel for video upload
├── courses/
│   └── [slug].tsx           # Course details (enrollment check added)
└── api/
    └── admin/
        └── lessons/
            └── update-video.ts  # API to update lesson videos
```

## Summary

✅ **Admin panel created** - Upload videos for lessons
✅ **Enrollment check working** - Shows/hides content based on enrollment
✅ **Video upload functional** - Uploads to Cloudinary
✅ **Access control implemented** - Locked/unlocked lessons
✅ **Database updates** - Stores video URL and duration

**Ready to use!** Make yourself an admin and start uploading course videos! 🎉

import React, { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  VideoCameraIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

interface Lesson {
  id: number;
  title: string;
  videoUrl: string | null;
  duration: number | null;
  order: number;
}

interface Module {
  id: number;
  title: string;
  description: string | null;
  order: number;
  lessons: Lesson[];
}

interface Course {
  id: number;
  slug: string;
  title: string;
  modules: Module[];
}

interface Props {
  courses: Course[];
}

const AdminCoursesPage: React.FC<Props> = ({ courses }) => {
  const [expandedCourses, setExpandedCourses] = useState<number[]>([]);
  const [expandedModules, setExpandedModules] = useState<number[]>([]);
  const [uploadingLesson, setUploadingLesson] = useState<number | null>(null);

  const toggleCourse = (courseId: number) => {
    setExpandedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleVideoUpload = async (lessonId: number, file: File) => {
    setUploadingLesson(lessonId);

    try {
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "course_videos"); // You'll need to create this in Cloudinary

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const cloudinaryData = await cloudinaryRes.json();

      if (!cloudinaryData.secure_url) {
        throw new Error("Failed to upload video");
      }

      // Update lesson with video URL
      const updateRes = await fetch("/api/admin/lessons/update-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          videoUrl: cloudinaryData.secure_url,
          duration: Math.round(cloudinaryData.duration), // Duration in seconds
        }),
      });

      if (updateRes.ok) {
        alert("Video uploaded successfully!");
        window.location.reload();
      } else {
        throw new Error("Failed to update lesson");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(error.message || "Failed to upload video");
    } finally {
      setUploadingLesson(null);
    }
  };

  return (
    <>
      <Head>
        <title>Manage Courses | Admin Panel</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
                <p className="text-gray-600 mt-1">Upload and manage course videos</p>
              </div>
              <Link
                href="/"
                className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                ← Back to Site
              </Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-4">
            {courses.map((course) => {
              const isExpanded = expandedCourses.includes(course.id);

              return (
                <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <button
                    onClick={() => toggleCourse(course.id)}
                    className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {isExpanded ? (
                        <ChevronUpIcon className="h-6 w-6 text-gray-400" />
                      ) : (
                        <ChevronDownIcon className="h-6 w-6 text-gray-400" />
                      )}
                      <div className="text-left">
                        <h2 className="text-xl font-bold text-gray-900">{course.title}</h2>
                        <p className="text-sm text-gray-500 mt-1">
                          {course.modules.length} modules • {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons
                        </p>
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-gray-200 p-6">
                      {course.modules.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                          No modules yet. Add modules to this course.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {course.modules.map((module) => {
                            const isModuleExpanded = expandedModules.includes(module.id);

                            return (
                              <div
                                key={module.id}
                                className="border border-gray-200 rounded-lg overflow-hidden"
                              >
                                <button
                                  onClick={() => toggleModule(module.id)}
                                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    {isModuleExpanded ? (
                                      <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                                    ) : (
                                      <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                                    )}
                                    <div className="text-left">
                                      <h3 className="font-semibold text-gray-900">{module.title}</h3>
                                      <p className="text-sm text-gray-500">{module.lessons.length} lessons</p>
                                    </div>
                                  </div>
                                </button>

                                {isModuleExpanded && (
                                  <div className="p-4 bg-white">
                                    <div className="space-y-3">
                                      {module.lessons.map((lesson) => (
                                        <div
                                          key={lesson.id}
                                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-red-300 transition-colors"
                                        >
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                              <VideoCameraIcon className="h-5 w-5 text-gray-400" />
                                              <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                                            </div>
                                            {lesson.videoUrl && (
                                              <p className="text-sm text-green-600 mt-1">
                                                ✓ Video uploaded {lesson.duration && `(${Math.floor(lesson.duration / 60)}m ${lesson.duration % 60}s)`}
                                              </p>
                                            )}
                                            {!lesson.videoUrl && (
                                              <p className="text-sm text-gray-500 mt-1">No video uploaded yet</p>
                                            )}
                                          </div>

                                          <div className="flex items-center gap-2">
                                            {uploadingLesson === lesson.id ? (
                                              <div className="text-sm text-gray-600">Uploading...</div>
                                            ) : (
                                              <>
                                                <label
                                                  htmlFor={`video-${lesson.id}`}
                                                  className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                                >
                                                  {lesson.videoUrl ? "Replace Video" : "Upload Video"}
                                                </label>
                                                <input
                                                  id={`video-${lesson.id}`}
                                                  type="file"
                                                  accept="video/*"
                                                  className="hidden"
                                                  onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                      if (confirm(`Upload video for "${lesson.title}"?`)) {
                                                        handleVideoUpload(lesson.id, file);
                                                      }
                                                    }
                                                  }}
                                                />
                                              </>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {courses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No courses found.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  // Check if user is admin
  if (!session || (session.user as any)?.role !== "admin") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  try {
    const courses = await (prisma as any).course.findMany({
      include: {
        modules: {
          orderBy: { order: "asc" },
          include: {
            lessons: {
              orderBy: { order: "asc" },
              select: {
                id: true,
                title: true,
                videoUrl: true,
                duration: true,
                order: true,
              },
            },
          },
        },
      },
      orderBy: { id: "asc" },
    });

    return {
      props: {
        courses: JSON.parse(JSON.stringify(courses)),
      },
    };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return {
      props: {
        courses: [],
      },
    };
  }
};

export default AdminCoursesPage;

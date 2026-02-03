import React, { useState } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import {
  PlusIcon,
  TrashIcon,
  VideoCameraIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
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
  price: number;
  level: string;
  duration: string;
  modules: Module[];
}

interface Props {
  courses: Course[];
}

const AdminCoursesPage: React.FC<Props> = ({ courses: initialCourses }) => {
  const [courses, setCourses] = useState(initialCourses);
  const [expandedCourses, setExpandedCourses] = useState<number[]>([]);
  const [expandedModules, setExpandedModules] = useState<number[]>([]);
  const [uploadingLesson, setUploadingLesson] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    level: "Beginner",
    instructor: "Dalimss Academy",
  });

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
      formData.append("upload_preset", "course_videos");

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
          duration: Math.round(cloudinaryData.duration),
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

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await fetch("/api/admin/courses/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCourse),
      });

      if (res.ok) {
        alert("Course created successfully!");
        window.location.reload();
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to create course");
      }
    } catch (error: any) {
      alert(error.message || "Failed to create course");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteCourse = async (courseId: number, courseName: string) => {
    if (!confirm(`Are you sure you want to delete "${courseName}"? This will delete all modules, lessons, and enrollments. This action cannot be undone!`)) {
      return;
    }

    try {
      const res = await fetch("/api/admin/courses/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      if (res.ok) {
        alert("Course deleted successfully!");
        setCourses(courses.filter(c => c.id !== courseId));
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete course");
      }
    } catch (error: any) {
      alert(error.message || "Failed to delete course");
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
                <p className="text-gray-600 mt-1">Create, manage, and upload course content</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <PlusIcon className="h-5 w-5" />
                  Create New Course
                </button>
                <Link
                  href="/"
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  ← Back to Site
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-4">
            {courses.map((course) => {
              const isExpanded = expandedCourses.includes(course.id);

              return (
                <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between p-6">
                    <button
                      onClick={() => toggleCourse(course.id)}
                      className="flex-1 flex items-center gap-4 hover:opacity-80 transition-opacity"
                    >
                      {isExpanded ? (
                        <ChevronUpIcon className="h-6 w-6 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronDownIcon className="h-6 w-6 text-gray-400 flex-shrink-0" />
                      )}
                      <div className="text-left">
                        <h2 className="text-xl font-bold text-gray-900">{course.title}</h2>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span>{course.modules.length} modules</span>
                          <span>•</span>
                          <span>{course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons</span>
                          <span>•</span>
                          <span>₹{course.price.toLocaleString()}</span>
                          <span>•</span>
                          <span>{course.level}</span>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id, course.title)}
                      className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete course"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-200 p-6">
                      {course.modules.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-500 mb-4">
                            No modules yet. Use Prisma Studio to add modules and lessons to this course.
                          </p>
                          <a
                            href="http://localhost:5555"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-600 hover:text-red-700 font-semibold"
                          >
                            Open Prisma Studio →
                          </a>
                        </div>
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
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500 mb-4">No courses yet. Create your first course!</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
              >
                <PlusIcon className="h-5 w-5" />
                Create New Course
              </button>
            </div>
          )}
        </div>

        {/* Create Course Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Create New Course</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleCreateCourse} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Title <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    placeholder="e.g. Advanced Digital Marketing"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    rows={4}
                    placeholder="Describe what students will learn..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹) <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      value={newCourse.price}
                      onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                      placeholder="4999"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={newCourse.duration}
                      onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                      placeholder="8 weeks"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Level <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={newCourse.level}
                      onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                      required
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instructor
                    </label>
                    <input
                      type="text"
                      value={newCourse.instructor}
                      onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                      placeholder="Dalimss Academy"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> After creating the course, use Prisma Studio to add modules and lessons.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-4 rounded-lg font-bold text-lg transition-all disabled:cursor-not-allowed"
                  >
                    {creating ? "Creating..." : "Create Course"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 py-4 rounded-lg font-bold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
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

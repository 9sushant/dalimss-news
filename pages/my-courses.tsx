import React from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import {
  PlayCircleIcon,
  ClockIcon,
  CheckCircleIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

interface Course {
  id: number;
  slug: string;
  title: string;
  thumbnail: string | null;
  instructor: string;
  duration: string;
  level: string;
}

interface Enrollment {
  id: string;
  progress: number;
  createdAt: string;
  course: Course;
  totalLessons: number;
  completedLessons: number;
}

interface Props {
  enrollments: Enrollment[];
  userEmail: string;
}

const MyCoursesPage: React.FC<Props> = ({ enrollments, userEmail }) => {
  return (
    <>
      <Head>
        <title>My Courses | Dalimss Academy</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Courses</h1>
            <p className="text-gray-600 mt-2">
              Welcome back! Continue your learning journey.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {enrollments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="max-w-md mx-auto">
                <AcademicCapIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  No Courses Yet
                </h2>
                <p className="text-gray-600 mb-6">
                  You haven't enrolled in any courses yet. Explore our course catalog and start learning today!
                </p>
                <Link
                  href="/courses"
                  className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Browse Courses
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  You're enrolled in <span className="font-semibold text-gray-900">{enrollments.length}</span> {enrollments.length === 1 ? 'course' : 'courses'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrollments.map((enrollment) => {
                  const progressPercentage = enrollment.progress;
                  const isCompleted = progressPercentage === 100;
                  const lessonsCompleted = enrollment.completedLessons;
                  const totalLessons = enrollment.totalLessons;

                  return (
                    <div
                      key={enrollment.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
                    >
                      {/* Thumbnail */}
                      <div className="relative h-48 bg-gradient-to-br from-red-500 to-red-700">
                        {enrollment.course.thumbnail ? (
                          <img
                            src={enrollment.course.thumbnail}
                            alt={enrollment.course.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <AcademicCapIcon className="h-24 w-24 text-white/20" />
                          </div>
                        )}
                        
                        {/* Progress Badge */}
                        {isCompleted ? (
                          <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                            <CheckCircleIcon className="h-4 w-4" />
                            Completed
                          </div>
                        ) : (
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                            {Math.round(progressPercentage)}% Complete
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                          {enrollment.course.title}
                        </h3>
                        
                        <p className="text-sm text-gray-600 mb-4">
                          By {enrollment.course.instructor}
                        </p>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                            <span>{lessonsCompleted} of {totalLessons} lessons</span>
                            <span className="font-semibold">{Math.round(progressPercentage)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isCompleted ? 'bg-green-600' : 'bg-red-600'
                              }`}
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                        </div>

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <ClockIcon className="h-4 w-4" />
                            <span>{enrollment.course.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <AcademicCapIcon className="h-4 w-4" />
                            <span>{enrollment.course.level}</span>
                          </div>
                        </div>

                        {/* CTA Button */}
                        <Link
                          href={`/learn/${enrollment.course.slug}`}
                          className="block w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold text-center transition-all"
                        >
                          {isCompleted ? 'Review Course' : 'Continue Learning'}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Browse More */}
          {enrollments.length > 0 && (
            <div className="mt-12 text-center">
              <Link
                href="/courses"
                className="inline-block bg-white hover:bg-gray-50 text-gray-900 px-8 py-3 rounded-lg font-semibold border-2 border-gray-300 transition-colors"
              >
                Browse More Courses
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  // Require authentication
  if (!session?.user) {
    return {
      redirect: {
        destination: "/auth/signin?callbackUrl=/my-courses",
        permanent: false,
      },
    };
  }

  try {
    // Fetch user's enrollments
    const enrollments = await (prisma as any).enrollment.findMany({
      where: {
        OR: [
          { userId: (session.user as any).id },
          { userEmail: session.user.email },
        ],
        status: "paid",
      },
      include: {
        course: {
          select: {
            id: true,
            slug: true,
            title: true,
            thumbnail: true,
            instructor: true,
            duration: true,
            level: true,
          },
        },
        userProgress: {
          select: {
            completed: true,
            lessonId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate progress for each enrollment
    const enrollmentsWithProgress = await Promise.all(
      enrollments.map(async (enrollment: any) => {
        // Get total lessons count
        const totalLessons = await (prisma as any).lesson.count({
          where: {
            module: {
              courseId: enrollment.course.id,
            },
          },
        });

        // Count completed lessons
        const completedLessons = enrollment.userProgress.filter(
          (p: any) => p.completed
        ).length;

        return {
          id: enrollment.id,
          progress: enrollment.progress || (totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0),
          createdAt: enrollment.createdAt.toISOString(),
          course: enrollment.course,
          totalLessons,
          completedLessons,
        };
      })
    );

    return {
      props: {
        enrollments: JSON.parse(JSON.stringify(enrollmentsWithProgress)),
        userEmail: session.user.email,
      },
    };
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    return {
      props: {
        enrollments: [],
        userEmail: session.user.email || "",
      },
    };
  }
};

export default MyCoursesPage;

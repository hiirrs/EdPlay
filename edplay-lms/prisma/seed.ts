// Adds seed data to your db
// @see https://www.prisma.io/docs/guides/database/seed-database

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Optionally clear existing data
  await prisma.answer.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.quiz.deleteMany({});
  await prisma.moduleContent.deleteMany({});
  await prisma.module.deleteMany({});
  await prisma.submission.deleteMany({});
  await prisma.assignment.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.gameNumeracy.deleteMany({});
  await prisma.gameLiteracy.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.school.deleteMany({});
  await prisma.post.deleteMany({});

  // Create a school
  const school = await prisma.school.create({
    data: {
      sch_name: "EdPlay Academy",
      ed_level: "SMA", // Using high school level as an example
      location: "123 Education Lane",
    },
  });

  // Create a teacher user
  const teacher = await prisma.user.create({
    data: {
      username: "teacher_john",
      email: "john@example.com",
      fullname: "John Doe",
      password: "securepassword", // In production, remember to hash passwords
      role: "teacher",
      schoolId: school.sch_id,
    },
  });

  // Create a student user
  const student = await prisma.user.create({
    data: {
      username: "student_jane",
      email: "jane@example.com",
      fullname: "Jane Smith",
      password: "anotherpassword", // In production, remember to hash passwords
      role: "student",
      schoolId: school.sch_id,
    },
  });

  // Create a course with the teacher as the instructor
  const course = await prisma.course.create({
    data: {
      name: "Mathematics 101",
      description: "An introductory course to basic mathematical concepts.",
      teacherId: teacher.user_id,
      schoolId: school.sch_id,
      educationLevel: "SMA",
      imageUrl: '/images/bgs/bg-class1.png'
    },
  });

  // Enroll the student in the course
  await prisma.enrollment.create({
    data: {
      userId: student.user_id,
      courseId: course.id,
      schoolId: school.sch_id,
    },
  });

  // Create an assignment for the course
  const assignment = await prisma.assignment.create({
    data: {
      courseId: course.id,
      title: "Algebra Homework",
      description: "Solve the algebra problems in chapter 2.",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // one week from now
      allowResubmission: false,
      maxUploadSize: 1048576, // 1 MB
    },
  });

  // Create a submission for the assignment by the student
  await prisma.submission.create({
    data: {
      assignmentId: assignment.id,
      studentId: student.user_id,
      filePath: "/submissions/algebra_homework_jane.pdf",
      isFinal: true,
    },
  });

  // Create a module for the course
  const moduleRecord = await prisma.module.create({
    data: {
      courseId: course.id,
      title: "Introduction to Algebra",
      description: "Basic concepts of algebra explained.",
    },
  });

  // Create module content
  await prisma.moduleContent.create({
    data: {
      moduleId: moduleRecord.id,
      contentType: "text",
      contentData: "This module covers the fundamentals of algebra including variables, equations, and functions.",
    },
  });

  // Create a quiz for the course
  const quiz = await prisma.quiz.create({
    data: {
      courseId: course.id,
      title: "Algebra Quiz",
      description: "Quiz on basic algebra concepts",
      allowResubmission: false,
    },
  });

  // Create a question in the quiz
  const question = await prisma.question.create({
    data: {
      quizId: quiz.id,
      questionText: "What is the value of x in the equation 2x + 3 = 7?",
      questionType: "short_answer",
    },
  });

  // Create an answer from the student for the question
  await prisma.answer.create({
    data: {
      questionId: question.id,
      studentId: student.user_id,
      answerText: "2",
    },
  });

  // Create a blog post
  await prisma.post.create({
    data: {
      title: "Welcome to EdPlay!",
      text: "This is our first post on the EdPlay platform. Stay tuned for more updates.",
    },
  });

  // Create a GameLiteracy record
  await prisma.gameLiteracy.create({
    data: {
      userId: student.user_id,
      schoolId: school.sch_id,
      score: 85,
    },
  });

  // Create a GameNumeracy record
  await prisma.gameNumeracy.create({
    data: {
      userId: student.user_id,
      schoolId: school.sch_id,
      score: 90,
    },
  });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

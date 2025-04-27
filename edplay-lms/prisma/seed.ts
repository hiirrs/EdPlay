import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Hash passwords
  const hashedAdminPassword = await bcrypt.hash("adminpassword", 10);
  const hashedTeacherPassword = await bcrypt.hash("securepassword", 10);
  const hashedStudentPassword = await bcrypt.hash("anotherpassword", 10);

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

  const school = await prisma.school.create({
    data: {
      sch_name: "EdPlay Academy",
      ed_level: "SMA",
      location: "123 Education Lane",
    },
  });

  await prisma.user.create({
    data: {
      username: "admin",
      email: "admin@example.com",
      fullname: "Admin User",
      password: hashedAdminPassword,
      role: "admin",
      schoolId: school.sch_id,
    },
  });

  const teacher = await prisma.user.create({
    data: {
      username: "teacher_john",
      email: "john@example.com",
      fullname: "John Doe",
      password: hashedTeacherPassword,
      role: "teacher",
      schoolId: school.sch_id,
    },
  });

  const student = await prisma.user.create({
    data: {
      username: "student_jane",
      email: "jane@example.com",
      fullname: "Jane Smith",
      password: hashedStudentPassword,
      role: "student",
      schoolId: school.sch_id,
    },
  });

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

  await prisma.enrollment.create({
    data: {
      userId: student.user_id,
      courseId: course.id,
      schoolId: school.sch_id,
    },
  });

  const assignment = await prisma.assignment.create({
    data: {
      courseId: course.id,
      title: "Algebra Homework",
      description: "Solve the algebra problems in chapter 2.",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      allowResubmission: false,
      maxUploadSize: 1048576,
    },
  });

  await prisma.submission.create({
    data: {
      assignmentId: assignment.id,
      studentId: student.user_id,
      filePath: "/submissions/algebra_homework_jane.pdf",
      isFinal: true,
    },
  });

  const moduleRecord = await prisma.module.create({
    data: {
      courseId: course.id,
      title: "Introduction to Algebra",
      description: "Basic concepts of algebra explained.",
    },
  });

  await prisma.moduleContent.create({
    data: {
      moduleId: moduleRecord.id,
      contentTitle: "Module Overview",
      contentType: "TEXT",
      contentData: "This module covers the fundamentals of algebra including variables, equations, and functions.",
    },
  });

  const quiz = await prisma.quiz.create({
    data: {
      courseId: course.id,
      title: "Algebra Quiz",
      description: "Quiz on basic algebra concepts",
      allowResubmission: false,
    },
  });

  const question = await prisma.question.create({
    data: {
      quizId: quiz.id,
      questionText: "What is the value of x in the equation 2x + 3 = 7?",
      questionType: "short_answer",
    },
  });

  await prisma.answer.create({
    data: {
      questionId: question.id,
      studentId: student.user_id,
      answerText: "2",
    },
  });

  await prisma.post.create({
    data: {
      title: "Welcome to EdPlay!",
      text: "This is our first post on the EdPlay platform. Stay tuned for more updates.",
    },
  });

  await prisma.gameLiteracy.create({
    data: {
      userId: student.user_id,
      schoolId: school.sch_id,
      score: 85,
    },
  });

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

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

function generateToken(length = 5) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}


async function main() {
  // Reset data
  await prisma.answer.deleteMany({})
  await prisma.question.deleteMany({})
  await prisma.quiz.deleteMany({})
  await prisma.moduleContent.deleteMany({})
  await prisma.module.deleteMany({})
  await prisma.assignmentSubmission.deleteMany({})
  await prisma.assignmentContent.deleteMany({})
  await prisma.assignment.deleteMany({})
  await prisma.enrollment.deleteMany({})
  await prisma.post.deleteMany({})
  await prisma.course.deleteMany({})
  await prisma.gameNumeracy.deleteMany({})
  await prisma.gameLiteracy.deleteMany({})
  await prisma.user.deleteMany({})
  await prisma.school.deleteMany({})

  // Create schools
  const schools = {
    SD: await prisma.school.create({
      data: {
        sch_name: 'Mekar Harapan Elementary',
        ed_level: 'SD',
        location: 'Jl. Kenanga No.1',
      },
    }),
    SMP: await prisma.school.create({
      data: {
        sch_name: 'EnumTest Academy',
        ed_level: 'SMP',
        location: 'Jl. Enum Street No.2',
      },
    }),
    SMA: await prisma.school.create({
      data: {
        sch_name: 'Nusantara Senior High',
        ed_level: 'SMA',
        location: 'Jl. Nusantara No.3',
      },
    }),
  }

  const roles = ['admin', 'teacher', 'student'] as const
  const hashedPasswords = {
    admin: await bcrypt.hash('admin123', 10),
    teacher: await bcrypt.hash('teacher123', 10),
    student: await bcrypt.hash('student123', 10),
  }

  // Create users
  const users = await Promise.all(
    (['SD', 'SMP', 'SMA'] as const).flatMap((level) =>
      roles.flatMap((role) =>
        Array.from({ length: 10 }).map((_, i) =>
          prisma.user.create({
            data: {
              username: `${role}_${level}_${i}`,
              email: `${role}.${level.toLowerCase()}${i}@example.com`,
              fullname: `${role.toUpperCase()} ${level} ${i}`,
              password: hashedPasswords[role],
              role,
              schoolId: schools[level].sch_id,
            },
          })
        )
      )
    )
  )

  const edLevels = ['SD', 'SMP', 'SMA'] as const
  const courses = await Promise.all(
    edLevels.flatMap((level) =>
      Array.from({ length: 10 }).map((_, i) => {
        const teacher = users.find(
          (u) => u.role === 'teacher' && u.schoolId === schools[level].sch_id
        )!
        return prisma.course.create({
          data: {
            name: `Course ${level} - ${i + 1}`,
            description: `Description for ${level} course ${i + 1}`,
            teacherId: teacher.user_id,
            schoolId: schools[level].sch_id,
            educationLevel: level,
            grade: (i % 12) + 1,
            enrollToken: generateToken(5),
          },
        })
      })
    )
  )

  // Enroll 10 students into courses (same school)
  await Promise.all(
    courses.map((course, i) => {
      const level = course.educationLevel
      const students = users.filter(
        (u) => u.role === 'student' && u.schoolId === schools[level].sch_id
      )
      return prisma.enrollment.create({
        data: {
          userId: students[i % students.length].user_id,
          courseId: course.id,
          schoolId: schools[level].sch_id,
        },
      })
    })
  )

  // Assignments
  for (const course of courses) {
    const level = course.educationLevel
    const assignment = await prisma.assignment.create({
      data: {
        courseId: course.id,
        title: `Assignment for ${course.name}`,
        description: 'Solve the problems',
        dueDate: new Date(Date.now() + 5 * 86400000),
      },
    })

    const contentTypes = ['TEXT', 'FILE', 'VIDEO', 'LINK'] as const
    await Promise.all(
      contentTypes.map((type) =>
        prisma.assignmentContent.create({
          data: {
            assignmentId: assignment.id,
            contentTitle: `Content (${type})`,
            contentType: type,
            contentData: `Data for ${type}`,
            filePath: type === 'FILE' ? '/files/example.pdf' : undefined,
          },
        })
      )
    )

    const student = users.find(
      (u) => u.role === 'student' && u.schoolId === schools[level].sch_id
    )!
    await prisma.assignmentSubmission.create({
      data: {
        assignmentId: assignment.id,
        userId: student.user_id,
        answerText: 'This is my answer',
        filesJson: JSON.stringify([{ name: 'answer.pdf', id: 'file1' }]),
      },
    })
  }

  // Modules
  for (const course of courses) {
    const module = await prisma.module.create({
      data: {
        courseId: course.id,
        title: `Module for ${course.name}`,
        description: 'Module description',
      },
    })

    const contentTypes = ['TEXT', 'FILE', 'VIDEO', 'LINK'] as const
    await Promise.all(
      contentTypes.map((type) =>
        prisma.moduleContent.create({
          data: {
            moduleId: module.id,
            contentTitle: `Content (${type})`,
            contentType: type,
            contentData: `Module Data ${type}`,
            filePath: type === 'FILE' ? '/files/module.pdf' : undefined,
          },
        })
      )
    )
  }

  // Quizzes
  const questionTypes = ['multiple_choice', 'checkbox_multiple', 'short_answer', 'true_false'] as const
  for (const course of courses) {
    const level = course.educationLevel
    const quiz = await prisma.quiz.create({
      data: {
        courseId: course.id,
        title: `Quiz for ${course.name}`,
        description: 'Quiz description',
        allowResubmission: true,
        deadline: new Date(Date.now() + 3 * 86400000),
        durationMinutes: 30,
      },
    })

    for (let i = 0; i < questionTypes.length; i++) {
      const question = await prisma.question.create({
        data: {
          quizId: quiz.id,
          questionText: `Question ${i + 1} (${questionTypes[i]})`,
          questionType: questionTypes[i],
        },
      })

      if (['multiple_choice', 'checkbox_multiple', 'true_false'].includes(question.questionType)) {
        await Promise.all(
          ['Option A', 'Option B'].map((text, index) =>
            prisma.answerOption.create({
              data: {
                questionId: question.id,
                text,
                isCorrect: index === 0,
              },
            })
          )
        )
      }

      const student = users.find(
        (u) => u.role === 'student' && u.schoolId === schools[level].sch_id
      )!
      await prisma.answer.create({
        data: {
          questionId: question.id,
          studentId: student.user_id,
          answerText: 'Answer text',
        },
      })
    }
  }

  // Posts
  await Promise.all(
    Array.from({ length: 10 }).map((_, i) =>
      prisma.post.create({
        data: {
          title: `Post ${i + 1}`,
          text: `This is post ${i + 1}`,
          courseId: courses[i % courses.length].id,
        },
      })
    )
  )

  // Game Scores
  for (const level of edLevels) {
    const student = users.find(
      (u) => u.role === 'student' && u.schoolId === schools[level].sch_id
    )!
    await Promise.all(
      Array.from({ length: 10 }).map((_, i) =>
        prisma.gameLiteracy.create({
          data: {
            userId: student.user_id,
            schoolId: schools[level].sch_id,
            score: 80 + i,
          },
        })
      )
    )
    await Promise.all(
      Array.from({ length: 10 }).map((_, i) =>
        prisma.gameNumeracy.create({
          data: {
            userId: student.user_id,
            schoolId: schools[level].sch_id,
            score: 85 + i,
          },
        })
      )
    )
  }

  console.log('✅ Full seeding with enum coverage completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

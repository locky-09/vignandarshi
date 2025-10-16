const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Setting up LearnSpace database...')

  try {
    // Test connection first
    await prisma.$connect()
    console.log('✅ Connected to MongoDB')

    // Create admin user
    try {
      const adminUser = await prisma.user.create({
        data: {
          email: 'admin@learnspace.com',
          name: 'Admin User',
          role: 'Admin',
          password: 'admin123',
        },
      })
      console.log('✅ Admin user created:', adminUser.name)
    } catch (error) {
      if (error.code === 'P2002') {
        console.log('ℹ️  Admin user already exists')
      } else {
        throw error
      }
    }

    // Create sample users
    const users = [
      { email: 'student1@learnspace.com', name: 'John Student', role: 'Student', password: 'student123' },
      { email: 'teacher1@learnspace.com', name: 'Jane Teacher', role: 'Faculty', password: 'teacher123' },
      { email: 'organizer1@learnspace.com', name: 'Bob Organizer', role: 'Organizer', password: 'organizer123' },
    ]

    for (const userData of users) {
      try {
        await prisma.user.create({ data: userData })
        console.log(`✅ Created user: ${userData.name}`)
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`ℹ️  User ${userData.name} already exists`)
        } else {
          console.log(`⚠️  Skipped user ${userData.name}: ${error.message}`)
        }
      }
    }

    // Create sample rooms
    const rooms = [
      { name: 'Room A101', capacity: 30, facilities: ['Projector', 'Whiteboard', 'Air Conditioning'] },
      { name: 'Room B202', capacity: 50, facilities: ['Smart Board', 'Sound System', 'Air Conditioning'] },
      { name: 'Room C303', capacity: 20, facilities: ['Projector', 'Whiteboard'] },
    ]

    for (const roomData of rooms) {
      try {
        await prisma.room.create({ data: roomData })
        console.log(`✅ Created room: ${roomData.name}`)
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`ℹ️  Room ${roomData.name} already exists`)
        } else {
          console.log(`⚠️  Skipped room ${roomData.name}: ${error.message}`)
        }
      }
    }

    console.log('\n🎉 Database setup completed successfully!')
    console.log('\n📋 Login Credentials:')
    console.log('   Admin: admin@learnspace.com / admin123')
    console.log('   Student: student1@learnspace.com / student123')
    console.log('   Teacher: teacher1@learnspace.com / teacher123')
    console.log('   Organizer: organizer1@learnspace.com / organizer123')
    console.log('\n🚀 Run "pnpm dev" to start the application!')

  } catch (error) {
    console.error('❌ Setup failed:', error.message)
    console.log('\n🔧 Troubleshooting:')
    console.log('1. Ensure MongoDB is running')
    console.log('2. Check DATABASE_URL in .env file')
    console.log('3. Run "pnpm db:generate" first')
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

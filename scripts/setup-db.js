const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Setting up database...')

  // Create initial admin user (using create instead of upsert)
  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@learnspace.com' }
    })
    
    if (!existingAdmin) {
      const adminUser = await prisma.user.create({
        data: {
          email: 'admin@learnspace.com',
          name: 'Admin User',
          role: 'Admin',
          password: 'admin123', // Change this in production
        },
      })
      console.log('Admin user created:', adminUser)
    } else {
      console.log('Admin user already exists')
    }
  } catch (error) {
    console.log('Admin user creation skipped (may already exist)')
  }

  // Create some sample users
  const sampleUsers = [
    {
      email: 'student1@learnspace.com',
      name: 'John Student',
      role: 'Student',
      password: 'student123',
    },
    {
      email: 'teacher1@learnspace.com',
      name: 'Jane Teacher',
      role: 'Faculty',
      password: 'teacher123',
    },
    {
      email: 'organizer1@learnspace.com',
      name: 'Bob Organizer',
      role: 'Organizer',
      password: 'organizer123',
    },
  ]

  for (const userData of sampleUsers) {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      })
      
      if (!existingUser) {
        await prisma.user.create({
          data: userData,
        })
        console.log(`Created user: ${userData.name}`)
      } else {
        console.log(`User ${userData.name} already exists`)
      }
    } catch (error) {
      console.log(`Skipped user ${userData.name} (may already exist)`)
    }
  }

  // Create some sample rooms
  const sampleRooms = [
    {
      name: 'Room A101',
      capacity: 30,
      facilities: ['Projector', 'Whiteboard', 'Air Conditioning'],
    },
    {
      name: 'Room B202',
      capacity: 50,
      facilities: ['Smart Board', 'Sound System', 'Air Conditioning'],
    },
    {
      name: 'Room C303',
      capacity: 20,
      facilities: ['Projector', 'Whiteboard'],
    },
  ]

  for (const roomData of sampleRooms) {
    try {
      const existingRoom = await prisma.room.findUnique({
        where: { name: roomData.name }
      })
      
      if (!existingRoom) {
        await prisma.room.create({
          data: roomData,
        })
        console.log(`Created room: ${roomData.name}`)
      } else {
        console.log(`Room ${roomData.name} already exists`)
      }
    } catch (error) {
      console.log(`Skipped room ${roomData.name} (may already exist)`)
    }
  }

  console.log('Database setup completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

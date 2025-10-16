const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function verifyConnection() {
  try {
    console.log('🔍 Testing MongoDB connection...')
    
    // Test basic connection
    await prisma.$connect()
    console.log('✅ MongoDB connection successful!')
    
    // Test database operations
    const userCount = await prisma.user.count()
    console.log(`✅ Database accessible - Found ${userCount} users`)
    
    // Test a simple query
    const users = await prisma.user.findMany({
      take: 1,
      select: { id: true, name: true, role: true }
    })
    
    if (users.length > 0) {
      console.log(`✅ Sample user found: ${users[0].name} (${users[0].role})`)
    } else {
      console.log('ℹ️  No users found - run "pnpm setup-db" to create initial data')
    }
    
    // Test room query
    const rooms = await prisma.room.findMany({
      take: 1,
      select: { name: true, capacity: true }
    })
    
    if (rooms.length > 0) {
      console.log(`✅ Sample room found: ${rooms[0].name} (${rooms[0].capacity} capacity)`)
    } else {
      console.log('ℹ️  No rooms found - run "pnpm setup-db" to create initial data')
    }
    
    console.log('\n🎉 MongoDB setup is working perfectly!')
    console.log('You can now run: pnpm dev')
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:')
    console.error(error.message)
    
    console.log('\n🔧 Troubleshooting steps:')
    console.log('1. Ensure MongoDB service is running')
    console.log('2. Check DATABASE_URL in .env file')
    console.log('3. Verify directory permissions for learnspace\\locky_09')
    console.log('4. Check if port 27017 is accessible')
    
  } finally {
    await prisma.$disconnect()
  }
}

verifyConnection()

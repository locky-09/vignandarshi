const { MongoClient } = require('mongodb')

async function configureReplicaSet() {
  console.log('🔧 Configuring MongoDB as replica set...')
  
  try {
    // Connect to MongoDB
    const client = new MongoClient('mongodb://localhost:27017')
    await client.connect()
    
    const admin = client.db().admin()
    
    // Check if already configured as replica set
    try {
      const status = await admin.command({ replSetGetStatus: 1 })
      console.log('✅ MongoDB is already configured as replica set')
      console.log('✅ Replica set name:', status.set)
      return true
    } catch (error) {
      console.log('ℹ️  MongoDB is not configured as replica set, configuring now...')
    }
    
    // Initialize replica set
    try {
      const result = await admin.command({
        replSetInitiate: {
          _id: 'rs0',
          members: [
            { _id: 0, host: 'localhost:27017' }
          ]
        }
      })
      
      console.log('✅ Replica set initialization initiated')
      console.log('⏳ Please wait 10-15 seconds for replica set to be ready...')
      
      // Wait a bit for replica set to initialize
      await new Promise(resolve => setTimeout(resolve, 15000))
      
      // Check status
      const status = await admin.command({ replSetGetStatus: 1 })
      console.log('✅ Replica set is ready!')
      console.log('✅ Set name:', status.set)
      console.log('✅ Members:', status.members.length)
      
      return true
      
    } catch (error) {
      if (error.message.includes('already initialized')) {
        console.log('✅ Replica set was already initialized')
        return true
      } else {
        throw error
      }
    }
    
  } catch (error) {
    console.error('❌ Failed to configure replica set:', error.message)
    console.log('\n🔧 Manual Configuration:')
    console.log('1. Stop MongoDB service')
    console.log('2. Edit mongod.cfg to add:')
    console.log('   replication:')
    console.log('     replSetName: "rs0"')
    console.log('3. Start MongoDB service')
    console.log('4. Run: mongosh --eval "rs.initiate()"')
    return false
  } finally {
    if (client) {
      await client.close()
    }
  }
}

configureReplicaSet()

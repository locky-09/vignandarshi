# MongoDB Replica Set Configuration

## The Issue
Prisma requires MongoDB to be configured as a replica set for write operations. Your standalone MongoDB installation needs this configuration.

## Solution Options

### Option 1: Automatic Configuration (Recommended)
```bash
# Install mongodb driver if not already installed
pnpm add mongodb

# Configure replica set automatically
pnpm configure-replica
```

### Option 2: Manual Configuration

#### Step 1: Stop MongoDB Service
```bash
# Stop MongoDB service
net stop MongoDB
```

#### Step 2: Edit MongoDB Configuration
1. Open: `C:\Program Files\MongoDB\Server\8.2\bin\mongod.cfg`
2. Add these lines under `net:` section:
```yaml
net:
  port: 27017
  bindIp: 127.0.0.1

# Add this section
replication:
  replSetName: "rs0"
```

#### Step 3: Start MongoDB Service
```bash
# Start MongoDB service
net start MongoDB
```

#### Step 4: Initialize Replica Set
```bash
# Connect to MongoDB and initialize replica set
mongosh --eval "rs.initiate()"
```

### Option 3: Alternative - Use MongoDB Atlas (Cloud)
If local configuration is complex, you can use MongoDB Atlas:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster
3. Get connection string
4. Update your `.env` file:
```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/learnspace"
```

## Verification
After configuration, verify it works:
```bash
pnpm verify-db
```

## Expected Output
```
✅ MongoDB connection successful!
✅ Database accessible - Found X users
✅ Replica set is ready!
```

## Troubleshooting

### If replica set configuration fails:
1. Ensure MongoDB service is running
2. Check if port 27017 is available
3. Verify user permissions
4. Try restarting MongoDB service

### If you prefer to skip replica set:
You can use MongoDB Atlas (cloud) instead of local MongoDB, which comes pre-configured as a replica set.

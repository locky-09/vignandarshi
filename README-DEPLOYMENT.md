# 🚀 Deployment Guide

## Quick Deploy to Vercel (Recommended)

### 1. Prepare Your Code
```bash
# Make sure all changes are committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your repository
5. Vercel will auto-detect Next.js

### 3. Set Environment Variables
In Vercel Dashboard → Project Settings → Environment Variables:

```
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/learnspace?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
```

### 4. Set Up MongoDB Atlas (Cloud Database)
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free account
3. Create new cluster (free tier)
4. Create database user
5. Get connection string
6. Update `DATABASE_URL` in Vercel

### 5. Configure MongoDB Atlas
1. In Atlas, go to Database → Connect
2. Choose "Connect your application"
3. Copy connection string
4. Replace `<password>` with your user password
5. Replace `<dbname>` with `learnspace`

## Alternative: Railway

### 1. Install Railway CLI
```bash
npm install -g @railway/cli
```

### 2. Deploy
```bash
railway login
railway init
railway up
```

### 3. Set Environment Variables
```bash
railway variables set DATABASE_URL="your-mongodb-connection-string"
railway variables set JWT_SECRET="your-jwt-secret"
```

## Environment Variables Needed

```env
# Database (use MongoDB Atlas for production)
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/learnspace?retryWrites=true&w=majority

# JWT Secret (generate a strong secret)
JWT_SECRET=your-super-secret-jwt-key-here

# Optional: Email configuration
EMAIL_SERVICE_ID=your-emailjs-service-id
EMAIL_TEMPLATE_ID=your-emailjs-template-id
EMAIL_PUBLIC_KEY=your-emailjs-public-key
```

## Production Checklist

- [ ] Set up MongoDB Atlas cluster
- [ ] Configure environment variables
- [ ] Test deployment URL
- [ ] Verify login works
- [ ] Check admin dashboard
- [ ] Test user creation
- [ ] Monitor API logs

## Troubleshooting

### Database Connection Issues
- Ensure MongoDB Atlas cluster is running
- Check connection string format
- Verify database user permissions

### Build Errors
- Check all imports are correct
- Ensure TypeScript compiles without errors
- Verify all dependencies are in package.json

### Runtime Errors
- Check environment variables are set
- Verify API routes are working
- Check browser console for errors

## Security Notes

- Change `JWT_SECRET` to a strong, random string
- Use MongoDB Atlas with proper authentication
- Consider adding rate limiting for production
- Enable HTTPS (automatic with Vercel/Railway)

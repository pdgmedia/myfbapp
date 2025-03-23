# Facebook Contest App - Deployment Guide for Vercel

This guide will walk you through deploying your Facebook Contest App to Vercel. This app has been specifically built for Vercel deployment and uses Prisma with PostgreSQL for the database.

## Prerequisites

- A Vercel account (free tier is fine)
- A PostgreSQL database (we recommend Neon, which has a generous free tier)
- A Facebook Developer account (for the Facebook API)

## Step 1: Set Up Your Database

1. **Create a PostgreSQL database**
   - Go to [Neon](https://neon.tech) and sign up for a free account
   - Create a new project
   - Copy your database connection string (it will look like `postgresql://user:password@hostname:port/database?sslmode=require`)

## Step 2: Deploy to Vercel

### Option 1: Deploy via Vercel Web Interface

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com) and log in
   - Click "Add New" > "Project"

2. **Import your repository**
   - If you've pushed the code to GitHub, select your repository
   - If not, click "Upload" and upload the zip file

3. **Configure project**
   - Framework Preset: Select "Next.js"
   - Root Directory: Leave as default (/)
   - Build Command: `prisma generate && prisma migrate deploy && next build`

4. **Add environment variables**
   - Click "Environment Variables"
   - Add a variable named `DATABASE_URL` with your PostgreSQL connection string
   - Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```
   npm install -g vercel
   ```

2. **Deploy the project**
   - Navigate to your project directory
   - Run `vercel`
   - Follow the prompts to log in and configure your project
   - When asked about environment variables, add your `DATABASE_URL`

## Step 3: Configure Your App

1. **Run database migrations**
   - The build command includes `prisma migrate deploy`, which will set up your database tables

2. **Set up Facebook API**
   - After deployment, visit your app URL
   - Go to the "Settings" page
   - Enter your Facebook Page Access Token
   - Save the token

## Step 4: Using Your App

1. **Create a contest**
   - Go to the "Contests" page
   - Click "New Contest"
   - Enter a name and the Facebook post ID
   - Click "Create"

2. **Process comments**
   - Open your contest
   - Click "Process Comments"
   - The app will automatically assign numbers to commenters

## Troubleshooting

- **Database connection issues**: Make sure your `DATABASE_URL` is correct and that your IP is allowed to connect to the database
- **Facebook API errors**: Ensure your access token has the correct permissions (pages_read_engagement, pages_manage_posts)
- **Build errors**: Check the Vercel build logs for any specific error messages

## Need Help?

If you encounter any issues during deployment, please refer to:
- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)

For specific questions about this app, please contact the developer who provided it to you.

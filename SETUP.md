# Setup Guide

## Quick Fix for Brand Creation Error

The error you're seeing is likely because the database tables haven't been created yet. Follow these steps:

### 1. Set up Supabase Database

1. Go to your Supabase dashboard: https://app.supabase.com/
2. Select your project: `itwgfbbyvjjsrybkqahv`
3. Go to **SQL Editor** in the left sidebar
4. Create a **New Query**
5. Copy and paste the entire contents of `database.sql` file
6. Click **Run** to execute the schema

### 2. Verify Environment Variables

Visit http://localhost:3002/debug to check if environment variables are loaded correctly.

### 3. Test Database Connection

Visit http://localhost:3002/test-db to test the database connection and permissions.

## Database Schema Summary

The schema creates these tables:
- `brands` - Store brand information
- `content_angles` - AI-generated content strategies  
- `content_ideas` - Platform-specific content ideas
- `generated_content` - Final generated content with images

## Common Issues & Solutions

### Issue: "relation 'brands' does not exist"
**Solution**: Run the database schema from `database.sql` in Supabase SQL Editor

### Issue: "new row violates row-level security policy"
**Solution**: Make sure RLS policies are created (included in database.sql)

### Issue: "User not authenticated" 
**Solution**: Make sure you're logged in at /login first

### Issue: Environment variables not found
**Solution**: Restart the dev server after updating .env.local

## Testing Steps

1. Restart your dev server: `npm run dev`
2. Visit http://localhost:3002/debug - ensure all env vars show ✅
3. Visit http://localhost:3002/test-db - test database connection
4. Go to /login and create an account
5. Try creating a brand

## Need Help?

If you're still having issues:
1. Check the browser console for detailed error messages
2. Check the Supabase dashboard logs
3. Verify your database schema is correctly applied
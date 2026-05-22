# Deployment (Vercel)

## 1) Push to Git
Ensure your repo is pushed to GitHub/GitLab/Bitbucket.

## 2) Create the Vercel project
- Go to https://vercel.com → **New Project**
- Import the repo
- Framework should auto-detect as **Next.js**

## 3) Set environment variables in Vercel
**Project → Settings → Environment Variables**

**App + Auth**
```
DATABASE_URL=...
DIRECT_DATABASE_URL=...
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FACEBOOK_CLIENT_ID=...
FACEBOOK_CLIENT_SECRET=...
APPLE_CLIENT_ID=...
APPLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

**R2**
```
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET=gear-images
```

## 4) Prisma client generation
`postinstall` already runs `prisma generate`.

## 5) Run production migrations
Vercel does not run `prisma migrate dev`. Run this from your machine or CI:
```
npx prisma migrate deploy
```

## 6) Deploy
Click **Deploy** in Vercel. After it finishes, verify:
- Sign-in flow
- Create + edit gear items
- Image upload + public gear showcase

## 7) Update OAuth providers
Ensure each OAuth provider has the Vercel URL registered as an allowed callback/redirect URL.

# Al Haddaf Mobile Car Wash 🚗✨

A premium, high-performance web application for Al Haddaf Mobile Car Wash, built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM** with **PostgreSQL**.

## Features

- **Dynamic Public Pages:** SEO-optimized, highly engaging landing pages for Services, Areas, and Blogs.
- **Admin Dashboard:** Full CMS to manage Services, Service Areas, Blog Posts, Reviews, and FAQs.
- **Rich Text Editing:** Integrated TipTap editor for managing blog posts and descriptions.
- **Drag and Drop:** Sortable interfaces using `@dnd-kit` for ordering services and areas.
- **Authentication:** Secure login for administrators using NextAuth v5.
- **Responsive Design:** Premium UI optimized for all devices, featuring Framer Motion micro-animations.
- **Serverless Database:** Fully compatible with serverless Edge environments utilizing Prisma PostgreSQL Adapter.

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/)
- **Language:** TypeScript
- **Database:** PostgreSQL (hosted via Supabase)
- **ORM:** [Prisma](https://www.prisma.io/) (with `@prisma/adapter-pg`)
- **Styling:** Tailwind CSS + custom UI components
- **Auth:** NextAuth.js (v5)

## Local Development

### 1. Prerequisites
- Node.js (v20+)
- npm or pnpm
- PostgreSQL Database URL

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Copy the example environment file and fill in your details:
```bash
cp .env.example .env
```
Ensure you have the following variables set in your `.env` file:
- `DATABASE_URL` (Connection pool URL)
- `DIRECT_URL` (Direct connection for Prisma migrations)
- `AUTH_SECRET` (A strong random secret for NextAuth)
- `ADMIN_EMAIL` & `ADMIN_PASSWORD` (For the initial admin account)

### 4. Database Setup
Generate the Prisma client and push the schema to your database:
```bash
npm run postinstall
npx prisma db push
```

*(Optional)* Seed the database with initial data:
```bash
npx prisma db seed
```

### 5. Start Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` to view the app. The admin portal is located at `/admin`.

## Production Deployment (Vercel)

This project is optimized for deployment on Vercel.

1. **Push to GitHub:** Ensure your code is pushed to your `main` branch.
2. **Import Project:** Import the repository into your Vercel account.
3. **Set Environment Variables:** Add `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` to your Vercel Project Settings -> Environment Variables.
4. **Deploy:** Vercel will automatically detect Next.js. The `postinstall` script (`prisma generate`) will run automatically to build the Prisma client.
5. **Verify:** Once deployed, your app will be securely served on the edge!

## License
Private Property of Al Haddaf. All rights reserved.

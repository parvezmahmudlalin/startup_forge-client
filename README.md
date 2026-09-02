# StartupForge — Client

StartupForge is a startup team-building platform that connects founders with developers, designers, marketers, and other collaborators.

This repository contains the frontend application built with Next.js.

## Live Site

https://startupforge-app.vercel.app

## Features

* Role-based Founder, Collaborator & Admin dashboards
* Startup and opportunity management
* Opportunity search, filtering & pagination
* Application management
* Better Auth with Google & credential login
* Protected routes and JWT-based API access
* Stripe payment integration
* Profile management
* Responsive UI with light/dark theme
* Loading, error and custom 404 states
* Framer Motion animations

## Tech Stack

* Next.js
* React
* Tailwind CSS
* HeroUI
* Framer Motion
* Better Auth
* JWT
* Stripe
* MongoDB

## Installation

```bash
git clone https://github.com/parvezmahmudlalin/startup_forge-client.git
cd startup_forge-client
npm install
```

Create `.env.local` and configure the required environment variables.

```env
NEXT_PUBLIC_SERVER_URL=
NEXT_PUBLIC_IMGBB_API_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Related Repository

**Server:**
https://github.com/parvezmahmudlalin/startup_forge-server
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

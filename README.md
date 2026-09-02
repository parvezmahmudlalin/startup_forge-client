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

Create a `.env.local` file and configure the required environment variables:

```env
NEXT_PUBLIC_SERVER_URL=
NEXT_PUBLIC_IMGBB_API_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

Start the development server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

## Related Repository

**Server:**
https://github.com/parvezmahmudlalin/startup_forge-server

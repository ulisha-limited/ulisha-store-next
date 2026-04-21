> # Ulisha Store Next (Deprecated)

A modern and efficient e-commerce solution tailored for startups, enabling seamless setup and free hosting on Vercel and Supabase Cloud.

[![CI Build](https://github.com/ulisha-limited/ulisha-store-next/actions/workflows/ci-build.yml/badge.svg)](https://github.com/ulisha-limited/ulisha-store-next/actions/workflows/ci-build.yml)


# Project Migration Notice

## Ulisha Store Next → Ulisha Store Laravel

The **ulisha-store-next** project is now officially **deprecated** and will be migrated to **ulisha-store-laravel**.

### No Further Updates
Effective immediately:
- No new features will be added  
- No bug fixes will be implemented  
- No maintenance or support will be provided  

This repository is now **archived in place** and should be considered **read-only** moving forward.

### Migration Direction
All future development, improvements, and support will continue under:

> **ulisha-store-laravel**

### Why the Migration?
This decision was made after evaluating architectural, scalability, and long-term maintenance concerns encountered in the Next.js implementation.  

For a full breakdown of the issues and lessons learned, read:  
👉 https://www.melvinjonesrepol.com/blog/ulisha-store-next-to-laravel-what-did-go-wrong

### Licensing Notice
- Both projects are based on the **Polyform Noncommercial License 1.0.0**
- **ulisha-store-next** remains available under this license for reference use  
- **ulisha-store-laravel** is **closed source**  
- A **separate license is required** to access or use the Laravel version
- A open-source migration program to automatically migrate database will be released

### More Information
For more details about the Laravel project, visit:  
👉 https://www.melvinjonesrepol.com/ulisha-store-laravel

### What You Should Do
- Start using **ulisha-store-laravel** for all new deployments  
- Avoid building on top of **ulisha-store-next**  
- Plan migration of existing setups as soon as possible  

---

**Note:** This repository will remain available for reference purposes only.

## Prerequisites

- Node.js
- Supabase (requires Docker)
- Google ReCaptcha
- MixPay (Payment)
- PayStack (Payment)
- Sentry (Optional)

## Supabase

First by creating a supabase cloud project:

- go to [Supabase Dashboard](https://app.supabase.com)
- click `New Project`
- choose:
  - Organization → (create one if needed)
  - Project Name → e.g. super-ulisha-store-app
  - Database Password → choose a secure one
  - Region → pick the nearest location
- Click Create new project
- Wait a few moments for the database to be provisioned.

## Setup Environment

Copy the .env.example to .env

```bash
cp .env.example .env
```

| Variable                        | Description                                                          | Location                                                 |
| ------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL (e.g., `https://<project-id>.supabase.co`) | **Supabase Project → Settings → General → Project URL**  |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anonymous key for client-side access                          | **Supabase Project → Settings → API → Project API Keys** |
| `SUPABASE_SERVICE_ROLE_KEY`     | Service role key for server-side access (⚠️ keep this private!)      | **Supabase Project → Settings → API → Project API Keys** |

Login first (if you haven't):

```bash
npx supabase login
```

Link the cloud project to this local one:

```bash
npx supabase link
```

It'll show the list of project you have select your project.

Push migrations to cloud:

```bash
npx supabase db push
```

Pull migrations from cloud:

```bash
npx supabase db pull
```

Updating types (if you ever changed migrations):

```bash
npx supabase gen types typescript --project-id <project-id> --schema public > src/supabase-types.ts
```

Creating a bucket:

- Go to your project storage -> buckets
- Create new bucket name `product-images`

Seed the database:

```bash
npm run db:seed
```

## Development Server

To start a local development server, run:

```bash
npm run dev
```

Once the server is running, open your browser and navigate to `http://localhost:4000/`. The application will automatically reload whenever you modify any of the source files.

## Building

To build the project run:

```bash
npm run  build
```

This will compile your project and store the build artifacts in the dist/ directory. By default, the production build optimizes your application for performance and speed.

## License

This project is licensed under the [Polyform Noncommercial License 1.0.0](LICENSE).

&copy; 2025 Ulisha Limited.

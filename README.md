# Awang OfficiaL Portfolio

React + Vite portfolio website with an admin dashboard, project management, comments, contact form, and social links.

## Project structure

- `src/` contains the application components and pages.
- `public/` contains public images, animations, icons, and static assets.
- `database/comment-setup.sql` configures the portfolio comment system and its dedicated image bucket.

## Environment variables

Configure these values in the deployment provider's project environment settings. Keep real secrets out of the repository and ZIP archives.

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
VITE_CONTACT_EMAIL=your-email@example.com
```

The contact form also supports the existing compatibility aliases in `src/Pages/Contact.jsx` when the primary `VITE_CONTACT_EMAIL` value is not set.

## Supabase resources

Project records use `public.portfolio_projects`; project images use the `portfolio-project-images` storage bucket. Comment records use `public.portfolio_comments`; comment avatars use `portfolio-profile-images`.

The portfolio may share a Supabase project with other applications. Keep the portfolio's tables, storage buckets, and policies isolated. Do not run general-purpose SQL that creates, renames, or changes shared tables or buckets.

For the portfolio comment feature, `database/comment-setup.sql` contains the dedicated setup. Review it before running it in Supabase SQL Editor. The administrator's user ID must be present in `public.portfolio_admins` with the expected admin role. Never put a Supabase service-role key in frontend code.

## Build

Requires Node.js 18 or newer and npm.

```bash
npm install --legacy-peer-deps
npm run build
```

Vite writes the production build to `dist/`. The hosted site is deployed through the configured GitHub/Vercel integration.

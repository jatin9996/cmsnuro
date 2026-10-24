# Dr. Kairav Shah — clinic website and CMS

A Next.js website for a neurosurgery practice, with an admin panel for the pages, photographs, videos, and appointment diary. It follows the supplied homepage design and replaces a WordPress setup with one app.

## Run it

```bash
npm run setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The admin panel is at [http://localhost:3000/admin](http://localhost:3000/admin).

Sample sign-in, for local use only:

- Email: `admin@kairavshah.local`
- Password: `Admin@12345`

Change that password from **Admin → Site settings** before anyone else can reach the site.

## What the admin can edit

- Site name, phone, WhatsApp, homepage text, portrait, and social links
- Google title, description, keywords, share image, verification, and custom meta tags
- Hero slides, statistics, conditions, patient stories, achievements
- Videos (MP4/WEBM upload, or a YouTube/Vimeo link) and gallery photographs
- Blog posts, press mentions, Instagram-style updates, and extra pages
- Appointment requests: confirm, complete, cancel, and keep private notes
- Messages from the contact form

Cancelling or completing a visit frees that time slot. Pending and confirmed visits block it.

## Before this goes live

The portrait, patient quotes, statistics, and press names are **sample content** so the design can be reviewed. Replace them with the doctor's photograph, consented stories, and real figures. Have a lawyer review Privacy and Terms. The phone number and email in the sample are placeholders.

## Deploy on Vercel

The SQLite file on your computer is not uploaded. Vercel needs Postgres.

1. In the Vercel project, open **Storage** and create a **Postgres** database (Neon). Connect it to this project.
2. Under **Settings → Environment Variables**, confirm these exist for Production:
   - `DATABASE_URL` — the pooled connection string
   - `DIRECT_URL` — the direct, non-pooled connection string
   - `AUTH_SECRET` — a new random string of at least 32 characters
   - `NEXT_PUBLIC_SITE_URL` — the live site URL, such as `https://your-site.vercel.app`
3. Leave the build command as `npm run build`. The build creates the tables and loads the sample content, including the admin user.
4. Redeploy. Open `https://your-site.vercel.app/admin/login`.

Sample sign-in after that first deploy:

- Email: `admin@kairavshah.local`
- Password: `Admin@12345`

Change the password under **Admin → Site settings** immediately.

Video and image uploads are stored on the server disk, which Vercel does not keep. Use a YouTube or Vimeo link for videos until file storage is added.

`npm run db:reset` deletes the local database and loads the sample content again.

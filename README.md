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
- Hero slides, statistics, conditions, patient stories, achievements
- Videos (MP4/WEBM upload, or a YouTube/Vimeo link) and gallery photographs
- Blog posts, press mentions, Instagram-style updates, and extra pages
- Appointment requests: confirm, complete, cancel, and keep private notes
- Messages from the contact form

Cancelling or completing a visit frees that time slot. Pending and confirmed visits block it.

## Before this goes live

The portrait, patient quotes, statistics, and press names are **sample content** so the design can be reviewed. Replace them with the doctor's photograph, consented stories, and real figures. Have a lawyer review Privacy and Terms. The phone number and email in the sample are placeholders.

For a public server, move off the local SQLite file:

1. Change `provider` in `prisma/schema.prisma` to `postgresql`.
2. Set `DATABASE_URL` and a new `AUTH_SECRET` (at least 32 characters).
3. Run `npx prisma db push` and create an admin user.
4. Put video files on object storage if they will be large. YouTube or Vimeo links already work.

`npm run db:reset` deletes the local database and loads the sample content again.

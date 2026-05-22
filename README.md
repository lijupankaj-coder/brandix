# Brandix

Brandix is a Nebulix SaaS app for generating professional brand kits with colors, typography, voice, taglines, social bios, logo usage rules, and downloadable brand guideline exports.

## Local Setup

```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

Default seeded admin:

```text
Email: hello@nebulixcloud.com
Password: change-this-local-password
```

## Deployment

Use the included Dockerfile. Set `DATABASE_URL` and a real `BRANDIX_ADMIN_PASSWORD` in production.
Set `NEXT_PUBLIC_APP_URL` to the production URL so password reset links point to the correct domain.

For Google login, create an OAuth 2.0 Web Client in Google Cloud Console and add this redirect URI:

```text
http://localhost:3000/api/auth/google/callback
```

For production, add the same callback path on your production domain and set:

```env
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

Uploaded logos are stored under `public/uploads/logos` in the local/Docker filesystem. For multi-instance production, swap this storage layer for S3, Supabase Storage, or another shared object store.

```bash
npm run build
npm run start
```

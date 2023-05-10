This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To test Apple pay:

Start ngrok

```
ngrok http 3000
```

Add the ngrok domain to the approved domains on Stripe's dashboard

Example: `https://d497-38-95-108-171.ngrok.io`

Access the page with the ngrok url instead of localhost

Environment variables:

```
APP_SECRET=[REDACTED]
APP_ID=[REDACTED]
API_ENDPOINT=[VIOLET_API_ENDPOINT. Ex: https://sandbox-api.violet.io]
REFRESH_TOKEN=[VIOLET REFRESH TOKEN]
```

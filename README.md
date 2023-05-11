# Violet NextJS Demo App

## Important

This is a demo app that shows how to use Violet's Checkout API. It should not be deployed to production without adding user authentication to prevent malicious use.

## Getting Started

1. Sign up at https://channel.violet.io/signup and create an app to get your app ID and app secret.

2. Login with the instructions here to retrieve your refresh token https://docs.violet.io/postman-login

Environment variables:

```
APP_SECRET=[REDACTED]
APP_ID=[REDACTED]
API_ENDPOINT=[VIOLET_API_ENDPOINT. Ex: https://sandbox-api.violet.io]
REFRESH_TOKEN=[VIOLET REFRESH TOKEN]
```

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## (Optional) Testing Apple pay:

Start ngrok

```
ngrok http 3000
```

Add the ngrok domain to the approved domains on Stripe's dashboard

Example: `https://d497-38-95-108-171.ngrok.io`

Access the page with the ngrok url instead of localhost

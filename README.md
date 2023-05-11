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

Apple Pay and other wallet-based Payment Methods have already been built into checkout for this sample application. To enable these, you will need to do the following:

Run the app through https using ngrok

```
nrgrok http 3000
```


This will give you a path that routes to your local running instance of the store. Google Pay and other wallet-based payment methods should now be enabled by default when you navigate through checkout.

To enable Apple Pay on compatible devices, an extra step is needed:

Reach out to support@violet.io with the following email:

```
Hi Team Violet,

This is <INTRODUCTION> using the Violet ULTRA Sample App. Please enable this domain for Apple Pay: 

<ENTER YOUR NGROK PATH HERE Example: `https://d497-38-95-108-171.ngrok.io`>

Thank you! 

<YOUR_NAME>

Hi Team Violet,

This is <INTRODUCTION> using the Violet ULTRA Sample App. Please enable this domain for Apple Pay: 

<ENTER YOUR NGROK PATH HERE>

Thank you! 

<YOUR_NAME>
```

Access the page with the ngrok url instead of localhost

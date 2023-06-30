# Violet NextJS Demo App

## Important

This is a demo app that shows how to use Violet's Checkout API. It should not be deployed to production without adding user authentication to prevent malicious use.

## Getting Started

1. Sign up at https://channel.violet.io/signup and create an app to get your app ID and app secret.

2. Login with the instructions [here](https://docs.violet.io/postman-login) to retrieve your refresh token

More information about the demo app [here](https://docs.violet.io/violet-sample-app-the-ultra-store)

## Environment variables:

Create a .env file in the project root directory and use the following template for the environment variables:

```
APP_SECRET=[REDACTED]
APP_ID=[REDACTED]
API_ENDPOINT=https://sandbox-api.violet.io
REFRESH_TOKEN=[VIOLET REFRESH TOKEN]
EXCLUDE_PUBLIC_OFFERS=true|false
```

Make sure to replace [REDACTED] and [VIOLET REFRESH TOKEN] with the appropriate values.

## Starting the Development Server

### Minimum Node version: 16.0.0

### Install dependencies

```bash
npm install
```

### Start the server

```bash
npm run dev
```

This command will launch the Next.js development server and make your application accessible at [http://localhost:3000](http://localhost:3000).

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

```

Access the page with the ngrok url instead of localhost

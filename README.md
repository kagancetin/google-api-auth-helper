# @kagancetin/google-api-auth-helper

A lightweight, framework-agnostic utility designed to simplify the Google OAuth2 flow. It helps you generate authorization URLs and exchange authorization codes for Access Tokens and Refresh Tokens with minimal boilerplate.

## Why This Package?
Managing OAuth2 flows manually can be tedious. This helper is built to solve three main problems:

- Automate Token Exchange: Convert authorization codes into tokens without writing complex googleapis logic.
- Persistent Storage: Use the onTokenSave callback to instantly save tokens to your database (MongoDB, PostgreSQL, Redis, etc.).
- SMTP Alternative: Ideal for applications on platforms like DigitalOcean or AWS where standard SMTP ports are blocked. Use this to get tokens and send emails via the Gmail API instead.

## Installation

```bash
npm install @kagancetin/google-api-auth-helper
```

## Usage Examples

### 1. Express.js Implementation
```js
const { GoogleApiAuthHelper } = require('@kagancetin/google-api-auth-helper');
const express = require('express');

const helper = new GoogleApiAuthHelper({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: 'http://localhost:3000/callback',
  onTokenSave: async (tokens) => {
    // Logic to save tokens to your database (e.g., MongoDB, PostgreSQL)
    console.log('Received Tokens:', tokens);
  }
});

const app = express();
const handlers = helper.expressHandler();

// Routes
app.get('/auth', handlers.auth);
app.get('/callback', handlers.callback);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
```

### 2. Next.js (App Router) Implementation

```ts
// app/api/auth/route.ts
import { GoogleApiAuthHelper } from '@kagancetin/google-api-auth-helper';
import { NextResponse } from 'next/server';

const helper = new GoogleApiAuthHelper({ /* your config */ });

export async function GET() {
  const url = helper.getAuthUrl();
  return NextResponse.json({ url });
}

// app/api/callback/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (code) {
    const tokens = await helper.handleCallback(code);
    return NextResponse.json({ success: true, tokens });
  }
  return NextResponse.json({ error: 'Authorization code not found' }, { status: 400 });
}
```

## Configuration Options

| Option         |  Type    |                Description                                       |
|----------------|:--------:|------------------------------------------------------------------|
| clientId       | string   |   Required. Your Google Client ID from Cloud Console.            |
| clientSecret   | string   |   Required. Your Google Client Secret from Cloud Console.        |
| redirectUri    | string   |   Required. Must match your Google Console configuration.        |
| scopes         | string[] |   (Optional) Array of scopes. Defaults to gmail.send.            |
| onTokenSave    | Function |   (Optional) Async callback triggered when tokens are received.  |

## 🗝️ Google Cloud Setup (2026 Update)

To get your CLIENT_ID and CLIENT_SECRET, follow the updated workflow in the Google Cloud Console:

### 1. Create a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click on the project dropdown and select **"New Project"**.
3. Name your project (e.g., `gmail-token-helper`) and click **Create**.

### 2. Enable Gmail API
1. Navigate to **APIs & Services > Library**.
2. Search for **"Gmail API"**.
3. Click on it and select **Enable**.

### 3. Configure OAuth Consent Screen
1. Go to **APIs & Services > Google Auth Platform** (or OAuth consent screen).
2. Set **User Type** to **External**.
3. **Branding:** Fill in the App Name and Support Email.
4. **Audience:** Add your email address under **Test Users** (This is required while the app is in 'Testing' mode).
5. **Data Access (Scopes):** Add the following scope for Gmail access:
   - `https://www.googleapis.com/auth/gmail.readonly`

### 4. Create Credentials
1. Navigate to the **Clients** (or Credentials) tab.
2. Click **Create Client** and select **OAuth client ID**.
3. Choose **Application type** (e.g., *Web Application* or *Desktop App*).
4. If Web: Add your **Authorized Redirect URIs** (e.g., `http://localhost:5000/callback`).
5. Click **Create** to receive your:
   - `CLIENT_ID`
   - `CLIENT_SECRET`

### 5. Environment Setup
Create a `.env` file in your root directory and add the credentials:

```env
CLIENT_ID=your_client_id_here
CLIENT_SECRET=your_client_secret_here
REDIRECT_URI=http://localhost:5000/callback
```

> **⚠️ Security Note:** Never commit your `.env` file or actual `CLIENT_SECRET` to GitHub. Ensure `.env` is added to your `.gitignore` file.

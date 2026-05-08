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
| scopes         | string[] |   (Optional) Array of scopes.           |
| onTokenSave    | Function |   (Optional) Async callback triggered when tokens are received.  |

## 🗝️ Google Cloud Setup (2026 Update)

To get your CLIENT_ID and CLIENT_SECRET, follow the updated workflow in the Google Cloud Console:

### 1. Project: Create a project at Google Cloud Console.

### 2. Library: Search for and Enable the specific API you need (e.g., Gmail API, Google Drive API).

### 3. Google Auth Platform (OAuth Consent):
1. Configure your internal/external user type.
2. Important (2026 UI): Ensure you add your email to Test Users while in Testing mode.
3. Add required Scopes (e.g., .../auth/gmail.send).

### 4. Clients (Credentials):
1. Create an OAuth client ID.
2. Add your Authorized Redirect URIs (Must match your redirectUri config exactly).

`Tip`: In the 2026 Google Cloud UI, the "OAuth Consent Screen" is often found under the "Google Auth Platform" tab.

```env
CLIENT_ID=your_client_id_here
CLIENT_SECRET=your_client_secret_here
REDIRECT_URI=http://localhost:3000/callback
```

> **⚠️ Security Note:** Never commit your `.env` file or actual `CLIENT_SECRET` to GitHub. Ensure `.env` is added to your `.gitignore` file.

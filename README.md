# gmail-token-helper

A lightweight, framework-agnostic OAuth2 helper to easily obtain and manage Gmail tokens. Perfect for server-side applications running on environments where SMTP ports are blocked (like DigitalOcean, AWS, etc.).

## Features
- 🚀 **Framework Agnostic**: Works with Express, Next.js, Fastify, or Vanilla Node.js.
- 🔐 **OAuth2 Simplified**: Handles the "Code to Token" exchange seamlessly.
- 💾 **Flexible Storage**: Use the `onTokenSave` callback to save tokens to MongoDB, Redis, or a local file.
- 🔄 **Auto-refresh Ready**: Designed to work with `access_type: offline` to ensure you get a `refresh_token`.

## Installation

```bash
npm install gmail-token-helper


## 🗝️ Google OAuth2 Configuration Guide

To use this application with the Gmail API, you need to obtain credentials from the Google Cloud Console. Follow these steps:

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

### Pro-Tip for your README:
If you are planning to distribute this as an NPM package or a tool for others, you might want to add a small **Security Note** at the bottom:

> **⚠️ Security Note:** Never commit your `.env` file or actual `CLIENT_SECRET` to GitHub. Ensure `.env` is added to your `.gitignore` file.

How does this look for your project? Need any specific technical sections added?
// examples/express-app/index.js
require('dotenv').config();
const express = require('express');
const { GmailTokenHelper } = require('gmail-token-helper');
const PORT = 5001;
const app = express();

// Initialize the helper
const helper = new GmailTokenHelper({
  clientId: process.env.GMAIL_CLIENT_ID,
  clientSecret: process.env.GMAIL_CLIENT_SECRET,
  redirectUri: process.env.GMAIL_REDIRECT_URI || `http://localhost:${PORT}/oauth2callback`,
  onTokenSave: async (tokens) => {
    console.log('--- STORAGE CALLBACK TRIGGERED ---');
    console.log('Save these to your DB:', JSON.stringify(tokens, null, 2));
    console.log('---------------------------------');
  }
});

const handlers = helper.expressHandler();

// Routes
app.get('/auth/google', handlers.auth);
app.get('/oauth2callback', handlers.callback);

// Simple landing page with a button
app.get('/', (req, res) => {
  res.send(`
    <h1>Gmail Token Helper Test</h1>
    <button onclick="window.location.href='/auth/google'">Get New Token</button>
  `);
});


app.listen(PORT, () => {
  console.log(`Test app is running at http://localhost:${PORT}`);
});
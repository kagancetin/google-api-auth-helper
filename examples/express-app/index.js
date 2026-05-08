// examples/express-app/index.js
require('dotenv').config();
const express = require('express');
const { googleApiAuthHelper } = require('@kagancetin/google-api-auth-helper');
const PORT = 5001;
const app = express();

// Initialize the helper
const helper = new googleApiAuthHelper({
  clientId: process.env.GOOGLEAPI_CLIENT_ID,
  clientSecret: process.env.GOOGLEAPI_CLIENT_SECRET,
  redirectUri: process.env.GOOGLEAPI_REDIRECT_URI || `http://localhost:${PORT}/oauth2callback`,
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
    <h1>GOOGLE API Token Helper Test</h1>
    <button onclick="window.location.href='/auth/google'">Get New Token</button>
  `);
});


app.listen(PORT, () => {
  console.log(`Test app is running at http://localhost:${PORT}`);
});
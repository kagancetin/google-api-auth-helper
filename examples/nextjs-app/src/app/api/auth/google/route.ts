import { GmailTokenHelper } from '@kagancetin/google-api-auth-helper';
import { NextResponse } from 'next/server';

const helper = new GmailTokenHelper({
  clientId: process.env.GMAIL_CLIENT_ID!,
  clientSecret: process.env.GMAIL_CLIENT_SECRET!,
  redirectUri: process.env.GMAIL_REDIRECT_URI!,
});

export async function GET() {
  const url = helper.getAuthUrl();
  return NextResponse.json({ url });
}
import { googleApiAuthHelper } from '@kagancetin/google-api-auth-helper';
import { NextResponse } from 'next/server';

const helper = new googleApiAuthHelper({
  clientId: process.env.GOOGLEAPI_CLIENT_ID!,
  clientSecret: process.env.GOOGLEAPI_CLIENT_SECRET!,
  redirectUri: process.env.GOOGLEAPI_REDIRECT_URI!,
});

export async function GET() {
  const url = helper.getAuthUrl();
  return NextResponse.json({ url });
}
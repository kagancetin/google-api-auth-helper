import { googleApiAuthHelper } from '@kagancetin/google-api-auth-helper';
import { NextResponse } from 'next/server';

const helper = new googleApiAuthHelper({
  clientId: process.env.GOOGLEAPI_CLIENT_ID!,
  clientSecret: process.env.GOOGLEAPI_CLIENT_SECRET!,
  redirectUri: process.env.GOOGLEAPI_REDIRECT_URI!,
  onTokenSave: async (tokens) => {
    console.log('--- NEXT.JS CALLBACK ---');
    console.log('Tokens:', tokens);
  }
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) return NextResponse.json({ error: 'No code' }, { status: 400 });

  try {
    const tokens = await helper.handleCallback(code);
    return NextResponse.json({ success: true, tokens });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
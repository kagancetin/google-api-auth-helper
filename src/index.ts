import { Console } from 'console';
import { google } from 'googleapis';

export interface GmailAuthOptions {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes?: string[];
  onTokenSave?: (tokens: any) => Promise<void> | void;
}

export class GmailTokenHelper {
  private oAuth2Client: any;
  private scopes: string[];
  private onTokenSave?: (tokens: any) => Promise<void> | void;

  constructor(options: GmailAuthOptions) {
    this.oAuth2Client = new google.auth.OAuth2(
      options.clientId,
      options.clientSecret,
      options.redirectUri,      
    );
    this.scopes = options.scopes || ['https://www.googleapis.com/auth/gmail.send'];
    this.onTokenSave = options.onTokenSave;
  }
  
  public getAuthUrl(): string {
    return this.oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: this.scopes,
      prompt: "consent"
    });
  }

  public async handleCallback(code: string) {
    const { tokens } = await this.oAuth2Client.getToken(code);
    if (this.onTokenSave) {
      await this.onTokenSave(tokens);
    }
    return tokens;
  }

  public expressHandler() {
    return {
      auth: (req: any, res: any) => res.json({ url: this.getAuthUrl() }),
      callback: async (req: any, res: any) => {
        try {
          const tokens = await this.handleCallback(req.query.code as string);
          res.json({ message: "Success", tokens });
        } catch (err: any) {
          res.status(500).json({ error: err.message });
        }
      }
    };
  }
}
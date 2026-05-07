export interface GmailAuthOptions {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    scopes?: string[];
    onTokenSave?: (tokens: any) => Promise<void> | void;
}
export declare class GmailTokenHelper {
    private oAuth2Client;
    private onTokenSave?;
    constructor(options: GmailAuthOptions);
    getAuthUrl(): string;
    handleCallback(code: string): Promise<any>;
    expressHandler(): {
        auth: (req: any, res: any) => any;
        callback: (req: any, res: any) => Promise<void>;
    };
}

export interface GoogleApiAuthOptions {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    scopes?: string[];
    onTokenSave?: (tokens: any) => Promise<void> | void;
}
export declare class googleApiAuthHelper {
    private oAuth2Client;
    private scopes;
    private onTokenSave?;
    constructor(options: GoogleApiAuthOptions);
    getAuthUrl(): string;
    handleCallback(code: string): Promise<any>;
    expressHandler(): {
        auth: (req: any, res: any) => any;
        callback: (req: any, res: any) => Promise<void>;
    };
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleApiAuthHelper = void 0;
const googleapis_1 = require("googleapis");
class googleApiAuthHelper {
    constructor(options) {
        this.oAuth2Client = new googleapis_1.google.auth.OAuth2(options.clientId, options.clientSecret, options.redirectUri);
        this.scopes = options.scopes || ['https://www.googleapis.com/auth/gmail.send'];
        this.onTokenSave = options.onTokenSave;
    }
    getAuthUrl() {
        return this.oAuth2Client.generateAuthUrl({
            access_type: "offline",
            scope: this.scopes,
            prompt: "consent"
        });
    }
    async handleCallback(code) {
        const { tokens } = await this.oAuth2Client.getToken(code);
        if (this.onTokenSave) {
            await this.onTokenSave(tokens);
        }
        return tokens;
    }
    expressHandler() {
        return {
            auth: (req, res) => res.json({ url: this.getAuthUrl() }),
            callback: async (req, res) => {
                try {
                    const tokens = await this.handleCallback(req.query.code);
                    res.json({ message: "Success", tokens });
                }
                catch (err) {
                    res.status(500).json({ error: err.message });
                }
            }
        };
    }
}
exports.googleApiAuthHelper = googleApiAuthHelper;
//# sourceMappingURL=index.js.map
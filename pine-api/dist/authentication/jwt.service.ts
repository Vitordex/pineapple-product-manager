import jwt, { VerifyOptions, SignOptions, VerifyCallback, SignCallback } from "jsonwebtoken";

export class JwtService {
    private hash: string;
    private expiration?: string;
    private subject: string;

    constructor(hash: string, subject: string, tokenExpiration?: string) {
        this.expiration = tokenExpiration;
        this.hash = hash;
        this.subject = subject;
    }

    public verify(token: string): string | object {
        const options: VerifyOptions = {
            ignoreExpiration: !this.expiration,
            maxAge: this.expiration,
            subject: this.subject
        };
        
        const result: Promise<string | object> = new Promise((resolve, reject) => {
            const verifyCallback: VerifyCallback = (err: Error, decoded: string | object) => {
                if(err) return reject(err);

                resolve(decoded);
            };

            jwt.verify(token, this.hash, options, verifyCallback);
        });

        return result;
    }

    public generate(payload: object = {}): string | object {
        const options : SignOptions = {
            subject: this.subject
        };

        if(!!this.expiration) options.expiresIn = this.expiration;
    
        const result: Promise<string> = new Promise((resolve, reject) => {
            const signCallback: SignCallback = (err: Error, encoded: string) => {
                if(err) return reject(err);

                resolve(encoded);
            };

            jwt.sign(payload, this.hash, options, signCallback);
        });

        return result;
    }
}

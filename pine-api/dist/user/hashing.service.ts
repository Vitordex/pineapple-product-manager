import crypto, { HexBase64Latin1Encoding } from "crypto"

export class HashingService {
    private key: string;
    private algorithm: string;
    private encoding: HexBase64Latin1Encoding;

    /**
     * @param {String} key The secret key to hash strings
     * @param {String} algorithm The algorithm to hash strings
     * @param {String} encoding The encoding of the input string
     */
    constructor(key: string, algorithm = 'sha1', encoding: HexBase64Latin1Encoding = 'hex') {
        this.key = key;
        this.algorithm = algorithm;
        this.encoding = encoding;
    }
    
    /**
     * Hash a string in configured algorithm
     * @param {String} text The string to hash
     * 
     * @returns {String}
     */
    public createHash(text: string): string {
        const hash: string = crypto.createHmac(this.algorithm, this.key).update(text).digest(this.encoding);

        return hash;
    }

    /**
     * Compare an input string with a hash
     * @param {String} text The input text
     * @param {String} hash The hash to compare
     * 
     * @returns {Boolean}
     */
    public compare(text: string, hash: string): boolean {
        const match = crypto.createHmac(this.algorithm, this.key).update(text).digest(this.encoding) === hash;

        return match;
    }
}

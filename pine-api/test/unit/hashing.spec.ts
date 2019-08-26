import assert from 'assert';
import { HashingService } from '../../dist/user/hashing.service';
import crypto from "crypto"

const key: string = 'teste';

describe('Hashing Service', () => {
    it('should create hash', () => {
        const text = 'alo';
        const service = new HashingService(key);
        const hash = service.createHash(text);
        const testHash = crypto.createHmac('sha1', key).update(text).digest('hex');

        assert(hash === testHash);
    });

    it('should fail on different hash keys', () => {
        const text = 'alo';
        const service = new HashingService(key);
        const hash = service.createHash(text);
        const testHash = crypto.createHmac('sha1', 'key').update(text).digest('hex');

        assert(hash !== testHash);
    });

    it('should pass comparing the same hash', () => {
        const text = 'alo';
        const service = new HashingService(key);
        const hash = service.createHash(text);

        assert(service.compare(text, hash));
    });

    it('should fail comparing different hashes', () => {
        const text = 'alo';
        const service = new HashingService(key);
        const hash = service.createHash(text);

        assert(!service.compare('text', hash));
    });
});

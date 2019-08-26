import { JwtService } from "../../dist/authentication/jwt.service";
import assert from 'assert';
import { JsonWebTokenError } from "jsonwebtoken";

describe('Jwt Service', () => {
    describe('when valid token', () => {
        it('should pass', async () => {
            const jwtService = new JwtService('teste', 'teste');
            const token = await jwtService.generate();

            await jwtService.verify(token.toString());
        });
    });

    describe('when invalid signature', () => {
        it('should fail', async () => {
            const jwtService = new JwtService('teste', 'teste');
            const otherService = new JwtService('alo', 'teste');
            const invalidToken = await otherService.generate();

            try {
                await jwtService.verify(invalidToken.toString());

                assert(false);
            } catch (error) {
                assert(error instanceof JsonWebTokenError);
                assert(error.message === 'invalid signature');
            }
        });
    });

    describe('when invalid subject', () => {
        it('should fail', async () => {
            const jwtService = new JwtService('teste', 'teste');
            const otherService = new JwtService('teste', 'alo');
            const invalidToken = await otherService.generate();

            try {
                await jwtService.verify(invalidToken.toString());

                assert(false);
            } catch (error) {
                assert(error instanceof JsonWebTokenError);
                assert(error.message.includes('jwt subject invalid'));
            }
        });
    });
});

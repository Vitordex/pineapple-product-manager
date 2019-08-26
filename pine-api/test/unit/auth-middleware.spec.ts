import { AuthService } from "../../dist/authentication/auth.service";
import { JwtService } from "../../dist/authentication/jwt.service";
import { Middleware } from "koa";
import assert = require("assert");
import { ApiRequestError } from "@xdgame-studio/koa-error-handle-middleware";

let jwtService = new JwtService('test', 'test');
let getUser = () => ({id: 1});
let authService: AuthService;

describe('Auth Middleware', () => {
    describe('happy path', () => {
        let middleware: Middleware;
        let context: any;
        before(async () => {
            authService = new AuthService(jwtService, getUser);
            middleware = authService.authenticate();
            context = {
                input: {
                    query: {
                        token: await jwtService.generate({id: 1})
                    }
                },
                state: {}
            };
            await middleware(context, () => Promise.resolve(context.status = 200));
        });

        it('should have status 200', () => {
            assert(context.status === 200);
        });

        it('should set user with id 1', () => {
            assert(context.state.user.id === 1);
        });
    });

    describe('with invalid location', () => {
        let middleware: Middleware;
        let context: any;
        before(async () => {
            authService = new AuthService(jwtService, getUser, 999);
            middleware = authService.authenticate();
            context = {
                input: {
                    query: {
                        token: await jwtService.generate({id: 1})
                    }
                },
                state: {},
                throw: (status: number, error: Error) => {throw error;}
            };
            try {
                await middleware(context, () => Promise.resolve(context.status = 200));   
            } catch (error) {
                context.error = error;
            }
        });

        it('should be an ApiRequestError', () => {
            assert(context.error instanceof ApiRequestError);
        });

        it('should have status 500', () => {
            assert(context.error.requestStatus === 500);
        });

        it('should set method with "authenticate"', () => {
            assert(context.error.method === 'authenticate');
        });

        it('should set output as {}', () => {
            const outputKeys = Object.keys(context.error.output).length;
            assert(outputKeys === 0);
        });
    });

    describe('with invalid signature', () => {
        let middleware: Middleware;
        let context: any;
        before(async () => {
            authService = new AuthService(jwtService, getUser);
            middleware = authService.authenticate();
            context = {
                input: {
                    query: {
                        token: 'await jwtService.generate()'
                    }
                },
                state: {},
                throw: (status: number, error: Error) => {throw error;}
            };
            try {
                await middleware(context, () => Promise.resolve(context.status = 200));   
            } catch (error) {
                context.error = error;
            }
        });

        it('should be an ApiRequestError', () => {
            assert(context.error instanceof ApiRequestError);
        });

        it('should have status 401', () => {
            assert(context.error.requestStatus === 401);
        });

        it('should set method with "authenticate"', () => {
            assert(context.error.method === 'authenticate');
        });

        it('should set message to "Invalid token"', () => {
            assert(context.error.message === 'Invalid token');
        });
    });

    describe('with header location', () => {
        let middleware: Middleware;
        let context: any;
        before(async () => {
            authService = new AuthService(jwtService, () => {}, 1, 'authorization');
            middleware = authService.authenticate();
            context = {
                input: {
                    headers: {
                        authorization: `bearer ${await jwtService.generate({id: 1})}`
                    }
                },
                state: {},
                throw: (status: number, error: Error) => {throw error;}
            };
            try {
                await middleware(context, () => Promise.resolve(context.status = 200));   
            } catch (error) {
                context.error = error;
            }
        });

        it('should have status 200', () => {
            assert(context.status === 200);
        });

        it('should set user with id 1', () => {
            assert(context.state.user.id === 1);
        });
    });

    

    describe('with header location and invalid header format', () => {
        let middleware: Middleware;
        let context: any;
        before(async () => {
            authService = new AuthService(jwtService, () => {}, 1, 'authorization');
            middleware = authService.authenticate();
            context = {
                input: {
                    headers: {
                        authorization: `${await jwtService.generate({id: 1})}`
                    }
                },
                state: {},
                throw: (status: number, error: Error) => {throw error;}
            };
            try {
                await middleware(context, () => Promise.resolve(context.status = 200));   
            } catch (error) {
                context.error = error;
            }
        });

        it('should be an ApiRequestError', () => {
            assert(context.error instanceof ApiRequestError);
        });

        it('should have status 401', () => {
            assert(context.error.requestStatus === 401);
        });

        it('should set method with "authenticate"', () => {
            assert(context.error.method === 'authenticate');
        });

        it('should set message to "Invalid token"', () => {
            assert(context.error.message === 'Invalid token');
        });
    });
});

import { Middleware, Context } from "koa";
import { NextFunction } from "connect";
import { JwtService } from "./jwt.service";
import { ApiRequestError } from "@xdgame-studio/koa-error-handle-middleware";
import { TokenPayload } from "./token-payload";
import { API_STATUS } from "../utils/request-status-enum";

export enum TOKEN_LOCATION {
    AUTH_HEADER,
    QUERY
}

export interface User {
    id: number,
    accessLevel: number
}

export class AuthService {
    private findUser: Function;
    private jwtService: JwtService;
    private tokenLocation: TOKEN_LOCATION = TOKEN_LOCATION.QUERY;
    private tokenPropertyName: string = 'token';

    private name: string = 'auth';

    constructor(jwtService: JwtService, findUser: Function, location?: TOKEN_LOCATION, tokenPropertyName?: string) {
        this.findUser = findUser;
        this.jwtService = jwtService;

        this.tokenLocation = location || this.tokenLocation;
        this.tokenPropertyName = tokenPropertyName || this.tokenPropertyName;
    }

    /**
     * Authenticates a request for a user
     */
    public authenticate(): Middleware {
        const middleware: Middleware = async (context: Context, next: NextFunction) => {
            const method: string = 'authenticate';
            const input: any = context.input;
            
            let token: string;

            switch (this.tokenLocation) {
                case TOKEN_LOCATION.QUERY:
                    token = context.input.query[this.tokenPropertyName];
                    break;
                case TOKEN_LOCATION.AUTH_HEADER:
                    token = context.input.headers[this.tokenPropertyName];
                    break;
                default:
                    const status: API_STATUS = API_STATUS.INTERNAL_ERROR;
                    const message: string = 'Invalid token extraction method';
                    const routeError: ApiRequestError = new ApiRequestError(status, message, this.name, method, input);

                    context.throw(status, routeError);
                    return;
            }

            let payload: TokenPayload;

            try {
                payload = (await this.jwtService.verify(token)) as TokenPayload;
            } catch (error) {
                const status: API_STATUS = API_STATUS.UNAUTHORIZED;
                const message: string = 'Invalid token';
                const routeError = new ApiRequestError(status, message, this.name, method, input, error);
                
                context.throw(status, routeError);
                return;
            }

            try {
                const userId = payload.id;
                const user = await this.findUser(userId);

                context.state.user = user;
            } catch (error) {
                const status: API_STATUS = API_STATUS.INTERNAL_ERROR;
                const message: string = 'Error finding the user';
                const routeError = new ApiRequestError(status, message, this.name, method, input, error);

                context.throw(status, routeError);
                return;
            }

            if(!context.state.user){
                const status: API_STATUS = API_STATUS.UNAUTHORIZED;
                const message: string = 'User not found';
                const routeError = new ApiRequestError(status, message, this.name, method, input);

                context.throw(status, routeError);
                return;
            }

            return next();
        };

        return middleware;
    }

    public authorize(level: number): Middleware {
        const middleware: Middleware = (context: Context, next: NextFunction) => {
            let token: string;
        };

        return middleware;
    }
}
import { Middleware, Context } from "koa";
import { NextFunction } from "connect";
import { JwtService } from "./jwt.service";
import { ApiRequestError } from "@xdgame-studio/koa-error-handle-middleware";
import { TokenPayload } from "./token-payload";
import { API_STATUS } from "../utils/request-status-enum";

export enum TOKEN_LOCATION {
    AUTH_HEADER = 1,
    QUERY = 2
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
            
            let extractLocation: {[prop: string]: string};
            switch (this.tokenLocation) {
                case TOKEN_LOCATION.QUERY:
                    extractLocation = context.input.query || {};
                    break;
                case TOKEN_LOCATION.AUTH_HEADER:
                    extractLocation = context.input.headers || {};
                    break;
                default:
                    const status: API_STATUS = API_STATUS.INTERNAL_ERROR;
                    const message: string = 'Invalid token extraction method';
                    const routeError: ApiRequestError = new ApiRequestError(status, message, this.name, method, input);

                    context.throw(status, routeError);
                    return;
            }

            let token = extractLocation[this.tokenPropertyName];
            if(this.tokenLocation === TOKEN_LOCATION.AUTH_HEADER)
                token = token.split(' ')[1];

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
            
            context.state.user = {id: payload.id};

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
import { Context } from "koa";
import { NextFunction } from "connect";
import { ApiRequestError } from '@xdgame-studio/koa-error-handle-middleware';
import { JwtService } from "../authentication/jwt.service";
import { UserService, IUser } from "./user.service";
import { API_STATUS } from "../utils/request-status-enum";
import { InputObject } from "../input/input-validation.middleware";
import { HashingService } from "./hashing.service";

interface IRegisterInput {
    email: string,
    password: string
}

export class UserController {
    private controller: string = 'User';

    constructor(private userService: UserService, 
        private jwtService: JwtService, 
        private hashService: HashingService) {}

    async register(context: Context, next: NextFunction) {
        const method = 'register';
        const input: InputObject = context.input;
        const userInput = input.body as IRegisterInput;
        const { email } = userInput;

        let user;

        try {
            user = await this.userService.findByEmail(email);
        } catch (error) {
            const status = API_STATUS.INTERNAL_ERROR;
            const message = 'Error verifying user email';
            const routeError = new ApiRequestError(status, message, this.controller, method, input, error);

            context.throw(status, routeError);
            return next();
        }

        if (!!user) {
            const status = API_STATUS.CONFLICT;
            const message = 'User already exists';
            const routeError = new ApiRequestError(status, message, this.controller, method, input);

            context.throw(status, routeError);
            return next();
        }

        try {
            user = await this.userService.create(userInput as IUser);
            await user.save();
        } catch (error) {
            const status = API_STATUS.INTERNAL_ERROR;
            const message = 'Error creating the user';
            const routeError = new ApiRequestError(status, message, this.controller, method, input, error);

            context.throw(status, routeError);
            return next();
        }

        let token: string | object;
        try {
            const payload: object = {
                id: (user as unknown as IUser).id
            };
            token = await this.jwtService.generate(payload);
        } catch (error) {
            const status = API_STATUS.INTERNAL_ERROR;
            const message = 'Error saving the user';
            const routeError = new ApiRequestError(status, message, this.controller, method, input, error);

            context.throw(status, routeError);
            return next();
        }

        context.status = API_STATUS.OK;
        context.body = { token, user: user.toObject(['email']) };

        return next();
    }

    async login(context: Context, next: NextFunction) {
        const method = 'login';
        const input: InputObject = context.input;
        const userInput = input.body as IRegisterInput;
        const { email, password } = userInput;

        let user;

        try {
            user = await this.userService.findByEmail(email);
        } catch (error) {
            const status = API_STATUS.INTERNAL_ERROR;
            const message = 'Error verifying user email';
            const routeError = new ApiRequestError(status, message, this.controller, method, input, error);

            context.throw(status, routeError);
            return next();
        }

        if (!user) {
            const status = API_STATUS.NOT_FOUND;
            const message = 'User not found';
            const routeError = new ApiRequestError(status, message, this.controller, method, input);

            context.throw(status, routeError);
            return next();
        }

        const passwordHash: string = (user.toObject() as IUser).password;
        let match: boolean;
        try {
            match = this.hashService.compare(password, passwordHash);
        } catch (error) {
            const status = API_STATUS.INTERNAL_ERROR;
            const message = 'Error comparing the user hash';
            const routeError = new ApiRequestError(status, message, this.controller, method, input, error);

            context.throw(status, routeError);
            return next();
        }

        if(!match){
            const status = API_STATUS.NOT_FOUND;
            const message = 'Incorrect password';
            const routeError = new ApiRequestError(status, message, this.controller, method, input);

            context.throw(status, routeError);
            return next();
        }

        let token: string | object;
        try {
            const payload: object = {
                id: (user as unknown as IUser).id
            };
            token = await this.jwtService.generate(payload);
        } catch (error) {
            const status = API_STATUS.INTERNAL_ERROR;
            const message = 'Error saving the user';
            const routeError = new ApiRequestError(status, message, this.controller, method, input, error);

            context.throw(status, routeError);
            return next();
        }

        context.status = API_STATUS.OK;
        context.body = { token, user: user.toObject(['email']) };

        return next();
    }
}

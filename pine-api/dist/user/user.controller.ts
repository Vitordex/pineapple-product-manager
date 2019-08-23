import { Context } from "koa";
import { NextFunction } from "connect";
import { ApiRequestError } from '@xdgame-studio/koa-error-handle-middleware';
import { JwtService } from "../authentication/jwt.service";
import { UserService, IUser } from "./user.service";
import { API_STATUS } from "../utils/request-status-enum";
import { InputValidation, InputObject } from "../input-validation/input-validation.middleware";

interface IRegisterInput {
    email: string,
    password: string
}

export class UserController {
    private controller: string = 'User';

    constructor(private userService: UserService, private jwtService: JwtService) {}

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

        context.status = API_STATUS.CREATED;
        context.body = { token, user: user.toObject(['email', 'password']) };

        return next();
    }
}

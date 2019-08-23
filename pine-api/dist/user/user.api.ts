import Router from "koa-router";
import { AuthService } from "../authentication/auth.service";
import { UserController } from "./user.controller";
import { Context } from "koa";
import { NextFunction } from "connect";
import { InputValidation } from "../input-validation/input-validation.middleware";
import { UserSchema } from "./user.schema";

export class UserApi {
    private router: Router;

    constructor(
        private controller: UserController, 
        private authService: AuthService, 
        private validationMiddleware: InputValidation,
        private userSchema: UserSchema
    ) {
        this.router = new Router({
            prefix: '/users'
        });
    }

    public configreRoutes() {
        this.router.post(
            '/',
            this.validationMiddleware.validate(this.userSchema.schemas.register),
            async (context: Context, next: NextFunction) => {
                await this.controller.register(context, next);
            }
        );

        this.router.post(
            '/login',
            this.validationMiddleware.validate(this.userSchema.schemas.login),
            async (context: Context, next: NextFunction) => {
                await this.controller.login(context, next);
            }
        );
    }

    public get routes(){
        return this.router.routes();
    }

    public get allowedMethods(){
        return this.router.allowedMethods();
    }
}
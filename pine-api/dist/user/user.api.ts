import Router from "koa-router";
import { AuthService } from "../authentication/auth.service";
import { UserController } from "./user.controller";
import { Context } from "koa";
import { NextFunction } from "connect";

export class UserApi {
    private router: Router;

    private controller: UserController;

    private authService: AuthService;

    constructor(controller: UserController, authService: AuthService) {
        this.controller = controller;

        this.authService = authService;

        this.router = new Router({
            prefix: '/users'
        });
    }

    public configreRoutes() {
        this.router.post(
            '/',
            async (context: Context, next: NextFunction) => {
                await this.controller.register(context, next);
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
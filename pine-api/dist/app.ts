import Koa from 'koa';
import { PgDatabaseService } from './database/pg-database.service';
import config from 'config';
import bodyParser from 'koa-bodyparser';
import { ErrorHandleMiddleware } from '@xdgame-studio/koa-error-handle-middleware';
import { RouteLoggerMiddleware } from '@xdgame-studio/koa-route-logger-middleware';
import { Logger } from '@xdgame-studio/log-service';
import { AuthService } from './authentication/auth.service';
import { JwtService } from './authentication/jwt.service';
import { User } from './user/user.model';
import { UserService } from './user/user.service';
import { HashingService } from './user/hashing.service';
import { UserController } from './user/user.controller';
import { UserApi } from './user/user.api';
import { Options } from 'sequelize';


export async function initApp(logger: Logger) {
    const app = new Koa();

    let dbOptions = config.get('db.connection') as Options;
    const db = await new PgDatabaseService(dbOptions);

    await User.configure(db.Connection, `${User.name}s`);

    app.use(bodyParser());

    const routeLoggerMiddleware = RouteLoggerMiddleware((params: string) => { logger.info(params); });
    app.use(routeLoggerMiddleware);

    const errorHandlerMiddleware = ErrorHandleMiddleware((params: string) => { logger.error(params); });
    app.use(errorHandlerMiddleware);

    const authConfig: any = config.get('auth');
    const jwtService: JwtService = new JwtService(authConfig.hash, authConfig.subject);
    const authMiddleware: AuthService = new AuthService(jwtService, User.findByPk);

    const hashingOptions = config.get('hashing') as any;

    const hashingService = new HashingService(hashingOptions.key);

    const userService = new UserService(User, hashingService);

    const userController = new UserController(userService, jwtService);
    const userApi = new UserApi(userController, authMiddleware);
    userApi.configreRoutes();

    app.use(userApi.routes);
    app.use(userApi.allowedMethods);

    return app;
};

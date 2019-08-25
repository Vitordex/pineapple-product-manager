import Koa from 'koa';
import { PgDatabaseService } from './database/pg-database.service';
import config from 'config';
import bodyParser from 'koa-bodyparser';
import { ErrorHandleMiddleware } from '@xdgame-studio/koa-error-handle-middleware';
import { RouteLoggerMiddleware } from '@xdgame-studio/koa-route-logger-middleware';
import { Logger } from '@xdgame-studio/log-service';
import { AuthService, TOKEN_LOCATION } from './authentication/auth.service';
import { JwtService } from './authentication/jwt.service';
import { User } from './user/user.model';
import { UserService } from './user/user.service';
import { HashingService } from './user/hashing.service';
import { UserController } from './user/user.controller';
import { UserApi } from './user/user.api';
import { Options } from 'sequelize';
import { InputValidation } from './input/input-validation.middleware';
import { UserSchema } from './user/user.schema';
import { UploadMiddleware } from './input/upload.middleware';
import { Product } from './product/product.model';
import { ProductService } from './product/product.service';
import { ProductController } from './product/product.controller';
import { FileService } from './file-service/file.service';
import { ProductApi } from './product/product.api';
import { ProductSchema } from './product/product.schema';
import serve from 'koa-static';


export async function initApp(logger: Logger) {
    const app = new Koa();

    let dbOptions = config.get('db.connection') as Options;
    const db = await new PgDatabaseService(dbOptions);

    await User.configure(db.Connection, `${User.name}s`);

    app.use(serve('./public'));
    app.use(bodyParser());
    
    const routeLoggerMiddleware = RouteLoggerMiddleware((params: string) => { logger.info(params); });
    app.use(routeLoggerMiddleware);

    const errorHandlerMiddleware = ErrorHandleMiddleware((params: string) => { logger.error(params); });
    app.use(errorHandlerMiddleware);

    const inputValidationMiddleware = new InputValidation();

    const authConfig: any = config.get('auth');
    const jwtService: JwtService = new JwtService(authConfig.hash, authConfig.subject);
    const authMiddleware: AuthService = new AuthService(
        jwtService, 
        User.findByPk, 
        TOKEN_LOCATION.AUTH_HEADER,
        authConfig.extractFrom
    );

    const hashingOptions = config.get('hashing') as any;

    const hashingService = new HashingService(hashingOptions.key);

    const userService = new UserService(User, hashingService);

    const userController = new UserController(userService, jwtService, hashingService);
    const userSchema = new UserSchema(inputValidationMiddleware.BaseSchema);
    const userApi = new UserApi(userController, authMiddleware, inputValidationMiddleware, userSchema);
    userApi.configreRoutes();

    app.use(userApi.routes);
    app.use(userApi.allowedMethods);

    const uploadConfig: any = config.get('upload');
    const uploadMiddleware = new UploadMiddleware(uploadConfig.destination);

    await Product.configure(db.Connection, `${Product.name}s`);
    const productService = new ProductService(Product);
    const fileService = new FileService();
    const productController = new ProductController(productService, fileService);
    const productSchema = new ProductSchema(inputValidationMiddleware.BaseSchema);
    const productApi = new ProductApi(productController, authMiddleware, uploadMiddleware, inputValidationMiddleware, productSchema);
    productApi.configureRoutes();

    app.use(productApi.routes);
    app.use(productApi.allowedMethods);

    return app;
};

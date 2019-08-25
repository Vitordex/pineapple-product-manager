import { ProductController } from "./product.controller";
import { AuthService } from "../authentication/auth.service";
import { UploadMiddleware } from "../input/upload.middleware";
import { InputValidation } from "../input/input-validation.middleware";
import Router from "koa-router";
import { ProductSchema } from "./product.schema";

export class ProductApi {
    private router: Router;

    constructor(private productController: ProductController, 
        private authService: AuthService, 
        private uploadMiddleware: UploadMiddleware, 
        private inputValidationMiddleware: InputValidation,
        private productSchema: ProductSchema) {
            this.router = new Router({
                prefix: '/products'
            });
        }

    public configureRoutes(){
        this.router.get(
            '/',
            this.inputValidationMiddleware.validate(this.productSchema.schemas.listProducts),
            this.authService.authenticate(),
            async (context, next) => {
                await this.productController.listProducts(context, next);
            }
        );

        this.router.get(
            '/:productId',
            this.inputValidationMiddleware.validate(this.productSchema.schemas.getProduct),
            this.authService.authenticate(),
            async (context, next) => {
                await this.productController.getProduct(context, next);
            }
        );

        this.router.delete(
            '/:productId',
            this.inputValidationMiddleware.validate(this.productSchema.schemas.deleteProduct),
            this.authService.authenticate(),
            async (context, next) => {
                await this.productController.deleteProduct(context, next);
            }
        );

        this.router.put(
            '/:productId',
            this.uploadMiddleware.uploadSingle('thumb'),
            this.inputValidationMiddleware.validate(this.productSchema.schemas.updateProduct),
            this.authService.authenticate(),
            async (context, next) => {
                await this.productController.updateProduct(context, next);
            }
        );

        this.router.post(
            '/',
            this.uploadMiddleware.uploadSingle('thumb'),
            this.inputValidationMiddleware.validate(this.productSchema.schemas.postProduct),
            this.authService.authenticate(),
            async (context, next) => {
                await this.productController.postProduct(context, next);
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

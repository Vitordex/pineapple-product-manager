import { ProductService, IProduct } from "./product.service";
import { Context } from "koa";
import { NextFunction } from "connect";
import { ApiRequestError } from "@xdgame-studio/koa-error-handle-middleware";
import { API_STATUS } from "../utils/request-status-enum";
import { InputObject } from "../input/input-validation.middleware";
import { FileService } from "../file-service/file.service";
import { User } from "../user/user.model";

interface IProductIdQuery{
    productId: number;
}

interface IProductCreate{
    name: string,
    description: string
}

export class ProductController {
    private controller: string = 'Product';

    constructor(private productService: ProductService, private fileService: FileService){}

    public async listProducts(context: Context, next: NextFunction) {
        const method = 'listProducts';
        
        let products;
        try {
            products = await this.productService.listProducts();
        } catch (error) {
            const status = API_STATUS.INTERNAL_ERROR;
            const message = 'Error listing products';
            const routeError = new ApiRequestError(status, message, this.controller, method, {}, error);

            context.throw(status, routeError);
            return next();
        }

        context.body = products;
        context.status = API_STATUS.OK;
        return next();
    }

    public async getProduct(context: Context, next: NextFunction) {
        const method = 'getProduct';
        const input: InputObject = context.input;
        const { productId } = input.params as IProductIdQuery;
        
        let product;
        try {
            product = await this.productService.getProductById(productId);
        } catch (error) {
            const status = API_STATUS.INTERNAL_ERROR;
            const message = 'Error getting product';
            const routeError = new ApiRequestError(status, message, this.controller, method, input, error);

            context.throw(status, routeError);
            return next();
        }

        if(!product){
            const status = API_STATUS.NOT_FOUND;
            const message = 'Product not found';
            const routeError = new ApiRequestError(status, message, this.controller, method, input, {});

            context.throw(status, routeError);
            return next();
        }

        context.body = product;
        context.status = API_STATUS.OK;
        return next();
    }

    public async deleteProduct(context: Context, next: NextFunction) {
        const method = 'deleteProduct';
        const input: InputObject = context.input;
        const { productId } = input.params as IProductIdQuery;
        
        let product;
        try {
            product = await this.productService.getProductById(productId);
        } catch (error) {
            const status = API_STATUS.INTERNAL_ERROR;
            const message = 'Error finding product';
            const routeError = new ApiRequestError(status, message, this.controller, method, input, error);

            context.throw(status, routeError);
            return next();
        }

        if(!product){
            const status = API_STATUS.NOT_FOUND;
            const message = 'Product not found';
            const routeError = new ApiRequestError(status, message, this.controller, method, input, {});

            context.throw(status, routeError);
            return next();
        }

        try {
            await this.productService.remove(productId);
        } catch (error) {
            const status = API_STATUS.INTERNAL_ERROR;
            const message = 'Error deleting product';
            const routeError = new ApiRequestError(status, message, this.controller, method, input, error);

            context.throw(status, routeError);
            return next();
        }

        context.status = API_STATUS.OK;
        return next();
    }

    public async updateProduct(context: Context, next: NextFunction) {
        const method = 'updateProduct';
        const input: InputObject = context.input;
        const {file} = input;
        const {productId} = input.params as IProductIdQuery;
        
        let product;
        try {
            product = await this.productService.getProductById(productId);
        } catch (error) {
            const status = API_STATUS.INTERNAL_ERROR;
            const message = 'Error finding product';
            const routeError = new ApiRequestError(status, message, this.controller, method, input, error);

            context.throw(status, routeError);
            return next();
        }

        if(!product){
            const status = API_STATUS.NOT_FOUND;
            const message = 'Product not found';
            const routeError = new ApiRequestError(status, message, this.controller, method, input, {});

            context.throw(status, routeError);
            return next();
        }

        if(!!file){
            try {
                const user: User = context.state.user;
                const userId = (user as any).id;

                product.imagePath = await this.moveThumbToPublic(userId, file as IFile);
            } catch (error) {
                const status = API_STATUS.INTERNAL_ERROR;
                const message = 'Error saving the product image';
                const routeError = new ApiRequestError(status, message, this.controller, method, input, error);

                context.throw(status, routeError);
                return next();
            }
        }

        const values = input.body as IProduct;
        values.imagePath = product.imagePath;
        try {
            product = await this.productService.updateProduct(product, values);
        } catch (error) {
            const status = API_STATUS.INTERNAL_ERROR;
            const message = 'Error updating product';
            const routeError = new ApiRequestError(status, message, this.controller, method, {}, error);

            context.throw(status, routeError);
            return next();
        }

        context.body = product;
        context.status = API_STATUS.OK;
        return next();
    }

    public async postProduct(context: Context, next: NextFunction) {
        const method = 'postProduct';
        const input: InputObject = context.input;
        const {file} = input;
        const product = input.body as IProduct;
        
        if(!!file){
            try {
                const user: User = context.state.user;
                const userId = (user as any).id;

                product.imagePath = await this.moveThumbToPublic(userId, file as IFile);
            } catch (error) {
                const status = API_STATUS.INTERNAL_ERROR;
                const message = 'Error saving the product image';
                const routeError = new ApiRequestError(status, message, this.controller, method, input, error);

                context.throw(status, routeError);
                return next();
            }
        }

        try {
            product.rate = Math.round(1 + Math.random() * 4);

            const productModel = await this.productService.createProduct(product);
            await productModel.save();
        } catch (error) {
            const status = API_STATUS.INTERNAL_ERROR;
            const message = 'Error creating the product';
            const routeError = new ApiRequestError(status, message, this.controller, method, {}, error);

            context.throw(status, routeError);
            return next();
        }

        context.body = product;
        context.status = API_STATUS.OK;
        return next();
    }

    private async moveThumbToPublic(userId: number, file: IFile): Promise<string>{
        const cwd = process.cwd();
        const publicFolder = `${cwd}/public/`;
        
        const imagePath = `thumb-${userId}.${(file as any).mimetype.split('/')[1]}`;
        const newPath = `${publicFolder}/${imagePath}`;
        await this.fileService.moveFile(`${process.cwd()}/${(file as any).path}`, newPath);

        return `/${imagePath}`;
    }
}

interface IFile {
    path: string,
    mimetype: string
}
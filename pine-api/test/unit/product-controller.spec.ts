import { Middleware } from "koa";
import assert = require("assert");
import { ApiRequestError } from "@xdgame-studio/koa-error-handle-middleware";
import { ProductController } from "../../dist/product/product.controller";

let productService: any = {};
let fileService: any = {};
let productController = new ProductController(productService, fileService);

describe('Product Controller', () => {
    describe('List Products', () => {
        describe('happy path', () => {
            let context: any = {};
            before(async () => {
                productService.listProducts = () => [{ id: 1 }];
                await productController.listProducts(context, () => Promise.resolve(context.status = 200));
            });

            it('should have status 200', () => {
                assert(context.status === 200);
            });

            it('should set body to array', () => {
                assert(context.body instanceof Array);
            });

            it('body should have one element', () => {
                assert(context.body.length === 1);
            });

            it('body element should have id = 1', () => {
                assert(context.body[0].id === 1);
            });
        });

        describe('with error listing products', () => {
            let context: any = {
                throw: (status: number, error: Error) => {throw error;}
            };
            before(async () => {
                productService.listProducts = () => {throw new Error('error')};
                try {
                    await productController.listProducts(context, () => Promise.resolve(context.status = 200));
                } catch (error) {
                    context.error = error;
                }
            });

            it('should be an ApiRequestError', () => {
                assert(context.error instanceof ApiRequestError);
            });

            it('should have status 500', () => {
                assert(context.error.requestStatus === 500);
            });

            it('should set method with "listProducts"', () => {
                assert(context.error.method === 'listProducts');
            });

            it('should set output as {}', () => {
                const outputKeys = Object.keys(context.error.output).length;
                assert(outputKeys === 0);
            });

            it('should set message to "Error listing products"', () => {
                assert(context.error.message === 'Error listing products');
            });
        });
    });
    describe('Post product', () => {
        describe('happy path with file', () => {
            let context: any = {
                state: {
                    user: {id: 1}
                },
                input: {
                    file: {
                        path: 'test',
                        mimetype: 'alo/test'
                    },
                    body: {}
                }
            };
            let fromFile: string;
            let toFile: string;
            before(async () => {
                fileService.moveFile = (from: string, to: string) => {
                    fromFile = from; 
                    toFile = to; 
                    return Promise.resolve();
                };
                productService.createProduct = () => ({save: () => Promise.resolve(true)});
                await productController.postProduct(context, () => Promise.resolve(context.status = 200));
            });

            it('should have status 200', () => {
                assert(context.status === 200);
            });

            it('should set body to object', () => {
                assert(context.body instanceof Object);
            });

            it('should set body with two keys', () => {
                const bodyKeys = Object.keys(context.body).length;
                assert(bodyKeys === 2);
            });

            it('from should be cwd + test', () => {
                assert(fromFile === `${process.cwd()}/test`);
            });

            it('to should be cwd + public + thumb id', () => {
                assert(toFile === `${process.cwd()}/public/thumb-1.test`);
            });
        });

        describe('happy path without file', () => {
            let context: any = {
                input: {
                    body: {}
                }
            };
            before(async () => {
                productService.createProduct = () => ({save: () => Promise.resolve(true)});
                await productController.postProduct(context, () => Promise.resolve(context.status = 200));
            });

            it('should have status 200', () => {
                assert(context.status === 200);
            });

            it('should set body to object', () => {
                assert(context.body instanceof Object);
            });

            it('should set body with one key', () => {
                const bodyKeys = Object.keys(context.body).length;
                assert(bodyKeys === 1);
            });
        });

        describe('with error saving the file', () => {
            let context: any = {
                state: {
                    user: {id: 1}
                },
                input: {
                    file: {
                        path: 'test',
                        mimetype: 'alo/test'
                    },
                    body: {}
                },
                throw: (status: number, error: Error) => {throw error;}
            };
            before(async () => {
                fileService.moveFile = (from: string, to: string) => {throw new Error('error')};
                try {
                    await productController.postProduct(context, () => Promise.resolve(context.status = 200));   
                } catch (error) {
                    context.error = error;
                }
            });

            it('should be an ApiRequestError', () => {
                assert(context.error instanceof ApiRequestError);
            });

            it('should have status 500', () => {
                assert(context.error.requestStatus === 500);
            });

            it('should set method with "postProduct"', () => {
                assert(context.error.method === 'postProduct');
            });

            it('should set message to "Error saving the product image"', () => {
                assert(context.error.message === 'Error saving the product image');
            });
        });

        describe('with error saving the product', () => {
            let context: any = {
                throw: (status: number, error: Error) => {throw error;},
                input: {
                    body: {

                    }
                }
            };
            let fromFile: string;
            let toFile: string;
            before(async () => {
                fileService.moveFile = (from: string, to: string) => {
                    fromFile = from; 
                    toFile = to; 
                    return Promise.resolve();
                };
                productService.createProduct = () => {throw new Error('error');};
                productController = new ProductController(productService, fileService);
                try {
                    await productController.postProduct(context, () => Promise.resolve(context.status = 200));
                } catch (error) {
                    context.error = error;
                }
            });

            it('should be an ApiRequestError', () => {
                assert(context.error instanceof ApiRequestError);
            });

            it('should have status 500', () => {
                assert(context.error.requestStatus === 500);
            });

            it('should set method with "postProduct"', () => {
                assert(context.error.method === 'postProduct');
            });

            it('should set message to "Error creating the product"', () => {
                assert(context.error.message === 'Error creating the product');
            });
        });
    });
});

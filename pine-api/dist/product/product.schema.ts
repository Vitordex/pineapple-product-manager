import joi, { ObjectSchema, SchemaMap } from 'joi';

export class ProductSchema {
    /**
     *
     */
    constructor(private baseSchema: ObjectSchema) {}

    private generateSchema(keys: SchemaMap | undefined = {}) {
        if (!keys.headers) keys.headers = joi.object().unknown();

        return this.baseSchema.keys(keys);
    }

    get schemas() {
        return {
            listProducts: this.generateSchema({
                body: joi.allow(false),
                headers: joi.object().keys({
                    authorization: joi.string()
                        .regex(/bearer .+/i)
                        .required()
                }).required().unknown(true)
            }),
            getProduct: this.generateSchema({
                params: joi.object().keys({
                    productId: joi.number()
                        .positive()
                        .required()
                }).required(),
                headers: joi.object().keys({
                    authorization: joi.string()
                        .regex(/bearer .+/i)
                        .required()
                }).required().unknown(true)
            }),
            updateProduct: this.generateSchema({
                params: joi.object().keys({
                    productId: joi.number()
                        .min(1)
                        .required()
                }).required(),
                body: joi.object().keys({
                    name: joi.string().min(1).max(50),
                    description: joi.string().min(1).max(255)
                }).min(1)
                    .required()
                    .unknown(false),
                file: joi.object().keys({
                    path: joi.string().required(),
                    mimetype: joi.string().required()
                }).unknown(true),
                headers: joi.object().keys({
                    authorization: joi.string()
                        .regex(/bearer .+/i)
                        .required()
                }).required().unknown(true)
            }),
            deleteProduct: this.generateSchema({
                params: joi.object().keys({
                    productId: joi.number()
                        .min(1)
                        .required()
                }).required(),
                headers: joi.object().keys({
                    authorization: joi.string()
                        .regex(/bearer .+/i)
                        .required()
                }).required().unknown(true)
            }),
            postProduct: this.generateSchema({
                body: joi.object().keys({
                    name: joi.string().min(1).max(50),
                    description: joi.string().min(1).max(255)
                }).min(1)
                    .required()
                    .unknown(false),
                file: joi.object().keys({
                    path: joi.string().required(),
                    mimetype: joi.string().required()
                }).unknown(true),
                headers: joi.object().keys({
                    authorization: joi.string()
                        .regex(/bearer .+/i)
                        .required()
                }).required().unknown(true)
            })
        };
    }
}

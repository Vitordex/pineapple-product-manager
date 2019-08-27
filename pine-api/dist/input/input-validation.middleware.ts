import { Middleware, Context } from "koa";
import joi, { Schema, ValidationErrorItem, ObjectSchema } from 'joi';
import { ApiRequestError } from '@xdgame-studio/koa-error-handle-middleware';

/**
 * The input of a request to pass for main controller methods
 * @interface
 */
export interface InputObject {
    /**
     * @abstract
     * @member InputObject.body The request body
     */
    body?: object,
    /**
     * @abstract
     * @member InputObject.query The request query params
     */
    query?: object,
    /**
     * @abstract
     * @member InputObject.params The request route params
     */
    params?: object,
    /**
     * @abstract
     * @member InputObject.headers The request relevant headers
     */
    headers?: object,
    /**
     * @abstract
     * @member InputObject.file The request file sent
     */
    file?: object | undefined
};

/**
 * The input validation error given for a joi schema validation
 * @interface
 */
interface InputError {
    /**
     * @abstract
     * @member InputObject.key The name of the property that was errored
     */
    key?: string,
    /**
     * @abstract
     * @member InputObject.label The error that was triggered for a validation
     */
    label?: string,
    /**
     * @abstract
     * @member InputObject.type The error type
     */
    type: string
};

export class InputValidation {
    private baseSchema: ObjectSchema = joi.object().options({ abortEarly: false });

    /**
     * Creates a middleware that validates the input of a user with a given joi schema
     * @param schema A joi schema to validate the input
     */
    public validate(schema: Schema): Middleware {
        const middleware: Middleware = async (context: Context, next: Function) => {
            const input: InputObject = {};

            const file = (context.req as any || {})['file'];

            if(!!(context.req as any).body)
                context.request.body = {
                    ...context.request.body, ...(context.req as any).body
                };

            if (this.isValidObject(context.request.body))
                input.body = context.request.body;
            if (this.isValidObject(context.request.query))
                input.query = context.request.query;
            if (this.isValidObject(context.params))
                input.params = context.params;
            if (this.isValidObject(context.request.headers))
                input.headers = context.request.headers;
            if (this.isValidObject(file))
                input.file = file;

            try {
                const verified = await joi.validate(input, schema);

                context.input = verified;
                await next();
            } catch (error) {
                if (!error.details) throw error;

                const status = 400;

                const mapError: Function = (err: ValidationErrorItem) => {
                    const error: InputError = {
                        key: (err.context || {}).key,
                        label: (err.context || {}).label,
                        type: err.type
                    };
                    return error;
                };
                const inputError = new ApiRequestError(
                    status,
                    'Input error',
                    'input-validation',
                    'validate',
                    input,
                    error.details.map(mapError)
                );

                context.status = status;
                context.throw(status, inputError);
            }
        };

        return middleware;
    }

    /**
     * Validates an object to check if it is an object and has keys
     * @param obj The object to validate
     */
    private isValidObject(obj: object | undefined) {
        return typeof (obj) === 'object' && Object.keys(obj).length > 0;
    }

    public get BaseSchema(): ObjectSchema {
        return this.baseSchema;
    }
}

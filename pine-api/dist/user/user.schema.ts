import joi, { Schema, ObjectSchema, SchemaMap } from 'joi';

export class UserSchema {
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
            register: this.generateSchema({
                body: joi.object().keys({
                    email: joi.string().email().required(),
                    password: joi.string().required()
                }).required()
            }),
            login: this.generateSchema({
                body: joi.object().keys({
                    email: joi.string().email().required(),
                    password: joi.string().required()
                })
            })
        };
    }
}

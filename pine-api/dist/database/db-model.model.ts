import { STRING, NUMBER, INTEGER } from 'sequelize';
import { Sequelize, Model, InitOptions } from "sequelize";
import { DbModelOptions } from "./db-model-options.model";
import { DbAttributes } from "./db-attributes.model";

export class DbModel extends Model {
    public static fields: DbAttributes;
    public static initOptions: DbModelOptions;

    public static get Types() {
        return {
            STRING: STRING,
            NUMBER: NUMBER,
            INTEGER: INTEGER
        }
    }

    public toObject(allowedFields: Array<string> = []): object {
        const values: any = this.get();

        let converted: any = {};
        const showAll = allowedFields.length === 0;
        if (!showAll) {
            allowedFields.forEach(field => {
                converted[field] = values[field];
            });
        }

        return showAll ? values : converted;
    }
}

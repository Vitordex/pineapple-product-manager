import { STRING, NUMBER, INTEGER } from 'sequelize';
import { Sequelize, Model, InitOptions } from "sequelize";
import { DbModelOptions } from "./db-model-options.model";
import { DbAttributes } from "./db-attributes.model";

export class DbModel extends Model {
    public static fields: DbAttributes;
    public static initOptions: DbModelOptions;

    public static configure(connection: Sequelize, tableName: string) {
        const initOptions: InitOptions = {
            ...this.initOptions,
            sequelize: connection,
            freezeTableName: true,
            tableName: tableName
        };

        DbModel.init(this.fields, initOptions);
    }

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
        if (allowedFields.length !== 0) {
            allowedFields.forEach(field => {
                converted[field] = values[field];
            });
        }

        return converted === {} ? values : converted;
    }
}

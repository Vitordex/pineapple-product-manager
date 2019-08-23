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
}

import { DbModel } from "../database/db-model.model";
import { DbAttributes } from "../database/db-attributes.model";
import { Sequelize, InitOptions } from "sequelize/types";

export class User extends DbModel {
    public static fields: DbAttributes = {
        id: {
            type: DbModel.Types.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DbModel.Types.STRING
        },
        password: {
            type: DbModel.Types.STRING
        }
    };

    public static configure(connection: Sequelize, tableName: string) {
        const initOptions: InitOptions = {
            ...this.initOptions,
            sequelize: connection,
            freezeTableName: true,
            tableName: tableName
        };

        User.init(this.fields, initOptions);
    }
}
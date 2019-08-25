import { DbModel } from "../database/db-model.model";
import { DbAttributes } from "../database/db-attributes.model";
import { Sequelize, InitOptions } from "sequelize/types";

export class Product extends DbModel {
    public static fields: DbAttributes = {
        id: {
            type: DbModel.Types.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DbModel.Types.STRING(50),
            allowNull: false
        },
        description: {
            type: DbModel.Types.STRING(255),
            allowNull: false
        },
        rate: {
            type: DbModel.Types.INTEGER,
            defaultValue: 5
        },
        imagePath: {
            type: DbModel.Types.STRING,
            defaultValue: '/default.jpg'
        }
    };
    
    public static configure(connection: Sequelize, tableName: string) {
        const initOptions: InitOptions = {
            ...this.initOptions,
            sequelize: connection,
            freezeTableName: true,
            tableName: tableName
        };

        Product.init(this.fields, initOptions);
    }
}
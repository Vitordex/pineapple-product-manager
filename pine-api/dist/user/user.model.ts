import { DbModel } from "../database/db-model.model";
import { DbAttributes } from "../database/db-attributes.model";
import { DbModelOptions } from "../database/db-model-options.model";

export class User extends DbModel {
    public static fields: DbAttributes = {
        id: {
            type: DbModel.Types.INTEGER,
            primaryKey: true
        },
        email: {
            type: DbModel.Types.STRING
        },
        password: {
            type: DbModel.Types.STRING
        }
    };

    public static initOptions: DbModelOptions = {

    };
}
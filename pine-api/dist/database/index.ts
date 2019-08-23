import { DbModel } from "./db-model.model";
import { DbModelOptions } from "./db-model-options.model";
import { DbAttributes } from "./db-attributes.model";

export interface Types {
    Model: DbModel, 
    Attributes: DbAttributes, 
    Options: DbModelOptions
};

export { PgDatabaseService as DatabaseService } from "./pg-database.service";
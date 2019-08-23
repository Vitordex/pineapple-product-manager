export interface DbModelOptions {
    defaultScope?: import("sequelize/types").FindOptions | undefined;
    scopes?: import("sequelize/types").ModelScopeOptions | undefined;
    omitNull?: boolean | undefined;
    timestamps?: boolean | undefined;
    paranoid?: boolean | undefined;
    underscored?: boolean | undefined;
    hasTrigger?: boolean | undefined;
    freezeTableName?: boolean | undefined;
    name?: import("sequelize/types").ModelNameOptions | undefined;
    modelName?: string | undefined;
    indexes?: import("sequelize/types").ModelIndexesOptions[] | undefined;
    createdAt?: string | boolean | undefined;
    deletedAt?: string | boolean | undefined;
    updatedAt?: string | boolean | undefined;
    tableName?: string | undefined;
    schema?: string | undefined;
    engine?: string | undefined;
    charset?: string | undefined;
    comment?: string | undefined;
    collate?: string | undefined;
    initialAutoIncrement?: string | undefined;
    hooks?: Partial<import("sequelize/types/lib/hooks").ModelHooks<import("sequelize/types").Model<any, any>>> | undefined;
    validate?: import("sequelize/types").ModelValidateOptions | undefined;
    setterMethods?: import("sequelize/types").ModelSetterOptions | undefined;
    getterMethods?: import("sequelize/types").ModelGetterOptions | undefined;
    version?: string | boolean | undefined;
}

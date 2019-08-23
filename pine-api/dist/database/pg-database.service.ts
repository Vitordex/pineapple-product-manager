import {Sequelize, Options} from "sequelize";

export {Sequelize as Connection} from "sequelize";

export class PgDatabaseService {
    private connection: Sequelize;

    constructor(options: Options){
        this.connection = new Sequelize({...options, dialect: "postgres"});
        this.connection.sync();
    }

    public get Connection(): Sequelize{
        return this.connection;
    }
}
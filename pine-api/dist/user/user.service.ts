import { User } from "./user.model";
import { NonNullFindOptions } from "sequelize/types";
import { HashingService } from "./hashing.service";

export interface IUser {
    id: string,
    email: string,
    password: string,
    name: string
}

export class UserService {
    private Model: typeof User;
    private hashingService: HashingService;

    constructor(model: typeof User, hashingService: HashingService) {
        this.Model = model;
        this.hashingService = hashingService;
    }
    
    public create(user: IUser) {
        if (user.password) {
            user.password = this.hashingService.createHash(user.password);
        }
        const newUser = new this.Model(user);
        return newUser;
    }
    
    public async findById(userId: number) {
        const user = await this.Model.findByPk(userId);
        return user;
    }
    
    public async findByEmail(email: string) {
        const query: NonNullFindOptions = {
            where: {
                email: email,
            },
            rejectOnEmpty: false
        };
        const user = await this.Model.findOne(query);
        return user;
    }
}

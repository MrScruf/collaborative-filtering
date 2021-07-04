import Rating from "../models/Rating";
import { getManager } from "typeorm";
import User from "../models/User";
import AbstractRepository from "./AbstractRepository";
import { userInfo } from "node:os";
import Movie from "../models/Movie";


export default class UsersRepository extends AbstractRepository<User>{
    objectName = "User"
    constructor() {
        super()
    }
    async getByUsername(usernameToGet: string) {
        const data = await getManager().getRepository(this.objectName).findOne({ username: usernameToGet }, { relations: ["roles"] })
        return data as User
    }

    async getFullUserData(id: number): Promise<User> {
        const data = await getManager().getRepository(this.objectName).findOne(id, { relations: ["ratings", "roles"] })
        return data as User
    }
    async getAllFull(): Promise<User[]> {
        const users = await getManager().getRepository(this.objectName).find({ relations: ["ratings", "roles"] })
        return users as User[];
    }


    async getSumOfRatings(user: User): Promise<number> {
        const { sum } = await getManager().getRepository(Rating).createQueryBuilder("rating")
            .select("sum(rating.percentage_rating)", "sum")
            .where("rating.userIdUser = :id", { id: user.id_user })
            .getRawOne()
        return sum;
    }

    async getCountOfRatings(user: User): Promise<number> {
        const { count } = await getManager().getRepository(Rating).createQueryBuilder("rating")
            .select("count(rating.percentage_rating)", "count")
            .where("rating.userIdUser = :id", { id: user.id_user })
            .getRawOne()
        return count;
    }
    async getAllUsersRatedMovie(movie: Movie): Promise<User[]> {
        const data = await getManager().getRepository(User).find({ relations: ["ratings"],where:{ratings: {movie: movie}} })
        return data as User[]
    }
}
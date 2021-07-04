import User from "../models/User"
import UsersRepository from "../repository/UsersRepository"
import AbstractService from "./AbstractService"
import Algorithm from "./bussiness/Algorithm"
import security from "./security"
import MovieService from "./MovieService"
import RatingService from "./RatingService"
import ExpectedRating from "../models/ExpectedRating"
import Movie from "../models/Movie"
import { Not } from "typeorm"
class UsersService extends AbstractService<User, UsersRepository>{
    constructor() {
        super(new UsersRepository())
    }
    async getByUsername(username: string) {
        return this.repository.getByUsername(username)
    }
    async getFullUserData(id: number): Promise<User> {
        return this.repository.getFullUserData(id)
    }

    async login(username: string, password: string): Promise<User> {
        let user = await this.getByUsername(username)
        if (user && security.hash(password) === user.password) return user;
        return null;
    }
    async getAllFull(): Promise<User[]> {
        return this.repository.getAllFull()
    }
    async calculateMean(user: User): Promise<any> {
        user = await this.getById(user.id_user)
        const sum = await this.repository.getSumOfRatings(user)
        const count = await this.repository.getCountOfRatings(user)
        user.mean_vote = sum / count || 0
        return this.update(user);
    }
    async calculateUserExpectedRatings(user: User, similarities: Array<Array<number>>): Promise<any> {
        return MovieService.getNotSeenMovies({ id_user: user.id_user } as User).then(async movies => {
            let expectedRatings = []
            //const users = await this.repository.findAll({ where: { id_user: Not(user.id_user) } })
            for (let i = 0; i < movies.length; i++) {
                const expectedRating = await Algorithm.expectedRating(user, await RatingService.getByMovieId(movies[i]), similarities)
                let rating = { user: user, movie: movies[i], percentage_rating: expectedRating | 0 } as ExpectedRating;
                expectedRatings.push(rating)
            }
            return RatingService.saveExpectedRatings(expectedRatings)
        }).catch(error => console.error(error))
    }
    async calculateAllExpectingRatings(): Promise<any> {
        const users = await this.getAllFull();
        const promises = []
        let similarities = Array.from(Array(1), () => new Array(1))
        for (let i = 0; i < users.length; i++) {
            promises.push( this.calculateUserExpectedRatings(users[i], similarities))
        }
        return Promise.all(promises)
    }
    async getAllUsersRatedMovie(movie: Movie): Promise<User[]> {
        return this.repository.getAllUsersRatedMovie(movie);
    }
}
export default new UsersService()
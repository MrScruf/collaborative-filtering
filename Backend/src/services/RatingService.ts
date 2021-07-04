import Rating from "../models/Rating"
import AbstractService from "./AbstractService"
import RatingRepository from "../repository/RatingRepository"
import Movie from "../models/Movie";
import User from "../models/User";
import ExpectedRating from "../models/ExpectedRating";
import { RepositoryNotTreeError } from "typeorm";
class RatingService extends AbstractService<Rating, RatingRepository>{
    constructor() {
        super(new RatingRepository())
    }

    async getRatingByUnique(user: User, movie: Movie): Promise<Rating> {
        return (await this.repository.findAll({ where: { user: user, movie: movie } }))[0] as Rating;
    }

    async deleteRatingByUnique(user: User, movie: Movie): Promise<any> {
        return this.repository.delete(await this.getRatingByUnique(user, movie))
    }
    async getByMovieId(movie: Movie): Promise<Rating[]> {
        return this.repository.getByMovieId(movie);
    }
    async deleteExpectedRating(user: User, movie: Movie): Promise<any> {
        return this.repository.deleteExpectedRatingByUnique(user, movie)
    }
    async saveExpectedRatings(rating: ExpectedRating[]): Promise<any> {
        return this.repository.saveExpectedRatings(rating);
    }
    async saveExpectedRating(rating: ExpectedRating): Promise<any> {
        return this.repository.saveExpectedRating(rating);
    }
    async getExpectedRatingByUnique(user: User, movie: Movie): Promise<ExpectedRating> {
        return this.repository.getExpectedRatingByUnique(user, movie)
    }
    async getRatingsOfSameMovies(userA: User, userB: User): Promise<Rating[][]> {
        return this.repository.getRatingsOfSameMovies(userA, userB)
    }
}
export default new RatingService()
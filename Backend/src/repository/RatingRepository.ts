import AbstractRepository from "./AbstractRepository";
import Rating from "../models/Rating";
import Movie from "../models/Movie";
import { getManager } from "typeorm";
import User from "../models/User";
import ExpectedRating from "../models/ExpectedRating";


export default class RatingRepository extends AbstractRepository<Rating>{
    protected objectName = "Rating";
    constructor() {
        super()
    }
    async getByMovieId(movieIn: Movie): Promise<Rating[]> {
        const repository = getManager().getRepository(this.objectName);
        const rows = await repository.find({
            where: {
                movie: movieIn
            }
        })
        return rows as Rating[];
    }

    async saveExpectedRatings(ratings: ExpectedRating[]): Promise<any> {
        const repository = getManager().getRepository(ExpectedRating);
        const promises = []
        for (let i = 0; i < ratings.length; i++) {
            promises.push(this.saveExpectedRating(ratings[i]).then(result => result.affected === 0 && this.createExpectedRating(ratings[i])))
        }
        return Promise.all(promises)
    }
    async saveExpectedRatingsSlow(ratings: ExpectedRating[]): Promise<any> {
        const repository = getManager().getRepository(ExpectedRating);
        return repository.save(ratings)
    }
    async saveExpectedRating(rating: ExpectedRating): Promise<any> {
        const repository = getManager().getRepository(ExpectedRating);
        return repository.update({ movie: rating.movie, user: rating.user }, rating)
    }
    async createExpectedRating(rating: ExpectedRating): Promise<any> {
        const repository = getManager().getRepository(ExpectedRating);
        return repository.insert(rating)
    }
    async deleteExpectedRatingByUnique(user: User, movie: Movie): Promise<any> {
        const repository = getManager().getRepository(ExpectedRating);
        return await repository.delete({ user: user, movie: movie })
    }

    async getExpectedRatingByUnique(user: User, movie: Movie): Promise<ExpectedRating> {
        const repository = getManager().getRepository(ExpectedRating);
        return repository.findOne({ user: user, movie: movie })
    }
    async getRatingsOfSameMovies(userA: User, userB: User): Promise<Rating[][]> {
        const getMoviesUserA = getManager().getRepository(Rating).createQueryBuilder("rating")
            .select("rating.movieIdMovie")
            .where(`rating.userIdUser = ${userA.id_user} `)
        const getMoviesUserB = getManager().getRepository(Rating).createQueryBuilder("rating")
            .select("rating.movieIdMovie")
            .where(`rating.userIdUser = ${userB.id_user} `)

        let ratingsUserB = await getManager().getRepository(Rating)
            .createQueryBuilder("rating").select()
            .andWhere(`rating.movieIdMovie IN (${getMoviesUserA.getSql()})`)
            .andWhere(`rating.userIdUser = ${userB.id_user}`)
            .getMany()
        let ratingsUserA = await getManager().getRepository(Rating)
            .createQueryBuilder("rating").select()
            .andWhere(`rating.movieIdMovie IN (${getMoviesUserB.getSql()})`)
            .andWhere(`rating.userIdUser = ${userA.id_user}`)
            .getMany()

        return [ratingsUserA, ratingsUserB];
    }
}
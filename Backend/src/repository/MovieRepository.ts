import AbstractRepository from "./AbstractRepository";
import Movie from "../models/Movie";
import { getManager } from "typeorm";
import PaginatingAndSorting from "../api/paginationAndSorting/PaginationAndSorting";
import Rating from "../models/Rating";
import ExprectedRating from "../models/ExpectedRating";
import User from "../models/User";

export default class MovieRepository extends AbstractRepository<Movie> {
    protected objectName = "movie";
    constructor() {
        super()
    }
    async getFullById(id: number): Promise<Movie> {
        const repository = getManager().getRepository(this.objectName);
        const rows = await repository.findOne(id, { relations: ["genres", "actors"] });
        return rows as Movie;
    }

    async findAllFull(options?: PaginatingAndSorting): Promise<Movie[]> {
        const repository = getManager().getRepository(this.objectName);
        const rows = await repository.find({ ...options, relations: ["genres", "actors"] });
        return rows as Movie[];
    }

    async getSumOfRatings(movie: Movie): Promise<number> {
        const { sum } = await getManager().getRepository(Rating).createQueryBuilder("rating")
            .select("sum(rating.percentage_rating)", "sum")
            .where("rating.movieIdMovie = :id", { id: movie.id_movie })
            .getRawOne()
        return sum;
    }

    async getCountOfRatings(movie: Movie): Promise<number> {
        const { count } = await getManager().getRepository(Rating).createQueryBuilder("rating")
            .select("count(rating.percentage_rating)", "count")
            .where("rating.movieIdMovie = :id", { id: movie.id_movie })
            .getRawOne()
        return count;
    }

    async getRecomendations(user: User, take: number, skip: number): Promise<ExprectedRating[]> {
        const repository = getManager().getRepository(ExprectedRating);
        let data = await repository.find({ order: { percentage_rating: "DESC" }, take: take, skip: skip, where: { user: user } })
        return data
    }

    async getNotSeenMovies(user: User): Promise<Movie[]> {
        const getSeenMoviesQuery = getManager().getRepository(Rating).createQueryBuilder("rating")
            .select("rating.movieIdMovie")
            .where(`rating.userIdUser = ${user.id_user} `)

        let data = getManager().getRepository(Movie)
            .createQueryBuilder("movie").select()
            .andWhere(`movie.id_movie NOT IN (${getSeenMoviesQuery.getSql()})`).getMany()
        return data;
    }
    async getCountRated(id_user: number): Promise<number> {
        const repository = getManager().getRepository(Rating);
        const data = repository.count({ where: { user: { id_user: id_user } as User } })
        return data
    }
    async getRated(id_user: number, options?: PaginatingAndSorting): Promise<Rating[]> {
        const repository = getManager().getRepository("rating");
        const data = await repository.find({ where: { user: { id_user: id_user } as User, ...options.where }, skip: options.skip, take: options.take, order: options.order , relations:["movie"]})
        return data as Rating[]
    }
}
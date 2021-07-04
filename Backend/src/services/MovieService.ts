import Movie from "../models/Movie"
import AbstractService from "./AbstractService"
import MovieRepository from "../repository/MovieRepository"
import PaginatingAndSorting from "../api/paginationAndSorting/PaginationAndSorting"
import User from "../models/User"
import Rating from "../models/Rating"

class MovieService extends AbstractService<Movie, MovieRepository>{
    //TODO: Dodelat ukladani vazeb filmu
    constructor() {
        super(new MovieRepository())
    }
    getFullById(id: number): Promise<Movie> {
        return this.repository.getFullById(id)
    }

    async findAllFull(options?: PaginatingAndSorting): Promise<Movie[]> {
        return this.repository.findAllFull(options)
    }
    async calculateAvg(movie: Movie): Promise<any> {
        const sum = await this.repository.getSumOfRatings(movie)
        const count = await this.repository.getCountOfRatings(movie)
        movie = await this.getById(movie.id_movie)
        movie.avg_rating = sum / count;
        return this.repository.update(movie);
    }

    async getRecomendations(user: User, take: number, skip: number): Promise<any[]> {
        return (await this.repository.getRecomendations(user, take, skip)).map(expRating => { return { movie: expRating.movie, expected_rating: expRating.percentage_rating } });
    }

    async getNotSeenMovies(user: User): Promise<Movie[]> {
        return this.repository.getNotSeenMovies(user)
    }
    async getCountRated(id_user: number): Promise<number> {
        return this.repository.getCountRated(id_user);
    }
    async getRated(id_user: number, options?: PaginatingAndSorting): Promise<Rating[]> {
        return (await this.repository.getRated(id_user, options)).map(rating => {
            rating["user"] = undefined
            return rating
        });
    }
}
export default new MovieService()
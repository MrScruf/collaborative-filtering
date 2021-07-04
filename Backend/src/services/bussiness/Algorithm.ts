import Rating from "../../models/Rating";
import Movie from "../../models/Movie";
import User from "../../models/User";
import MovieService from "../MovieService";
import RatingService from "../RatingService";
import UsersService from "../UsersService";
var similarity = require('compute-cosine-similarity');

class Algorithm {
    normalizer: number;
    constructor(){
        this.normalizer = 0.8
    }
    cosinSimilarity(a: Rating[], b: Rating[]): number {
        let sum_of_mult = 0;
        let sum_a_pow = 0
        let sum_b_pow = 0
        if (!a || !b) return 0;
        for (let i = 0; i < a.length; i++) {
            sum_of_mult += a[i].percentage_rating * b[i].percentage_rating
            sum_a_pow += a[i].percentage_rating ** 2
            sum_b_pow += b[i].percentage_rating ** 2
        }
        return sum_of_mult / (Math.sqrt(sum_a_pow) * Math.sqrt(sum_b_pow))
    }

    normalize(rating: number): number {
        if (rating > 100) return 100;
        if (rating < 0) return 0
        return rating
    }

    async getRatings(userA: User, userB: User): Promise<Rating[][]> {
        return await RatingService.getRatingsOfSameMovies(userA, userB);
    }

    async expectedRating(user: User, movieRatings: Rating[], similarities: Array<Array<number>>): Promise<number> {
        let sum = 0;
        for (let i = 0; i < movieRatings.length; i++) {
            let similarity = (similarities[user.id_user] && similarities[user.id_user][movieRatings[i].user.id_user]) || (similarities[movieRatings[i].user.id_user]&& similarities[movieRatings[i].user.id_user][user.id_user]);
            if (!similarity) {
                const vectors = await this.getRatings(user, movieRatings[i].user)
                similarity = this.cosinSimilarity(vectors[0], vectors[1])
                if(!similarities[user.id_user]){
                    similarities[user.id_user] = []
                }
                similarities[user.id_user][movieRatings[i].user.id_user] = similarity

            }
            const data = similarity * (movieRatings[i].percentage_rating - movieRatings[i].user.mean_vote)
            sum += data
        }
        sum *= this.normalizer;
        return this.normalize(user.mean_vote + sum);
    }

    meanUserRanking(user: User): number {
        const sum = user.ratings.reduce((total, currentValue) => {
            return total + currentValue.percentage_rating;
        }, 0)
        return sum / user.ratings.length || 0;
    }
    getNormalizer(): number{
        return this.normalizer;
    }
    setNormalizer(value: number): void{
        this.normalizer = value;
    }
}

export default new Algorithm()
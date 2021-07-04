import security from "../services/security";
import User from "../models/User";
import UsersService from "../services/UsersService";
import MovieService from "../services/MovieService";
import RatingService from "../services/RatingService";
import Rating from "../models/Rating";

async function createUser(name: string) {
    const user = {
        username: name,
        password: security.hash("heslo1"),
        ratings: [],
        roles: [],
        mean_vote: 0
    } as User
    return await UsersService.create(user)
}

async function prepareTest(numOfUsers: number) {
    let users = []
    for (let i = 0; i < numOfUsers; i++) {
        users.push(await createUser("user" + i))
    }
    const movies = await MovieService.findAll()
    let promisesOut = []
    for (let user of users) {
        const index = Math.floor(Math.random() * movies.length / 2)
        const len = (index + Math.floor(movies.length / 2))
        let promises = []
        for (let i = index; i < len; i++) {
            const rating = {
                movie: movies[i],
                user: user,
                percentage_rating: 50
            } as Rating
            promises.push(RatingService.update(rating))
        }
        promisesOut.push(Promise.all(promises).then(async (values) => {
            await UsersService.calculateMean(user)
        }))
    }
    await Promise.all(promisesOut)
    let moviePromises = []
    for (let movie of movies) {
        moviePromises.push(MovieService.calculateAvg(movie))
    }
    await Promise.all(moviePromises)
}

function memory() {
    const arr = [1, 2, 3, 4, 5, 6, 9, 7, 8, 9, 10];
    arr.reverse();
    const used = process.memoryUsage() as any;
    for (let key in used) {
        console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
    }
}

async function runTest(runs: number, numOfUsers: number) {
    console.time("data")
    await prepareTest(numOfUsers)
    console.timeEnd("data")
    memory()
    for (let i = 0; i < runs; i++) {
        console.time("test")
        await UsersService.calculateAllExpectingRatings()
        console.timeEnd("test")
    }
    memory()
}

export default runTest;
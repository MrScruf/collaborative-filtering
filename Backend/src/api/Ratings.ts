import express from "express"
import SecurityRequest from "../types/security/SecurityRequest";
import jwtAuthenticator from "../validators/authentication/jwtAuthentication"

import { validationResult } from 'express-validator';
import authorization from "../validators/authorization";
import RatingEntityValidator from "../validators/entities/RatingEntityValidator";
import RatingService from "../services/RatingService";
import MovieService from "../services/MovieService";
import Rating from "../models/Rating";
import UsersService from "../services/UsersService";
import Movie from "../models/Movie";
import User from "../models/User";

var router = express.Router();

router.post("/:idMovie", jwtAuthenticator.authenticateTokenFromHeader, RatingEntityValidator.insertValidator, async (req: SecurityRequest, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let rating = new Rating()
        rating.user = await UsersService.getById(req.securityData.data.id_user)
        rating.movie = await MovieService.getById(parseInt(req.params.idMovie))
        rating.percentage_rating = req.body.percentage_rating
        rating.text_rating = req.body.text_rating
        await RatingService.create(rating)
        res.sendStatus(200)
    } catch (e) {
        res.status(500).send("Došlo k chybě")
    }
})

router.put("/:idMovie", jwtAuthenticator.authenticateTokenFromHeader, RatingEntityValidator.insertValidator, async (req: SecurityRequest, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let rating;
        const user = { id_user: req.securityData.data.id_user } as User
        const movie = { id_movie: parseInt(req.params.idMovie) } as Movie
        let deleteExpected = false
        if (!(rating = await RatingService.getRatingByUnique(user, movie))) {
            rating = new Rating()
            rating.user = user
            rating.movie = movie
            deleteExpected = true;
        }
        rating.percentage_rating = req.body.percentage_rating
        rating.text_rating = req.body.text_rating
        await RatingService.update(rating)
        await MovieService.calculateAvg(movie)
        await UsersService.calculateMean(user)
        if (deleteExpected) await RatingService.deleteExpectedRating(user, movie)
        res.sendStatus(200)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete("/:idMovie", jwtAuthenticator.authenticateTokenFromHeader, authorization.ratingAuthorization, async (req: SecurityRequest, res: express.Response) => {
    try {
        await RatingService.deleteRatingByUnique({ id_user: req.securityData.data.id_user } as User, { id_movie: parseInt(req.params.idMovie) } as Movie)
        res.sendStatus(204)
    } catch (e) {
        res.status(500).send("Došlo k chybě")
    }
})

router.get("/:idMovie", jwtAuthenticator.authenticateTokenFromHeader, async (req: SecurityRequest, res: express.Response) => {
    try {
        res.send(await RatingService.getRatingByUnique({ id_user: req.securityData.data.id_user } as User, { id_movie: parseInt(req.params.idMovie) } as Movie))
    } catch (e) {
        res.status(500).send("Došlo k chybě")
    }
})



export default router;
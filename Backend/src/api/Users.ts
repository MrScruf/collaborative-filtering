import express from "express"
import UsersService from "../services/UsersService"
import RoleService from "../services/RoleService"

import { validationResult } from 'express-validator';
import LoginObjectValidator from "../validators/authentication/LoginObjectValidation"
import jwt from "../services/security/jwt"
import User from "../models/User";
import SecurityRequest from "../types/security/SecurityRequest";
import jwtAuthenticator from "../validators/authentication/jwtAuthentication"
import authorization from "../validators/authorization";
import RatingEntityValidator from "../validators/entities/RatingEntityValidator";
import RatingService from "../services/RatingService";
import Movie from "../models/Movie";
import MovieService from "../services/MovieService";
import UserEntityValidator from "../validators/entities/UserEntityValidator";
import security from "../services/security";
import PaginatingAndSorting from "./paginationAndSorting/PaginationAndSorting";

var router = express.Router();
router.post("/register", UserEntityValidator.insertValidator, async (req: SecurityRequest, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const role = await RoleService.getByName("user")
        let user = {
            username: req.body.username,
            password: security.hash(req.body.password),
            roles: [role]
        } as User
        user = await UsersService.create(user)
        UsersService.calculateUserExpectedRatings(user, [])
        const { password, ratings, mean_vote, ...securityContextUser } = { ...user }
        res.status(200).json({ roles: securityContextUser.roles.map(role => role.name), token: jwt.generateAccessToken(securityContextUser) })
    } catch (e) {
        res.status(500).send("Došlo k chybě")
    }


})

//Ratings
router.post(":idUser/ratings/:idMovie", jwtAuthenticator.authenticateTokenFromHeader, authorization.adminAuthorization, authorization.ratingAuthorization, RatingEntityValidator.insertValidator, async (req: SecurityRequest, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty() || req.body.id_movie != req.params.idMovie || req.body.id_user != req.params.idUser) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        await RatingService.create(req.body)
        res.sendStatus(200)
    } catch (e) {
        res.status(500).send("Došlo k chybě")
    }
})

router.put(":idUser/ratings/:idMovie", jwtAuthenticator.authenticateTokenFromHeader, authorization.adminAuthorization, authorization.ratingAuthorization, RatingEntityValidator.updateValidator, async (req: SecurityRequest, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty() || req.body.id_movie != req.params.idMovie || req.body.id_user != req.params.idUser) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        await RatingService.update(req.body)
        res.sendStatus(204)
    } catch (e) {
        res.status(500).send("Došlo k chybě")
    }
})

router.delete(":idUser/ratings/:idMovie", jwtAuthenticator.authenticateTokenFromHeader, authorization.adminAuthorization, authorization.ratingAuthorization, async (req: SecurityRequest, res: express.Response) => {
    try {
        await RatingService.deleteRatingByUnique({ id_user: parseInt(req.params.idUser) } as User, { id_movie: parseInt(req.params.idMovie) } as Movie)
        res.sendStatus(204)
    } catch (e) {
        res.status(500).send("Došlo k chybě")
    }
})

router.get("/movies/recommendations", jwtAuthenticator.authenticateTokenFromHeader, async (req: SecurityRequest, res: express.Response) => {
    res.json(await MovieService.getRecomendations({ id_user: req.securityData.data.id_user } as User, 10, 0))
})

//Login
router.post("/login", async (req: SecurityRequest, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    let user: User;
    if ((user = await UsersService.login(req.body.username, req.body.password))) {
        const { password, ratings, mean_vote, ...securityContextUser } = { ...user }
        res.status(200).json({ roles: securityContextUser.roles.map(role => role.name), token: jwt.generateAccessToken(securityContextUser) })
    } else {
        res.status(401).send("Wrong credentials")
    }
})

router.post("/renew", jwtAuthenticator.authenticateTokenFromHeader, async (req: SecurityRequest, res: express.Response) => {
    res.status(200).json({ roles: req.securityData.data.roles.map(role => role.name), token: jwt.generateAccessToken(req.securityData.data), username: req.securityData.data.username })
})

router.get("/count/all", jwtAuthenticator.authenticateTokenFromHeader, authorization.adminAuthorization, async (req: SecurityRequest, res: express.Response) => {
    UsersService.getCount().then(count => {
        res.json(count)
    }).catch(error => {
        res.status(500).send("Error")
    })
})
router.get("", jwtAuthenticator.authenticateTokenFromHeader, authorization.adminAuthorization, async (req: SecurityRequest, res: express.Response) => {
    const paginationSortingObject = new PaginatingAndSorting();
    req.query.limit && (paginationSortingObject.take = parseInt(req.query.limit as string))
    !req.query.limit && delete paginationSortingObject.take
    req.query.offset && (paginationSortingObject.skip = parseInt(req.query.offset as string))
    !req.query.offset && delete paginationSortingObject.skip
    try {
        return res.status(200).json(await UsersService.findAll(paginationSortingObject))
    } catch (e) {
        return res.status(500).send("Došlo k chybě")
    }
})
router.get("/:id", jwtAuthenticator.authenticateTokenFromHeader, authorization.adminAuthorization, async (req: SecurityRequest, res: express.Response) => {
    UsersService.getById(parseInt(req.params.id)).then(user => {
        delete user.password
        res.json(user)
    }).catch(error => {
        res.status(500).send("Error")
    })
})

export default router;
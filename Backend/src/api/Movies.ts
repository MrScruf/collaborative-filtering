import express from "express"
import SecurityRequest from "../types/security/SecurityRequest";
import jwtAuthenticator from "../validators/authentication/jwtAuthentication"

import { validationResult } from 'express-validator';
import MovieEntityValidator from "../validators/entities/MovieEntityValidator";
import MovieService from "../services/MovieService";
import authorization from "../validators/authorization";
import PaginatingAndSorting from "./paginationAndSorting/PaginationAndSorting";
import { ILike, Like } from "typeorm";
import User from "../models/User";

var router = express.Router();

router.post("/", MovieEntityValidator.insertValidator, jwtAuthenticator.authenticateTokenFromHeader, authorization.adminAuthorization, async (req: SecurityRequest, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        await MovieService.create(req.body)
        res.sendStatus(200)
    } catch (e) {
        res.status(500).send("Došlo k chybě")
    }
})
router.put("/:id", MovieEntityValidator.updateValidator, jwtAuthenticator.authenticateTokenFromHeader, authorization.adminAuthorization, async (req: SecurityRequest, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const id = parseInt(req.params.id)
        if (isNaN(id)) return res.status(400).send("Špatný formát id")
        await MovieService.update(req.body)
        res.sendStatus(200)
    } catch (e) {
        res.status(500).send("Došlo k chybě")
    }
})
router.delete("/:id", jwtAuthenticator.authenticateTokenFromHeader, authorization.adminAuthorization, async (req: SecurityRequest, res: express.Response) => {
    try {
        const id = parseInt(req.params.id)
        if (isNaN(id)) return res.status(400).send("Špatný formát id")
        await MovieService.deleteById(parseInt(req.params.id))
        return res.sendStatus(204)
    } catch (e) {
        return res.status(500).send("Došlo k chybě")
    }
})
router.get("/", async (req: SecurityRequest, res: express.Response) => {
    const paginationSortingObject = new PaginatingAndSorting();
    paginationSortingObject.where = {}
    paginationSortingObject.order = {}
    req.query.limit && (paginationSortingObject.take = parseInt(req.query.limit as string))
    req.query.offset && (paginationSortingObject.skip = parseInt(req.query.offset as string))
    req.query.sort && (paginationSortingObject.order[req.query.sort as string] = "ASC")
    req.query.order && (paginationSortingObject.order[req.query.sort as string] = req.query.order as string)
    req.query.name && (paginationSortingObject.where["name"] = ILike(`${req.query.name}%`))
    req.query.release_year && (paginationSortingObject.where["release_year"] = req.query.release_year as string)
    try {
        return res.status(200).json(await MovieService.findAllFull(paginationSortingObject));
    } catch (e) {
        return res.status(500).send("Došlo k chybě")
    }
})
router.get("/:id", async (req: SecurityRequest, res: express.Response) => {
    try {
        const id = parseInt(req.params.id)
        if (isNaN(id)) return res.status(400).send("Špatný formát id")
        return res.status(200).json(await MovieService.getFullById(id))
    } catch (e) {
        return res.sendStatus(404)
    }
})
router.get("/count/all", async (req: SecurityRequest, res: express.Response) => {
    res.json(await MovieService.getCount())
})

router.get("/users/rated/count", jwtAuthenticator.authenticateTokenFromHeader, async (req: SecurityRequest, res: express.Response) => {
    try {
        res.json(await MovieService.getCountRated(req.securityData.data.id_user))
    } catch (e) {
        res.status(500).send("Error")
    }

})
router.get("/users/rated", jwtAuthenticator.authenticateTokenFromHeader, async (req: SecurityRequest, res: express.Response) => {
    const paginationSortingObject = new PaginatingAndSorting();
    paginationSortingObject.where = {}
    paginationSortingObject.order = {}
    req.query.limit && (paginationSortingObject.take = parseInt(req.query.limit as string))
    req.query.offset && (paginationSortingObject.skip = parseInt(req.query.offset as string))
    if (req.query.sort) {
        if (req.query.sort === "rating")
            paginationSortingObject.order = { percentage_rating: "DESC" }
    }
    if (req.query.order) {
        if (req.query.sort === "rating")
            paginationSortingObject.order["percentage_rating"] = req.query.order as string
    }
    if (!req.query.sort) {
        (paginationSortingObject.order = { create_datetime: "DESC" })
    }
    try {
        return res.status(200).json(await MovieService.getRated(req.securityData.data.id_user, paginationSortingObject));
    } catch (e) {
        return res.status(500).send("Došlo k chybě")
    }
})
router.get("/users/:id/rated/count", jwtAuthenticator.authenticateTokenFromHeader, authorization.adminAuthorization, async (req: SecurityRequest, res: express.Response) => {
    try {
        res.json(await MovieService.getCountRated(parseInt(req.params.id)))
    } catch (e) {
        res.status(500).send("Error")
    }

})
router.get("/users/:id/rated", jwtAuthenticator.authenticateTokenFromHeader, authorization.adminAuthorization, async (req: SecurityRequest, res: express.Response) => {
    const paginationSortingObject = new PaginatingAndSorting();
    paginationSortingObject.where = {}
    paginationSortingObject.order = {}
    req.query.limit && (paginationSortingObject.take = parseInt(req.query.limit as string))
    req.query.offset && (paginationSortingObject.skip = parseInt(req.query.offset as string))
    if (req.query.sort) {
        if (req.query.sort === "rating")
            paginationSortingObject.order = { percentage_rating: "DESC" }
    }
    if (req.query.order) {
        if (req.query.sort === "rating")
            paginationSortingObject.order["percentage_rating"] = req.query.order as string
    }
    if (!req.query.sort) {
        (paginationSortingObject.order = { create_datetime: "DESC" })
    }
    try {
        return res.status(200).json(await MovieService.getRated(parseInt(req.params.id), paginationSortingObject));
    } catch (e) {
        return res.status(500).send("Došlo k chybě")
    }
})

export default router;
import express from "express"
import SecurityRequest from "../types/security/SecurityRequest";
import jwtAuthenticator from "../validators/authentication/jwtAuthentication"

import { validationResult } from 'express-validator';
import authorization from "../validators/authorization";
import RatingEntityValidator from "../validators/entities/RatingEntityValidator";
import RatingService from "../services/RatingService";
import PaginatingAndSorting from "./paginationAndSorting/PaginationAndSorting";
import { ILike } from "typeorm";
import GenreService from "../services/GenreService";

var router = express.Router();

router.get("/", async (req: SecurityRequest, res: express.Response) => {
    const paginationSortingObject = new PaginatingAndSorting();
    paginationSortingObject.where = {}
    req.query.limit && (paginationSortingObject.take = parseInt(req.query.limit as string))
    req.query.offset && (paginationSortingObject.skip = parseInt(req.query.offset as string))
    req.query.name && (paginationSortingObject.where["name"] = ILike(`${req.query.name}%`))
    try {
        return res.status(200).json(await GenreService.findAll(paginationSortingObject));
    } catch (e) {
        return res.status(500).send("Došlo k chybě")
    }
})

export default router;
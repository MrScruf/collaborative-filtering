import express from "express"
import SecurityRequest from "../types/security/SecurityRequest";
import jwtAuthenticator from "../validators/authentication/jwtAuthentication"
import authorization from "../validators/authorization";
import UsersService from "../services/UsersService";
import Algorithm from "../services/bussiness/Algorithm";
import User from "../models/User";

var router = express.Router();

let interval = setInterval(() => UsersService.calculateAllExpectingRatings(),
    10 * 60 * 1000)

router.post("/calculate", jwtAuthenticator.authenticateTokenFromHeader, authorization.adminAuthorization, async (req: SecurityRequest, res: express.Response) => {
    clearInterval(interval)
    UsersService.calculateAllExpectingRatings().then(result => {
        return res.status(200).send("Done")
    }).catch(error => {
        return res.status(500).send("Error")
    }).finally(() => {
        interval = setInterval(() => UsersService.calculateAllExpectingRatings(),
            10 * 60 * 1000)
    })
})

router.get("/normalizer", jwtAuthenticator.authenticateTokenFromHeader, authorization.adminAuthorization, async (req: SecurityRequest, res: express.Response) => {
    res.json(Algorithm.getNormalizer())
})

router.put("/normalizer", jwtAuthenticator.authenticateTokenFromHeader, authorization.adminAuthorization, async (req: SecurityRequest, res: express.Response) => {
    try {
        const value = parseFloat(req.body.normalizer)
        Algorithm.setNormalizer(value)
        res.send("OK")
    } catch (e) {
        res.status(400).send("Chyba")
    }
})

router.post("/similarity", jwtAuthenticator.authenticateTokenFromHeader, authorization.adminAuthorization, async (req: SecurityRequest, res: express.Response) => {
    try {
        const idFirst = parseInt(req.body.first)
        const idSecond = parseInt(req.body.second)
        const vectors = await Algorithm.getRatings({ id_user: idFirst } as User, { id_user: idSecond } as User)
        res.json(Algorithm.cosinSimilarity(vectors[0], vectors[1]))
    } catch (e) {
        console.log(e)
        res.status(400).send("Error")
    }

})
export default router;
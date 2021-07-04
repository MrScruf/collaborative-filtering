import SecurityRequest from "../../types/security/SecurityRequest";
import { Response } from 'express';
import SecurityData from "../../types/security/SecurityData";

function adminAuthorization(req: SecurityRequest, res: Response, next: any) {
    if (isAdmin(req.securityData)) {
        return next();

    }
    return res.sendStatus(403);
}
function isAdmin(securityData: SecurityData): boolean {
    return securityData.data.roles.some(role => {
        return role.name === "admin"
    });
}

function ratingAuthorization(req: SecurityRequest, res: Response, next: any) {
    if (req.body.id_user === req.securityData.data.id_user) {
        return next();
    }
    return res.status(403).send("Not authorized");
}

export default {
    adminAuthorization, ratingAuthorization
}
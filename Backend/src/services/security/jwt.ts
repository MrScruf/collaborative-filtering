import User from "../../models/User";

var jwt = require('jsonwebtoken');

const securityToken = process.env.TOKEN_SECRET || "tajneHeslo"

function generateAccessToken(data: any) {
    return jwt.sign({data: data}, securityToken, { expiresIn: '10h' });
}

function verify(authToken: string, callback: (err: any, user: any) => any) {
    jwt.verify(authToken, securityToken, callback)
}
export default {
    generateAccessToken,
    verify
}
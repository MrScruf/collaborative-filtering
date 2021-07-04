import jwt from "../../services/security/jwt"
import { Response } from 'express';
import SecurityRequest from "../../types/security/SecurityRequest";
import SecurityData from "../../types/security/SecurityData";

const HEADER_NAME=  "Authorization"
const HEADER_PREFIX = "Bearer "

function authenticateTokenFromHeader(req: SecurityRequest, res: Response, next: any) {
  const authHeader = req.header(HEADER_NAME);
  if (!authHeader) return res.status(401).send("Not authenticated")
  const prefix = authHeader.slice(0,7)
  const token = authHeader.substr(7)
  if(prefix !== HEADER_PREFIX)return res.status(401).send("Not authenticated")

  jwt.verify(token, (err: any, securityData: SecurityData) => {
    if (err) {
      return res.status(401).send("Not authenticated")
    }
    req.securityData = securityData
    next()
  })
}

export default{
  authenticateTokenFromHeader
}
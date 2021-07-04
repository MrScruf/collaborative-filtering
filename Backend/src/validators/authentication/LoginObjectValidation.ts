import { body } from 'express-validator';

let insertValidator = [
    body("password").notEmpty().isString().isLength({min: 6}),
    body("username").notEmpty().isAlphanumeric()
]
export default{
    insertValidator
}
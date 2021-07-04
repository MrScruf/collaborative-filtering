import { body } from 'express-validator';
import Validator from '../../types/validators/validator';

let insertValidator = [
    body("name").notEmpty().isAlpha(),
]

let updateValidator = [
    ...insertValidator,
    body("id_genre").notEmpty().isNumeric()
]

export default {
    insertValidator, updateValidator
} as Validator
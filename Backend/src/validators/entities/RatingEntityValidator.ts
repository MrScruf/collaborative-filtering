import { body } from 'express-validator';
import Validator from '../../types/validators/validator';

let insertValidator = [
    body("percentage_rating").notEmpty().isNumeric(),
    body("text_rating").isString(),
]

let updateValidator = [
    ...insertValidator,
]

export default {
    insertValidator, updateValidator
} as Validator
import { body } from 'express-validator';
import Validator from '../../types/validators/validator';

let insertValidator = [
    body("name").notEmpty().isAlphanumeric(),
]

let updateValidator = [
    ...insertValidator,
    body("id_role").notEmpty().isNumeric()
]

export default {
    insertValidator, updateValidator
} as Validator
import { body } from 'express-validator';
import UsersRepository from '../../repository/UsersRepository';
import Validator from '../../types/validators/validator';

let insertValidator = [
    body("username").notEmpty().isAlphanumeric().custom(value=>{
        return new UsersRepository().getByUsername(value).then((user:any)=>{
            if(user)return Promise.reject("Username already exists");
        })
    }),
    body("password").notEmpty().isString().isLength({min: 6}),
]

let updateValidator = [
    ...insertValidator,
    body("id_user").notEmpty().isNumeric()
]

export default {
    insertValidator, updateValidator
} as Validator
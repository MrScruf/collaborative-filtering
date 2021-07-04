import { body } from 'express-validator';
import Validator from '../../types/validators/validator';

let insertValidator = [
    body("name").notEmpty().isString(),
    body("description").notEmpty().isString(),
    body("release_year").notEmpty().isNumeric(),
    body("img_url").notEmpty().isString(),
    body("actors").isArray().custom(actors => {
        for (let actor of actors) {
            if(!actor.name)return Promise.reject("Neplatny herec prirazeny k filmu") 
        }
        return Promise.resolve()
    }),
    body("genres").isArray().custom(genres => {
        for (let genre of genres) {
            if(!genre.name)return Promise.reject("Neplatny zanr prirazeny k filmu") 
        }
        return Promise.resolve()
    }),
]

let updateValidator = [
    ...insertValidator,
    body("id_movie").notEmpty().isNumeric()
]

export default {
    insertValidator, updateValidator
} as Validator
import Genre from "../models/Genre";
import AbstractRepository from "./AbstractRepository";
import { getManager } from "typeorm";

export default class GenreRepository extends AbstractRepository<Genre>{
    objectName = "Genre"
    constructor() {
        super()
    }
    async getByName(nameToGet: String) {
        return await getManager().getRepository(this.objectName).findOne({name: nameToGet}) as Genre
    }
}
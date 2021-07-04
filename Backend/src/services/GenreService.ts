import Genre from "../models/Genre"
import AbstractService from "./AbstractService"
import GenreRepository from "../repository/GenreRepository"
class GenreService extends AbstractService<Genre, GenreRepository>{
    constructor() {
        super(new GenreRepository())
    }
}
export default new GenreService()
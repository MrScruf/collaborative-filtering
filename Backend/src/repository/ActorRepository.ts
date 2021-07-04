import Actor from "../models/Actor";
import AbstractRepository from "./AbstractRepository";

export default class ActorRepository extends AbstractRepository<Actor>{
    protected objectName = "Actor";
    constructor() {
        super()
    }
}
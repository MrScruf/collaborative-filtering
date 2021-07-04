import Actor from "../models/Actor"
import AbstractService from "./AbstractService"
import ActorRepository from "../repository/ActorRepository"
class ActorService extends AbstractService<Actor, ActorRepository>{
    constructor() {
        super(new ActorRepository())
    }
}
export default new ActorService()
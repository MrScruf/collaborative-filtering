import AbstractRepository from "./AbstractRepository";
import Role from "../models/Role";
import { getManager } from "typeorm";

export default class RoleRepository extends AbstractRepository<Role>{

    protected objectName = "Role";
    constructor() {
        super()
    }

    async getUserRolesById(id: number): Promise<Role[]> {
        return null;
    }
    async getByName(name: string): Promise<Role> {
        const repository = getManager().getRepository(Role);
        return repository.findOne({ where: { name: name } })
    }
}
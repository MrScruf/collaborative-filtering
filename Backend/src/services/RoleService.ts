import Role from "../models/Role"
import AbstractService from "./AbstractService"
import RoleRepository from "../repository/RoleRepository"
class RoleService extends AbstractService<Role, RoleRepository>{

    constructor() {
        super(new RoleRepository())
    }

    async getUserRolesById(id: number): Promise<Array<Role>> {

        return this.repository.getUserRolesById(id);
    }
    async getByName(name: string): Promise<Role> {
        return this.repository.getByName(name)
    }
}
export default new RoleService()
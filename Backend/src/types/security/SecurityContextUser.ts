import Role from "../../models/Role";

export default interface SecurityContextUser{
    id_user: number;
    username: string;
    roles: Array<Role>;
}
import User from "../../models/User";
import SecurityContextUser from "./SecurityContextUser";

export default interface SecurityData {
    data: SecurityContextUser;
    iat: number;
    exp: number;
}
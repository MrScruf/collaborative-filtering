import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import User from "./User";

/**
 * Class representing 1:1 table in database
 */
@Entity()
class Role {
    @PrimaryGeneratedColumn()
    id_role: number;
    @Column()
    name: string;

    @ManyToMany(type => User, user => user.roles, { cascade: true })
    users: User[];
}
export default Role;
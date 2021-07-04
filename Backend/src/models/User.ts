import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Rating from "./Rating";
import Role from "./Role";

/**
 * Class representing 1:1 table in database
 */
@Entity({ name: "users" })
class User {
    @PrimaryGeneratedColumn()
    id_user: number;
    @Column()
    username: string;
    @Column()
    password: string;

    @Column("float8", { nullable: true, default: 0 })
    mean_vote: number;

    @ManyToMany(type => Role, role => role.users, { onDelete: "CASCADE" })
    @JoinTable({ name: "user_has_role", joinColumn: { name: "id_user", referencedColumnName: "id_user" }, inverseJoinColumn: { name: "id_role", referencedColumnName: "id_role" } })
    roles?: Role[];

    @OneToMany(type => Rating, rating => rating.user, { onDelete: "CASCADE" })
    ratings?: Rating[]
}
export default User;
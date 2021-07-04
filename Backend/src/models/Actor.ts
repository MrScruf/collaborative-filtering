import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import Movie from "./Movie";

/**
 * Class representing 1:1 table in database
 */
@Entity()
class Actor {
    @PrimaryGeneratedColumn()
    id_actor: number;
    @Column()
    name: string;
    @Column({ nullable: true })
    surname: string;

    @ManyToMany(type => Movie, movie => movie.actors, { onDelete: "CASCADE" })
    movies: Movie[]
}

export default Actor;
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import Movie from "./Movie";

/**
 * Class representing 1:1 table in database
 */
@Entity()
class Genre {
    @PrimaryGeneratedColumn()
    id_genre: number;
    @Column({ unique: true })
    name: string;

    @ManyToMany(type => Movie, movie => movie.genres, { onDelete: "CASCADE" })
    movies: Movie[]
}

export default Genre;
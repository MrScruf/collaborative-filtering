import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Actor from "./Actor";
import Genre from "./Genre";
import Rating from "./Rating";

/**
 * Class representing 1:1 table in database
 */
@Entity()
class Movie {
    @PrimaryGeneratedColumn()
    id_movie: number;
    @Column()
    name: string;
    @Column()
    description: string;
    @Column("int")
    release_year: number;
    @Column({ nullable: true })
    img_url: string;
    @Column("float8",{ nullable: false, default: 0 })
    avg_rating: number;

    @OneToMany(type => Rating, rating => rating.movie, { cascade: true })
    ratings: Rating[]

    @ManyToMany(type => Genre, genre => genre.movies, { cascade: true })
    @JoinTable({ name: "movie_has_genre", joinColumn: { name: "id_movie", referencedColumnName: "id_movie" }, inverseJoinColumn: { name: "id_genre", referencedColumnName: "id_genre" } })
    genres: Genre[]

    @ManyToMany(type => Actor, actor => actor.movies, { cascade: true })
    @JoinTable({ name: "movie_has_actor", joinColumn: { name: "id_movie", referencedColumnName: "id_movie" }, inverseJoinColumn: { name: "id_actor", referencedColumnName: "id_actor" } })
    actors: Actor[]
}

export default Movie;
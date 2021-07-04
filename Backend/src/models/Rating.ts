import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";
import Movie from "./Movie";
import User from "./User";

/**
 * Class representing 1:1 table in database
 */
@Entity()
@Unique("rating_uq", ["user", "movie"])
class Rating {
    @PrimaryGeneratedColumn()
    id_rating: number;
    @ManyToOne(() => User, user => user.ratings, { eager: true, onDelete: "CASCADE" },)
    user: User;
    @ManyToOne(() => Movie, movie => movie.ratings, { eager: true, onDelete: "CASCADE",  },)
    movie: Movie;
    @Column("integer")
    percentage_rating: number;
    @Column({ nullable: true })
    text_rating: string;
    @CreateDateColumn()
    create_datetime: Date
}

export default Rating
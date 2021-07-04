import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";
import Movie from "./Movie";
import User from "./User";

/**
 * Class representing 1:1 table in database
 */
 @Entity()
class ExpectedRating{
    @ManyToOne(() => User, { eager: true, onDelete: "CASCADE", primary:true },)
    user: User;
    @ManyToOne(() => Movie, { eager: true, onDelete: "CASCADE",primary:true  },)
    movie: Movie;
    @Column("integer")
    percentage_rating: number;
}

export default ExpectedRating;
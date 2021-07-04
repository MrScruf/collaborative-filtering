import express from 'express';
import "reflect-metadata";
import { createConnection } from "typeorm";
require("dotenv").config();
const app = express()
var cors = require('cors')
const cookieParser = require('cookie-parser');

//Nastavení globálních midlewaru
app.use(cors())
app.use(express.json());
app.use(cookieParser());

//Import routers
import UserRouter from "./api/Users"
import RoleRouter from "./api/Roles"
import MoviesRouter from "./api/Movies"
import GenreRouter from "./api/Genre"
import ActorsRouter from "./api/Actors"
import RatingsRouter from "./api/Ratings"
import AdminRouter from "./api/Admin"
//Import entities
import User from './models/User';
import Actor from './models/Actor';
import Genre from './models/Genre';
import Movie from './models/Movie';
import Rating from './models/Rating';
import Role from './models/Role';
import ExprectedRating from './models/ExpectedRating';

import UsersService from './services/UsersService';
import security from './services/security';
import MovieService from './services/MovieService';
import RatingService from './services/RatingService';
import Algorithm from './services/bussiness/Algorithm';
import RoleService from './services/RoleService';
import runTest from './tests';

createConnection({
  type: "postgres",
  host: process.env.PGHOST || "localhost",
  port: parseInt(process.env.PGPORT || "5432"),
  username: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "admin",
  database: process.env.PGDATABASE || "database",
  entities: [
    User, Actor, Genre, Movie, Rating, Role, ExprectedRating
  ],
  synchronize: true,
  logging: false,
  extra: {
    "connectionLimit": 15
  }
}).then(async connection => {
  app.use("/api/v1/users", UserRouter);
  app.use("/api/v1/roles", RoleRouter);
  app.use("/api/v1/movies", MoviesRouter);
  app.use("/api/v1/ratings", RatingsRouter);
  app.use("/api/v1/genres", GenreRouter);
  app.use("/api/v1/actors", ActorsRouter);
  app.use("/api/v1/admin", AdminRouter);
  const port = process.env.SERVER_PORT || 6666;
  app.listen(port, async () => {
    console.log(`App listening on port ${port}!`);
    console.log("Running test")
    console.log("finished test")
  });

}).catch(error => console.log("TypeORM connection error: ", error));

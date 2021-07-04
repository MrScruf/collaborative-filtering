import { ObjectLiteral } from "typeorm";

export default class PaginatingAndSorting{
    take? = 10
    skip?: number;
    order?: any
    where?: any;
}
import PaginatingAndSorting from "../api/paginationAndSorting/PaginationAndSorting";
import AbstractRepository from "../repository/AbstractRepository";

export default abstract class AbstractService<Entity, Repository extends AbstractRepository<Entity>>{

    protected repository: Repository;
    constructor(repository: Repository) {
        this.repository = repository;
    }

    async findAll(options?: PaginatingAndSorting): Promise<Entity[]> {
        return this.repository.findAll(options)
    }
    async getById(id: Number): Promise<Entity> {
        return this.repository.getById(id);
    }
    async update(entity: Entity): Promise<any> {
        return this.repository.update(entity);
    }
    async delete(entity: Entity): Promise<any> {
        return this.repository.delete(entity);
    }
    async deleteById(id: number): Promise<any>{
        return this.repository.deleteById(id)
    }
    async create(entity: Entity): Promise<any> {
        return this.repository.create(entity);
    }
    async getCount(): Promise<number>{
        return this.repository.getCount();
    }
}
import PaginatingAndSorting from "../api/paginationAndSorting/PaginationAndSorting";
import { getManager } from "typeorm";

export default abstract class Repository<T>{
    protected abstract objectName: string;
    constructor() {
    }
    async findAll(options?: PaginatingAndSorting): Promise<T[]> {
        const repository = getManager().getRepository(this.objectName);
        const rows = await repository.find(options);
        return rows as Array<T>
    }
    async getById(id: Number): Promise<T> {
        const repository = getManager().getRepository(this.objectName);
        const rows = await repository.findOne(id);
        return rows as T
    }
    async update(entity: T): Promise<any> {
        const repository = getManager().getRepository(this.objectName);
        const data = await repository.save(entity)
        return data as T
    }
    async delete(entity: T): Promise<any> {
        const repository = getManager().getRepository(this.objectName);
        const data = await repository.delete(entity);
        return data
    }
    async deleteById(id: number): Promise<any>{
        const repository = getManager().getRepository(this.objectName);
        const data = await repository.delete(id);
        return data;
    }
    async create(entity: T): Promise<any> {
        const repository = getManager().getRepository(this.objectName);
        const data = await repository.save(entity)
        return data as T
    }
    async getCount(): Promise<number>{
        const repository = getManager().getRepository(this.objectName);
        return repository.count();
    }
}
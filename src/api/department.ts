import { getDepartments } from '../db/department'
import { Memory } from '../optimizations/memory'

export class DepartmentApi {
    public getAll = this.memory.many(getDepartments)

    constructor(private readonly memory: Memory) { }
}

type ApiOf<T> = {
    // tslint:disable-next-line:ban-types
    [K in keyof T]: T[K] extends Function ? T[K] : never
}

export type DepartmentsApiSpec = ApiOf<DepartmentApi>

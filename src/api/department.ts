import { getDepartments } from '../db/department'
import { Memory } from '../optimizations/memory'
import { ApiOf } from './models'

export class DepartmentApi {
    public getAll = this.memory.many(getDepartments)

    constructor(private readonly memory: Memory) { }
}

export type DepartmentsApiSpec = ApiOf<DepartmentApi>

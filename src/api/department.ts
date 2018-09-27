import { getDepartments } from '../db/department'
import { Query } from '../db/query/models'
import { Memory } from '../optimizations/memory'
import { Department } from '../schema/models'
import { ApiOf } from './models'

export class DepartmentApi {
    public getAll = this.memory.many(
        async (filter: Query<Department>) => {
            return await getDepartments(filter)
        },
    )

    constructor(private readonly memory: Memory) { }
}

export type DepartmentsApiSpec = ApiOf<DepartmentApi>

import { Query } from '../db/query/models'
import { Memory } from '../optimizations/memory'
import { Department } from '../schema/models'
import { ApiOf } from './models'
import { DepartmentsSource } from './source'

export class DepartmentApi {
    public getAll = this.memory.many(
        async (filter: Query<Department>) => {
            return await this.source.getDepartments(filter)
        },
    )

    constructor(
        private readonly memory: Memory,
        private readonly source: DepartmentsSource,
    ) { }
}

export type DepartmentsApiSpec = ApiOf<DepartmentApi>

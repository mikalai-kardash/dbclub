import { getDepartments } from '../db/department'
import { Memory } from '../optimizations/memory'

export class DepartmentApi {
    public getAll = this.memory.many(getDepartments)

    constructor(private readonly memory: Memory) { }
}

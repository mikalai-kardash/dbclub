import { Salary } from '../db/models'
import { getSalaries } from '../db/salary'
import { createDefault } from '../optimizations/loader.factory'
import { Memory } from '../optimizations/memory'
import { ApiOf } from './models'

const getByEmployeeId = createDefault(getSalaries, (id, s) => id === s.emp_no)

export class SalaryApi {
    public getByEmployeeId = this.memory.single(
        async (id: number) => {
            return await getByEmployeeId.load(id)
        },
        {
            getFuncKey(id: number) {
                return `api/salaries/getByEmployeeId/${id}`
            },
            getKey(salary: Salary) {
                return `salaries/${salary.emp_no}/${salary.from_date}`
            },
        },
    )

    constructor(private memory: Memory) { }
}

export type SalaryApiSpec = ApiOf<SalaryApi>

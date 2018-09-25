import { getEmployeeByIds } from '../db/employee'
import { Employee } from '../db/models'
import { createDefault } from '../optimizations/loader.factory'
import { Memory } from '../optimizations/memory'

const getById = createDefault(getEmployeeByIds, (id, e) => e.emp_no === id)

export class EmployeeApi {
    public getEmployeeById = this.memory.single(
        async (id: number) => {
            return await getById.load(id)
        },
        {
            getFuncKey(id: number) {
                return `api/employees/getEmployeeById/${id}`
            },
            getKey(employee: Employee) {
                return `employees/${employee.emp_no}`
            },
        },
    )

    constructor(private memory: Memory) { }
}

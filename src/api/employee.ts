import { EmployeeList, getDepartmentsEmployees, getEmployeeByIds } from '../db/employee'
import { Employee } from '../db/models'
import { createDefault } from '../optimizations/loader.factory'
import { Memory } from '../optimizations/memory'
import { ApiOf } from './models'

const getById = createDefault(getEmployeeByIds, (id, e) => e.emp_no === id)
const getByDepartmentId = createDefault(getDepartmentsEmployees, (id, list) => id === list.dept_no)

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

    public getEmployeeListByDepartmentId = this.memory.single(
        async (id: number) => {
            const list = await getByDepartmentId.load(id)
            return list.employees
        },
        {
            getFuncKey(id: number) {
                return `api/employees/getEmployeeListByDepartmentId/${id}`
            },
            getKey(list: EmployeeList) {
                return `employee-list/${list.dept_no}`
            },
        },
    )

    constructor(private memory: Memory) { }
}

export type EmployeeApiSpec = ApiOf<EmployeeApi>

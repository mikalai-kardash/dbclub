import { DepartmentApi } from '../api/department'
import { EmployeeApi } from '../api/employee'
import { SalaryApi } from '../api/salary'
import { TitleApi } from '../api/title'
import { DepartmentSource } from '../db/department.source'
import { DefaultCache } from '../optimizations/cache'
import { Memory } from '../optimizations/memory'
import { Context } from './server'

export const context = () => {
    const data = new DefaultCache()
    const func = new DefaultCache()
    const memory = new Memory(data, func)

    const departments = new DepartmentApi(memory, new DepartmentSource())
    const employees = new EmployeeApi(memory)
    const titles = new TitleApi(memory)
    const salaries = new SalaryApi(memory)

    return {
        api: {
            departments,
            employees,
            titles,
            salaries,
        },
        cache: {
            data,
            func,
        },
    } as Context
}

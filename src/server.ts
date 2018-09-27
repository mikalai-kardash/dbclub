import { DepartmentsApiSpec } from './api/department'
import { EmployeeApiSpec } from './api/employee'
import { TitleApiSpec } from './api/title'
import { Cache } from './optimizations/cache'

export interface Context {
    api: {
        departments: DepartmentsApiSpec,
        employees: EmployeeApiSpec,
        titles: TitleApiSpec,
    },
    cache: {
        data: Cache,
        func: Cache,
    },
}

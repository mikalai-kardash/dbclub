import { DepartmentsApiSpec } from './api/department'
import { EmployeeApiSpec } from './api/employee'
import { Cache } from './optimizations/cache'

export interface Context {
    api: {
        departments: DepartmentsApiSpec,
        employees: EmployeeApiSpec,
    },
    cache: {
        data: Cache,
        func: Cache,
    },
}

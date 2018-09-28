import { DepartmentsApiSpec } from 'api/department'
import { EmployeeApiSpec } from 'api/employee'
import { SalaryApiSpec } from 'api/salary'
import { TitleApiSpec } from 'api/title'
import { Cache } from 'optimizations/cache'

export interface Context {
    api: {
        departments: DepartmentsApiSpec,
        employees: EmployeeApiSpec,
        titles: TitleApiSpec,
        salaries: SalaryApiSpec,
    },
    cache: {
        data: Cache,
        func: Cache,
    },
}

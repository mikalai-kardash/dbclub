import { DepartmentsApiSpec } from './api/department'
import { Cache } from './optimizations/cache'

export interface Context {
    api: {
        departments: DepartmentsApiSpec,
    },
    cache: {
        data: Cache,
        func: Cache,
    },
}

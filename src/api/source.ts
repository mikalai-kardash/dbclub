import { Query } from '../db/query/models'
import { Department } from '../schema/models'

export interface DepartmentsSource {
    getDepartments(filters: Query<Department>): Promise<Department[]>
}

export {
    Query,
    Department,
}

import { Department, DepartmentsSource as Source, Query } from '../api/source'
import { getDepartments } from './department'

export class DepartmentSource implements Source {
    public async getDepartments(filters: Query<Department>): Promise<Department[]> {
        const departments = await getDepartments(filters)
        return departments.map(d => ({
            id: d.dept_no,
            name: d.dept_name,
        }))
    }
}

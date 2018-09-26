import { Department } from '../schema/models'
import { Context } from '../server'
import { mapDepartment } from './mappers'

const resolveDepartments = async (_: any, _args: any, context: Context): Promise<Department[]> => {
    const departments = await context.api.departments.getAll()
    return departments.map(mapDepartment)
}

export default {
    // employee: resolveEmployee,
    // department: resolveDepartment,
    departments: resolveDepartments,
}

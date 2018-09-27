import { Query } from '../db/query/models'
import { Department } from '../schema/models'
import { Context } from '../server'
import { mapDepartment } from './mappers'

const resolveDepartments = async (_: any, args: Query<Department>, context: Context): Promise<Department[]> => {
    const departments = await context.api.departments.getAll(args)
    return departments.map(mapDepartment)
}

export default {
    departments: resolveDepartments,
}

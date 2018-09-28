import { Query } from '../db/query/models'
import { Department } from './models'
import { Context } from './server'

const resolveDepartments = async (_: any, args: Query<Department>, context: Context): Promise<Department[]> => {
    const departments = await context.api.departments.getAll(args)
    return departments
}

export default {
    departments: resolveDepartments,
}

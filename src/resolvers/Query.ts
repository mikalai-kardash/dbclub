import { Query } from '../db/query/models'
import { Context } from '../server'
import { Department } from './models'

const resolveDepartments = async (_: any, args: Query<Department>, context: Context): Promise<Department[]> => {
    const departments = await context.api.departments.getAll(args)
    return departments
}

export default {
    departments: resolveDepartments,
}

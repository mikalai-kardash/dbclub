import { Context } from '../server'
import { Employee } from './models'

const resolveTitle = async (parent: Employee, _: any, context: Context): Promise<string> => {
    const { title } = await context.api.titles.getTitleByEmployeeId(parent.id)
    return title
}

const resolveSalary = async (parent: Employee, _: any, context: Context): Promise<number> => {
    const { salary } = await context.api.salaries.getByEmployeeId(parent.id)
    return salary
}

export default {
    title: resolveTitle,
    salary: resolveSalary,
}

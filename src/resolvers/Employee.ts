import { Employee } from '../schema/models'
import { Context } from '../server'

const resolveTitle = async (parent: Employee, _: any, context: Context): Promise<string> => {
    const title = await context.api.titles.getTitleByEmployeeId(parent.id)
    return title.title
}

export default {
    title: resolveTitle,
}

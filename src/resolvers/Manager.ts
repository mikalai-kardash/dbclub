import { getEmployeeTitle } from '../db/title'
import { Manager, Title } from '../schema/models'
import { mapTitle } from './mappers'

const resolveTitle = async (parent: Manager): Promise<Title> => {
    console.log(parent.id)
    const [title] = await getEmployeeTitle(parent.id)
    return mapTitle(title)
}

export default {
    title: resolveTitle,
}

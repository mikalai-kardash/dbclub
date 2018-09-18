import { getDepartmentManagers } from '../db/manager'
import { Department, Manager } from '../schema/models'
import { mapManager } from './mappers'

const resolveManager = async (parent: Department): Promise<Manager> => {
    const [manager] = await getDepartmentManagers(parent.id)
    return mapManager(manager)
}

export default {
    manager: resolveManager,
}

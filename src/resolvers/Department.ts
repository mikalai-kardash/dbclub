import { getDepartmentEmployees } from '../db/employee'
import { getDepartmentManagers } from '../db/manager'
import { Department, Employee, Manager } from '../schema/models'
import { mapEmployees, mapManager } from './mappers'

const resolveManager = async (parent: Department): Promise<Manager> => {
    const [manager] = await getDepartmentManagers(parent.id)
    return mapManager(manager)
}

const resolveEmployees = async (parent: Department): Promise<Employee[]> => {
    const employees = await getDepartmentEmployees(parent.id)
    return employees.map(mapEmployees)
}

export default {
    manager: resolveManager,
    employees: resolveEmployees,
}

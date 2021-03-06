import { getDepartmentManagers } from '../db/manager'
import { mapEmployees, mapManager } from './mappers'
import { Department, Employee, Manager } from './models'
import { Context } from './server'

const resolveManager = async (parent: Department): Promise<Manager> => {
    const [manager] = await getDepartmentManagers(parent.id)
    return mapManager(manager)
}

const resolveEmployees = async (parent: Department, _: any, context: Context): Promise<Employee[]> => {
    const employees = await context.api.employees.getEmployeeListByDepartmentId(parent.id)
    return employees.map(mapEmployees)
}

export default {
    manager: resolveManager,
    employees: resolveEmployees,
}

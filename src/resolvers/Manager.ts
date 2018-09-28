import { getSalaryForEmployee } from '../db/salary'
import { getEmployeeTitle } from '../db/title'
import { mapSalary, mapTitle } from './mappers'
import { Manager, Salary, Title } from './models'

const resolveTitle = async (parent: Manager): Promise<Title> => {
    const [title] = await getEmployeeTitle(parent.id)
    return mapTitle(title)
}

const resolveSalary = async (parent: Manager): Promise<Salary> => {
    const [salary] = await getSalaryForEmployee(parent.id)
    return mapSalary(salary)
}

export default {
    title: resolveTitle,
    salary: resolveSalary,
}

import { queryData } from './config'
import { mapSalary } from './mappers'
import { Salary } from './models'

const getSalaryForEmployee = async (emp_no: number): Promise<Salary[]> => {
    const query = 'SELECT * FROM salaries WHERE emp_no = ? ORDER BY from_date DESC'
    const params = [emp_no]
    return await queryData(query, params, mapSalary)
}

export {
    getSalaryForEmployee,
}

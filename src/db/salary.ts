import { queryData } from './config'
import { mapSalary } from './mappers'
import { Salary } from './models'
import { toQuery } from './utils'

const getSalaryForEmployee = async (emp_no: number): Promise<Salary[]> => {
    const query = 'SELECT * FROM salaries WHERE emp_no = ? ORDER BY from_date DESC'
    const params = [emp_no]
    return await queryData(query, params, mapSalary)
}

const getSalaries = async (ids: number[]): Promise<Salary[]> => {
    const params = [...ids]
    const query = `
        SELECT *
        FROM salaries
        WHERE emp_no IN (${toQuery(ids)})
          AND to_date = DATE('9999-01-01')
    `
    return await queryData(query, params, mapSalary)
}

export {
    getSalaryForEmployee,
    getSalaries,
}

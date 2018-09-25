import { queryData } from './config'
import { mapEmloyee } from './mappers'
import { Employee } from './models'

const getEmployee = async (): Promise<Employee> => {
    const query = 'select * from employees limit 1'
    return await queryData<Employee>(query, [], mapEmloyee)[0]
}

const getDepartmentEmployees = async (dept_no: number): Promise<Employee[]> => {
    const query = `
        SELECT * FROM employees es
        INNER JOIN dept_emp de ON de.emp_no = es.emp_no
        WHERE de.dept_no = ?
        ORDER BY de.from_date DESC
        LIMIT 128
    `
    const params = [dept_no]
    return await queryData<Employee>(query, params, mapEmloyee)
}

const getEmployeeByIds = async (ids: number[]): Promise<Employee[]> => {
    const list = ids.map(_ => '?').join(', ')
    const query = `SELECT * FROM employees WHERE id IN [${list}]`
    return await queryData<Employee>(query, ids, mapEmloyee)
}

export {
    getEmployee,
    getDepartmentEmployees,
    getEmployeeByIds,
}

import { mapEmloyee } from './mappers'
import { Employee } from './models'
import { runQuery } from './run'
import { groupBy, toQuery } from './utils'

const getDepartmentEmployees = async (dept_no: number): Promise<Employee[]> => {
    const query = `
        SELECT * FROM employees es
        INNER JOIN dept_emp de ON de.emp_no = es.emp_no
        WHERE de.dept_no = ?
        ORDER BY de.from_date DESC
        LIMIT 128
    `
    const params = [dept_no]
    return await runQuery({ query, params }, mapEmloyee)
}

export interface EmployeeList {
    dept_no: number,
    employees: Employee[],
}

const getDepartmentsEmployees = async (ids: number[]): Promise<EmployeeList[]> => {
    const params = [...ids]
    const query = `
        SELECT *
        FROM employees es
        INNER JOIN dept_emp de ON de.emp_no = es.emp_no
        WHERE de.to_date = DATE('9999-01-01')
          AND de.dept_no IN (${toQuery(ids)})
        LIMIT 256
    `
    const employees = await runQuery({ query, params }, mapEmloyee)
    const grouped = groupBy(employees, 'dept_no')

    return grouped.map(g => ({
        dept_no: g.id,
        employees: g.arr,
    }))
}

const getEmployeeByIds = async (ids: number[]): Promise<Employee[]> => {
    const list = toQuery(ids)
    const query = `SELECT * FROM employees WHERE id IN (${list})`
    return await runQuery<Employee>({ query, params: ids }, mapEmloyee)
}

export {
    getDepartmentEmployees,
    getEmployeeByIds,
    getDepartmentsEmployees,
}

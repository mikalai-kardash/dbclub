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

export interface EmployeeList {
    dept_no: number,
    employees: Employee[],
}

const groupBy = <T, K extends keyof T>(arr: T[], key: K): Array<{ id: T[K], arr: T[] }> => {
    interface ReturnType { id: T[K], arr: T[] }

    const map = new Map<T[K], T[]>()

    arr.forEach(item => {
        const id = item[key]
        if (!id) { return }

        const group = map.get(id) || []
        if (group.length === 0) {
            map.set(id, group)
        }

        group.push(item)
    })

    const result: ReturnType[] = []

    for (const [id, values] of map) {
        result.push({ id, arr: values })
    }

    return result
}

const getDepartmentsEmployees = async (ids: number[]): Promise<EmployeeList[]> => {
    const params = [...ids]
    const query = `
        SELECT *
        FROM employees es
        INNER JOIN dept_emp de ON de.emp_no = es.emp_no
        WHERE de.to_date = DATE('9999-01-01')
          AND de.dept_no IN (${ids.map(_ => '?').join(', ')})
        LIMIT 256
    `
    const employees = await queryData(query, params, mapEmloyee)
    const grouped = groupBy(employees, 'dept_no')

    return grouped.map(g => ({
        dept_no: g.id,
        employees: g.arr,
    }))
}

const getEmployeeByIds = async (ids: number[]): Promise<Employee[]> => {
    const list = ids.map(_ => '?').join(', ')
    const query = `SELECT * FROM employees WHERE id IN (${list})`
    return await queryData<Employee>(query, ids, mapEmloyee)
}

export {
    getEmployee,
    getDepartmentEmployees,
    getEmployeeByIds,
    getDepartmentsEmployees,
}

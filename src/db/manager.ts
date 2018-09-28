import { mapManager } from './mappers'
import { Manager } from './models'
import { runQuery } from './run'

const getDepartmentManagers = async (dept_no: number): Promise<Manager[]> => {
    const query = `
        SELECT * FROM employees es
        INNER JOIN dept_manager dm ON dm.emp_no = es.emp_no
        WHERE dm.dept_no = ?
        ORDER BY dm.to_date DESC
    `
    const params = [dept_no]
    return await runQuery({ query, params }, mapManager)
}

export {
    getDepartmentManagers,
}

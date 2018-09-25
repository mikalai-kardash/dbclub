import { queryData } from './config'
import { Department } from './models'

const mapDepartment = (record: any): Department => {
    return {
        dept_name: record.dept_name,
        dept_no: record.dept_no,
    }
}

const queryDepartments = async (query: string, params: any[]) => {
    return await queryData<Department>(query, params, mapDepartment)
}

const getDepartmentById = async (dept_no: number): Promise<Department[]> => {
    const query = 'SELECT * FROM departments WHERE dept_no = ?'
    const params = [dept_no]
    return await queryDepartments(query, params)
}

const getDepartments = async (): Promise<Department[]> => {
    const query = 'SELECT * FROM departments LIMIT 0, 128'
    return await queryDepartments(query, [])
}

export {
    getDepartmentById,
    queryDepartments,
    getDepartments,
}

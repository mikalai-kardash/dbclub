import { Department as DepartmentSchema } from '../resolvers/models'
import { Department } from './models'
import { QueryBuilder } from './query/builder'
import { FieldNameMap, Query } from './query/models'
import { runQuery } from './run'

const mapDepartment = (record: any): Department => {
    return {
        dept_name: record.dept_name,
        dept_no: record.dept_no,
    }
}

const queryDepartments = async (query: string, params: any[]) => {
    return await runQuery({ query, params }, mapDepartment)
}

const getDepartments = async (filter: Query<DepartmentSchema>): Promise<Department[]> => {
    let query = `
        SELECT *
        FROM departments
    `

    const map: FieldNameMap<DepartmentSchema, Department> = {
        id: 'dept_no',
    }

    const builder = new QueryBuilder<DepartmentSchema>([
        'id',
        'name',
    ], map)

    const where = builder.where(filter && filter.where)

    if (where) {
        query = `${query}
        WHERE ${where.query}`
    }

    return await queryDepartments(query, [...(where && where.params || [])])
}

export {
    queryDepartments,
    getDepartments,
}

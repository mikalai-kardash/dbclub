import { queryData } from './config'
import { mapTitle } from './mappers'
import { Title } from './models'

const getEmployeeTitle = async (emp_no: number): Promise<Title[]> => {
    const query = `
        SELECT * FROM titles
        WHERE emp_no = ?
        ORDER BY titles.from_date DESC
        LIMIT 128
    `
    const params = [emp_no]
    return await queryData<Title>(query, params, mapTitle)
}

const getEmployeesTitle = async (ids: number[]): Promise<Title[]> => {
    const params = [...ids]
    const qs = ids.map(_ => '?').join(', ')
    const query = `
        SELECT * FROM titles
        WHERE to_date = DATE('9999-01-01')
          AND emp_no IN (${qs})
    `
    const titles = await queryData(query, params, mapTitle)
    return titles
}

export {
    getEmployeeTitle,
    getEmployeesTitle,
}

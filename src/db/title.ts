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

export {
    getEmployeeTitle,
}

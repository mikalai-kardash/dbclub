import { queryData } from './config'
import { mapEmloyee } from './mappers'
import { Employee } from './models'

const getEmployee = async (): Promise<Employee> => {
    const query = 'select * from employees limit 1'
    return await queryData<Employee>(query, [], mapEmloyee)[0]
}

export {
    getEmployee,
}

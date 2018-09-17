import { getEmployee } from '../db/employee'
import { Employee } from '../schema/models'

const resolveEmployee = async (): Promise<Employee> => {
    const employee = await getEmployee()
    return {
        id: employee.emp_no,
        firstName: employee.first_name,
        lastName: employee.last_name,
    }
}

export default {
    employee: resolveEmployee,
}

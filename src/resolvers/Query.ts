import { getEmployee } from '../db/employee'
import { Employee } from '../schema/models'

const tableName = 'employees'
const employeeFields = [
    'id',
    'firstName',
    'lastName',
]

interface WhereInput {
    AND?: WhereInput[]
    OR?: WhereInput[]
}

interface Args {
    where?: WhereInput
}

interface Query {
    query: string
    parameters: any[]
}

const buildQuery = (args: Args): string => {
    let query = `SELECT * FROM ${tableName}`

    if (args.where) {
        const condition = employeeFields
            .map(s => ({
                field: s,
                value: args.where[s],
            }))
            .find(f => f.value)

        if (condition) {
            query += ` WHERE ${condition.field} = ?`
        }
    }

    return query
}

const resolveEmployee = async (_parent: any, _args: any): Promise<Employee> => {
    console.log(buildQuery(_args))
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

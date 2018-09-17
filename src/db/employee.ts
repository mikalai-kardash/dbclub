import { db } from './config'
import { Employee } from './models'

const mapEmloyee = (record: any): Employee => {
    return {
        emp_no: record.emp_no,
        first_name: record.first_name,
        last_name: record.last_name,
        birth_date: record.birth_date,
        gender: record.gender,
        hire_date: record.hire_date,
    }
}

const getEmployee = async (): Promise<Employee> => {
    return new Promise<Employee>((resolve, reject) => {
        db().query('select * from employees limit 1', (err, result: any[]) => {
            if (err) {
                reject(err)
                return
            }
            resolve(result.map(mapEmloyee)[0])
        })
    })
}

export {
    getEmployee,
}

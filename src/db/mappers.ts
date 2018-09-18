import { Employee, Manager } from './models'

export const mapEmloyee = (record: any): Employee => {
    return {
        emp_no: record.emp_no,
        first_name: record.first_name,
        last_name: record.last_name,
        birth_date: new Date(record.birth_date),
        gender: record.gender,
        hire_date: new Date(record.hire_date),
    }
}

export const mapManager = (record: any): Manager => {
    const employee = mapEmloyee(record)
    return {
        ...employee,
        from_date: new Date(record.from_date),
        to_date: new Date(record.to_date),
    }
}

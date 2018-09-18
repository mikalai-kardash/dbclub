import {
    Department as DataDepartment,
    Employee as DataEmployee,
    Manager as DataManager,
} from '../db/models'
import {
    Department as SchemaDepartment,
    Employee as SchemaEmployee,
    Manager as SchemaManager,
} from '../schema/models'

export const mapEmployees = (data: DataEmployee): SchemaEmployee => {
    const gender = data.gender === 'M' ? 'MALE' : 'FEMALE'
    return {
        gender,
        id: data.emp_no,
        firstName: data.first_name,
        lastName: data.last_name,
        dob: data.birth_date,
        hireDate: data.hire_date,
        __typeName: 'Employee',
    }
}

export const mapManager = (data: DataManager): SchemaManager => {
    const employee = mapEmployees(data)
    return {
        ...employee,
        from: data.from_date,
        to: data.to_date,
        __typeName: 'Manager',
    }
}

export const mapDepartment = (data: DataDepartment): SchemaDepartment => {
    return {
        id: data.dept_no,
        name: data.dept_name,
        __typeName: 'Department',
    }
}

import {
    Department as DataDepartment,
    Employee as DataEmployee,
    Manager as DataManager,
    Salary as DataSalary,
    Title as DataTitle,
} from '../db/models'
import {
    Department as SchemaDepartment,
    Employee as SchemaEmployee,
    Manager as SchemaManager,
    Salary as SchemaSalary,
    Title as SchemaTitle,
} from './models'

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

export const mapTitle = (data: DataTitle): SchemaTitle => {
    return {
        employeeId: data.emp_no,
        name: data.title,
        from: data.from_date,
        to: data.to_date,
        __typeName: 'Title',
    }
}

export const mapSalary = (data: DataSalary): SchemaSalary => {
    return {
        employeeId: data.emp_no,
        salary: data.salary,
        from: data.from_date,
        to: data.to_date,
        __typeName: 'Salary',
    }
}

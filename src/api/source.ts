import { Query } from '../db/query/models'
import { Department, Employee, Salary, Title } from '../schema/models'

export interface DepartmentsSource {
    getDepartments(filters?: Query<Department>): Promise<Department[]>
}

type DepartmentEmployeeList = Required<{
    departmentId: string,
    employees: Employee[],
}>

export interface EmployeesSource {
    getEmployeesByIds(ids: number[], filters?: Query<Employee>): Promise<Employee[]>
    getEmployeesByDepartmentIds(ids: string[], filters?: Query<Employee>): Promise<DepartmentEmployeeList[]>
    getManagersByDepartmentIds(ids: string[], filters?: Query<Employee>): Promise<Employee[]>
}

export interface SalariesSource {
    getSalariesByEmployeeIds(ids: number[], filters?: Query<Salary>): Promise<Salary[]>
}

export interface TitlesSource {
    getTitlesByEmployeeIds(ids: number[], filters?: Query<Title>): Promise<Title[]>
}

export {
    Query,
    Department,
    Employee,
    Title,
    Salary,
}

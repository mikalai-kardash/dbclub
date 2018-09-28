export type GenderType = 'M' | 'F'

type HistoricalRecord = Partial<{
    from_date: Date,
    to_date: Date,
}>

export type DepartmentRecord = Partial<{
    dept_no: string,
    dept_name: string,
}>

export type EmployeeRecord = Partial<{
    birth_date: Date,
    emp_no: number,
    first_name: string,
    hire_date: Date,
    gender: GenderType,
    last_name: string,
}>

export type SalaryRecord = Partial<HistoricalRecord & {
    emp_no: number,
    salary: number,
}>

export type TitleRecord = Partial<HistoricalRecord & {
    emp_no: number,
    title: string,
}>

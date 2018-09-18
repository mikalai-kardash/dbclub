export interface Employee {
    emp_no: number
    first_name?: string
    last_name?: string
    birth_date?: Date
    gender?: 'M' | 'F'
    hire_date?: Date
}

export interface Manager extends Employee {
    from_date: Date
    to_date: Date
}

export interface Salary {
    emp_no: number
    salary: number
    from_date: Date
    to_date: Date
}

export interface Title {
    emp_no: number
    title: string
    from_date: Date
    to_date: Date
}

export interface Department {
    dept_no: number
    dept_name: string
}

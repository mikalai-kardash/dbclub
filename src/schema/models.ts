type TypeNames =
    'Employee' |
    'Department' |
    'Manager' |
    'Title'

type Gender =
    'MALE' |
    'FEMALE'

export interface SchemaType {
    __typeName: TypeNames
}

export interface Employee extends SchemaType {
    id: number
    firstName: string
    lastName: string
    dob: Date
    gender: Gender,
    hireDate: Date
}

export interface Manager extends Employee {
    from: Date
    to: Date
}

export interface Department extends SchemaType {
    id: number
    name?: string
    manager?: Employee
}

export interface Title extends SchemaType {
    employeeId: number
    name: string
    from: Date
    to: Date
}

export interface DepartmentWhereInput {
    AND?: DepartmentWhereInput
    OR?: DepartmentWhereInput

    id: number
    name: string
}

export interface EmployeeWhereInput {
    AND?: EmployeeWhereInput[]
    OR?: EmployeeWhereInput[]

    id?: number
    firstName?: string
    lastName?: string
}

export interface EmployeeOrderByInput {
    id?: number
    id_DESC?: number

    firstName?: string
    firstName_DESC?: string

    lastName?: string
    lastName_DESC?: string
}

export interface EmployeeArguments {
    where?: EmployeeWhereInput
    skip?: number
    limit?: number
}

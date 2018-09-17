export interface Employee {
    id: number
    firstName: string
    lastName: string
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

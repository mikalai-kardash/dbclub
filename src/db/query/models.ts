export type FieldType = string | number | boolean | Date

export interface FilterNull {
    null: true
}

export interface FilterNotNull {
    not_null: true
}

export interface FilterIn {
    in: FieldType[]
}

export type Filter =
    FilterIn |
    FilterNotNull |
    FilterNull

export type WhereInputFields<T> = {
    [K in keyof T]?: T[K] | Filter
}

export interface WhereInputAnd<T> {
    and: Array<WhereInput<T>>
}

export interface WhereInputOr<T> {
    or: Array<WhereInput<T>>
}

export type WhereInput<T> =
    WhereInputAnd<T> |
    WhereInputOr<T> |
    WhereInputFields<T>

export type OrderByInput<T> = Partial<{
    [K in keyof T]: boolean
}>

export type Query<T> = Partial<{
    where: WhereInput<T>,
    orderBy: OrderByInput<T>,
    offset: number,
    limit: number,
}>

export interface Condition {
    kind: 'filter'
    query: string
    params: FieldType[]
}

export interface OrCondition {
    kind: 'or'
    or: ConditionType[]
}

export interface AndCondition {
    kind: 'and'
    and: ConditionType[]
}

export type ConditionType =
    Condition |
    OrCondition |
    AndCondition

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

export interface FilterEq {
    eq: FieldType
}

export type Filter =
    FilterEq |
    FilterIn |
    FilterNotNull |
    FilterNull

export type WhereInputFields<T> = {
    [K in keyof T]?: Filter
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

export type SimplePaging<T> = Pick<Query<T>, 'limit' | 'offset'>

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

export type FieldNameMap<T, U> = Partial<Readonly<{
    [P in keyof T]: keyof U
}>>

export type PropertyMap = Partial<Readonly<{
    [name: string]: string,
}>>

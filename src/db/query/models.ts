type FieldType = string | number | boolean | Date

interface FilterNull {
    null: true
}

interface FilterNotNull {
    not_null: true
}

interface FilterIn<T> {
    in: T[]
}

type Filter<T> =
    FilterIn<T> |
    FilterNotNull |
    FilterNull

type WhereInputFields<T> = {
    [K in keyof T]?: T[K] | Filter<T[K]>
}

interface WhereInputAnd<T> {
    and: Array<WhereInput<T>>
}

interface WhereInputOr<T> {
    or: Array<WhereInput<T>>
}

type WhereInput<T> =
    WhereInputAnd<T> |
    WhereInputOr<T> |
    WhereInputFields<T>

type OrderByInput<T> = {
    [K in keyof T]?: boolean
}

export interface Query<T> {
    where?: WhereInput<T>
    orderBy?: OrderByInput<T>
    offset?: number
    limit?: number
}

export interface ConditionVisitor {
    visit(condition: ConditionType)

    analyze(condition: Condition)
    analyzeAnd(condition: AndCondition)
    analyzeOr(condition: OrCondition)
}

export interface ConditionVisitable {
    accept(visitor: ConditionVisitor)
}

export interface Condition extends ConditionVisitable {
    kind: 'filter'
    query: string
    params: FieldType[]
}

export interface OrCondition extends ConditionVisitable {
    kind: 'or'
    or: ConditionType[]
}

export interface AndCondition extends ConditionVisitable {
    kind: 'and'
    and: ConditionType[]
}

type ConditionType =
    Condition |
    OrCondition |
    AndCondition

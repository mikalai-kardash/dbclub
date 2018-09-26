import { AndCondition, Condition, OrCondition } from './conditions'
import {
    ConditionType,
    FieldType,
    Filter,
    FilterIn,
    FilterNotNull,
    FilterNull,
    WhereInput,
    WhereInputAnd,
    WhereInputFields,
    WhereInputOr,
} from './models'

const isAnd = <T>(where: WhereInput<T>): where is WhereInputAnd<T> => {
    if ((where as WhereInputAnd<T>).and) {
        return true
    }
}

const isOr = <T>(where: WhereInput<T>): where is WhereInputOr<T> => {
    if ((where as WhereInputOr<T>).or) {
        return true
    }
}

const isFields = <T>(where: WhereInput<T>): where is WhereInputFields<T> => {
    return !isAnd(where) && !isOr(where)
}

const isFieldType = (value: any): value is FieldType => {
    return typeof value === 'string'
        || typeof value === 'number'
        || typeof value === 'boolean'
        || value instanceof Date
}

const isFilterIn = <T>(value: Filter | T): value is FilterIn => {
    return (value as FilterIn).in !== undefined
}

const isFilterNull = <T>(value: Filter | T): value is FilterNull => {
    return (value as FilterNull).null !== undefined
}

const isFilterNotNull = <T>(value: Filter | T): value is FilterNotNull => {
    return (value as FilterNotNull).not_null !== undefined
}

const isType = <T>(value: Filter | T): value is T => {
    return !isFilterIn(value)
        && !isFilterNotNull(value)
        && !isFilterNull(value)
}

const createFilter = <T, F extends keyof T>(fields: WhereInputFields<T>, fieldNames: F[]): Condition => {
    for (const name of fieldNames) {
        const value = fields[name]

        if (!value) {
            continue
        }

        if (isFilterNull(value)) {
            return new Condition(`${name} IS NULL`, [])
        }

        if (isFilterNotNull(value)) {
            return new Condition(`${name} IS NOT NULL`, [])
        }

        if (isFilterIn(value)) {
            const values = value.in
            return new Condition(`${name} IN [${values.map(_ => '?').join(', ')}]`, [
                ...values as FieldType[],
            ])
        }

        if (isType(value)) {
            if (isFieldType(value)) {
                return new Condition(`${name} = ?`, [value])
            }
            continue
        }
    }
}

export const traverse = <T, K extends keyof T>(where: WhereInput<T>, fieldNames: K[]): ConditionType | undefined => {
    if (!where) {
        return undefined
    }

    type FiltersArrayType = 'and' | 'or'

    const filters: Array<FiltersArrayType | WhereInput<T>> = [where]
    let pending: ConditionType[] = []
    let cycles = 0

    while (filters.length > 0) {
        if (cycles > 200) {
            throw new Error('Infinite loop detected.')
        }

        cycles++

        const next = filters.pop()

        if (typeof next === 'string') {
            switch (next) {
                case 'and':
                    pending = [
                        new AndCondition([...pending]),
                    ]
                    break

                case 'or':
                    pending = [
                        new OrCondition([...pending]),
                    ]
                    break

                default: throw new Error(`Not supported: ${next}`)
            }
            continue
        }

        if (isAnd(next)) {
            filters.push('and', ...next.and)
            continue
        }

        if (isOr(next)) {
            filters.push('or', ...next.or)
            continue
        }

        if (isFields(next)) {
            pending.push(
                createFilter(next, fieldNames),
            )
        }
    }

    if (pending.length > 1) {
        throw new Error(`Parsing error. Unprocessed filters left (${pending.length}).`)
    }

    if (pending.length === 1) {
        const [condition] = pending
        return condition
    }

    return undefined
}

interface Where {
    query: string
    params: FieldType[]
}

const parse = (condition: ConditionType | undefined): Where | undefined => {
    if (!condition) {
        return undefined
    }

    type ProcessingType = 'and' | 'or'
    const processing: Array<ProcessingType | ConditionType> = [condition]
    const params: FieldType[] = []

    while (processing.length > 0) {
        const next = processing.pop()

        if (typeof next === 'string') {
            continue
        }

        switch (next.kind) {
            case 'and':
                processing.push('and', ...next.and)
                break

            case 'or':
                processing.push('or', ...next.or)
                break

        }

    }
}

import { AndCondition, Condition, OrCondition } from './conditions'
import {
    ConditionType,
    FieldNameMap,
    FieldType,
    Filter,
    FilterEq,
    FilterIn,
    FilterNotNull,
    FilterNull,
    OrderByInput,
    PropertyMap,
    SimplePaging,
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

const isFilterIn = <T>(value: Filter | T): value is FilterIn => {
    return (value as FilterIn).in !== undefined
}

const isFilterEq = <T>(value: Filter | T): value is FilterEq => {
    return (value as FilterEq).eq !== undefined
}

const isFilterNull = <T>(value: Filter | T): value is FilterNull => {
    return (value as FilterNull).null !== undefined
}

const isFilterNotNull = <T>(value: Filter | T): value is FilterNotNull => {
    return (value as FilterNotNull).not_null !== undefined
}

const createFilter = <T, F extends keyof T>(
    fields: WhereInputFields<T>,
    fieldNames: F[],
    map: PropertyMap = {},
): Condition => {
    for (const name of fieldNames) {
        const value = fields[name]

        if (!value) {
            continue
        }

        const actualName = map[name as string] || name

        if (isFilterNull(value)) {
            return new Condition(`${actualName} IS NULL`, [])
        }

        if (isFilterNotNull(value)) {
            return new Condition(`${actualName} IS NOT NULL`, [])
        }

        if (isFilterIn(value)) {
            const values = value.in
            return new Condition(`${actualName} IN (${values.map(_ => '?').join(', ')})`, [
                ...values as FieldType[],
            ])
        }

        if (isFilterEq(value)) {
            return new Condition(`${actualName} = ?`, [value.eq])
        }

        continue
    }
}

export const traverse = <T, K extends keyof T>(
    where: WhereInput<T>,
    fieldNames: K[],
    map: PropertyMap = {},
): ConditionType | undefined => {
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
                createFilter(next, fieldNames, map),
            )
        }
    }

    if (pending.length > 1) {
        throw new Error(`Traversal error. Unprocessed filters left (${pending.length}).`)
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

const reduceResults = (results: Where[], plus: 'AND' | 'OR'): Where => {
    if (!results || results.length === 0) {
        return undefined
    }

    const [first, ...rest] = results.reverse()

    if (!rest) {
        return first
    }

    const shouldWrap = (s: string): boolean => /\sAND|OR\s/.test(s)
    const wrap = (s: string) => shouldWrap(s) ? `(${s})` : s

    return rest.reduce((current, prev) => {
        const left = wrap(prev.query)
        const right = wrap(current.query)

        return {
            query: `${left} ${plus} ${right}`,
            params: [
                ...prev.params,
                ...current.params,
            ],
        }
    }, first)
}

export const parse = (condition: ConditionType | undefined): Where | undefined => {
    if (!condition) {
        return undefined
    }

    type ProcessingType = 'and' | 'or'
    const processing: Array<ProcessingType | ConditionType> = [condition]
    let pending: Where[] = []
    let cycles = 0

    while (processing.length > 0) {
        if (cycles > 200) {
            throw new Error('Infinite loop detected.')
        }

        cycles++
        const next = processing.pop()

        if (typeof next === 'string') {

            switch (next) {
                case 'and':
                    pending = [reduceResults(pending, 'AND')]
                    break

                case 'or':
                    pending = [reduceResults(pending, 'OR')]
                    break

                default: throw new Error(`Unknown logical exppression: ${next}.`)
            }

            pending = pending.filter(p => p)
            continue
        }

        switch (next.kind) {
            case 'and':
                processing.push('and', ...next.and.reverse())
                break

            case 'or':
                processing.push('or', ...next.or.reverse())
                break

            case 'filter':
                const { params, query } = next
                pending.push({ query, params })
                break
        }
    }

    if (pending.length === 0) {
        return undefined
    }

    if (pending.length > 1) {
        throw new Error(`Parsing error. Unprocessed conditions left: ${pending.length}`)
    }

    const [result] = pending
    return result
}

interface OrderBy {
    query: string
}

export const order = <T, K extends keyof T>(orderBy: OrderByInput<T> | undefined, fields: K[]): OrderBy | undefined => {
    if (!orderBy) {
        return undefined
    }

    const query: string[] = []

    for (const field of fields) {
        const ordered = orderBy[field]

        if (ordered === undefined) {
            continue
        }

        query.push(`${field} ${ordered ? 'ASC' : 'DESC'}`)
    }

    if (query.length > 0) {
        return {
            query: query.join(', '),
        }
    }

    return undefined
}

interface Limit {
    query: string
}

export const limit = <T>(page: SimplePaging<T> | undefined): Limit | undefined => {
    if (!page) {
        return undefined
    }

    if (!page.limit) {
        return undefined
    }

    const query = page.offset
        ? `${page.offset}, ${page.limit}`
        : `${page.limit}`

    return { query }
}

export class QueryBuilder<T> {
    constructor(
        private fields: Array<keyof T>,
        private map: PropertyMap = {},
    ) { }

    public where(where: WhereInput<T>): Where | undefined {
        return parse(traverse(where, this.fields, this.map))
    }

    public order(orderBy: OrderByInput<T>): OrderBy | undefined {
        return order(orderBy, this.fields)
    }

    public limit(paging: SimplePaging<T>): Limit | undefined {
        return limit(paging)
    }
}

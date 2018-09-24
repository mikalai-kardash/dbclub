import { ConditionKind } from './conditions'
import { AndCondition } from './conditions.and'
import { OrCondition } from './conditions.or'
import { SimpleCondition } from './conditions.simple'
import { Field, FieldValue } from './fields'
import { Writer } from './writer'

interface WhereInputFields {
    [field: string]: FieldValue | FieldValue[]
}

export interface WhereInput {
    AND?: Array<WhereInput | WhereInputFields>
    OR?: Array<WhereInput | WhereInputFields>
}

type Where = (WhereInput | WhereInputFields)

interface WhereConditions {
    where: Where
}

interface WhereResult {
    query: string
    params: FieldValue[]
}

interface Condition {
    condition: string
    param: FieldValue[]
}

const whereFields = (fields: Field[]) => {
    const extensions = [
        'IN',
        'NULL',
        'NOT_NULL',
    ]
    return fields
        .map(f => [f, ...extensions.map(e => `${f}_${e}`)])
        .reduce((f, o) => o.concat(f), [])
}

export class QueryBuilder {
    private whereFields: Field[]
    private writer = new Writer()

    constructor(fields: Field[]) {
        this.whereFields = whereFields(fields)
    }

    public where(conditions: WhereConditions): WhereResult {
        const { where } = conditions
        const condition = this.parseConditions(where)
        const result = this.writer.evaluate(condition)

        if (result) {
            return {
                query: `WHERE ${result.query}`,
                params: [...result.params],
            }
        }
    }

    private parseConditions(where: Where): ConditionKind {
        if (!where) {
            return
        }

        if (where.AND || where.OR) {
            const { OR, AND } = where as WhereInput

            if (AND) {
                const subs = AND.map(c => this.parseConditions(c))
                return new AndCondition([...subs])
            }

            if (OR) {
                const subs = OR.map(c => this.parseConditions(c))
                return new OrCondition([...subs])
            }
        }

        const condition = this.condition(where)
        if (condition) {
            return new SimpleCondition(
                condition.condition,
                [...condition.param],
            )
        }
    }

    private condition(where: Where): Condition {
        const fieldName = (raw: string, suffix: 'IN' | 'NULL' | 'NOT_NULL') => {
            const ix = raw.lastIndexOf(`_${suffix}`)
            return raw.substring(0, ix)
        }
        const isNull = (raw: string) => raw.indexOf('_NULL') > -1
        const isNotNull = (raw: string) => raw.indexOf('_NOT_NULL') > -1

        for (const field of this.whereFields) {
            const value = where[field]

            if (value && value['length']) {
                const arr = value as FieldValue[]
                const values = arr.map(_ => '?').join(', ')
                const name = fieldName(field, 'IN')
                const condition = `${name} IN [${values}]`

                return {
                    condition,
                    param: value as FieldValue[],
                }
            }

            if (value) {
                if (isNotNull(field)) {
                    const name = fieldName(field, 'NOT_NULL')
                    return {
                        param: [],
                        condition: `${name} IS NOT NULL`,
                    }
                }

                if (isNull(field)) {
                    const name = fieldName(field, 'NULL')
                    return {
                        param: [],
                        condition: `${name} IS NULL`,
                    }
                }

                return {
                    param: [value] as FieldValue[],
                    condition: `${field} = ?`,
                }
            }
        }
        return undefined
    }
}

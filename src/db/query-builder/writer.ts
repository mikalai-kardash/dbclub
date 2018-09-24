import { AndCondition, Condition, ConditionKind, OrCondition } from './conditions'
import { FieldValue } from './fields'

export interface IWritable {
    analyze(writer: IWriter)
}

export interface IWriter {
    write(condition: Condition)
    writeAnd(and: AndCondition)
    writeOr(or: OrCondition)
}

interface Result {
    query: string
    params: FieldValue[]
}

const forScope = () => {
    return new Writer()
}

const complexCondition = (conditions: ConditionKind[], join: 'AND' | 'OR'): Result => {
    const useBrakets = conditions.filter(c => (c['AND'] || c['OR']) !== undefined).length > 0

    const [first, ...rest] = conditions
        .map(c => forScope().evaluate(c))
        .filter(r => r)

    return rest.reduce(
        (prev, current) => {
            const query = useBrakets
                ? `(${prev.query}) ${join} (${current.query})`
                : `${prev.query} ${join} ${current.query}`

            return {
                query,
                params: [...prev.params, ...current.params],
            } as Result
        },
        first,
    )
}

export class Writer implements IWriter {

    private result: Result

    public write(condition: Condition) {
        if (!condition) {
            return
        }

        this.result = {
            query: condition.condition,
            params: [...condition.param],
        } as Result
    }

    public writeAnd({ AND }: AndCondition) {
        if (!AND || AND.length === 0) {
            return
        }

        this.result = complexCondition(AND, 'AND')
    }

    public writeOr({ OR }: OrCondition) {
        if (!OR || OR.length === 0) {
            return
        }

        this.result = complexCondition(OR, 'OR')
    }

    public evaluate(condition: IWritable): Result {
        if (condition) {
            condition.analyze(this)
        }

        return this.result
    }
}

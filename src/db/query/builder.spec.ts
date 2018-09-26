import { traverse } from './builder'
import { AndCondition, Condition, ConditionType, OrCondition } from './models'

const expectFilter = (condition: ConditionType): condition is Condition => {
    expect(condition.kind).toBe('filter')
    return true
}

const expectAnd = (condition: ConditionType): condition is AndCondition => {
    expect(condition.kind).toBe('and')
    return true
}

const expectOr = (condition: ConditionType): condition is OrCondition => {
    expect(condition.kind).toBe('or')
    return true
}

describe('Traversal', () => {

    describe('field filter conditions', () => {

        it('id = ?', () => {
            const condition = traverse({ id: 1 }, ['id'])
            if (expectFilter(condition)) {
                expect(condition.query).toBe('id = ?')
                expect(condition.params).toEqual([1])
            }
        })

        it('flag = ?', () => {
            const condition = traverse({ flag: true }, ['flag'])
            if (expectFilter(condition)) {
                expect(condition.query).toBe('flag = ?')
                expect(condition.params).toEqual([true])
            }
        })

    })

    describe('logical conditions', () => {

        it('and', () => {
            const condition = traverse({
                and: [
                    { id: 1 },
                    { id: 2 },
                ],
            }, ['id'])

            expectAnd(condition)
        })

        it('or', () => {
            const condition = traverse({
                or: [
                    { id: 1 },
                    { id: 2 },
                ],
            }, ['id'])

            expectOr(condition)
        })

    })

})

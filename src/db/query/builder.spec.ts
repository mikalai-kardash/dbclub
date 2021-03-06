import { limit, order, parse, traverse } from './builder'
import { AndCondition, Condition, ConditionType, FieldNameMap, OrCondition } from './models'

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
            const condition = traverse({ id: { eq: 1 } }, ['id'])
            if (expectFilter(condition)) {
                expect(condition.query).toBe('id = ?')
                expect(condition.params).toEqual([1])
            }
        })

        it('flag = ?', () => {
            const condition = traverse({ flag: { eq: true } }, ['flag'])
            if (expectFilter(condition)) {
                expect(condition.query).toBe('flag = ?')
                expect(condition.params).toEqual([true])
            }
        })

        it('alias', () => {
            const map: FieldNameMap<{ id: number }, { alias: number }> = { id: 'alias' }
            const condition = traverse({ id: { eq: 1 } }, ['id'], map)
            if (expectFilter(condition)) {
                expect(condition.query).toBe('alias = ?')
            }
        })

    })

    describe('logical conditions', () => {

        it('and', () => {
            const condition = traverse({
                and: [
                    { id: { eq: 1 } },
                    { id: { eq: 2 } },
                ],
            }, ['id'])

            expectAnd(condition)
        })

        it('or', () => {
            const condition = traverse({
                or: [
                    { id: { eq: 1 } },
                    { id: { eq: 2 } },
                ],
            }, ['id'])

            expectOr(condition)
        })

    })

})

describe('Parser', () => {
    it('id = ?', () => {
        const parsed = parse({
            kind: 'filter',
            params: [1],
            query: 'id = ?',
        } as Condition)

        expect(parsed.query).toBe('id = ?')
        expect(parsed.params).toEqual([1])
    })

    it('id = ? AND id = ?', () => {
        const parsed = parse({
            kind: 'and',
            and: [
                {
                    kind: 'filter',
                    query: 'id = ?',
                    params: [1],
                } as Condition,
                {
                    kind: 'filter',
                    query: 'flag = ?',
                    params: [true],
                } as Condition,
            ],
        })

        expect(parsed.query).toBe('id = ? AND flag = ?')
        expect(parsed.params).toEqual([1, true])
    })

    it('(id = ? AND flag = ?) OR id2 = ?', () => {
        const parsed = parse({
            kind: 'or',
            or: [
                {
                    kind: 'and',
                    and: [
                        {
                            kind: 'filter',
                            query: 'id = ?',
                            params: [1],
                        },
                        {
                            kind: 'filter',
                            query: 'flag = ?',
                            params: [true],
                        },
                    ],
                },
                {
                    kind: 'filter',
                    query: 'id2 = ?',
                    params: [2],
                },
            ],
        })

        expect(parsed.query).toBe('(id = ? AND flag = ?) OR id2 = ?')
        expect(parsed.params).toEqual([1, true, 2])
    })
})

describe('Ordering', () => {

    it('id ASC', () => {
        const orderBy = order({ id: true }, ['id'])
        expect(orderBy.query).toBe('id ASC')
    })

    it('id DESC', () => {
        const orderBy = order({ id: false }, ['id'])
        expect(orderBy.query).toBe('id DESC')
    })

    it('id ASC, flag DESC', () => {
        const orderBy = order({ id: true, flag: false }, ['id', 'flag'])
        expect(orderBy.query).toBe('id ASC, flag DESC')
    })

})

describe('Paging', () => {

    it('128', () => {
        const page = limit({
            limit: 128,
        })
        expect(page.query).toBe('128')
    })

    it('256, 128', () => {
        const page = limit({
            offset: 256,
            limit: 128,
        })
        expect(page.query).toBe('256, 128')
    })

})

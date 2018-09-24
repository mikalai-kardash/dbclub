import { QueryBuilder, WhereInput } from './query-builder'

describe('Where Conditions', () => {
    let builder: QueryBuilder

    beforeEach(() => {
        builder = new QueryBuilder([
            'id',
        ])
    })

    describe('one field', () => {
        it('id = 1', () => {
            const { query, params } = builder.where({
                where: {
                    id: 1,
                },
            })

            expect(query).toBe('WHERE id = ?')
            expect(params).toEqual([1])
        })

        it('id IN [1, 2]', () => {
            const { query, params } = builder.where({
                where: {
                    id_IN: [1, 2],
                },
            })

            expect(query).toBe('WHERE id IN [?, ?]')
            expect(params).toEqual([1, 2])
        })

        it('id IS NULL', () => {
            const { query, params } = builder.where({
                where: {
                    id_NULL: true,
                },
            })

            expect(query).toBe('WHERE id IS NULL')
            expect(params).toEqual([])
        })

        it('id IS NOT NULL', () => {
            const { query, params } = builder.where({
                where: {
                    id_NOT_NULL: true,
                },
            })

            expect(query).toBe('WHERE id IS NOT NULL')
            expect(params).toEqual([])
        })
    })

    describe('AND', () => {

        it('simple', () => {
            const { query, params } = builder.where({
                where: {
                    AND: [
                        { id: 1 },
                        { id: 2 },
                    ],
                },
            })

            expect(query).toBe('WHERE id = ? AND id = ?')
            expect(params).toEqual([1, 2])
        })

        it('complex', () => {
            const { query, params } = builder.where({
                where: {
                    AND: [
                        { id: 1 },
                        {
                            AND: [
                                { id: 2 },
                                { id: 3 },
                            ],
                        },
                    ],
                },
            })

            expect(query).toBe('WHERE (id = ?) AND (id = ? AND id = ?)')
            expect(params).toEqual([1, 2, 3])
        })
    })

})

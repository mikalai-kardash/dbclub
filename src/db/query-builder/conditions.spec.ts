import { AndCondition } from './conditions.and'
import { OrCondition } from './conditions.or'
import { SimpleCondition } from './conditions.simple'
import { Writer } from './writer'

describe('Writer', () => {

    let writer: Writer

    beforeEach(() => {
        writer = new Writer()
    })

    it('no conditions', () => expect(writer.evaluate(undefined)).toBeUndefined())

    it('simple condition', () => {
        const condition = new SimpleCondition('id = ?', [1])
        const result = writer.evaluate(condition)
        expect(result.query).toBe('id = ?')
        expect(result.params).toEqual([1])
    })

    it('and condition', () => {
        const condition = new AndCondition([
            new SimpleCondition('id = ?', [1]),
            new SimpleCondition('id = ?', [2]),
        ])
        const result = writer.evaluate(condition)
        expect(result.query).toBe('id = ? AND id = ?')
        expect(result.params).toEqual([1, 2])
    })

    it('and condition (complex)', () => {
        const condition = new AndCondition([
            new AndCondition([
                new SimpleCondition('id = ?', [1]),
                new SimpleCondition('id = ?', [2]),
            ]),
            new SimpleCondition('id = ?', [3]),
        ])
        const result = writer.evaluate(condition)

        expect(result.query).toBe('(id = ? AND id = ?) AND (id = ?)')
        expect(result.params).toEqual([1, 2, 3])
    })

    it('or condition', () => {
        const condition = new OrCondition([
            new SimpleCondition('id = ?', [1]),
            new SimpleCondition('id = ?', [2]),
        ])
        const result = writer.evaluate(condition)
        expect(result.query).toBe('id = ? OR id = ?')
        expect(result.params).toEqual([1, 2])
    })

    it('or condition (complex)', () => {
        const condition = new OrCondition([
            new AndCondition([
                new SimpleCondition('id = ?', [1]),
                new SimpleCondition('id = ?', [2]),
            ]),
            new SimpleCondition('id = ?', [3]),
        ])
        const result = writer.evaluate(condition)
        expect(result.query).toBe('(id = ? AND id = ?) OR (id = ?)')
        expect(result.params).toEqual([1, 2, 3])
    })
})

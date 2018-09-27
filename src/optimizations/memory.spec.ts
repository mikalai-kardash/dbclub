import { Cache } from './cache'
import { Memory } from './memory'

interface Entity {
    id: number
}

class CacheStub implements Cache {
    private cache = new Map()

    public get<V>(key: any): V {
        return this.cache.get(key)
    }

    public set<V>(key: any, value: V) {
        this.cache.set(key, value)
    }

    public get stored() {
        return this.cache
    }
}

describe('Memory', () => {

    describe('single', () => {
        let func: CacheStub
        let data: CacheStub
        let memory: Memory

        beforeEach(() => {
            func = new CacheStub()
            data = new CacheStub()
            memory = new Memory(data, func)
        })

        let memoized: (id: number) => Promise<{ id: number }>
        let called: number

        beforeEach(() => {
            memoized = memory.single(
                async (id: number) => {
                    called++
                    return { id }
                },
                {
                    getFuncKey(key) {
                        return `single/${key}`
                    },
                    getKey(result: { id: number }) {
                        return `collection/${result.id}`
                    },
                },
            )

            called = 0
        })

        it('memorizes result', async () => {
            const result = await memoized(1)

            expect(result.id).toBe(1)
            expect(func.stored.size).toBe(1)
            expect(data.stored.size).toBe(1)
        })

        it('calls real func once', async () => {
            await memoized(1)
            await memoized(1)
            expect(called).toBe(1)
        })
    })

    describe('many', () => {
        let func: CacheStub
        let data: CacheStub
        let memory: Memory

        beforeEach(() => {
            func = new CacheStub()
            data = new CacheStub()
            memory = new Memory(data, func)
        })

        let memoized: (id: number) => Promise<Entity[]>
        let called: number

        beforeEach(() => {
            memoized = memory.many(
                async (id: number) => {
                    called++
                    return [{ id }, { id: id + 1 }]
                },
                {
                    getFuncKey(key) {
                        return `single/${key}`
                    },

                    getKey(result: Entity) {
                        return `collection/${result.id}`
                    },
                },
            )

            called = 0
        })

        it('memorizes results', async () => {
            const result = await memoized(1)

            expect(result.length).toBe(2)
            expect(func.stored.size).toBe(1)
            expect(data.stored.size).toBe(2)
        })

        it('calls real func once', async () => {
            await memoized(1)
            await memoized(1)
            expect(called).toBe(1)
        })
    })
})

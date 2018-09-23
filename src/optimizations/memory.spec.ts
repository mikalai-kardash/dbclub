import { Cache } from './cache'
import { Memory } from './memory'

class CacheStub implements Cache {
    private cache = new Map()

    public get<V>(key: any): V {
        console.log(`get ${key}`)
        return this.cache.get(key)
    }

    public set<V>(key: any, value: V) {
        console.log(`set ${key} = ${value}`)
        this.cache.set(key, value)
    }

    public get stored() {
        return this.cache
    }
}

describe('Memory', () => {
    let func: CacheStub
    let data: CacheStub
    let memory: Memory

    beforeEach(() => {
        func = new CacheStub()
        data = new CacheStub()
        memory = new Memory(data, func)
    })

    describe('single', () => {
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
})

import { Cache } from './cache'

interface Options {
    getKey?(...args: any[]): string
    getFuncKey?(...args: any[]): string
}

type Func<T> = (...args: any[]) => Promise<T>

// tslint:disable-next-line:no-empty
const noop = (...args: any[]) => { }

export class Memory {

    constructor(
        private data: Cache,
        private func: Cache,
    ) { }

    public single<T>(fn: Func<T>, options: Options = {}): Func<T> {
        const { getKey } = options
        const load = this.getResults(fn, options)
        const cache = getKey ? (result: T, ...args: any[]) => {
            const cacheKey = getKey(result, ...args)
            const stored = this.data.get<T>(cacheKey)

            if (!stored) {
                this.data.set(cacheKey, result)
            }
        } : noop

        return async (...args: any[]): Promise<T> => {
            const result = await load(...args)
            cache(result, ...args)
            return result
        }
    }

    public many<T>(fn: Func<T[]>, options: Options = {}): Func<T[]> {
        const { getKey } = options
        const load = this.getResults(fn, options)
        const cache = getKey ? (result: T, ...args: any[]) => {
            const cacheKey = getKey(result, ...args)
            const stored = this.data.get<T>(cacheKey)

            if (!stored) {
                this.data.set(cacheKey, result)
            }
        } : noop

        return async (...args: any[]): Promise<T[]> => {
            const result = await load(...args)
            result.map(r => cache(r, ...args))
            return result
        }
    }

    private getResults<T>(fn: Func<T>, options: Options) {
        return async (...args: any[]): Promise<T> => {
            const { getFuncKey } = options
            const key = getFuncKey ? getFuncKey(...args) : fn
            const cached = this.func.get<T>(key)

            if (cached) {
                return cached
            }

            const result = await fn(...args)
            this.func.set(key, result)

            return result
        }
    }
}

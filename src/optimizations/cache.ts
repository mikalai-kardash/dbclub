export interface Cache {
    get<V>(key: any): V
    set<V>(key: any, value: V)
}

export class DefaultCache implements Cache {
    private cache = new Map()

    public get<V>(key: any): V {
        if (!key) {
            return
        }

        return this.cache.get(key)
    }

    public set<V>(key: any, value: V) {
        if (!key) {
            return
        }

        if (!value) {
            return
        }

        this.cache.set(key, value)
    }
}

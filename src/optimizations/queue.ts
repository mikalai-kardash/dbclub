interface Item<K, V> {
    key: K
    resolve: (value: V) => void
    reject: (error: Error) => void
}

export interface Batch<K, V> {
    length: number

    add(item: Item<K, V>): void
    get(): Work<K, V>
}

interface Work<K, V> {
    keys: K[]
    items: Array<Item<K, V>>
}

export const EmptyWork: Work<any, any> = {
    items: [],
    keys: [],
}

export class LoaderQueue<K, V> implements Batch<K, V> {
    private items: Array<Item<K, V>> = []
    private keys = new Set<K>()

    public get length() {
        return this.items.length
    }

    public has(key: K): boolean {
        return this.keys.has(key)
    }

    public get(): Work<K, V> {
        if (this.keys.size === 0) {
            return EmptyWork
        }

        const batch = [...this.items]
        const keys = [...this.keys]

        this.items = []
        this.keys = new Set()
        return {
            keys,
            items: batch,
        }
    }

    public add(item: Item<K, V>): void {
        this.items.push(item)

        if (!this.keys.has(item.key)) {
            this.keys.add(item.key)
            return
        }
    }
}

import { Batch } from './queue'
import { Scheduler } from './scheduler'

export type LoaderFunction<K, V> = (ids: K[]) => Promise<V[]>
export type KeyValueMatchFunction<K, V> = (key: K, value: V) => boolean

interface LoaderOptions<K, V> {
    scheduler: Scheduler,
    batch: Batch<K, V>
    loader(keys: K[]): Promise<V[]>
    match(key: K, value: V): boolean
}

export class Loader<K, V> {

    private scheduler: Scheduler
    private loader: LoaderFunction<K, V>
    private batch: Batch<K, V>
    private match: KeyValueMatchFunction<K, V>

    constructor({ scheduler, loader, batch, match }: LoaderOptions<K, V>) {
        this.scheduler = scheduler
        this.loader = loader
        this.batch = batch
        this.match = match
    }

    public load(id: K): Promise<V> {
        if (!id) {
            throw new Error('Undefined or null: id.')
        }

        return new Promise<V>((resolve, reject) => {
            this.batch.add({ key: id, resolve, reject })

            if (this.batch.length === 1) {
                this.scheduleLoad()
            }
        })
    }

    private scheduleLoad() {
        const next = () => {
            this.scheduleLoad()
        }

        this.scheduler.run(async () => {
            await this.loadValues()

            if (this.batch.length > 0) {
                next()
            }
        })
    }

    private async executeLoader(keys: K[]): Promise<{
        error?: Error,
        result?: V[],
    }> {
        try {
            const result = await this.loader(keys)
            return { result }
        } catch (error) {
            return { error }
        }
    }

    private async loadValues(): Promise<void> {
        const work = this.batch.get()
        const { error, result } = await this.executeLoader(work.keys)

        work.items.forEach(({ key, reject, resolve }) => {
            const matchItem = (v: V) => {
                try {
                    return this.match(key, v)
                } catch (e) {
                    return false
                }
            }

            if (error) {
                reject(error)
                return
            }

            const value = result.find(matchItem)

            if (!value) {
                reject(new Error('No match.'))
                return
            }

            if (value instanceof Error) {
                reject(value)
                return
            }

            resolve(value)
        })
    }
}

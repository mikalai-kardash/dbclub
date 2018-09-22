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

    private async loadValues(): Promise<void> {
        const work = this.batch.get()
        const values = await this.loader(work.keys)

        work.items.forEach(({ key, reject, resolve }) => {
            const value = values.find(v => this.match(key, v))

            if (value instanceof Error) {
                reject(value)
            } else {
                resolve(value)
            }
        })
    }
}

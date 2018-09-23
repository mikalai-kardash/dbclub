import { Loader } from './loader'
import { Batch, LoaderQueue } from './queue'
import { SchedulerStub } from './testing/scheduler.stub'

interface Entity {
    id: number
}

interface ResultOrError {
    error?: Error,
    result?: any,
}

const uncover = async <T>(promise: Promise<T>): Promise<ResultOrError> => {
    try {
        const result = await promise
        return { result }
    } catch (error) {
        return { error }
    }
}

const createLoader = (options: {
    throwOnLoader?: boolean,
    throwOnMatch?: boolean,
    throwOn?: number,
} = {}) => {
    const {
        throwOnMatch,
        throwOnLoader,
        throwOn,
    } = options

    let matches = 0
    const scheduler = new SchedulerStub()
    const queue = new LoaderQueue<number, Entity>()

    const loader = new Loader<number, Entity>({
        scheduler,
        batch: queue,

        match(id, entity) {
            if (throwOnMatch && throwOn === matches++) {
                throw new Error('Match error.')
            }
            return entity && entity.id === id
        },

        async loader(ids): Promise<Entity[]> {
            if (throwOnLoader) {
                throw new Error('Loader error.')
            }
            return ids.map(id => ({ id }))
        },
    })

    return {
        scheduler,
        queue,
        loader,
    }
}

describe('Loader', () => {

    let scheduler: SchedulerStub
    let queue: Batch<number, Entity>
    let dataLoader: Loader<number, Entity>

    beforeEach(() => {
        const data = createLoader()
        scheduler = data.scheduler
        queue = data.queue
        dataLoader = data.loader
    })

    it('schedules item', () => {
        const p1 = dataLoader.load(1)

        expect(p1).toBeInstanceOf(Promise)
        expect(queue.length).toBe(1)
        expect(scheduler.length).toBe(1)
    })

    it('resolves item', async () => {
        const promise = dataLoader.load(1)
        scheduler.execute()
        const entity = await promise
        expect(entity.id).toBe(1)
    })

    it('resolves multiple items', async () => {
        const p1 = dataLoader.load(1)
        const p4 = dataLoader.load(4)
        const p3 = dataLoader.load(3)
        const p2 = dataLoader.load(2)

        expect(scheduler.length).toBe(1)

        scheduler.execute()

        const v1 = await p1
        const v2 = await p2
        const v3 = await p3
        const v4 = await p4

        expect(v1.id).toBe(1)
        expect(v2.id).toBe(2)
        expect(v3.id).toBe(3)
        expect(v4.id).toBe(4)
    })
})

describe('Loader, when loader throws', () => {
    let scheduler: SchedulerStub
    let dataLoader: Loader<number, Entity>

    beforeEach(() => {
        const data = createLoader({
            throwOnLoader: true,
        })

        dataLoader = data.loader
        scheduler = data.scheduler
    })

    it('rejects all items on loader error', async () => {
        const p1 = dataLoader.load(1)
        const p2 = dataLoader.load(2)

        scheduler.execute()

        const v1 = await uncover(p1)
        const v2 = await uncover(p2)

        expect(v1.error).toBeInstanceOf(Error)
        expect(v2.error).toBeInstanceOf(Error)
    })
})

describe('Loader, when matcher throws', () => {
    let scheduler: SchedulerStub
    let dataLoader: Loader<number, Entity>

    beforeEach(() => {
        const data = createLoader({
            throwOnMatch: true,
            throwOn: 0,
        })

        dataLoader = data.loader
        scheduler = data.scheduler
    })

    it('rejects item on match error', async () => {
        const p1 = dataLoader.load(1)

        scheduler.execute()

        const v1 = await uncover(p1)
        expect(v1.error).toBeInstanceOf(Error)
    })
})

describe('Loader, when matcher throws (2)', () => {
    let scheduler: SchedulerStub
    let dataLoader: Loader<number, Entity>

    beforeEach(() => {
        const data = createLoader({
            throwOnMatch: true,
            throwOn: 2,
        })

        dataLoader = data.loader
        scheduler = data.scheduler
    })

    it('rejects only item with match error', async () => {
        const p1 = dataLoader.load(1)
        const p2 = dataLoader.load(2)
        const p3 = dataLoader.load(3)

        scheduler.execute()

        const v1 = await uncover(p1)
        const v2 = await uncover(p2)
        const v3 = await uncover(p3)

        expect(v1.error).toBeFalsy()
        expect(v3.error).toBeFalsy()
        expect(v2.error).toBeInstanceOf(Error)
    })
})

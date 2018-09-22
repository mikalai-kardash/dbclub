import { EmptyWork, LoaderQueue } from './queue'

// tslint:disable-next-line:no-empty
const resolve = () => { }
// tslint:disable-next-line:no-empty
const reject = () => { }

describe('Loader Queue', () => {
    let queue: LoaderQueue<number, string>

    beforeEach(() => {
        queue = new LoaderQueue()
    })

    it('is empty when created', () => expect(queue.length).toBe(0))

    it('returns default work object when empty', () => {
        const work = queue.get()
        expect(work).toBe(EmptyWork)
    })

    it('provides unique keys', () => {
        queue.add({ key: 1, resolve, reject })
        queue.add({ key: 1, resolve, reject })

        const work = queue.get()
        expect(work.keys.length).toBe(1)
        expect(work.items.length).toBe(2)
    })

    it('empties queue after items retrieved', () => {
        queue.add({ key: 1, resolve, reject })
        queue.add({ key: 2, resolve, reject })

        queue.get()

        expect(queue.length).toBe(0)
    })
})

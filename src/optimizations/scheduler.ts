export type Job = () => void

export interface Scheduler {
    run(job: Job): void
}

export class EventLoopScheduler implements Scheduler {
    private resolved = Promise.resolve()

    public run(job: Job) {
        this.resolved.then(() => {
            process.nextTick(job)
        })
    }
}

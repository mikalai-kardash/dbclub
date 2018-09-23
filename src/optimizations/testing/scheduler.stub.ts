import { Job, Scheduler } from '../scheduler'

export class SchedulerStub implements Scheduler {
    private scheduled: Job[] = []

    public get length() { return this.scheduled.length }

    public run(job: Job): void {
        this.scheduled.push(job)
    }

    public execute() {
        const job = this.scheduled.shift()
        job()
    }
}

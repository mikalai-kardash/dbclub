import { format } from 'date-fns'

const DATE_FORMAT = 'YYYYMMDDThh:mm:ss.SSS'
const timestamp = () => format(new Date(), DATE_FORMAT)
const log = console.log

export interface ILogger {
    info(s: string)
    error(e: Error, s?: string)
}

export class ConsoleLogger implements ILogger {

    constructor(private tag: string) { }

    public info(s: string) {
        this.write(`info: ${s}`)
    }

    public error(e: Error, s?: string) {
        if (e) {
            this.write(`error: ${e}`)
        }

        if (s) {
            this.write(`error: ${s}`)
        }

        if (!e && !s) {
            this.write(`error: Oops!`)
        }
    }

    private write(s: string) {
        log(`${timestamp()}/${this.tag}: ${s}`)
    }
}

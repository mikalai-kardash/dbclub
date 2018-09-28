import { differenceInMilliseconds, distanceInWordsStrict } from 'date-fns'
import * as prettify from 'sql-formatter'
import { format as sqlFormat } from 'sqlstring'
import { v4 } from 'uuid'
import { isDebug } from '../environment'
import { AsyncQuery, Mapper, Query } from '../types'
import { ConsoleLogger, ILogger } from './logger'

const logSqlQuery = (logger: ILogger, params: [string, any[]]) => {
    const query = params[0]
    const prms = params[1] || []
    const allParams = (prms).join(', ')
    const sql = prettify.format(sqlFormat(query, prms))

    logger.info(`Executing SQL query (${allParams}):
---
${sql}
---
`)
}

const logElapsedTime = (logger: ILogger, params: [Date]) => {
    const [requested] = params
    const completed = new Date()
    const words = distanceInWordsStrict(completed, requested)
    const elapsed = differenceInMilliseconds(completed, requested)
    logger.info(`${words} (${elapsed}ms)`)
}

const logResults = <T>(logger: ILogger, results: T[]) => {
    const r = results || []
    logger.info(`Received ${r.length} records.`)
}

const getTag = () => {
    const s = v4()
    return s.substring(0, s.indexOf('-'))
}

export const createProxy = <T>(getDataAsync: AsyncQuery<T>): AsyncQuery<T> => {
    if (!isDebug()) {
        return getDataAsync
    }

    return async (query: Query, mapper: Mapper<T>): Promise<T[]> => {
        const tag = getTag()
        const logger = new ConsoleLogger(tag)

        logSqlQuery(logger, [query.query, query.params])

        const requested = new Date()

        try {

            const result = await getDataAsync(query, mapper)
            logResults(logger, result)
            return result

        } catch (e) {

            logger.error(e)

        } finally {

            logElapsedTime(logger, [requested])

        }
    }
}

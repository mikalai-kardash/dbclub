import { differenceInMilliseconds, distanceInWordsStrict, format } from 'date-fns'
import { createPool, Pool } from 'mysql'
import * as prettify from 'sql-formatter'
import { format as sqlFormat } from 'sqlstring'

const getHost = () => process.env.MYSQL_HOST
const getUser = () => process.env.MYSQL_USER
const getPassword = () => process.env.MYSQL_PASSWORD
const getDatabase = () => process.env.MYSQL_DATABASE
const isDebug = () => +process.env.DEBUG > 0

const connect = () => {
    return createPool({
        connectionLimit: 10,
        host: getHost(),
        user: getUser(),
        password: getPassword(),
        database: getDatabase(),
    })
}

type Mapper<T> = (record: any) => T

const DATE_FORMAT = 'YYYYMMDDThh:mm:ss.SSS'
const timestamp = () => format(new Date(), DATE_FORMAT)

const queryData = async <T>(
    query: string,
    params: any[],
    mapper: Mapper<T>,
): Promise<T[]> => {
    const requested = new Date()

    if (isDebug()) {
        const allParams = params.join(', ')
        const sql = prettify.format(sqlFormat(query, params))
        console.log(
            `${timestamp()}: info: Executing SQL query (${allParams}):
---
${sql}
---
`)
    }

    return new Promise<T[]>((resolve, reject) => {
        connect().query(query, params, (err, records: any[]) => {
            const completed = new Date()
            const words = distanceInWordsStrict(completed, requested)
            const elapsed = differenceInMilliseconds(completed, requested)

            if (err) {
                if (isDebug()) {
                    console.log(`${timestamp()}: error: ${err}`)
                    console.log(`${timestamp()}: info: ${words} (${elapsed}ms)`)
                }

                reject(err)
                return
            }

            if (isDebug()) {
                console.log(`${timestamp()}: info: Received ${records && records.length} records.`)
                console.log(`${timestamp()}: info: ${words} (${elapsed}ms)`)
            }

            const mapped = records.map(mapper)
            resolve(mapped)
        })
    })
}

type AsyncQuery<T> = (query: Query, mapper: Mapper<T>) => Promise<T[]>

type Query = Partial<{
    query: string,
    params: any[],
}>

const queryAsync = (query: string, params: any[]): Promise<any[]> => {
    return new Promise<any[]>((resolve, reject) => {
        connect().query(query, params, (err, records: any[]) => {
            if (err) {
                reject(err)
                return
            }
            resolve(records || [])
        })
    })
}

const getDataAsync = async <T>(query: Query, mapper: Mapper<T>): Promise<T[]> => {
    const records = await queryAsync(query.query, query.params)
    const mapped = records.map(mapper)
    return mapped
}

export {
    connect as db,
    queryData,
}

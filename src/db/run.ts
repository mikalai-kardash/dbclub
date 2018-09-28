import { connect } from './mysql'
import { createProxy } from './trace/get-data'
import { AsyncQuery, Mapper, Query } from './types'

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

export const createQuery = <T>(): AsyncQuery<T> => {
    return createProxy(getDataAsync)
}

import * as mysql from 'mysql'

const getHost = () => process.env.MYSQL_HOST
const getUser = () => process.env.MYSQL_USER
const getPassword = () => process.env.MYSQL_PASSWORD
const getDatabase = () => process.env.MYSQL_DATABASE

const connect = () => {
    return mysql.createPool({
        connectionLimit: 10,
        host: getHost(),
        user: getUser(),
        password: getPassword(),
        database: getDatabase(),
    })
}

type Mapper<T> = (record: any) => T

const queryData = async <T>(
    query: string,
    params: any[],
    mapper: Mapper<T>,
): Promise<T[]> => {
    return new Promise<T[]>((resolve, reject) => {
        connect().query(query, params, (err, records: any[]) => {
            if (err) {
                reject(err)
                return
            }
            const mapped = records.map(mapper)
            resolve(mapped)
        })
    })
}

export {
    connect as db,
    queryData,
}

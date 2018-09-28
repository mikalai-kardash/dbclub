import { createPool } from 'mysql'
import { getDatabase, getHost, getPassword, getUser } from './environment'

export const connect = () => {
    return createPool({
        connectionLimit: 10,
        host: getHost(),
        user: getUser(),
        password: getPassword(),
        database: getDatabase(),
    })
}

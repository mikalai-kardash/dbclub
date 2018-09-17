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

export {
    connect as db,
}

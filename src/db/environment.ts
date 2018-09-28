export const getHost = () => process.env.MYSQL_HOST
export const getUser = () => process.env.MYSQL_USER
export const getPassword = () => process.env.MYSQL_PASSWORD
export const getDatabase = () => process.env.MYSQL_DATABASE
export const isDebug = () => +process.env.DEBUG > 0

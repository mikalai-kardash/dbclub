import { ApolloServer } from 'apollo-server'
import * as environment from 'dotenv'
import { DepartmentApi } from './api/department'
import { EmployeeApi } from './api/employee'
import { TitleApi } from './api/title'
import { DefaultCache } from './optimizations/cache'
import { Memory } from './optimizations/memory'
import Department from './resolvers/Department'
import Manager from './resolvers/Manager'
import Query from './resolvers/Query'
import { definitions, kind } from './schema/db.graphql'
import { Context } from './server'

environment.config()

const server = new ApolloServer({
    typeDefs: { kind, definitions },
    resolvers: {
        Query,
        Department,
        Manager,
    },
    context: () => {
        const data = new DefaultCache()
        const func = new DefaultCache()
        const memory = new Memory(data, func)

        const departments = new DepartmentApi(memory)
        const employees = new EmployeeApi(memory)
        const titles = new TitleApi(memory)

        return {
            api: {
                departments,
                employees,
                titles,
            },
            cache: {
                data,
                func,
            },
        } as Context
    },
})

server.listen().then(({ url }) => {
    console.log(`Server running at ${url}`)
})

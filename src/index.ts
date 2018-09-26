import { ApolloServer } from 'apollo-server'
import * as environment from 'dotenv'
import { DepartmentApi } from './api/department'
import { DefaultCache } from './optimizations/cache'
import { Memory } from './optimizations/memory'
import Department from './resolvers/Department'
import Manager from './resolvers/Manager'
import Query from './resolvers/Query'
import { definitions, kind } from './schema/db.graphql'

environment.config()

const server = new ApolloServer({
    typeDefs: { kind, definitions },
    resolvers: {
        Query,
        Department,
        Manager,
    },
    context: ({ req }) => {
        const data = new DefaultCache()
        const func = new DefaultCache()
        const memory = new Memory(data, func)

        const departments = new DepartmentApi(memory)

        return {
            ...req,
            api: {
                departments,
            },
            cache: {
                data,
                func,
            },
        }
    },
})

server.listen().then(({ url }) => {
    console.log(`Server running at ${url}`)
})

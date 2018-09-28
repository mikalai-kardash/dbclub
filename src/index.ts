import { ApolloServer } from 'apollo-server'
import * as environment from 'dotenv'
import { DepartmentApi } from './api/department'
import { EmployeeApi } from './api/employee'
import { SalaryApi } from './api/salary'
import { TitleApi } from './api/title'
import { DepartmentSource } from './db/department.source'
import { DefaultCache } from './optimizations/cache'
import { Memory } from './optimizations/memory'
import resolvers from './resolvers/resolvers'
import { Context } from './resolvers/server'
import { definitions, kind } from './schema/db.graphql'

environment.config()

const server = new ApolloServer({
    typeDefs: { kind, definitions },
    resolvers,
    context: () => {
        const data = new DefaultCache()
        const func = new DefaultCache()
        const memory = new Memory(data, func)

        const departments = new DepartmentApi(memory, new DepartmentSource())
        const employees = new EmployeeApi(memory)
        const titles = new TitleApi(memory)
        const salaries = new SalaryApi(memory)

        return {
            api: {
                departments,
                employees,
                titles,
                salaries,
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

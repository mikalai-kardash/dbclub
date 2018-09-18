import { ApolloServer } from 'apollo-server'
import * as environment from 'dotenv'
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
        return {
            ...req,
        }
    },
})

server.listen().then(({ url }) => {
    console.log(`Server running at ${url}`)
})

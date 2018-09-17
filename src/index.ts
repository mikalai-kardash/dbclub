import { ApolloServer } from 'apollo-server'
import * as environment from 'dotenv'
import Query from './resolvers/Query'
import { definitions, kind } from './schema/db.graphql'

environment.config()

const server = new ApolloServer({
    typeDefs: { kind, definitions },
    resolvers: {
        Query,
    },
})

server.listen().then(({ url }) => {
    console.log(`Server running at ${url}`)
})

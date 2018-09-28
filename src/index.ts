import { ApolloServer } from 'apollo-server'
import * as environment from 'dotenv'
import { context } from './resolvers/context.factory'
import resolvers from './resolvers/resolvers'
import typeDefs from './schema'

environment.config()

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
})

server.listen().then(({ url }) => {
    console.log(`Server running at ${url}`)
})

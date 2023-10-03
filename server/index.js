const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose'); // ORM(Object Relationship Mapper) to connect to MongoDB

const { MONGODB } = require('./config.js');
const typeDefs = require('./graphql/typeDefs.js');
const resolvers = require('./graphql/resolvers/index.js');




const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req })
});



mongoose.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true, 
 })
    .then(() => {
    console.log("--- MongoDB Connected ---")
    return server.listen({ port: 5000 })
        .then(res => {
            console.log(`--- Server is running at ${res.url} ---`)
    })
})


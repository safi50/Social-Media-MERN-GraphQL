const postResolvers = require('./posts');
const userResolvers = require('./users');
const commentsResolvers = require('./comments');
const likeResolvers = require('./likes');

module.exports = {
    Post: {
        // Get count of likes and comments -> runs everytime a query is made for a post
        likeCount: (parent) => parent.likes.length,
        commentCount: (parent) => parent.comments.length
    },
    Query: {
        ...postResolvers.Query
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...postResolvers.Mutation,
        ...commentsResolvers.Mutation,
        ...likeResolvers.Mutation
    }, 
    Subscription: {
        ...postResolvers.Subscription
    }
}
const Post = require('../../models/Post');
const checkAuth = require('../utils/checkAuth');
const { AuthenticationError, UserInputError } = require('apollo-server');


module.exports = {
    Mutation : {
        createComment: async (_, {postId, body} , context) => {
            const user = checkAuth(context);
            if (body.trim === '') {
                throw new UserInputError('Empty comment', {
                    errors: {
                        body: 'Comment body must not be empty'
                    }
                })
            }

            console.log(postId)
            const post = await Post.findById(postId);
            console.log(post)
            if (post) {
                // Adding new comment in comments array of post
                post.comments.unshift({
                    body,
                    username: user.username,
                    createdAt: new Date().toISOString()
                })
                // saving changes in post
                await post.save();
                return post;
            }
            else throw new UserInputError('Post not found');
        },

        deleteComment: async (_, {postId, commentId} , context) => {
            const user = checkAuth(context);

            const post = await Post.findById(postId);

            if (post) {
                const commentIndex = post.comments.findIndex(c => c.id === commentId);
                
                if (commentIndex === -1) {
                    throw new UserInputError('Comment not found');
                }

                // making sure comment of the user who is deleting it
                if (post.comments[commentIndex].username == user.username) {
                    // removes 1 comment from index (commentIndex)
                    post.comments.splice(commentIndex, 1)
                    await post.save();
                    return post;
                }
                else {
                    throw new AuthenticationError('Action not allowed');
                }
            }
            else {
                throw new UserInputError('Post not found');
            }
        }
    }
}
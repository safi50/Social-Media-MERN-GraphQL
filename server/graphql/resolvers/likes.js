const Post = require('../../models/Post');
const checkAuth = require('../utils/checkAuth');
const { AuthenticationError, UserInputError } = require('apollo-server');


module.exports = {
    Mutation : {
        async likePost(_, {postId} , context) {
            const user = checkAuth(context);

            const post = await Post.findById(postId);
            if (post) {
                
                // Checking if post is already liked by user -> if yes, unlike it
                if (post.likes.find(like => like.username === user.username)) {
                    // Post already liked, unlike it
                    post.likes = post.likes.filter(like => like.username !== user.username);
                } else {
                    post.likes.push({
                        username: user.username,
                        createdAt: new Date().toISOString()
                    })
                }
                await post.save();
                return post;

            }
        }
    }
}
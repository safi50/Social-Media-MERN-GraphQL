const Post = require('../../models/Post');
const checkAuth = require('../utils/checkAuth');
const { AuthenticationError } = require('apollo-server');

module.exports = {


    Query: {
        async getPosts() {
            try {
                const posts = await Post.find().sort({ createdAt: -1 });
                return posts;
            } catch (err) {
                throw new Error(err);
            }
        },

        async getPost(_, { postId }) {
            try {
                const post = await Post.findById(postId);
                if (post) {
                    return post;
                } else {
                    throw new Error('Post not found');
                }
            } catch (err) {
                throw new Error(err);
            }
        }, 

       
    },
    Mutation : {
        async createPost(_, { body }, context) {
            const user = checkAuth(context);

            if (body.trim() === '') {
                throw new Error('Post body must not be empty');
            }

            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            });
            const post = await newPost.save();

            context.pubsub.publish('NEW_POST', {
                newPost: post
            })

            return post;
        }, 

        async deletePost(_, { postId }, context) {
            const user = checkAuth(context);
            console.log("Authenticated User:", user);
    
        
            try {
                const post = await Post.findById(postId);
                console.log("Retrieved Post:", post);
    
                if (!post) {
                    throw new Error('Post not found');
                }
                
                if (user.username === post.username) {
                    await post.deleteOne();
                    console.log('Post deleted successfully');
    
                    return 'Post deleted successfully';
                } else {
                    throw new AuthenticationError('Action not allowed');
                }
            } catch (err) {
                throw new Error(err);
            }
        }    
    }, 
    Subscription: {
        newPost: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST')
        }
    }

};
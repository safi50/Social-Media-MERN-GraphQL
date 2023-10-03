const User = require('../../models/User');
const config = require('../../config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');
const { Validator   } = require('node-input-validator');

// Function to create a token
function generateToken(user) {
    return jwt.sign({
        id: user.id, 
        email: user.email,
        username: user.username
    },
    config.SECRET_KEY, 
    { expiresIn: '12h' }
    );    
}

module.exports = {
    Mutation: {
            async login(_, { email, password }) {

                // Validate user data
                const loginValidator = new Validator({ email, password }, {
                    email: 'required|email',
                    password: 'required|minLength:6'
                });
                const matched = await loginValidator.check();
                if (!matched) {
                    throw new UserInputError('Incorrect Credentials', { errors: loginValidator.errors });
                }

                // Check if User Exists
                const user = await User.findOne({ email });
                if (!user) {
                    errors.general = 'User not found';
                    throw new UserInputError('User not found', { errors });
                }

                // Check if password is correct
                const match = await bcrypt.compare(password, user.password);
                if (!match) {
                    errors = 'Wrong Credentials!';
                    throw new UserInputError('Wrong Credentials', { errors });
                }

               const token = generateToken(user);

                return {
                    ...user._doc, 
                    id: user._id, 
                    token
                };
            },

        // register(_, args, context, info) 
            async register (_, {
                registerInput: { username, email, password, confirmPassword }
            }, context, info) {

            // Validate user data
            const validation = new Validator({ username, email, password, confirmPassword }, {
                username: 'required|minLength:3',
                email: 'required|email',
                password: 'required|minLength:6',
                confirmPassword: 'same:password'
            });

            const matched = await validation.check();
            if (!matched) {
                throw new UserInputError('Errors', { errors: validation.errors });
            }

             // Check if User Exists
             const user = await User.findOne({ email });
                if (user) {
                    throw new UserInputError('User already exists', {
                        errors: {
                            email: 'This email is already taken'
                        }
                    })
                }
             
            // Encrypt password and create an auth token
                password = await bcrypt.hash(password, 12);
                const newUser = new User({
                    email,
                    username,
                    password,
                    createdAt: new Date().toISOString()
                });

                // Save user to database
                const res = await newUser.save();

                // Create an auth token
                const token = generateToken(res);

                return {
                    ...res._doc, 
                    id: res._id, 
                    token
                }
        }
    }
};
const  jwt  = require('jsonwebtoken');
const { SECRET_KEY } = require('../../config.js');
const { AuthenticationError } = require('apollo-server');

module.exports = (context) => {
    // context = { ... headers }
    const token = context.req.headers.authorization;

    if (token) {
        if (token) {
            try {
                const user = jwt.verify(token, SECRET_KEY);
                return user;
            } catch(err) {
                throw new AuthenticationError('Invalid/Expired token');
            }
        }
        throw new Error('Authentication token error');
    }
    throw new Error('Authorization Token must be provided');
}
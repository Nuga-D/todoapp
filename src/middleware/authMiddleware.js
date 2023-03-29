const jwt = require('jsonwebtoken');
const { getRepository } = require('typeorm');
const User = require('../entities/User');

const authMiddleware = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        throw new Error('Authorization header not found');
        }
        const token = authorizationHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const userRepository = getRepository(User);
        const user = await userRepository.findOne(decoded.userId);
        if (!user) {
          throw new Error('User not found');
        }
        
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
        }
        };
        
        module.exports = authMiddleware;

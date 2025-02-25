const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET_KEY

class TokenValidator {
   validateToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header is missing' });
    }
  
    const token = authHeader.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Token is missing' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }


  }
  validateSocketToken(socket, next) {
    const token = socket.handshake.auth.token;
    if (token) {
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
          return next(new Error('Authentication error'));
        }
        socket.decoded = decoded;
        console.log(decoded);
        next();
      });
    } 
    else {
      console.log('connection failed')
      next(new Error('Authentication error'));
    }

  }
}

module.exports = new TokenValidator();




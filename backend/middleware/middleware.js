
const jwt = require('jsonwebtoken');

function authMiddleware(req,res, next) {
  const authentication = req.headers.authorization;

  if(!authentication) {
    return res.status(401).json({
      message: "No token provided"
    });
  }

  const token = authentication.split(' ')[1];

  try {
    const decoded  = jwt.verify(token, process.env.SECRET_KEY);
    if(decoded.id) {
      req.id = decoded.id;
      next();
    } else {
      return res.status(411).json({
        message: "Invalid token",
      });
    }
  } catch (error) {
    // console.log(error);
    
    return res.status(401).json({
      message: "Unauthorized"
    });
  }
}

module.exports = authMiddleware;
const jwt = require('jsonwebtoken')


const invalidatedTokens = new Set()

function authMiddleware(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    if (!token || invalidatedTokens.has(token)){
        return res.status(401).json({ message: "Access Denied. Invalid Token."}) //UnAuth
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.userId = decoded.userId
        next()
    }   catch(err) {
        return res.status(400).json({ message: 'Invalid token.' })
    }
}


function invalidateToken(token) {
    invalidatedTokens.add(token)
}

module.exports = {
    authMiddleware,
    invalidateToken
}





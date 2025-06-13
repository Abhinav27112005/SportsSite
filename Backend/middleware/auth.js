import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.js';
import pool from '../config/db.js';

export const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(403).json({ 
            message: "Authentication token required",
            code: "TOKEN_REQUIRED"
        });
    }

    try {
        const decoded = jwt.verify(token, jwtConfig.secret);
        if(decoded.exp && decoded.exp < Date.now()/1000){
            return res.status(401).json({ 
                message: "Token has expired",
                code: "TOKEN_EXPIRED"
            });
        }
        req.user = decoded;
        next();
    } catch (err) {
        const message = err.name === 'TokenExpiredError' 
            ? "Token expired" 
            : "Invalid token";
        const code = err.name === 'TokenExpiredError'
            ? "TOKEN_EXPIRED"
            : "INVALID_TOKEN";
            
        return res.status(401).json({ message, code });
    }
};

export const isAdmin = async (req, res, next) => {
    try {
        // Verify pool connection first
        if (!pool) {
            throw new Error('Database connection not established');
        }

        const {rows} = await pool.query(
            "SELECT is_admin FROM signup WHERE Id = $1", 
            [req.user.id]
        );
        
        if (!rows[0]?.is_admin) {
            return res.status(403).json({message: "Admin access required"});
        }
        
        next();
    } catch (err) {
        console.error('Admin check error:', err);
        return res.status(500).json({ 
            error: 'Database error',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};
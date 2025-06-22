import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.js';
import User from '../models/User.js';

const saltRounds = 12;

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        await User.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByEmail(email.trim());
        
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        // Handle plaintext passwords in database (migration)
        if (user.password.length < 60) {
            const hashedPassword = await bcrypt.hash(password.trim(), saltRounds);
            if (password.trim() !== user.password) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            await User.updatePassword(user.id, hashedPassword);
        } else {
            const isPasswordValid = await bcrypt.compare(password.trim(), user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
        }
        
        const token = jwt.sign(
            { id: user.id, is_admin: user.is_admin },
            jwtConfig.secret,
            { expiresIn: jwtConfig.expiresIn|| '1h' }
        );
        
        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                is_admin: user.is_admin
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    const decoded = jwt.verify(token, jwtConfig.secret, { ignoreExpiration: true });
    
    const newToken = jwt.sign(
      { id: decoded.id, is_admin: decoded.is_admin },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );
    
    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
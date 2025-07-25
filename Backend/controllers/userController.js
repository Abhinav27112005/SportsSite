import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.js'
const saltRounds = 12;

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        await User.update(req.user.id, { name, email });
        res.json({ message: "Profile updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        // Get user by ID instead of email
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }
        
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        await User.updatePassword(req.user.id, hashedPassword);

        //Issue a new Token
        const token = jwt.sign(
        { id: user.id, is_admin: user.is_admin },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn || '1h' }
        );
        res.json({ message: "Password changed successfully",token});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
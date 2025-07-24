import pool from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

class User {
    static async create({ name, email, password }) {
        const {rows} = await pool.query(
            "INSERT INTO signup (name, email, password) VALUES ($1, $2, $3) RETURNING *",
            [name, email, password]
        );
        return rows[0];
    }
    
    static async createUnverified({ name, email, password, otp }) {
        const otpExpiry = new Date();
        const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || 10, 10);
        otpExpiry.setMinutes(otpExpiry.getMinutes() + expiryMinutes); // OTP valid for configured minutes
        
        const {rows} = await pool.query(
            "INSERT INTO signup (name, email, password, otp, otp_expiry, is_verified) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [name, email, password, otp, otpExpiry, false]
        );
        return rows[0];
    }

    static async findByEmail(email) {
        const {rows} = await pool.query(
            "SELECT * FROM signup WHERE email = $1",
            [email]
        );
        return rows[0];
    }
    
    static async verifyOTP(email, otp) {
        const now = new Date();
        // Convert to UTC to match PostgreSQL timestamp
        const utcNow = new Date(now.toISOString());
        
        try {
            const {rows} = await pool.query(
                `SELECT * FROM signup 
                WHERE email = $1 
                AND otp = $2 
                AND otp_expiry > $3
                AND is_verified = false`,
                [email, otp, utcNow]
            );
        
            if (rows.length === 0) {
                console.error('OTP Verification Failed:', {
                    email,
                    otp,
                    currentTime: utcNow
                });
                return { verified: false };
            }
        
            // Update verification status
            await pool.query(
                `UPDATE signup 
                SET is_verified = true, 
                    otp = NULL, 
                    otp_expiry = NULL
                WHERE email = $1`,
                [email]
            );
        
            return { verified: true, user: rows[0] };
        } catch (error) {
            console.error('Database Error during OTP verification:', error);
            return { verified: false };
        }
    }
    
    static async regenerateOTP(email, otp) {
        const otpExpiry = new Date();
        const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || 10, 10);
        otpExpiry.setMinutes(otpExpiry.getMinutes() + expiryMinutes); // OTP valid for configured minutes
        
        const {rows} = await pool.query(
            "UPDATE signup SET otp = $1, otp_expiry = $2 WHERE email = $3 AND is_verified = false RETURNING *",
            [otp, otpExpiry, email]
        );
        
        if (rows.length === 0) {
            return null;
        }
        
        return rows[0];
    }

    static async findById(id) {
        const {rows} = await pool.query(
            "SELECT id, name, email, password, is_admin, is_verified FROM signup WHERE id = $1",
            [id]
        );
        return rows[0];
    }

    static async update(id, { name, email }) {
        await pool.query(
            "UPDATE signup SET name = $1, email = $2 WHERE Id = $3",
            [name, email, id]
        );
    }

    static async updatePassword(id, hashedPassword) {
        await pool.query(
            "UPDATE signup SET password = $1 WHERE Id = $2",
            [hashedPassword, id]
        );
    }
    static async deleteUnverified(email) {
        const { rowCount } = await pool.query(
            "DELETE FROM signup WHERE email = $1 AND is_verified = false",
            [email]
        );
        return rowCount > 0;
    }
}

export default User;
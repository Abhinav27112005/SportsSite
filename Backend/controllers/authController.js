import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.js';
import User from '../models/User.js';
import { sendOTPEmail, generateOTP, calculateOTPExpiry } from '../utils/emailService.js';

const saltRounds = 12;

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findByEmail(email.trim());
        if (existingUser) {
            // If user exists but is not verified, allow re-registration
            if (existingUser.is_verified === false) {
                const otp = generateOTP();
                const hashedPassword = await bcrypt.hash(password.trim(), saltRounds);
                
                // Update the existing unverified user with new details and OTP
                 // Update user first
                const updated = await User.regenerateOTP(email.trim(), otp);
                if (!updated) {
                    return res.status(500).json({ error: "Failed to update user" });
                }
                // Send OTP email
                // Then send email
                const emailSent = await sendOTPEmail(email.trim(), name, otp);
                
                if (!emailSent) {
                    await User.regenerateOTP(email.trim(), null); // Rollback
                    return res.status(500).json({ error: "Failed to send verification email" });
                }
                
                return res.status(201).json({ 
                    message: "Verification code sent to your email",
                    requiresVerification: true,
                    email: email.trim()
                });
            } 
                // User exists and is verified
            return res.status(400).json({ error: "Email already registered" });
        }
        
        // Create new user with OTP
        const otp = generateOTP();
        const hashedPassword = await bcrypt.hash(password.trim(), saltRounds);
        
        const newUser = await User.createUnverified({ 
            name, 
            email: email.trim(), 
            password: hashedPassword, 
            otp 
        });
        
        if (!newUser) {
            return res.status(500).json({ error: "Failed to create user" });
        }
        
        // Send OTP email
        const emailSent = await sendOTPEmail(email.trim(), name, otp);
        
        if (!emailSent) {
            await User.deleteUnverified(email.trim()); // Rollback
            return res.status(500).json({ error: "Failed to send verification email" });
        }
        
        res.status(201).json({ 
            message: "Verification code sent to your email",
            requiresVerification: true,
            email: email.trim()
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
                console.log('Login attempt for:', email);
        const user = await User.findByEmail(email.trim());
                console.log('User found:', user ? user.email : 'none');
        
        
        if (!user) {
            console.log('No user found with email:', email);
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        // Check if user is verified
        if (user.is_verified === false) {
            // Generate new OTP for unverified user
            const otp = generateOTP();
            
            // First update database, then send email
            const updatedUser = await User.regenerateOTP(email.trim(), otp);
            if (!updatedUser) {
                return res.status(500).json({ error: "Failed to generate OTP" });
            }

            // Send OTP email
            const emailSent = await sendOTPEmail(email.trim(), user.name, otp);
            
            if (!emailSent) {
                // Rollback OTP generation if email fails
                await User.regenerateOTP(email.trim(), null);
                return res.status(500).json({ 
                    error: "Failed to send verification email",
                    code: "EMAIL_SEND_FAILED"
                });
            }
            return res.status(403).json({
              message: "Email not verified. Verification code sent to your email.",
              code: "EMAIL_NOT_VERIFIED",
              requiresVerification: true,
              email: email.trim()
            });
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

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }
    
    const result = await User.verifyOTP(email.trim(), otp.trim());
    
    if (!result.verified) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }
    
    // Generate token for the verified user
    const token = jwt.sign(
      { id: result.user.id, is_admin: result.user.is_admin },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn || '1h' }
    );
    
    res.json({
      message: "Email verified successfully",
      token,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        is_admin: result.user.is_admin
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    
    const user = await User.findByEmail(email.trim());
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    if (user.is_verified) {
      return res.status(400).json({ error: "Email is already verified" });
    }
    
    // Generate new OTP
    const otp = generateOTP();
    const updatedUser = await User.regenerateOTP(email.trim(), otp);
    
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found or already verified" });
    }
    
    // Send OTP email
    const emailSent = await sendOTPEmail(email.trim(), user.name, otp);
    
    if (!emailSent) {
      return res.status(500).json({ error: "Failed to send verification email" });
    }
    
    res.json({ message: "Verification code resent to your email" });
  } catch (error) {
    console.error('Resend OTP error:', error);
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
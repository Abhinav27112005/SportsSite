import express from 'express';
import { signup, login, refreshToken, verifyOTP, resendOTP } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.get('/verify-token', verifyToken, (req, res) =>{
    res.json({
        valid:true,
        message: 'Token is valid',
        user: {
            id: req.user.id,
            is_admin: req.user.is_admin
        }
    })
})
router.post('/refresh-token', refreshToken);
export default router;
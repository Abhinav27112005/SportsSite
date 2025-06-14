import express from 'express';
import { signup, login } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
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
export default router;
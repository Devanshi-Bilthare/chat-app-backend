const express = require('express');
const { registerUser, loginUser, getMe, getAll,getUser } = require('../controllers/userControllers');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/getUser/:id', getUser);
router.get('/getAll',getAll);

module.exports = router;

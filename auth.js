const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();

// In-memory data store (for demo purposes, this should be a database in production)
let users = [];
let queryHistory = [];

const SECRET_KEY = 'your_secret_key'; // Change this to a strong key

// Middleware to check token
function checkToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        req.userId = decoded.id;
        next();
    });
}

// Signup route
router.post('/signup', (req, res) => {
    const { username, password, specialCode } = req.body;
    // Validate special code (you can set your own logic here)
    if (specialCode !== 'YOUR_SPECIAL_CODE') {
        return res.status(403).send({ message: 'Invalid special code.' });
    }
    const hashedPassword = bcrypt.hashSync(password, 8);
    const user = { id: users.length + 1, username, password: hashedPassword };
    users.push(user);
    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: 86400 }); // expires in 24 hours
    res.status(201).send({ auth: true, token });
});

// Login route
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).send({ auth: false, token: null });
    }
    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: 86400 }); // expires in 24 hours
    res.status(200).send({ auth: true, token });
});

// Logout route
router.post('/logout', (req, res) => {
    res.status(200).send({ auth: false, token: null }); // Simply invalidate the token on client side by removing it
});

// Query history management
router.post('/query', checkToken, (req, res) => {
    const query = req.body.query;
    queryHistory.push({ userId: req.userId, query, date: new Date() });
    res.status(200).send({ message: 'Query saved successfully!' });
});

router.get('/query/history', checkToken, (req, res) => {
    const history = queryHistory.filter(q => q.userId === req.userId);
    res.status(200).send(history);
});

module.exports = router;
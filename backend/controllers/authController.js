const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// Sign Up
exports.signup = (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const id = uuidv4();

    db.run(`INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)`,
        [id, name, email, hashedPassword], function (err) {
            if (err) return res.status(500).send("User registration failed.");
            const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: 86400 });
            res.status(201).json({ auth: true, token });
        });
};

// Login
exports.login = (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
        if (err || !user) return res.status(404).send('User not found');
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 86400 });
        res.status(200).json({ auth: true, token });
    });
};

const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Update User Profile
exports.updateProfile = (req, res) => {
    const { name, email, password } = req.body;
    const userId = req.user.id;
    const hashedPassword = bcrypt.hashSync(password, 8);

    db.run(`UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?`,
        [name, email, hashedPassword, userId], function (err) {
            if (err) return res.status(500).send("Failed to update profile.");
            res.status(200).send("Profile updated successfully.");
        });
};

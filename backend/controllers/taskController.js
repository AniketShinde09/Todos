const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Create Task
exports.createTask = (req, res) => {
    const { title, status } = req.body;
    const id = uuidv4();
    const userId = req.user.id;

    db.run(`INSERT INTO tasks (id, userId, title, status) VALUES (?, ?, ?, ?)`,
        [id, userId, title, status], function (err) {
            if (err) return res.status(500).send("Failed to create task.");
            res.status(201).json({ id, title, status });
        });
};

// Get Tasks
exports.getTasks = (req, res) => {
    const userId = req.user.id;
    db.all(`SELECT * FROM tasks WHERE userId = ?`, [userId], (err, tasks) => {
        if (err) return res.status(500).send("Failed to fetch tasks.");
        res.status(200).json(tasks);
    });
};

// Update Task
exports.updateTask = (req, res) => {
    const { id, title, status } = req.body;

    db.run(`UPDATE tasks SET title = ?, status = ? WHERE id = ?`, [title, status, id], function (err) {
        if (err) return res.status(500).send("Failed to update task.");
        res.status(200).send("Task updated successfully.");
    });
};

// Delete Task
exports.deleteTask = (req, res) => {
    const { id } = req.params;

    db.run(`DELETE FROM tasks WHERE id = ?`, [id], function (err) {
        if (err) return res.status(500).send("Failed to delete task.");
        res.status(200).send("Task deleted successfully.");
    });
};

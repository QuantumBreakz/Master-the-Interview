// AI-generated Express server
// Demonstrates routing, middleware, and JSON responses

const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Sample data
let users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
];

// GET all users
app.get('/users', (req, res) => {
    res.json(users);
});

// GET user by ID
app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id == req.params.id);
    if (user) res.json(user);
    else res.status(404).json({ error: 'User not found' });
});

// POST new user
app.post('/users', (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const newUser = { id: Date.now(), name };
    users.push(newUser);
    res.status(201).json(newUser);
});

// PUT update user
app.put('/users/:id', (req, res) => {
    const user = users.find(u => u.id == req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { name } = req.body;
    if (name) user.name = name;
    res.json(user);
});

// DELETE user
app.delete('/users/:id', (req, res) => {
    const index = users.findIndex(u => u.id == req.params.id);
    if (index === -1) return res.status(404).json({ error: 'User not found' });
    const removed = users.splice(index, 1);
    res.json(removed[0]);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

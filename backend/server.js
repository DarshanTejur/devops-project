const express = require('express');
const cors = require('cors'); // Line 1
const app = express();

app.use(cors()); // Line 2 (must be before your routes)

app.get('/api', (req, res) => {
    res.json({ message: "Backend is connected and running!" });
});

app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on port 3000');
});
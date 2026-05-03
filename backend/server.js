const express = require('express');
const cors = require('cors'); // Ensure this is here
const app = express();

app.use(cors()); // This MUST be before app.get('/api'...)

app.get('/api', (req, res) => {
    res.json({ message: "Backend is connected and running!" });
});

app.listen(3000, '0.0.0.0');
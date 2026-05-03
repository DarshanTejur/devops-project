const express = require('express');
const app = express();
const PORT = 3000;

app.get('/api', (req, res) => {
  res.json({ message: "Backend is connected and running!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
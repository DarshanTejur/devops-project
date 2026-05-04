const express = require('express');
const mongoose = require('mongoose');
const client = require('prom-client'); // 1. Import Prometheus client
const app = express();

// --- MONITORING SETUP ---
// Create a Registry to hold metrics and collect default data (CPU, Memory, etc.)
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// --- MIDDLEWARE ---
app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// --- MONGODB CONNECTION ---
const mongoURI = 'mongodb://database:27017/devops_db';
mongoose.connect(mongoURI)
    .then(() => console.log("MongoDB Connected!"))
    .catch(err => console.log("MongoDB Connection Error: ", err));

// --- SCHEMAS ---
const VisitSchema = new mongoose.Schema({ timestamp: { type: Date, default: Date.now } });
const Visit = mongoose.model('Visit', VisitSchema);

const TaskSchema = new mongoose.Schema({
    text: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    date: { type: Date, default: Date.now }
});
const Task = mongoose.model('Task', TaskSchema);

// --- ROUTES ---

// 2. PROMETHEUS METRICS ROUTE (This fixes the 404 in image_f02662.jpg)
app.get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
});

app.get('/api', async (req, res) => {
    try {
        const newVisit = new Visit();
        await newVisit.save();
        const totalVisits = await Visit.countDocuments();
        res.json({ message: "Backend & Database are connected!", total_visits: totalVisits });
    } catch (err) {
        res.status(500).json({ message: "Database Error", error: err });
    }
});

app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ date: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: "Could not fetch tasks" });
    }
});

app.post('/api/tasks', async (req, res) => {
    try {
        const newTask = new Task({ text: req.body.text });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(500).json({ error: "Could not save task" });
    }
});

app.listen(3000, '0.0.0.0', () => {
    console.log('Backend running on port 3000');
});
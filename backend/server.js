const express = require('express');
const mongoose = require('mongoose');
const client = require('prom-client');
const app = express();

// --- MONITORING SETUP ---
const register = new client.Registry();

// 1. Collect default metrics (CPU, Memory, etc.) and add them to our registry
client.collectDefaultMetrics({ register });

// 2. NEW: Custom Metric to count HTTP requests - REGISTERED correctly
const httpRequestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
    registers: [register] // This is the crucial fix
});

// --- MIDDLEWARE ---
app.use(express.json());

// Middleware to track metrics for every request
app.use((req, res, next) => {
    res.on('finish', () => {
        httpRequestCounter.inc({
            method: req.method,
            route: req.path,
            status_code: res.statusCode
        });
    });
    next();
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// --- MONGODB CONNECTION ---
const mongoURI = process.env.MONGO_URI || 'mongodb://database:27017/devops_db';
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

// Prometheus Metrics Route
app.get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    // This now sends both default AND custom metrics
    res.send(await register.metrics());
});

app.get('/api', async (req, res) => {
    try {
        const newVisit = new Visit();
        await newVisit.save();
        const totalVisits = await Visit.countDocuments();
        res.json({ message: "Backend & Database are connected!", total_visits: totalVisits });
    } catch (err) { 
        res.status(500).json({ message: "Database Error" }); 
    }
});

app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ date: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: "Fetch Error" });
    }
});

app.post('/api/tasks', async (req, res) => {
    try {
        const newTask = new Task({ text: req.body.text });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(500).json({ error: "Save Error" });
    }
});

app.listen(3000, '0.0.0.0', () => {
    console.log('Backend running on port 3000');
});
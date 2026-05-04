import React, { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState({ message: 'Initializing...', total_visits: 0 });
  const [text, setText] = useState('');
  const API_BASE = 'http://3.111.52.80:3000/api';

  useEffect(() => {
    fetch(API_BASE).then(res => res.json()).then(setStatus).catch(console.error);
    fetch(`${API_BASE}/tasks`).then(res => res.json()).then(setTasks).catch(console.error);
  }, []);

  const addTask = (e) => {
    e.preventDefault();
    if (!text) return;
    fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    }).then(res => res.json()).then(newTask => {
      setTasks([newTask, ...tasks]);
      setText('');
    });
  };

  return (
    <div>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', margin: '0' }}>Toji's  Dashboard</h1>
        <p style={{ color: '#94a3b8' }}>Infrastructure: AWS EC2 | Container: Docker | DB: MongoDB</p>
      </header>
      
      <div className="card">
        <h3 style={{ marginTop: '0', color: '#38bdf8' }}>System Health</h3>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span className="status-dot"></span>
          <span>{status.message}</span>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Live Connections: {status.total_visits}</p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: '0' }}>Deployment Tasks</h3>
        <form onSubmit={addTask} style={{ display: 'flex', marginBottom: '20px' }}>
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g., Update Nginx config..." />
          <button type="submit">Push Task</button>
        </form>
        
        <div>
          {tasks.length === 0 ? (
            <p style={{ color: '#64748b' }}>No active tasks in pipeline.</p>
          ) : (
            tasks.map(task => (
              <div key={task._id} className="task-item">
                <span>{task.text}</span>
                <span style={{ color: '#38bdf8', fontSize: '0.8rem' }}>{new Date(task.date).toLocaleTimeString()}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
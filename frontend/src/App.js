import React, { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState({ message: 'Initializing...', total_visits: 0 });
  const [text, setText] = useState('');

  // INDUSTRY STANDARD: Safety check for 'process' to prevent browser crashes
  const API_BASE = (typeof process !== 'undefined' && process.env.REACT_APP_API_URL) 
    ? process.env.REACT_APP_API_URL 
    : 'http://localhost:3000/api';

  useEffect(() => {
    // Initial health check and visit count
    fetch(API_BASE)
      .then(res => res.json())
      .then(setStatus)
      .catch(err => console.error("Health check failed:", err));

    // Fetch existing tasks
    fetch(`${API_BASE}/tasks`)
      .then(res => res.json())
      .then(setTasks)
      .catch(err => console.error("Task fetch failed:", err));
  }, [API_BASE]);

  const addTask = (e) => {
    e.preventDefault();
    if (!text) return;
    
    fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    })
      .then(res => res.json())
      .then(newTask => {
        setTasks([newTask, ...tasks]);
        setText('');
      })
      .catch(err => console.error("Add task failed:", err));
  };

  return (
    <div style={{ backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', margin: '0' }}>Toji's Dashboard</h1>
        <p style={{ color: '#94a3b8' }}>Infrastructure: AWS EC2 | Container: Docker | DB: MongoDB</p>
      </header>
      
      <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #334155' }}>
        <h3 style={{ marginTop: '0', color: '#38bdf8' }}>System Health</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#22c55e', borderRadius: '50%' }}></div>
          <span>{status.message}</span>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Live Connections: {status.total_visits}</p>
      </div>

      <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
        <h3 style={{ marginTop: '0' }}>Deployment Tasks</h3>
        <form onSubmit={addTask} style={{ display: 'flex', marginBottom: '20px', gap: '10px' }}>
          <input 
            type="text" 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            placeholder="e.g., Update Nginx config..." 
            style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white' }}
          />
          <button type="submit" style={{ padding: '12px 24px', backgroundColor: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            Push Task
          </button>
        </form>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {tasks.length === 0 ? (
            <p style={{ color: '#64748b' }}>No active tasks in pipeline.</p>
          ) : (
            tasks.map(task => (
              <div key={task._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', borderBottom: '1px solid #334155' }}>
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
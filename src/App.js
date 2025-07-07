import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [joke, setJoke] = useState('Awesome joke is loading...');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  const generateJokes = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://icanhazdadjoke.com/', {
        headers: { Accept: 'application/json' },
      });
      const data = await res.json();
      setJoke(data.joke);
      setHistory(prev => {
        const newHistory = [data.joke, ...prev.filter(j => j !== data.joke)];
        return newHistory.slice(0, 5);
      });
    } catch (err) {
      setJoke('Failed to fetch joke.');
      console.error('The error is', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateJokes();
    // eslint-disable-next-line
  }, []);

  const copyJoke = () => {
    navigator.clipboard.writeText(joke);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="app-bg">
      <nav className="navbar">
        <div className="navbar-title">😂 Joke Generator</div>
        <div className="navbar-links">
          <a href="https://icanhazdadjoke.com/api" target="_blank" rel="noopener noreferrer">API Docs</a>
          <a href="https://github.com/icanhazdadjoke" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </nav>
      <div className="joke-card">
        <div className="emoji" aria-label="laughing">😂</div>
        <h1 className="main-title">Random Dad Jokes</h1>
        <div className="joke" id="joke">
          {loading ? <span className="spinner"></span> : joke}
        </div>
        <div className="button-row">
          <button id="jokebtn" className="btn fancy-btn" onClick={generateJokes} disabled={loading}>
            {loading ? 'Loading...' : 'Next Joke'}
          </button>
          <button className="btn copy-btn" onClick={copyJoke} disabled={loading || !joke}>
            {copied ? 'Copied!' : 'Copy Joke'}
          </button>
        </div>
      </div>
      <div className="history-section">
        <h2>Joke History</h2>
        <ul className="history-list">
          {history.length === 0 && <li>No jokes yet.</li>}
          {history.map((j, idx) => (
            <li key={idx}>{j}</li>
          ))}
        </ul>
      </div>
      <footer className="footer">
        <span>Powered by <a href="https://icanhazdadjoke.com/" target="_blank" rel="noopener noreferrer">icanhazdadjoke.com</a></span>
      </footer>
    </div>
  );
}

export default App;

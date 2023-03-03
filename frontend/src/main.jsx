import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import axios from 'axios';
// const PORT = import.meta.env.PORT || 5000;
// console.log(`http://localhost:${PORT}/`)
axios.defaults.baseURL = `http://localhost:5000`;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

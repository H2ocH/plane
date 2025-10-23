import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' // Assuming a global css file for tailwind directives

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

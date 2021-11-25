import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Home from './components/pages/home'
import './lib/firebase'

ReactDOM.render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>,
  document.getElementById('root')
)

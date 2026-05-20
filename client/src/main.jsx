import './axiosConfig'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const theme = localStorage.getItem('theme')
const language = localStorage.getItem('language') || 'en'
const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
const isDark = theme ? theme === 'dark' : prefersDark

document.documentElement.classList.toggle('dark', isDark)
document.documentElement.lang = language

document.documentElement.style.colorScheme = isDark ? 'dark' : 'light'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

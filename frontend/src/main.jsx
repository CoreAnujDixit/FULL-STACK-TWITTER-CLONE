import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/react'
import axios from 'axios'

// Configure axios base URL
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  </StrictMode>,
)

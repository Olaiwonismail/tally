import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource/public-sans/400.css'
import '@fontsource/public-sans/700.css'
import '@fontsource/public-sans/800.css'
import './styles/registry.css'
import App from './App.jsx'
import { StoreProvider } from './state/store.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>,
)

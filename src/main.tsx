import { BrowserRouter } from 'react-router'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { Toaster } from './components/ui/sonner'
import Providers from './components/providers'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Providers>
        <App />
        <Toaster />
      </Providers>
    </BrowserRouter>
  </StrictMode>
)

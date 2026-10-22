import React from 'react'
import ReactDOM from 'react-dom/client'
import AdminApp from './admin/AdminApp.tsx'
import App from './App.tsx'
import { SiteContentProvider } from './content/SiteContent.tsx'
import './index.css'

const isAdmin = window.location.pathname.replace(/\/+$/, '') === '/admin'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isAdmin ? (
      <AdminApp />
    ) : (
      <SiteContentProvider>
        <App />
      </SiteContentProvider>
    )}
  </React.StrictMode>,
)

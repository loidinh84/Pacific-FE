import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'
import { initSystemBranding } from './utils/systemBranding.js'

initSystemBranding();

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "1039868725838-pacificdemo.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)


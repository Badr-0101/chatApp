import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { appStore } from './store/store'
import { Toaster } from "sonner"

createRoot(document.getElementById('root')!).render(
  <Provider store={appStore}>
    <StrictMode>  
      <BrowserRouter basename="/chat-app">
        <App />
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </StrictMode>
  </Provider>,
)

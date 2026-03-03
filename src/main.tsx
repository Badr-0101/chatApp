import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { appStore } from './store/store'
import { Toaster } from "sonner"
import { PersistGate } from 'redux-persist/integration/react'
import { appPersistor } from './store/store'
createRoot(document.getElementById('root')!).render(
  <Provider store={appStore}>
    <StrictMode>  
      <PersistGate loading={null} persistor={appPersistor}>
      <BrowserRouter basename="/chat-app">
        <App />
        <Toaster position="top-right" richColors />
      </BrowserRouter>
      </PersistGate>
    </StrictMode>
  </Provider>,
)

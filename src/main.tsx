import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// PrimeReact styles
import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

import { PrimeReactProvider } from 'primereact/api'

// ✅ Redux
import { Provider } from 'react-redux'
import { store } from './app/store.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrimeReactProvider value={{ ripple: true }}>

      {/* ✅ ADD THIS */}
      <Provider store={store}>
        <App />
      </Provider>

    </PrimeReactProvider>
  </StrictMode>
)
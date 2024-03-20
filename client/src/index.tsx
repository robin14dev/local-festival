import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { UserContextProvider } from 'contexts/userContext'
import { LoginModalContextProvider } from 'contexts/LoginModalContext'
import { PickItemsContextProvider } from 'contexts/PickItemsContext'
import { ModalContextProvider } from 'contexts/ModalContext'
import SignupModal from 'components/account/SignupModal'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
    <StrictMode>
        {/*  
     <BrowserRouter>
      <UserContextProvider>
        <ModalContextProvider>
          <PickItemsContextProvider>
            <App />
          </PickItemsContextProvider>
        </ModalContextProvider>
      </UserContextProvider>
    </BrowserRouter> */}
        <SignupModal />
    </StrictMode>
)

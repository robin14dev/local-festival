import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { UserContextProvider } from "contexts/userContext";
import { LoginModalContextProvider } from "contexts/LoginModalContext";
import { PickItemsContextProvider } from "contexts/PickItemsContext";
import { ModalContextProvider } from "contexts/ModalContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <StrictMode>
    {/* <BrowserRouter>
      <UserContextProvider>
        <LoginModalContextProvider>
          <PickItemsContextProvider>
            <App />
          </PickItemsContextProvider>
        </LoginModalContextProvider>
      </UserContextProvider>
    </BrowserRouter> */}
     <BrowserRouter>
      <UserContextProvider>
        <ModalContextProvider>
          <PickItemsContextProvider>
            <App />
          </PickItemsContextProvider>
        </ModalContextProvider>
      </UserContextProvider>
    </BrowserRouter>
   
  </StrictMode>
);

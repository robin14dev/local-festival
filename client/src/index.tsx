import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { StrictMode } from "react";
import { UserContextProvider } from "./contexts/userContext";
import { LoginModalContextProvider } from "./contexts/LoginModalContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <StrictMode>
    <BrowserRouter>
      <UserContextProvider>
        <LoginModalContextProvider>
          <App />
        </LoginModalContextProvider>
      </UserContextProvider>
    </BrowserRouter>
  </StrictMode>,
);

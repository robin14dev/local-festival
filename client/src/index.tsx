import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { StrictMode } from "react";
import { UserContextProvider } from "./contexts/userContext";
import { LoginModalContextProvider } from "./contexts/LoginModalContext";
import { PickItemsContextProvider } from "./contexts/PickItemsContext";
import LoginModal from "./components/account/LoginModal";
import HashTag from "components/HashTag";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <StrictMode>
    {/* <BrowserRouter>
      <UserContextProvider>
        <LoginModalContextProvider>
          <PickItemsContextProvider>
            <LoginModal />
            <App />
          </PickItemsContextProvider>
        </LoginModalContextProvider>
      </UserContextProvider>
    </BrowserRouter> */}
    <HashTag onSearch={() => {}} query={""} />
  </StrictMode>
);

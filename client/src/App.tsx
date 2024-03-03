import "./App.css";
import "../src/styles/common.scss";
import theme from "./styles/theme";
import React, { useState, useRef, useCallback, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet";
import styled, { ThemeProvider } from "styled-components";
import axios from "axios";
import {
  LoginModalDispatchContext,
  LoginModalStateContext,
} from "./contexts/LoginModalContext";
import Wishlist from "./pages/Wishlist";
import DetailView from "./pages/DetailView";
import Main from "./pages/Main";
import Account from "./pages/Account";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginModal from "./components/account/LoginModal";

const Wrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
`;

function App() {
  console.log("App render");
  const [festivalData, setFestivalData] = useState<FestivalItem[]>([]);

  const [filteredData, setFilteredData] =
    useState<FestivalItem[]>(festivalData);
  const offset = useRef(0);

  return (
    <ThemeProvider theme={theme}>
      <Wrapper>
        <Helmet>
          <title>이번주엔 어디로 가볼까? - LOCO</title>
        </Helmet>

        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <Main
                filteredData={filteredData}
                setFestivalData={setFestivalData}
                setFilteredData={setFilteredData}
                offset={offset}
              />
            }
          />
          <Route
            path=":search"
            element={
              <Main
                filteredData={filteredData}
                setFestivalData={setFestivalData}
                setFilteredData={setFilteredData}
                offset={offset}
              />
            }
          />

          <Route path="/Wishlist" element={<Wishlist />} />
          <Route path="/Detail/:festivalId/*" element={<DetailView />} />
          <Route path="/Account" element={<Account />} />
        </Routes>
        <Footer />
      </Wrapper>
    </ThemeProvider>
  );
}

export default App;

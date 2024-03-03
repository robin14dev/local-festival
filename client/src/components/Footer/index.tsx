import React, { useContext, useState, useEffect } from "react";
import peachmong from "../../assets/peachmong.png";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Account } from "../../assets/profile.svg";
import { ReactComponent as Wishlist } from "../../assets/heart-empty.svg";
import { ReactComponent as Main } from "../../assets/search.svg";
import { UserContext } from "../../contexts/userContext";
import { LoginModalDispatchContext } from "../../contexts/LoginModalContext";
import { Container, MobileContainer, Item } from "./styled";

const Footer = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  let navigate = useNavigate();
  const { authState } = useContext(UserContext);
  const setIsLoginModal = useContext(LoginModalDispatchContext);
  const goPage = (path: string) => {
    if (authState.loginStatus) {
      navigate(`/${path}`);
    } else {
      setIsLoginModal(true);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      {isMobile ? (
        <MobileContainer data-testid="Footer-mobile">
          <Item onClick={() => navigate("/")}>
            <Main width={23} height={23} fill={"#FF9A62"} />

            <div>둘러보기</div>
          </Item>
          <Item onClick={() => goPage("Wishlist")}>
            <Wishlist width={23} height={23} fill={"#FF9A62"} />
            <div>위시리스트</div>
          </Item>
          <Item onClick={() => goPage("Account")}>
            <Account width={23} height={23} fill={"#FF9A62"} />
            <div>프로필</div>
          </Item>
        </MobileContainer>
      ) : (
        <Container data-testid="Footer">
          <img src={peachmong} alt="peachmong" />
          <div>Copyright © 2022 Peachmong All rights reserved.</div>
        </Container>
      )}
    </>
  );
};

export default Footer;

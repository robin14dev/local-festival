import React from "react";
import moment from "moment";

import { ReactComponent as Instagram } from "../assets/instagram.svg";
import { ReactComponent as Youtube } from "../assets/youtube.svg";
import { ReactComponent as Homepage } from "../assets/homepage.svg";
import { ReactComponent as Phone } from "../assets/phone.svg";
import { Contacts, Container, Links, Overview } from "./styled";

type DescTabProps = {
  festival: FestivalItem;
};

const DescTab = ({ festival }: DescTabProps) => {
  const { location, overview, tel, title, homepageUrl, startDate, endDate } =
    festival;

  const urlCollection = {
    official: "",
    instagram: "",
    youtube: "",
  };
  if (homepageUrl) {
    const regex = {
      official: /http(s)?:\/\/[a-zA-Z\\d`~!@#$%^&*()-_=+]+/g,
      instagram: /(https?:\/\/www.instagram.com\/[a-zA-Z0-9]+)/g,
      youtube: /(https?:\/\/www.youtube.com\/[a-zA-Z0-9]+)/g,
    };

    if (homepageUrl.match(regex.official)) {
      urlCollection["official"] = homepageUrl.match(regex.official)![0];
    }
    if (homepageUrl.match(regex.instagram)) {
      urlCollection["official"] = homepageUrl.match(regex.instagram)![0];
    }

    if (homepageUrl.match(regex.youtube)) {
      urlCollection["youtube"] = homepageUrl.match(regex.youtube)![0];
    }
  }

  return (
    <Container>
      <h1>{title}</h1>
      <h2> {location}</h2>
      <h2>
        {moment(startDate, "YYYY.MM.DD").format("YYYY년 MM월 DD일")} ~{" "}
        {moment(endDate, "YYYY.MM.DD").format("YYYY년 MM월 DD일")}
      </h2>

      <Overview>
        {overview
          .replace(/<(\/br|br)([^>]*)>/gi, "\n")
          .replace(/&lt;/gi, "<")
          .replace(/&gt;/gi, ">")}
      </Overview>

      <Contacts>
        <div>
          <button
            onClick={() => {
              document.location.href = `tel:${tel}`;
            }}
          >
            <Phone />
            {tel}
          </button>
        </div>

        <Links>
          {!!urlCollection.official && (
            <button
              onClick={() => {
                window.open(urlCollection.official);
              }}
            >
              <Homepage /> 공식 홈페이지
            </button>
          )}
          {!!urlCollection.instagram && (
            <button
              onClick={() => {
                window.open(urlCollection.instagram);
              }}
            >
              <Instagram /> 인스타그램 계정
            </button>
          )}
          {!!urlCollection.youtube && (
            <button
              onClick={() => {
                window.open(urlCollection.youtube);
              }}
            >
              <Youtube /> 유튜브 채널
            </button>
          )}
        </Links>
      </Contacts>
    </Container>
  );
};

export default DescTab;

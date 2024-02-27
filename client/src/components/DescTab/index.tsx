import React from "react";
import moment from "moment";

import { ReactComponent as InstagramIcon } from "../../assets/instagram.svg";
import { ReactComponent as YoutubeIcon } from "../../assets/youtube.svg";
import { ReactComponent as HomepageIcon } from "../../assets/homepage.svg";
import { ReactComponent as PhoneIcon } from "../../assets/phone.svg";
import { Contacts, Container, Links, Overview } from "./styled";
import { Link } from "react-router-dom";

type DescTabProps = {
  festival: FestivalItem;
};
type RegexObj = { [key: string]: RegExp };

const regex: { [key: string]: RegExp } = {
  official: /https?:\/\/(?!www.instagram\.com|www.youtube\.com)[\w\-\./]+/g,
  instagram: /https?:\/\/(www.instagram\.com)[\w\-\.\/]+/g,
  youtube: /https?:\/\/(www.youtube\.com)[\w\-\.\/]+/g,
};

const DescTab = ({ festival }: DescTabProps) => {
  const { location, overview, tel, title, startDate, endDate } = festival;

  const homepageUrl =
    "https://www.google.com   https://www.instagram.com/sefes   https://www.youtube.com/efse";

  const urlCollection: { [key: string]: string } = {
    official: "",
    instagram: "",
    youtube: "",
  };
  const getMatchedUrl = (homepageUrl: string, regexObj: RegexObj) => {
    for (const url in regexObj) {
      const urlRegex = regexObj[url];
      if (urlRegex.test(homepageUrl)) {
        const matchedUrl = homepageUrl.match(urlRegex) as string[];
        urlCollection[url] = matchedUrl[0];
      }
    }
  };
  const openLink = (url: string): void => {
    window.open(url);
  };
  if (homepageUrl) {
    getMatchedUrl(homepageUrl, regex);
  }

  const {
    official: officialLink,
    instagram: instagramLink,
    youtube: youtubeLink,
  } = urlCollection;

  return (
    <Container data-testid="DescTab">
      <h1>{title}</h1>
      <h2> {location}</h2>
      <h2>
        <span>
          {moment(startDate, "YYYY.MM.DD").format("YYYY년 MM월 DD일")}
        </span>
        <span>~</span>
        <span>{moment(endDate, "YYYY.MM.DD").format("YYYY년 MM월 DD일")}</span>
      </h2>

      <Overview>
        {overview
          .replace(/<(\/br|br)([^>]*)>/gi, "\n")
          .replace(/&lt;/gi, "<")
          .replace(/&gt;/gi, ">")}
      </Overview>

      {/**
       * Link가 url를 상대적인 주소로 인식하기 때문에 https도 빼주어야되고 www.google.com으로만 넣어줘야됨
       */}

      <Contacts>
        <div>
          <a href={`tel:${tel}`}>
            <PhoneIcon />
            {tel}
          </a>
        </div>

        <Links>
          {officialLink && (
            <a href={officialLink} target="_blank" rel="noopener noreferrer">
              <HomepageIcon /> 공식 홈페이지
            </a>
          )}
          {instagramLink && (
            <a href={instagramLink} target="_blank" rel="noopener noreferrer">
              <InstagramIcon /> 인스타그램 계정
            </a>
          )}
          {youtubeLink && (
            <a href={youtubeLink} target="_blank" rel="noopener noreferrer">
              <YoutubeIcon /> 유튜브 채널
            </a>
          )}
        </Links>
      </Contacts>
    </Container>
  );
};

export default DescTab;

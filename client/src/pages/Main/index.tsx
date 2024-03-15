import React, { useRef, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { NoDataIcon } from "assets";
import {
  Container,
  SearchAndTag,
  FestivalList,
  ErrorMsg,
  LoadingWrapper,
} from "./styled";

import Search from "components/Search";
import HashTags from "components/HashTags";
import Festival from "components/Festival";
import Loading from "components/Loading";
import { hashTagData } from "assets/data/hashTags";

type MainProps = {
  filteredData: FestivalItem[];
  offset: React.MutableRefObject<number>;
  setFestivalData: React.Dispatch<React.SetStateAction<FestivalItem[]>>;
  setFilteredData: React.Dispatch<React.SetStateAction<FestivalItem[]>>;
};

const Main = ({
  filteredData,
  offset,
  setFestivalData,
  setFilteredData,
}: MainProps) => {
  console.log("Main render");

  const [searchParams, setSearchParams] = useSearchParams();
  const observerTargetEl = useRef(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState(searchParams.get("query"));
  // const [isTag, setIsTag] = useState(false);
  const navigate = useNavigate();
  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      console.log(process.env);

      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/festivals`,
        { params: { limit: 8, offset: offset.current, query } }
      );

      const festivals = response.data;
      console.log(festivals);

      setFestivalData((prevData) => [...prevData, ...festivals]);
      setFilteredData((prevData) => [...prevData, ...festivals]);
      setHasNextPage(festivals.length === 8);

      if (festivals.length) {
        offset.current += 8;
        sessionStorage.setItem("offset", offset.current.toString());
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setFestivalData([]);
    }
  }, [offset, query]);

  const onSearch: onSearchFunc = (searchText) => {
    console.log("리얼 onSearch", searchText);

    try {
      offset.current = 0;
      setSearchParams({ query: "" });

      navigate(`/search?query=${searchText}`);
      setQuery(searchText);
      setFilteredData([]);
      setHasNextPage(true);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!observerTargetEl.current || !hasNextPage) return;
    const callback: IntersectionObserverCallback = (entries, observer) => {
      if (offset.current === 0) {
        fetchData();
        return;
      }

      if (entries[0].isIntersecting) {
        console.log("isInterSecting!!");

        fetchData();
      }
    };
    const io = new IntersectionObserver(callback);

    io.observe(observerTargetEl.current);

    return () => {
      io.disconnect();
    };
  }, [hasNextPage, fetchData, query]);

  return (
    <Container data-testid="MainPage">
      <SearchAndTag>
        <Search onSearch={onSearch} />
        <HashTags tagData={hashTagData} onSearch={onSearch} />
      </SearchAndTag>
      <FestivalList>
        {filteredData.length > 0 &&
          filteredData.map((festival) => (
            <Festival key={festival.festivalId} festival={festival} />
          ))}
        {isLoading === false && filteredData.length === 0 && (
          <ErrorMsg>
            {/* <NoDataIcon /> */}
            <img src={NoDataIcon} alt="" />
            <div>
              <h1>No Result Found</h1>
              <p>
                <span>'{query}'</span> 에 대한 <br></br> 축제정보가 존재하지
                않습니다
              </p>
            </div>
          </ErrorMsg>
        )}
      </FestivalList>
      {isLoading ? (
        <LoadingWrapper>
          <Loading text="축제들을 불러오고 있습니다." />
        </LoadingWrapper>
      ) : null}
      <div style={{ height: "1rem" }} ref={observerTargetEl}></div>
    </Container>
  );
};

export default React.memo(Main);

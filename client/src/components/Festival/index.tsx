import React, { useContext, useEffect, useState, useCallback } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { LoginModalContext } from "../../contexts/LoginModalContext";
import { UserContext } from "../../contexts/userContext";
import { Container, Status } from "./styled";
import HeartImg from "../../assets/heart.png";
import onErrorImage from "../../assets/noimage.png";
import EmptyHeartImg from "../../assets/empty-heart.png";
import "../../styles/common.scss";
import { PickItemsContext } from "../../contexts/PickItemsContext";

type FestivalProps = {
  festival: FestivalItem;
};

export function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  let month: string | number = today.getMonth() + 1;
  let day: string | number = today.getDate();

  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;

  return Number(`${year}${month}${day}`);
}

const Festival = ({ festival }: FestivalProps) => {
  const {
    authState: { loginStatus },
  } = useContext(UserContext);
  const { setIsLoginModal } = useContext(LoginModalContext);
  const { pickItems, togglePick } = useContext(PickItemsContext);
  const { festivalId, title, imageUrl, startDate, endDate, location } =
    festival;
  const [like, setLike] = useState(false);

  console.log("Festival Render", loginStatus, pickItems);

  let navigate = useNavigate();

  const onErrorImg = (e: React.ChangeEvent<HTMLImageElement>) => {
    e.target.src = onErrorImage;
  };

  const onClickMoveDVP = (festivalId: number) => {
    navigate(`/Detail/${festivalId}`);
  };

  const onClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    console.log("heart clicked!!!!!!!", loginStatus);

    if (loginStatus) {
      togglePick(festival);
      setLike((prevLike) => !prevLike);
    } else {
      setIsLoginModal(true);
    }

    /**
     * 로그인 되어 있으면 찜, 로그인 안되어 있으면 로그인 모달
     */
  };
  const today = getCurrentDate();

  const getStatus = (
    today: number,
    startDate: number,
    endDate: number
  ): [string, string] => {
    const statusMap = {
      scheduled: "예정",
      completed: "종료",
      inProgress: "진행중",
    };

    const entries = Object.entries(statusMap);

    // 순서 중요
    if (startDate > today) {
      // 예정
      return entries[0];
    }
    if (today > endDate) {
      return entries[1];
    }
    return entries[2];
  };

  const [statusKey, statusText] = getStatus(today, startDate, endDate);

  /**
   * TODO : useEffect가 필요한 이유
   *
   * 로그인 안했을 때
   * 각 축제는 하트가 활성화 되지 않음
   *
   * 로그인을 했을 때 각 축제는 해당 축제가 로그인한 유저가 찜을 햇는지 파악해야됨
   *
   *
   * 문제가
   *
   * 메인페이지에서 로그인했을 때 Festival의 useEffect가 작동하지 않는 것 같음
   */

  useEffect(() => {
    /**
     * 초기화시
     * 로그인 안했으니깐 like는 무조건 false
     *
     * 로그인시, 업데이트된 pickItems를 참조하여 like update
     * TODO : 원했던 것은 loginStatus 바뀌면 그때 알아서 업데이트되게 하는건데 로그인 => 축제 리렌더링 => 찜목록 받아오고  => 축제 리렌더링
     *
     *
     *
     * 로그인이 안되어 있다면 그냥 return
     *
     * 로그인이 되어 있다면 참조
     *
     * 로그인 하면 userContext 업데이트 되서 렌더링 된 다음에 찜정보를 업데이트하는데, 로그인이 되면 축제정보 useEffect가 발생되고
     *
     */

    console.log("Festival useEffect", loginStatus, pickItems, festivalId);

    if (loginStatus) {
      const isPicked = pickItems.some((pick) => pick.festivalId === festivalId);
      if (isPicked) {
        setLike(true);
      }
    }
  }, [pickItems]);

  // useEffect(() => {
  //   const isPicked = pickItems.some((ele) => ele.festivalId === festivalId);
  //   setLike(isPicked);
  // }, [pickItems, festivalId]);

  return (
    <Container
      data-testid="Festival"
      key={festivalId}
      onClick={() => onClickMoveDVP(festivalId)}
    >
      <Status status={statusKey}>{statusText}</Status>
      <img
        src={`${imageUrl}?w=400&h=400&fit=crop` || onErrorImage}
        alt={title}
        onError={onErrorImg}
      />
      <section>
        <div>
          <h1>{title}</h1>
          <ul>
            <li>{location}</li>
            <li>
              {moment(startDate, "YYYY.MM.DD").format("YYYY.MM.DD")} ~{" "}
              {moment(endDate, "YYYY.MM.DD").format("YYYY.MM.DD")}
            </li>
          </ul>
        </div>
        <button onClick={onClickHandler}>
          <img alt="heart" src={like ? HeartImg : EmptyHeartImg} />
        </button>
      </section>
    </Container>
  );
};

export default Festival;

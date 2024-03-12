import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from "react";
import axios from "axios";
import { UserContext } from "./userContext";
const PickItemsContext = createContext<PickItemsContext>({
  pickItems: [],
  setPickItems: () => {},
  togglePick: () => {},
  getPickItems: () => {},
});

const getPickItemsFromStorage: () => FestivalItem[] = () => {
  console.log("getPick오니????");

  if (sessionStorage.getItem("picks")) {
    const picks = sessionStorage.getItem("picks");
    if (picks) {
      return JSON.parse(picks);
    }
  } else {
    return [];
  }
};
const getPickItemsFromAPI = async (): Promise<FestivalItem[]> => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}/pick`,
      {
        headers: {
          accesstoken: sessionStorage.getItem("accesstoken") ?? "",
        },
      }
    );
    const result: FestivalItem[] = response.data;

    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
};

type Props = { children: JSX.Element | JSX.Element[] };
const PickItemsContextProvider = ({ children }: Props) => {
  const [pickItems, setPickItems] = useState<FestivalItem[]>([]);
  const {
    authState: { loginStatus },
  } = useContext(UserContext);
  const togglePick: togglePick = useCallback(
    async (newPick: FestivalItem) => {
      //#1. 픽했는지 아닌지 부터 확인
      console.log("togglePick!!");

      const found = pickItems.filter(
        (el) => el.festivalId === newPick.festivalId
      );
      if (found.length !== 0) {
        // 이미 찜목록에 있으면 해제를 시켜줘야됨
        //픽 해제해서 서버에 픽 해제한 정보 보내주기
        try {
          await axios.delete(`${process.env.REACT_APP_SERVER_URL}/pick`, {
            data: { festivalId: newPick.festivalId },
            headers: {
              accesstoken: sessionStorage.getItem("accesstoken") ?? "",
            },
          });
          const nextPicks = pickItems.filter(
            (item) => item.festivalId !== newPick.festivalId
          );
          console.log("여기까지옴??????");

          setPickItems(nextPicks);
          sessionStorage.setItem("picks", JSON.stringify(nextPicks));
        } catch (error) {
          console.log(error);
        }
      } else {
        //픽해서 서버에 픽한 정보 보내주기
        try {
          await axios.post(
            `${process.env.REACT_APP_SERVER_URL}/pick`,
            {
              festivalId: newPick.festivalId,
            },
            {
              headers: {
                accesstoken: sessionStorage.getItem("accesstoken") ?? "",
              },
            }
          );

          const nextPicks = [newPick, ...pickItems];

          setPickItems(nextPicks);
          sessionStorage.setItem("picks", JSON.stringify(nextPicks));
        } catch (error) {
          console.log(error);
        }
      }
    },
    [pickItems]
  );

  const getPickItems = async () => {
    console.log("getPickItems!!");

    if (loginStatus) {
      let nextPickItems;
      if (window.sessionStorage.getItem("picks")) {
        nextPickItems = getPickItemsFromStorage();
      } else {
        nextPickItems = await getPickItemsFromAPI();
        sessionStorage.setItem("picks", JSON.stringify(nextPickItems));
      }

      setPickItems(nextPickItems);
    }
  };
  useEffect(() => {
    console.log("useEffect!!! 픽아이템 컨텍스트", loginStatus);

    if (loginStatus) {
      getPickItems();
    }
  }, [loginStatus]);

  return (
    <PickItemsContext.Provider
      value={{ pickItems, setPickItems, togglePick, getPickItems }}
    >
      {children}
    </PickItemsContext.Provider>
  );
};

/**
 * pickItems를 굳이 상태로 두어야 하나??
 *
 * sessionStorage에서 아이디만 저장해서 아이디만 조회하면 되지 않나??
 *
 * 상태로 두어야 하는 이유 찾아보기
 *
 *  세션스토리지 작동 안할까봐 ??
 *
 *  로그인 성공시
 *   1. 토큰으로 pickItems가져온다
 *   2. 가져온 아이템으로 pickItems의 상태를 업데이트 한다
 *   3. 토큰으로 굳이 가져와야 하나>>
 *   4. Festival에서는 아이디로만 찜여부 확인하면 되지만,
 *      WishList페이지에서 축제를 렌더링해줘야 되기 때문에 전체 데이터가 필요함
 *   5. MAIN-Festival에서는 id로만 렌더링, WishList에서는 전체 렌더링
 *   6. 토글 픽으로 찜해주고 서버에 보내줘야됨
 *
 *  설계
 *  찜목록 컨텍스트 만든 다음 메인, 위시리스트, 상세페이지만 프로바이더로 감싼다
 *  각 아이템들 사용하기
 *
 */
export { PickItemsContext, PickItemsContextProvider };

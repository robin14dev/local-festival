상세페이지 들어가는거 테스트

모킹은 festivalId를 1로 해서 리뷰들을 가져오는걸로 설정했는데

dvp 작동방식은 festivalId가 처음엔 0으로 초기화 되었다가
useEffect로 바뀌는 방식 이거 생각해봐야겠네

Form
상태

userInfo
account : {value, isValid, isUnique}
nickname : {value, isValid, isUnique}
password : {value, isValid}
passwordCheck: {value, isValid}
messages
account
nickname
password
passwordCheck

-   validate = () => {}
-   onChangeHandler = (inputVal) => {

    1. 각 타입에 맞는 value 업데이트
    2. 유효한지 validate 함수 호출 - 유효 결과에 따라서 setState(isValid) - 유효 메시지 보여줘야됨 (메시지랑 필드 분리하는게 낫겠는데??) - 유효 메시지 setMessage()
       }

-   최적화
    -   문제
        1. 특정 input value 변경시, 다른 필드 컴포넌트도 리렌더링
            - memo 받을 때 userInfo.account.value || message.account가 변경될때만 리렌더링 하도록 !

---

Field에서 필요한 것

props - onChangeHandler - message(type, value?)

에러가 닜는지 안났는지 => 에러 메시지

요소
-label
-message -중복확인버튼? - <input onChange={핸들러}/>

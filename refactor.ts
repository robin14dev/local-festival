// //# 입력하면서 유효성 검사
// function validate(type: string) { // 리턴할 것 : 유효성 통과 여부, 메시지?
// //@ 준비물 1. 검사할 유형
//   const validType = type as
//     | 'account'
//     | 'nickname'
//     | 'password'
//     | 'passwordCheck';

// //@ 준비물 2. 유효성 결과 보여줄 메시지 (이건 여기 있을 필요 없음) => 빼내기
//   // const errMsgDom: HTMLElement | null = document.body.querySelector(
//   //   `.${e.target.name}`
//   // );
//   // //#1 빈값일때는 메시지 안보이게하고 return false
//   // if (e.target.value === '') {
//   //   setValidMsg((prevMsg) => ({
//   //     ...prevMsg,
//   //     [e.target.name]: '',
//   //   }));
//     //? (얘 왜해주는거??) => 밖에서 이미 해주니깐 필요 없음
//     // setUserInfo((prevInfo) => ({
//     //   ...prevInfo,
//     //   [e.target.name]: {
//     //     ...prevInfo[e.target.name],
//     //     isValid: false,
//     //   },
//     // }));
//     //return false;
//   //}

//   //#2 빈값이 아닐때 정규식 체크
//   if (rgx[validType]) {
//     //#2-1 정규식이 있는 account, nickname의 중복확인여부 isUnique를 계속 false
//     if (e.target.name === 'account' || e.target.name === 'nickname') {
//       // 계정과 닉네임은 다시 작성시 중복확인을 또 해줘야하므로 작성중에는 isUnique계속 false
//       // 입력할 때마다 계속 눌러지니깐
//       //* 밖으로 꺼내기
//       //유저정보 isUnique : false
//       //* 밖으로 꺼내기
//       //중복확인 버튼 비활성화 되있다면 활성화 해주기

//     }
//     //#2-2 정규식이 있는 account, nickname, password가 통과 못했을 때
//     if (rgx[validType].test(e.target.value) === false) {
//       //* 밖으로 빼내기 리턴 false로만
//         //  - 유저정보 변경 (isValid : true)
//         // - 메시지 변경 (유효성 통과)

//       return false;
//     } else {
//       //* 밖으로 빼내기
//        //  - 유저정보 변경 (isValid : false)
//        // - 메시지 변경 (유효성 실패)
//        // DOM 색깔 변경 (account, nickname 오렌지, 비밀번호는 초록 )
//         return true;
//     }
//   } else {
//     // 정규식이 없으면 없는대로 체크
//     if (password.text !== e.target.value) {
//       //* 밖으로 빼내기
//        //  - 유저정보 변경 (isValid : false)
//        // - 메시지 변경 (유효성 실패)
//       return false;
//     } else {
//     //* 밖으로 빼내기
//     //  - 유저정보 변경 (isValid : true)
//     // - 메시지 변경 (유효성 통과)
//     return true;
//   }
// }
// const handleUserInfo = useCallback(
//   (e: React.ChangeEvent<HTMLInputElement>) => {

//     // 인풋에다 입력하는 동안 validate가 계속 호출
//     //# 유효성 검사 실패시 isValid: false로 바꾸고 리턴
//     //! validate함수 빼내기 <- changeEvent에 너무 몰빵되어잇음
//     if (validate(e.target.name) === false) {
//       return setUserInfo((prevInfo) => ({
//         ...prevInfo,
//         [e.target.name]: {
//           ...prevInfo[e.target.name],
//           text: e.target.value,
//           isValid: false,
//         },
//       }));
//     }

//     console.log('설마 여기?');

//     //# 유효성 검사 통과시 isValid: true 바꾸고 리턴
//     return setUserInfo((prevInfo) => ({
//       ...prevInfo,
//       [e.target.name]: {
//         ...prevInfo[e.target.name],
//         text: e.target.value,
//         isValid: true,
//       },
//     }));
//   },
//   [userInfo]
// );

// //# 중복검사
// const duplicateCheck = async (e: React.MouseEvent<HTMLButtonElement>) => {
//   e.preventDefault();
//   const target = e.target as HTMLButtonElement;
//   const errMsgDom: HTMLInputElement | null = document.body.querySelector(
//     `.${target.name}`
//   );
//   if (userInfo[target.name].isValid === false) {
//     console.log('중복확인 누를 때 유효성 검사가 통과되지 않은경우');
//     return;
//   }
//   console.log('중복확인 누를 때 유효성 검사가 통과된경우');

//   try {
//     const response = await axios.get(
//       `${process.env.REACT_APP_SERVER_URL}/users/signup`,
//       {
//         params: { [target.name]: userInfo[target.name].text },
//       }
//     );
//     //# 중복확인 통과 됐을 때 --- 1.버튼 비활성화
//     if (target.name === 'account' && dupliCheckBtnAccount.current) {
//       dupliCheckBtnAccount.current.disabled = true;
//     }
//     if (target.name === 'nickname' && dupliCheckBtnNickname.current) {
//       dupliCheckBtnNickname.current.disabled = true;
//     }
//    //# 중복확인 통과 됐얼 때 --- 2. 메시지 보여주기
//     setValidMsg((prevMsg) => ({
//       ...prevMsg,
//       [target.name]: message[target.name].unique,
//     }));
//   //# 중복확인 통과 됐얼 때 --- 3. 유저정보에 unique 표시
//     setUserInfo((prevInfo) => ({
//       ...prevInfo,
//       [target.name]: {
//         ...prevInfo[target.name],
//         isUnique: true,
//       },
//     }));
//     if (errMsgDom) {
//       errMsgDom.style.color = 'green';
//     }

//     // console.log(response);
//   } catch (err: unknown) {
//     if (err instanceof AxiosError) {
//       //# 중복확인 실패 했을 때 --- 1. 유저정보 unique false로

//       console.log(err.response);
//       if (err.response?.data === `Already ${target.name}`) {
//         console.log('here!!');

//         setUserInfo((prevInfo) => ({
//           ...prevInfo,
//           [target.name]: {
//             ...prevInfo[target.name],
//             isUnique: false,
//           },
//         }));
//         //# 중복확인 실패 했을 때 --- 2. 실패 메시지

//         setValidMsg((prevMsg) => ({
//           ...prevMsg,
//           [target.name]: message[target.name].already,
//         }));
//         if (errMsgDom) {
//           errMsgDom.style.color = 'red';
//         }
//       }
//     }
//   }
// };

// //# 전송하기
// const handleSubmit = useCallback(
//   async (e: React.FormEvent<HTMLButtonElement>) => {
//     e.preventDefault();

//     const validUserInfo = (): boolean => {
//       for (const info in userInfo) {
//         if (userInfo[info].isValid === false) return false;
//         /* //!isUnique 있으면 true인지도 확인 false면 바로 false */
//         if (
//           userInfo[info].hasOwnProperty('isUnique') &&
//           userInfo[info]['isUnique'] === false
//         )
//           return false;
//       }
//       return true;
//     };

//     //# 유효성 검사와 중복 체크가 하나라도 false면 return
//     if (validUserInfo() === false) return;

//     //# 유효성 검증 & 중복체크 통과시, 서버에 회원가입 정보 전송

//     try {
//       setLoading(true);
//       const response = await axios.post(
//         `${process.env.REACT_APP_SERVER_URL}/users/signup`,
//         {
//           account: account.text,
//           password: password.text,
//           nickname: nickname.text,
//         }
//       );
//       console.log('success!!');

//       //# 회원가입 성공시, 성공메시지와 함께 3초 뒤 로그인 모달로 이동

//       setProgress('success');
//       setLoading(false);
//     } catch (error) {
//       console.log('fail!!');
//       console.log(error);
//       setProgress('failed');
//       setLoading(false);
//     }
//   },
//   [userInfo]
// );

// //# 작성 중일 때
//   /*
//     정규식을 통과했을 때
//         - 중복확인 버튼 활성화
//         - 유저정보 변경 (isValid : true)
//         - 메시지 변경 (유효성 통과)

//     정규식을 통과하지 못했을 때
//         - 중복확인 버튼 비활성화
//         - 유저정보 변경 (isValid : false)
//         - 메시지 변경 (유효성 실패)

//         내용을 썼다가 빈값인 경우

//   # 중복확인 버튼 눌렀을 때
//     - 유효성을 아직 통과하지 않았을 때
//       - 어차피 비활성화 자나? => 없애기, 혹시 모르니깐?
//     - 유효성을 통과 했을 때

//       - 중복확인 성공시
//           - 유저정보 변경 (isUnique : true)
//           - 메시지 변경 (중복 성공)
//           - 중복확인 버튼 비활성화
//       - 중복확인 실패시
//           - 유저정보 변경 (isUnique : false)
//           - 메시지 변경 (중복 실패)
//           - 중복확인 버튼 활성화

//   # 전송하기 버튼 눌렀을 때
//     - 유효성, 중복검사 다 했는지 점검

//   */

//   //# 원본
//   const handleUserInfo = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       function validate(type: string) {
//         const validType = type as
//           | 'account'
//           | 'nickname'
//           | 'password'
//           | 'passwordCheck';

//         // type Rgx = {
//         //   [index: string]: RegExp;
//         //   account: RegExp;
//         //   nickname: RegExp;
//         //   password: RegExp;
//         // };

//         // const rgx: Rgx = {
//         //   account: /[a-z0-9_!#$%^&*()-]+\@+[a-z0-9]+\.[a-z]+/,
//         //   nickname: /^[가-힣|a-z|A-Z|0-9|]{4,8}$/,
//         //   password: /^.*(?=^.{8,}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!~@#$%^&+=]).*$/,
//         // };

//         const errMsgDom: HTMLElement | null = document.body.querySelector(
//           `.${e.target.name}`
//         );
//         //#1 빈값일때는 메시지 안보이게하고 return false
//         if (e.target.value === '') {
//           setValidMsg((prevMsg) => ({
//             ...prevMsg,
//             [e.target.name]: '',
//           }));
//           //? (얘 왜해주는거??) => 밖에서 이미 해주니깐 필요 없음
//           // setUserInfo((prevInfo) => ({
//           //   ...prevInfo,
//           //   [e.target.name]: {
//           //     ...prevInfo[e.target.name],
//           //     isValid: false,
//           //   },
//           // }));
//           return false;
//         }

//         //#2 빈값이 아닐때 정규식 체크
//         if (rgx[validType]) {
//           //#2-1 정규식이 있는 account, nickname의 중복확인여부 isUnique를 계속 false
//           if (e.target.name === 'account' || e.target.name === 'nickname') {
//             console.log(e.target.value);

//             // 계정과 닉네임은 다시 작성시 중복확인을 또 해줘야하므로 작성중에는 isUnique계속 false
//             // 입력할 때마다 계속 눌러지니깐
//             if (userInfo[e.target.name].isUnique) {
//               setUserInfo((prevInfo) => ({
//                 ...prevInfo,
//                 [e.target.name]: {
//                   ...prevInfo[e.target.name],
//                   isUnique: false,
//                 },
//               }));

//               // 유효성을 통과 못하면 중복확인 불들어오지 못하게 해야됨
//               if (
//                 // 중복확인 해제 css처리

//                 e.target.name === 'account' &&
//                 dupliCheckBtnAccount.current?.disabled === true
//               ) {
//                 dupliCheckBtnAccount.current.disabled = false;
//               }
//               if (
//                 e.target.name === 'nickname' &&
//                 dupliCheckBtnNickname.current?.disabled === true
//               ) {
//                 dupliCheckBtnNickname.current.disabled = false;
//               }
//             }
//           }
//           //#2-2 정규식이 있는 account, nickname, password가 통과 못했을 때
//           if (rgx[validType].test(e.target.value) === false) {
//             setValidMsg((prevMsg) => ({
//               ...prevMsg,
//               [e.target.name]: message[validType].fail,
//             }));
//             setUserInfo((prevInfo) => ({
//               ...prevInfo,
//               [e.target.name]: {
//                 ...prevInfo[e.target.name],
//                 text: e.target.value,
//                 isValid: false,
//               },
//             }));

//             if (errMsgDom) {
//               errMsgDom.style.color = 'red';
//             }
//             return false;
//           } else {
//             setValidMsg((prevMsg) => ({
//               ...prevMsg,
//               [e.target.name]: message[validType].success,
//             }));
//             setUserInfo((prevInfo) => ({
//               ...prevInfo,
//               [e.target.name]: {
//                 ...prevInfo[e.target.name],
//                 text: e.target.value,
//                 isValid: true,
//               },
//             }));

//             if (errMsgDom) {
//               if (e.target.name === 'account' || e.target.name === 'nickname') {
//                 errMsgDom.style.color = 'var(--primaryOrange)';
//                 return true;
//               }
//               errMsgDom.style.color = 'green';
//             }
//             return true;
//           }
//         } else {
//           // 정규식이 없으면 없는대로 체크
//           if (password.text !== e.target.value) {
//             setValidMsg((prevMsg) => ({
//               ...prevMsg,
//               [e.target.name]: message.passwordCheck.fail,
//             }));
//             setUserInfo((prevInfo) => ({
//               ...prevInfo,
//               [e.target.name]: {
//                 ...prevInfo[e.target.name],
//                 text: e.target.value,
//                 isValid: false,
//               },
//             }));
//             if (errMsgDom) {
//               errMsgDom.style.color = 'red';
//             }
//             return false;
//           } else {
//             setValidMsg((prevMsg) => ({
//               ...prevMsg,
//               [e.target.name]: message.passwordCheck.success,
//             }));
//             setUserInfo((prevInfo) => ({
//               ...prevInfo,
//               [e.target.name]: {
//                 ...prevInfo[e.target.name],
//                 text: e.target.value,
//                 isValid: true,
//               },
//             }));
//             if (errMsgDom) {
//               errMsgDom.style.color = 'green';
//             }
//           }
//           return true;
//         }
//       }

//       //# 유효성 검사 실패시 isValid: false로 바꾸고 리턴

//       if (validate(e.target.name) === false) {
//         return setUserInfo((prevInfo) => ({
//           ...prevInfo,
//           [e.target.name]: {
//             ...prevInfo[e.target.name],
//             text: e.target.value,
//             isValid: false,
//           },
//         }));
//       }

//       console.log('설마 여기?');

//       //# 유효성 검사 통과시 isValid: true 바꾸고 리턴
//       return setUserInfo((prevInfo) => ({
//         ...prevInfo,
//         [e.target.name]: {
//           ...prevInfo[e.target.name],
//           text: e.target.value,
//           isValid: true,
//         },
//       }));
//     },
//     [userInfo]
//   );

//   const handleSubmit = useCallback(
//     async (e: React.FormEvent<HTMLButtonElement>) => {
//       e.preventDefault();

//       const validUserInfo = (): boolean => {
//         for (const info in userInfo) {
//           if (userInfo[info].isValid === false) return false;
//           /* //!isUnique 있으면 true인지도 확인 false면 바로 false */
//           if (
//             userInfo[info].hasOwnProperty('isUnique') &&
//             userInfo[info]['isUnique'] === false
//           )
//             return false;
//         }
//         return true;
//       };

//       //# 유효성 검사와 중복 체크가 하나라도 false면 return
//       if (validUserInfo() === false) return;

//       //# 유효성 검증 & 중복체크 통과시, 서버에 회원가입 정보 전송

//       try {
//         setLoading(true);
//         const response = await axios.post(
//           `${process.env.REACT_APP_SERVER_URL}/users/signup`,
//           {
//             account: account.text,
//             password: password.text,
//             nickname: nickname.text,
//           }
//         );
//         console.log('success!!');

//         //# 회원가입 성공시, 성공메시지와 함께 3초 뒤 로그인 모달로 이동

//         setProgress('success');
//         setLoading(false);
//       } catch (error) {
//         console.log('fail!!');
//         console.log(error);
//         setProgress('failed');
//         setLoading(false);
//       }
//     },
//     [userInfo]
//   );

//   const duplicateCheck = async (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault();
//     const target = e.target as HTMLButtonElement;
//     const errMsgDom: HTMLInputElement | null = document.body.querySelector(
//       `.${target.name}`
//     );
//     if (userInfo[target.name].isValid === false) {
//       console.log('중복확인 누를 때 유효성 검사가 통과되지 않은경우');
//       return;
//     }
//     console.log('중복확인 누를 때 유효성 검사가 통과된경우');

//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_SERVER_URL}/users/signup`,
//         {
//           params: { [target.name]: userInfo[target.name].text },
//         }
//       );
//       if (target.name === 'account' && dupliCheckBtnAccount.current) {
//         dupliCheckBtnAccount.current.disabled = true;
//       }
//       if (target.name === 'nickname' && dupliCheckBtnNickname.current) {
//         dupliCheckBtnNickname.current.disabled = true;
//       }

//       setValidMsg((prevMsg) => ({
//         ...prevMsg,
//         [target.name]: message[target.name].unique,
//       }));
//       setUserInfo((prevInfo) => ({
//         ...prevInfo,
//         [target.name]: {
//           ...prevInfo[target.name],
//           isUnique: true,
//         },
//       }));
//       if (errMsgDom) {
//         errMsgDom.style.color = 'green';
//       }

//       // console.log(response);
//     } catch (err: unknown) {
//       if (err instanceof AxiosError) {
//         console.log(err.response);
//         if (err.response?.data === `Already ${target.name}`) {
//           console.log('here!!');

//           setUserInfo((prevInfo) => ({
//             ...prevInfo,
//             [target.name]: {
//               ...prevInfo[target.name],
//               isUnique: false,
//             },
//           }));
//           setValidMsg((prevMsg) => ({
//             ...prevMsg,
//             [target.name]: message[target.name].already,
//           }));
//           if (errMsgDom) {
//             errMsgDom.style.color = 'red';
//           }
//         }
//       }
//     }
//   };

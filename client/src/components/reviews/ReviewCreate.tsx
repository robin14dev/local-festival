import axios from 'axios';
import React, { useState } from 'react';
// import styled, { css } from 'styled-components';

import ReviewWrite from './ReviewWrite';
// const Wrapper = styled.div<{ isEdit?: boolean }>`
//   width: 100%;
//   height: auto;
//   border: 1px solid #d9d9d9;
//   border-radius: 8px;
//   position: relative;
//   .notifications {
//     position: absolute;
//     top: -3rem;
//     right: 0rem;
//   }
//   ${(props) =>
//     props.isEdit &&
//     css`
//       border: none;
//     `}

//   @media screen and (max-width: 1076px) {
//     width: 95%;
//   }

//   @media (max-width: 485px) {
//     margin: 0 1rem;

//     ${(props) =>
//       props.isEdit &&
//       css`
//         margin: 0;
//         width: 100%;
//         border: 1px solid #d9d9d9;
//         width: 100%;
//       `}
//   }

//   @media (max-width: 375px) {
//     ${(props) =>
//       props.isEdit &&
//       css`
//         border: 1px solid #d9d9d9;
//       `}
//   }
// `;

// const Textarea = styled.textarea<{ length: number }>`
//   width: 100%;
//   height: 7rem;
//   border: none;
//   resize: none;
//   border-radius: 8px 8px 0 0;
//   padding: 1rem;
//   transition: all 1s;

//   & + section {
//     margin-bottom: 0.5rem;
//     margin-left: 0.5rem;
//   }

//   @media screen and (max-width: 730px) {
//     height: ${(props) => props.length >= 150 && '9rem'};
//   }
//   @media screen and (max-width: 540px) {
//     height: ${(props) => props.length >= 150 && '12rem'};
//   }
//   @media screen and (max-width: 420px) {
//     height: ${(props) => props.length >= 150 && '13rem'};
//   }
// `;
// const Controllers = styled.div`
//   height: 3.5rem;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: 0 1rem;
//   border-top: 1px solid #d9d9d9;
//   border-radius: 0px 0px 0.5rem 0.5rem;

//   & > div {
//     display: flex;
//   }

//   @media (max-width: 540px) {
//   }
//   @media (max-width: 485px) {
//     padding: 0 0.5rem;
//   }
//   @media (max-width: 375px) {
//     padding-left: 0;
//   }
// `;

// const Button = styled.button<{ photo?: boolean; back?: boolean }>`
//   background-color: ${(props) =>
//     props.photo ? 'white' : `var(--primaryPurple)`};
//   border: ${(props) => (props.photo ? '1px solid #D9D9D9' : 'none')};
//   border-radius: 4px;
//   color: white;
//   width: 4rem;
//   height: 33px;

//   font-weight: bold;
//   font-size: 1rem;

//   ${(props) =>
//     props.back &&
//     css`
//       position: absolute;
//       top: 0.5rem;
//       right: 0.5rem;
//       background-color: white;
//       border: 1.5px solid #b7b9f8;
//       border-radius: 4px;
//       color: var(--primaryPurple);
//       width: 3rem;
//     `}

//   img {
//     height: 24px;
//     margin-top: 4px;
//   }

//   cursor: pointer;
//   outline: inherit;
//   transition: transform 0.2s ease-out;
//   &:hover {
//     transition: transform 0.2s ease-out;
//     transform: translateY(-5%);
//   }

//   & + & {
//     margin-left: 1rem;
//   }

//   @media (max-width: 485px) {
//     width: 4rem;
//     /* font-size: 0.8rem; */
//   }
//   @media (max-width: 375px) {
//     width: 3rem;
//     font-size: 0.8rem;
//     ${(props) =>
//       props.back &&
//       css`
//         font-size: 0.8rem;
//       `};
//   }
// `;

// const style = {
//   Wrapper: `width : 90%;`,
//   CountText: `position : absolute`,
// };

type ReviewCreateProps = {
  updateReviewList: (newReview: TReviewItem) => void;
  festivalId: number;
  authState: AuthState;
  // editItem?: EditItem;
  // setEditItem?: React.Dispatch<React.SetStateAction<EditItem>>;
  // updateReview?: (updatedItem: TReviewItem) => void;
};
const ReviewCreate = ({
  updateReviewList,
  festivalId,
  authState,
}: // setEditItem,
// editItem,
// updateReview,
ReviewCreateProps) => {
  // const [content, setContent] = useState(editItem?.info.content || '');
  // const [rating, setRating] = useState<number | null>(
  //   editItem?.info.rating || null
  // );
  const [isLoading, setIsLoading] = useState(false);
  // const [messages, setMessages] = useState<Message[]>([]);

  // const handleContent = (value: string) => {
  //   // setContent(value);
  //   // if (value.length >= maxContentLength.current) {
  //   //   createNotification(
  //   //     `${maxContentLength.current - 1}자 까지 입력할 수 있습니다.`
  //   //   );
  //   //   setContent(value.slice(0, -1));
  //   //   return;
  //   // }
  // };

  // const handleRating = (rating: number) => {
  //   setRating(rating);
  // };

  // const createNotification = (text: string): void => {
  //   const newMessage: Message = {
  //     text,
  //     dismissTime: 2000,
  //     uuid: Math.random(),
  //   };
  //   /*
  //   두번클릭해서 똑같은 알람 뜨지 않게
  //   */
  //   if (messages[messages.length - 1]?.text === newMessage.text) return;

  //   setMessages((prevMessage) => [...prevMessage, newMessage]);
  //   setTimeout(() => {
  //     setMessages((prevMessages) => prevMessages.slice(1));
  //   }, 2000);
  // };

  const submitContent = async (text: string, rateToSubmit: number) => {
    try {
      setIsLoading(true);
      const createdRes = await axios({
        method: 'post',
        url: `${process.env.REACT_APP_SERVER_URL}/review`,
        data: {
          content: text,
          rating: Number(rateToSubmit),
          festivalId: festivalId,
        },
        headers: {
          accesstoken: sessionStorage.getItem('accesstoken') ?? '',
        },
      });

      const { content, createdAt, id, rating, updatedAt, userId } =
        createdRes.data;

      const newReview = {
        userId,
        content,
        rating,
        createdAt,
        updatedAt,
        festivalId,
        id,
        User: {
          nickname: authState.nickname,
          defaultPic: authState.defaultPic,
        },
        like_num: 0,
      };
      updateReviewList(newReview);
      return 'success';
    } catch (error) {
      console.log(error);
      return 'failure';
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // <Wrapper isEdit={editItem?.isEdit}>
    //   <div className="notifications">
    //     {messages.map((message) => (
    //       <Toast key={message.uuid} message={message} />
    //     ))}
    //   </div>
    //   <Textarea
    //     length={content.length}
    //     spellCheck="false"
    //     maxLength={maxContentLength.current}
    //     value={content}
    //     onChange={handleContent}
    //     placeholder="후기를 남겨주세요."
    //   />

    //   <CountText content={content} maxContentLength={300} />
    //   <Controllers>
    //     <Rating initialRating={rating} handleRating={handleRating} />
    //     <div>
    //       <Button photo>
    //         <img src={cameraImg} alt="사진올리기"></img>
    //       </Button>
    //       {authState.loginStatus ? (
    //         editItem ? (
    //           <>
    //             <Button
    //               back={true}
    //               onClick={() => {
    //                 if (setEditItem) {
    //                   setEditItem((prev) => ({ ...prev, isEdit: false }));
    //                 }
    //               }}
    //             >
    //               취소
    //             </Button>
    //             <Button onClick={handleSubmit}>수정하기</Button>
    //           </>
    //         ) : (
    //           <Button onClick={handleSubmit}>올리기</Button>
    //         )
    //       ) : (
    //         <Button
    //           onClick={() => {
    //             if (modalContext) {
    //               modalContext.setLoginModal(true);
    //             }
    //           }}
    //         >
    //           로그인
    //         </Button>
    //       )}
    //     </div>
    //   </Controllers>
    // </Wrapper>
    // <WriteCopy
    //   style={style}
    //   submitContent={submitContent}
    //   onChangeContent={handleContent}
    // ></WriteCopy>
    <ReviewWrite
      // messages={messages}
      submitContent={submitContent}
      // onChangeContent={handleContent}
      isLoading={isLoading}
    ></ReviewWrite>
  );
};

export default ReviewCreate;

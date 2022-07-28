import React, {useState, useEffect} from "react";
import styled from "styled-components";
import ReviewList from "./ReviewList";
import ReviewWrite from "./ReviewWrite";
import axios from "axios";
const Wrapper = styled.div`
  width: 100%;
  /* height: 100%; */
  /* background-color: #d8e4f0c8; */
  overflow: hidden; // 안해주면 줄어들음
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  
`;

const ReviewTab = ({festivalInfo, authState}) => {
const {festivalId} = festivalInfo


const [listOfReviews, setListOfReviews] = useState([])

//* listOfReviews
// {content: "'소록소록 로운 비나리 소록소록 다솜.',", createdAt: "20…}
// id :1
// festivalId : 3
// userId : "bbb1234"
// nickname :"유동혁"
// content : "'소록소록 로운 비나리 소록소록 다솜.',"
// rating:4
// createdAt: "2022-06-14T01:44:00.000Z"
// updatedAt: "2022-06-14T01:44:00.000Z"



  useEffect(()=>{
    //# 특정 축제에 대한 리뷰글들을 불러온다. 
    //* api 수정 특정 글의 리뷰로 전달
    console.log('review tab here------------');
    axios.get(`${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/review/${festivalId}`,
    {headers: {
      accesstoken: sessionStorage.getItem("accesstoken"),
    }})
    .then(response => {
      console.log(response.data);
      setListOfReviews(response.data)
      //console.log('reviewtab 클릭시 서버에서 리뷰리스트를 받아옵니다.');
    })
    .catch(err => {
      console.log(err);
     // console.log('받아오는게 없어서 dummydata로 대체합니다.');
     
    })
  },[])

const updateReviewList = (newReview)=>{
  console.log( "상끌 성공!!!!");

  const nextReviewLists = [...listOfReviews, newReview]

  setListOfReviews(nextReviewLists)
}

const deleteReview = (reviewId,festivalId)=>{
 
  axios
  .delete(`${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/review/${festivalId}/${reviewId}`, {
    headers: {
      accesstoken: sessionStorage.getItem("accesstoken")
    }
  })
  .then((response) => {
    console.log(response.data.message);
    if(response.data.message === "ok") {
      console.log('before', listOfReviews);
      const nextReviewLists = listOfReviews.filter(review => Number(review.id) !== Number(reviewId))
      console.log('after', nextReviewLists);
      setListOfReviews(nextReviewLists)
    } else {

    }
    

  })
  .catch(err => {
    console.log(err);
  });
}





  return (
    <Wrapper>
      <ReviewWrite authState={authState}
        festivalId={festivalId}
       updateReviewList={updateReviewList}
       
         />
      <ReviewList authState={authState} 
      listOfReviews={listOfReviews} 
      festivalId={festivalId}
      deleteReview={deleteReview} />
    </Wrapper>
  );
};

export default ReviewTab;

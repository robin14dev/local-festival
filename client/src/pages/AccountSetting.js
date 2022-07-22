import React , {useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import axios from 'axios'
import moment from "moment";

const Wrapper = styled.div`
margin: 5rem;
height : 55vh;
`

const List = styled.div`
margin-left: 0.5rem;
`

const Info = styled.div`
display: flex;
flex-direction: column;
justify-content: flex-start;
width: 50%;
border-bottom: 1px solid lightgray;
padding-bottom: 2rem;
/* pointer-events:none; */
`
const Heading = styled.div`
display: flex;
justify-content: space-between;
& > div {
  line-height: 1.5rem;
}

padding-top: 0.8rem;
/* border: 1px solid black; */
/* height: 5rem; */
`
const Button = styled.div`
& > button {
  text-decoration: underline;
}
`
const Modal = styled.div`
//display: none;
line-height: 1.5rem;

& > button {
  background-color: #1564a9;
  color: white;
  height: 1.5rem;
 border-radius: 0.2rem;
  padding :0 1rem;
 
}

& > input {
  height: 1.5rem;
}
`

export default function AccountSetting({authState, handleAuthState}) {
  const [isOpen, setIsOpen] = useState(false)
  const [nickname, setNickname] = useState(authState.nickname)
  const [pwdForm, setPwdForm] = useState({
    currentPassword : '',
    newPassword : '',
    passwordCheck : '',
  })
  const [updatedAt, setUpdatedAt] = useState('')

  const {newPassword, passwordCheck} = pwdForm
  
  const inputhere = useRef()
  const list = useRef()
  const errMessagePwd = useRef()

  useEffect(()=>{
    axios.get(`${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/users/edit`,  {headers: { accesstoken: sessionStorage.getItem("accesstoken")}})
    .then(response => {
      console.log(response);
      setUpdatedAt(response.data.updatedAt)
    })
  }, [])
 
  const nicknameHandler = (e) => {
    setNickname(e.target.value)
   }

   const profileHandler = () => {

    if(inputhere.current.value === "") {
      document.querySelector('.errorMessage').textContent = "최소 한 글자 이상의 단어를 적어주세요"
     
    }  else {
        axios.put(`${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/users/nickname`, {nickname},  {headers: { accesstoken: sessionStorage.getItem("accesstoken")}})
        .then(response => {
    
          const nextNickname = response.data.nickname
      
          handleAuthState(nextNickname)
          window.location.replace("/AccountSetting")
        })
        .catch(err => {
          console.log(err);
        })
    }
       
      
      }

  const onClickHandler = (e) => {
   
      console.log(list.current);
    if(e.target.name === 'nickname' && !isOpen) {
      setIsOpen(e.target.name)
        e.target.textContent = '취소'
       

    } else if(e.target.name === 'password' && !isOpen) {
       setIsOpen(e.target.name)
      e.target.textContent = '취소'
    } else{
      setIsOpen(false)
      e.target.textContent = '수정'
    }

  }

  const onChangeHandler = (e) => {
    const nextForm = {
      ...pwdForm, 
      [e.target.id] : e.target.value
    }
    setPwdForm(nextForm)
    console.log(pwdForm);
  }
 const onClickPwd = () => {
  if(newPassword !== passwordCheck) {
    errMessagePwd.current.textContent = '새로 입력한 비밀번호가 서로 일치하지 않습니다.'
  } else {
    axios.put(`${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/users/password`, pwdForm,  {headers: { accesstoken: sessionStorage.getItem("accesstoken")}})
    .then(response => {
      console.log(response);
      const {message, updatedAt} = response.data;
      if(message === 'password successfully changed') {
        errMessagePwd.current.textContent = '비밀번호가 변경되었습니다.'
        setUpdatedAt(updatedAt)
      }
    })
    .catch(err => {
      console.log('errrrr',err.response.data.message);

      if(err.response.data.message === 'Wrong Password') {
        errMessagePwd.current.textContent = '기존 비밀번호가 일치하지 않습니다.'
      } else {
        console.log(err);
      }
    })


    //기존 비밀번호가 일치하지 않을 때
  }
 }
  return (
 <Wrapper>
    <h1>계정</h1>
   
      <List ref={list}>
        <Info>
          <Heading>
            <div>닉네임</div>
            <Button><button name='nickname' onClick={onClickHandler}>수정</button></Button>
          </Heading>
         
          {isOpen === 'nickname' ?  <Modal>
          <div>변경할 닉네임을 입력해 주세요</div>
          <div className="errorMessage" style={{ color: "Red" }}></div>
          <input ref={inputhere} onChange={nicknameHandler} placeholder={authState.nickname}></input>
          <button onClick={profileHandler} >수정하기</button>
          </Modal> :  <div style={{color:'gray'}}>{authState.nickname}</div>}
         
        </Info>
        
        <Info>
          <Heading>
            <div>비밀번호</div>
            <Button><button name='password' onClick={onClickHandler} >수정</button></Button>
          </Heading>
          
          {isOpen === 'password' ? <Modal>
          
              <label htmlFor="currentPassword" >현재 비밀번호</label><br></br>
              <input onChange={onChangeHandler}  id='currentPassword'></input><br></br>
              <label htmlFor="newPassword" >새 비밀번호</label><br></br>
              <input onChange={onChangeHandler}  id='newPassword'></input><br></br>
              <label htmlFor="passwordCheck" >비밀번호 확인</label><br></br>
              <input onChange={onChangeHandler}  id='passwordCheck'></input><br></br>
              <button onClick={onClickPwd}>비밀번호 변경</button>
              <div ref={errMessagePwd}></div>

          
          </Modal> : <div style={{color:'gray'}} >최종수정일 : {moment(updatedAt).format("YYYY년 MM월 DD일 HH시 mm분")}</div>}
        
        </Info>
      </List>
    </Wrapper>
  )
}

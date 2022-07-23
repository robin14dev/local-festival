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
`

const Heading = styled.div`
display: flex;
justify-content: space-between;
& > div {
  line-height: 1.5rem;
}

& > h4 {
  margin: 0.5rem 0;
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
line-height: 1.5rem;
transition: all 2s ease-out;

& > button {
  background-color: #1564a9;
  color: white;
  height: 2rem;
 border-radius: 0.3rem;
  padding :0 1rem;
  font-weight : 550  ;
}

& > input {
  height: 2rem;
  border-radius: 0.3rem;
  border: 1px solid gray;
  padding-left: 0.5rem;

  
}

/* @keyframes slide {
  from {
    transform: translateY(-1%);
  }
  to {
    transform: translateY(0%);
  }
}

animation: slide 0.5s; */
`
const Nickname = styled(Modal)`

&>div:nth-child(1) {
  margin: 0.5rem 0;
}

& button {
 margin-left: 1rem;

 &:hover {
  box-shadow: 1px 3px 1px  rgba(217, 220, 224, 0.901);

 }
}



`

const Password = styled(Modal)`

margin-top: 0.5rem;

& > input {
  margin: 0.2rem 0 ;
  height : 1.8rem 
}

& button {
  margin-top: 1rem;
  &:hover {
  box-shadow: 1px 3px 1px  rgba(217, 220, 224, 0.901);

 }
}

& > span {
  margin-left: 1rem;
  color: red;
}

`

export default function AccountSetting({authState, handleAuthState}) {
  const [isOpen, setIsOpen] = useState({
    nickname : false,
    password : false
  })
  const [nickname, setNickname] = useState(authState.nickname)
  const [pwdForm, setPwdForm] = useState({
    currentPassword : '',
    newPassword : '',
    passwordCheck : '',
  })

  //로직 
  // 닫혀있으면 false 
  // 특정 부분 클릭했을 때 특정부분의 상태값이 false면 그부분만 true로 해주고 setstate, 다른 값들은 여전히 false
  // 열려있는 특정 부분 다시 클릭했을 때 true를 false로 바꿔주기


  const [updatedAt, setUpdatedAt] = useState('')

  const {newPassword, passwordCheck} = pwdForm
  
  const inputhere = useRef()
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

  const openModalHandler = (e) => {
    if(isOpen[e.target.name] === false) {

      //const keyName = e.target.name

      //isOpen[e.target.name] = true
      const nextIsOpen = {...isOpen, [e.target.name] : true }
      e.target.textContent = '취소'
      setIsOpen(nextIsOpen)
  
    } else{
      const nextIsOpen = {...isOpen, [e.target.name] : false }
      e.target.textContent = '수정'
      setIsOpen(nextIsOpen)
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
   
      <List>
        <Info>
          <Heading>
            <h4>닉네임</h4>
            <Button><button name='nickname' onClick={openModalHandler}>수정</button></Button>
          </Heading>
         
          {isOpen.nickname ? 
            <Nickname>
            <div>변경할 닉네임을 입력해 주세요</div>
            <input ref={inputhere} onChange={nicknameHandler} placeholder={authState.nickname}></input>
            <button onClick={profileHandler} >수정하기</button>
            </Nickname> 
          : <div style={{color:'gray'}}>{authState.nickname}</div>}
         
        </Info>
        
        <Info>
          <Heading>
            <h4>비밀번호</h4>
            <Button><button name='password' onClick={openModalHandler} >수정</button></Button>
          </Heading>
          
          {isOpen.password? <Password>
          
              <label htmlFor="currentPassword" >현재 비밀번호</label><br></br>
              <input type={'password'} onChange={onChangeHandler}  id='currentPassword'></input><br></br>
              <label htmlFor="newPassword" >새 비밀번호</label><br></br>
              <input type={'password'} onChange={onChangeHandler}  id='newPassword'></input><br></br>
              <label htmlFor="passwordCheck" >비밀번호 확인</label><br></br>
              <input type={'password'} onChange={onChangeHandler}  id='passwordCheck'></input><br></br>
              <button onClick={onClickPwd}>비밀번호 변경</button>
              <span ref={errMessagePwd}></span>

          
          </Password> : <div style={{color:'gray'}} >최종수정일 : {moment(updatedAt).format("YYYY년 MM월 DD일 HH시 mm분")}</div>}
        
        </Info>
       
      </List>
    </Wrapper>
  )
}

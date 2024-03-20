import axios, { AxiosError } from 'axios'
import React, { useState, useEffect, useContext, useRef } from 'react'
import { ReactComponent as ServerFail } from '../../../assets/server-fail.svg'
import Loading from '../../Loading'
import {
    ModalContainer,
    LoadingWrapper,
    LoginSection,
    Backdrop,
    FormContainer,
} from './styled'

import { ConfirmIcon } from 'assets'
import { ModalDispatchContext } from 'contexts/ModalContext'
import { Field } from './Field'
import { FieldType, Progress, UserInfo, ValidateFuncParams } from './types'

const SignupModal = () => {
    const setModalKey = useContext(ModalDispatchContext)
    const userInfoRef = useRef({
        account: { value: '', isValid: false, isUnique: false },
        nickname: { value: '', isValid: false, isUnique: false },
        password: { value: '', isValid: false, isUnique: false },
        passwordCheck: { value: '', isValid: false, isUnique: false },
    })
    const [isLoading, setLoading] = useState(false)
    const [progress, setProgress] = useState<Progress>('inProgress')
    const [isHide, setIsHide] = useState(false)

    const { account, nickname, password, passwordCheck } = userInfoRef.current

    const updateUserInfo = (nextUserInfo: UserInfo) => {
        userInfoRef.current = { ...userInfoRef.current, ...nextUserInfo }
    }
    const duplicateCheckFromAPI = async (
        type: FieldType,
        value: string
    ): Promise<boolean> => {
        try {
            await axios.get(
                `${process.env.REACT_APP_SERVER_URL}/users/signup`,
                {
                    params: { [type]: value },
                }
            )
            return false
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                if (err.response?.data === `Already ${type}`) {
                    console.log('여기로 들어옴??')
                    return true
                }
                throw new Error()
            }

            throw new Error()
        }
    }
    const validate = ({ type, value, regex }: ValidateFuncParams): boolean => {
        if (!value) return false

        if (['account', 'nickname', 'password'].includes(type))
            return regex.test(value) ? true : false
        if (type === 'passwordCheck') {
            console.log('여기까지옴????', password)

            if (!password) return false
            return value === userInfoRef.current.password.value ? true : false
        }

        return false
    }
    const closeModal = () => {
        setModalKey('')
    }
    const openLoginModal = () => {
        setModalKey('LoginModal')
    }
    const Success = () => {
        const [count, setCount] = useState(3)

        useEffect(() => {
            // const timer = setInterval(() => {
            //   setCount((prevCount) => prevCount - 1);
            // }, 1000);
            // let closeModal = setTimeout(() => {
            //   setIsSignup(false);
            //   setIsLogin(true);
            // }, 4000);
            // return () => {
            //   clearInterval(timer);
            //   clearInterval(closeModal);
            // };
        }, [])
        return (
            <div className="signupSuccess">
                <h1>
                    Let's{' '}
                    <span
                        style={{
                            color: 'var(--primaryOrange)',
                            fontSize: '5rem',
                        }}
                    >
                        LoCo
                    </span>
                </h1>
                <img src={ConfirmIcon} />
                <div>
                    <p>
                        환영합니다 <span>{nickname.value}</span>님!
                    </p>
                    <p>회원 가입이 완료되었습니다</p>
                    <p>
                        <span style={{ color: 'var(--primaryPurple)' }}>
                            {count}
                        </span>
                        초 뒤에 <span>로그인</span>화면으로 넘어갑니다
                    </p>
                </div>
            </div>
        )
    }
    const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        /**
         * TODO : 여기서 부터 해야됨
         * 유효성 전부 다 통과하는지 확인
         * 통과한 이후에 api 요청 보내기
         */
    }
    const getFieldProps = () => {
        return { validate, updateInfo: updateUserInfo, duplicateCheckFromAPI }
    }

    return (
        <Backdrop onClick={closeModal}>
            <ModalContainer
                data-testid="SignupModal"
                onClick={(e) => {
                    e.stopPropagation()
                }}
                isHide={isHide}
            >
                {isLoading && (
                    <LoadingWrapper>
                        <h1>Loco</h1>
                        <Loading text={'Loading'} />
                    </LoadingWrapper>
                )}
                {!isLoading && progress === 'inProgress' ? (
                    <FormContainer>
                        <h1>LoCo</h1>
                        <form onSubmit={onSubmitHandler}>
                            <Field type="account" {...getFieldProps()} />
                            <Field type="nickname" {...getFieldProps()} />
                            <Field type="password" {...getFieldProps()} />
                            <Field type="passwordCheck" {...getFieldProps()} />
                            <button type="submit">회원가입</button>
                        </form>

                        <LoginSection>
                            <p>이미 계정이 있으신가요?</p>
                            <button
                                onClick={() => {
                                    setIsHide(true)
                                    openLoginModal()
                                }}
                            >
                                로그인
                            </button>
                        </LoginSection>
                    </FormContainer>
                ) : !isLoading && progress === 'success' ? (
                    <Success />
                ) : !isLoading && progress === 'failed' ? (
                    <div className="errMessage">
                        <h1>
                            Let's{' '}
                            <span
                                style={{
                                    color: 'var(--primaryOrange)',
                                    fontSize: '5rem',
                                }}
                            >
                                LoCo
                            </span>
                        </h1>
                        <ServerFail />
                        <div>
                            <p>서버와의 연결이 끊어졌습니다</p>
                            <p>잠시 후에 다시 시도해 주세요</p>
                        </div>
                        <button
                            onClick={() => {
                                // setIsSignup(false);
                            }}
                        >
                            메인페이지로 돌아가기
                        </button>
                    </div>
                ) : null}
            </ModalContainer>
        </Backdrop>
    )
}

export default SignupModal

import axios, { AxiosError } from 'axios'
import React, {
    useState,
    useEffect,
    useContext,
    useRef,
    useCallback,
} from 'react'
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
import { validationRegex, validationMessages } from './validation'

const duplicateCheckFromAPI = async (
    type: FieldType,
    value: string
): Promise<boolean> => {
    try {
        await axios.get(`${process.env.REACT_APP_SERVER_URL}/users/signup`, {
            params: { [type]: value },
        })
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

const SignupModal = () => {
    const setModalKey = useContext(ModalDispatchContext)
    const [userInfo, setUserInfo] = useState({
        account: { value: '', isValid: false, isUnique: false },
        nickname: { value: '', isValid: false, isUnique: false },
        password: { value: '', isValid: false },
        passwordCheck: { value: '', isValid: false },
    })
    const [messaages, setMessages] = useState({
        account: '',
        nickname: '',
        password: '',
        passwordCheck: '',
    })
    const [isLoading, setLoading] = useState(false)
    const [progress, setProgress] = useState<Progress>('inProgress')
    const [isHide, setIsHide] = useState(false)

    /**
     * userInfo값이 바뀜 => updateValidState 참조값 바뀜 => Field 리렌더링
     *
     * Field에선 updateValidState랑 message만 동적으로 바뀜
     *
     * 함수는 계속 바뀔수밖에 없지 않나??
     */

    /**
     * validate에서 userInfo가 계쏙 초기값이 나오는 이유
     *
     * updateValidState useCallback으로 [] 해놓으면 초기값 상태로 validate가 저장되기 때문
     *
     * updateValidState 의존성배열에 [userInfo] 해놓으면
     *
     *
     */
    const validate = ({
        type,
        value,
    }: {
        type: string
        value: string
    }): boolean => {
        // TODO : message를 리턴하는게 나을 것 같음 단순히 boolean 리턴하는게 아니라
        console.log(userInfo)

        const regex = validationRegex[type]
        if (!value) return false

        if (['account', 'nickname', 'password'].includes(type))
            return regex.test(value) ? true : false
        if (type === 'passwordCheck') {
            const password = userInfo.password.value

            if (!password) return false
            return value === userInfo.password.value ? true : false
        }

        return false
    }
    const updateValidState = useCallback(
        ({ type, value }: { type: FieldType; value: string }) => {
            const isValid = validate({ type, value })

            setUserInfo((prev) => ({
                ...prev,
                [type]: {
                    ...prev[type],
                    isValid,
                    value,
                },
            }))
            if (isValid) {
                if (
                    (type === 'account' || type === 'nickname') &&
                    userInfo[type].isUnique === false
                ) {
                    setMessages((prev) => ({
                        ...prev,
                        [type]: validationMessages[type].duplicateCheck,
                    }))
                } else {
                    setMessages((prev) => ({
                        ...prev,
                        [type]: validationMessages[type].valid,
                    }))
                }
            } else {
                value
                    ? setMessages((prev) => ({
                          ...prev,
                          [type]: validationMessages[type].inValid,
                      }))
                    : setMessages((prev) => ({
                          ...prev,
                          [type]: '',
                      }))
            }
        },
        []
    )
    // const updateUserInfo = ({
    //     type, // account
    //     value, // dbehdgur
    // }: {
    //     type: FieldType
    //     value: string
    // }) => {
    //     // const isValid = validate({ type, value })
    //     // setUserInfo((prev) => ({
    //     //     ...prev,
    //     //     [type]: { ...[type], value, isValid },
    //     // }))
    //     // if (isValid) {
    //     //     if (
    //     //         (type === 'account' || type === 'nickname') &&
    //     //         userInfo[type].isUnique === false
    //     //     ) {
    //     //         setMessages((prev) => ({
    //     //             ...prev,
    //     //             [type]: validationMessages[type].duplicateCheck,
    //     //         }))
    //     //     } else {
    //     //         setMessages((prev) => ({
    //     //             ...prev,
    //     //             [type]: validationMessages[type].valid,
    //     //         }))
    //     //     }
    //     // } else {
    //     //     value
    //     //         ? setMessages((prev) => ({
    //     //               ...prev,
    //     //               [type]: validationMessages[type].inValid,
    //     //           }))
    //     //         : setMessages((prev) => ({
    //     //               ...prev,
    //     //               [type]: '',
    //     //           }))
    //     // }
    // }
    const updateUniqueState = async (type: FieldType) => {
        try {
            const value = userInfo[type].value
            const isDuplicated = await duplicateCheckFromAPI(type, value)
            console.log(isDuplicated, 'here')

            if (isDuplicated) {
                throw new Error('Duplicated')
            }
            setUserInfo((prev) => ({
                ...prev,
                [type]: { ...[type], isUnique: true },
            }))
            setMessages((prev) => ({
                ...prev,
                [type]: validationMessages[type].valid,
            }))
        } catch (err: unknown) {
            console.log('캐치??', typeof err)
            console.dir(err)

            if (err instanceof Error) {
                if (err.message === 'Duplicated') {
                    console.log('에러 찍힘??')
                    setUserInfo((prev) => ({
                        ...prev,
                        [type]: { ...[type], isUnique: false },
                    }))
                    setMessages((prev) => ({
                        ...prev,
                        [type]: validationMessages[type].exist,
                    }))
                }
            }
        }
    }

    /**
     * TODO
     * 비밀번호 입력 후, 비밀번호 확인 입력후 새로운 비밀번호 입력시 비밀번호 확인 에러 업데이트 안되는 현상
     * 비밀번호 입력시, passwordCheck의 isValid는 password === passwordCheck로 판단
     * 이제 useEffect를 써야되는거 아닌가??
     *
     * 현재 상황
     *
     * useRef로 입력값, 상태 관리
     *
     * 필드에 입력시 해당 값과 유효성 업데이트, ref는 렌더링되지 않으니깐 이점을 이용함
     *
     * 문제
     *
     * passwordCheck의 isValid는 password랑 passwordCheck랑 같아야 true
     * 비번입력 => 비번확인 입력 => 다른비번입력 하면 useRef값은 달라지지만
     * 비번확인은 계속 기존 값을 유지해서 에러 업데이트가 되지 않음
     *
     * 해결방법
     * - useEffect?
     *  - fieldType이 passwordCheck면 종속성을 fieldType.passwordValue에다 놓고
     *  - fieldType.password.value가 바뀔때마다 일치하는지 테스트 => isValid를 false로 만듬 이건 되고
     *  - isValid가 false면 자식 컴포넌트에서 해당 업데이트된 값을 전달해 주어야 하는데 일단 리렌더링이 안되니깐 전달할 수 있는 방법이... 없는 것 같음
     *
     *
     * - useState ?
     * TODO :  각 필드에 memo를 하면 되지 않을까?
     * 1. children으로 해결해보기
     * 2. memo로 해결해보기
     * - 구체적으로 어떻게 ?
     *  - 입력값이 상태가 되면
     */

    // const { account, nickname, password, passwordCheck } = userInfoRef.current

    // const updateUserInfo = (nextUserInfo: UserInfo) => {
    //     userInfoRef.current = { ...userInfoRef.current, ...nextUserInfo }
    // }

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
                    <p>{/* 환영합니다 <span>{nickname.value}</span>님! */}</p>
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
        return {
            validate,

            updateUniqueState,
            message: userInfo,
        }
    }

    /**
     * type이랑 value 둘다 넘어옴
     * validate돌림
     *
     */

    // useEffect(() => {
    //     /**
    //      * 원하는 것
    //      * 계정 입력 => 넘어감 => 유효성 검증 => 메시지 보여주기
    //      * focusOut할 때 focusOut한 요소를 validate 하면됨
    //      *
    //      */
    // }, [touched])

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
                            <Field
                                updateValidState={updateValidState}
                                name="account"
                                type="email"
                                message={messaages.account}
                                duplicationCheck
                            />
                            <Field
                                updateValidState={updateValidState}
                                name="nickname"
                                type="text"
                                message={messaages.nickname}
                                duplicationCheck
                            />
                            <Field
                                updateValidState={updateValidState}
                                name="password"
                                type="password"
                                message={messaages.password}
                            />
                            <Field
                                updateValidState={updateValidState}
                                name="passwordCheck"
                                type="password"
                                message={messaages.passwordCheck}
                            />

                            {/* <Field />
                            <Field /> */}
                            {/* <Field {...getFieldProps()} />
                            <Field {...getFieldProps()} />
                            <Field {...getFieldProps()} />
                            <Field {...getFieldProps()} /> */}
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

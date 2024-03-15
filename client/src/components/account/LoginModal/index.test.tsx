import React, { useContext } from 'react'
import { render, screen } from '@testing-library/react'
import LoginModal from '.'
import userEvent from '@testing-library/user-event'
import { ModalContextProvider, ModalDispatchContext } from 'contexts/ModalContext'

describe('<LoginModal />', () => {
    test('컴포넌트가 성공적으로 렌더링 됩니다.', () => {
        const { container } = render(<LoginModal />)

        const emailInput = screen.getByPlaceholderText('email을 입력해 주세요')
        const passwordInput =
            screen.getByPlaceholderText('비밀번호를 입력해 주세요')
        const submitButton = screen.getByRole('button', { name: '로그인' })
        const signupButton = screen.getByRole('button', {name : '회원가입'})
        expect(emailInput).toBeInTheDocument()
        expect(passwordInput).toBeInTheDocument()
        expect(submitButton).toBeInTheDocument()
        expect(signupButton).toBeInTheDocument();
        expect(container).toMatchSnapshot()
    })
    test('회원가입 버튼을 누르면 로그인 모달이 사라지고 회원가입 모달이 렌더링 됩니다', async() => {
        const user = userEvent.setup()
        const TestComponent = ():JSX.Element => {
            const setModalKey = useContext(ModalDispatchContext)
            const showLoginModal = () => {
                setModalKey('LoginModal')
            }
            return <button onClick={showLoginModal}>loginModal</button>
        }
        const {container} =render(<ModalContextProvider>
            <TestComponent/>
        </ModalContextProvider>)

        const showLoginModalButton = screen.getByRole('button', {name : 'loginModal'})
        expect(showLoginModalButton).toBeInTheDocument()
        await user.click(showLoginModalButton)

        const loginModal = screen.getByTestId('LoginModal')
        expect(loginModal).toBeInTheDocument()

        const signupButton = screen.getByRole('button', {name : '회원가입'})
        expect(signupButton).toBeInTheDocument();
        await user.click(signupButton);
        const SignupModal = screen.getByTestId('SignupModal')
        expect(SignupModal).toBeInTheDocument()
        expect(loginModal).not.toBeInTheDocument()
        expect(container).toMatchSnapshot()



    })
    test('<input>에 입력한 텍스트 값이 그대로 렌더링 됩니다', async () => {
        const user = userEvent.setup()
        const { container } = render(<LoginModal />)

        const emailInput = screen.getByPlaceholderText('email을 입력해 주세요')
        const passwordInput =
            screen.getByPlaceholderText('비밀번호를 입력해 주세요')

        expect(emailInput).toHaveValue('')
        expect(passwordInput).toHaveValue('')

        const emailText = 'account@mail.com'
        const passwordText = '1234'
        await user.click(emailInput)
        await user.keyboard(emailText)
        expect(emailInput).toHaveValue(emailText)
        await user.tab()
        await user.keyboard(passwordText)
        expect(passwordInput).toHaveValue(passwordText)
        expect(container).toMatchSnapshot();

    })
    test('로그인 실패 시, 이메일이 존재하지 않을 때 에러 메시지를 렌더링 합니다.', () => {
        /**
         * api 호출 해야됨
         * 
         * TODO : api랑 응답 메시지 데이터 읽어보고 준비하기 
         * 
         */
    })
    test.skip('로그인 실패 시, 잘못된 비밀번호 입력시, 에러메시지를 렌더링 합니다.', () => {})
    test.skip('로그인 버튼 클릭 시, input에 입력한 텍스트들이 콜백함수의 인자로 들어가 호출됩니다', () => {})
    test.skip('로그인 성공시, 로그인 모달이 사라집니다.', () => {})
})

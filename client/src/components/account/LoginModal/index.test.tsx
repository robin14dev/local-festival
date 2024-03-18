import React, { useContext } from 'react'
import {
    render,
    screen,
    waitFor,
    waitForElementToBeRemoved,
} from '@testing-library/react'
import LoginModal from '.'
import userEvent from '@testing-library/user-event'
import {
    ModalContextProvider,
    ModalDispatchContext,
} from 'contexts/ModalContext'
import {
    interceptLoginFailureOnPassword,
    interceptLoginFailureOnUserId,
    interceptLoginSuccess,
} from 'test/mocks/mockServer/scope/user'

describe('<LoginModal />', () => {
    test('컴포넌트가 성공적으로 렌더링 됩니다.', () => {
        const { container } = render(<LoginModal />)

        const emailInput = screen.getByPlaceholderText('email을 입력해 주세요')
        const passwordInput =
            screen.getByPlaceholderText('비밀번호를 입력해 주세요')
        const submitButton = screen.getByRole('button', { name: '로그인' })
        const signupButton = screen.getByRole('button', { name: '회원가입' })
        expect(emailInput).toBeInTheDocument()
        expect(passwordInput).toBeInTheDocument()
        expect(submitButton).toBeInTheDocument()
        expect(signupButton).toBeInTheDocument()
        expect(container).toMatchSnapshot()
    })
    test('인풋에 입력한 텍스트 값이 그대로 렌더링 됩니다', async () => {
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
        expect(container).toMatchSnapshot()
    })
    test('인풋 중 하나라도 비어있으면 로그인 버튼이 비활성화 됩니다.', async () => {
        const user = userEvent.setup()
        const { container } = render(<LoginModal />)

        const emailInput = screen.getByPlaceholderText('email을 입력해 주세요')
        const passwordInput =
            screen.getByPlaceholderText('비밀번호를 입력해 주세요')

        expect(emailInput).toHaveValue('')
        expect(passwordInput).toHaveValue('')

        const emailText = 'account@mail.com'
        const passwordText = '1234'
        const testCases = [
            { input: emailInput, text: emailText },
            { input: passwordInput, text: passwordText },
        ]

        const submitButton = screen.getByRole('button', { name: '로그인' })
        expect(submitButton).toBeInTheDocument()
        for (const testCase of testCases) {
            const { input, text } = testCase
            await user.click(input)
            await user.keyboard(text)
            expect(input).toHaveValue(text)
            expect(submitButton).toBeDisabled()
            expect(container).toMatchSnapshot()
            await user.clear(input)
        }
    })
    test('회원가입 버튼을 누르면 로그인 모달이 사라지고 회원가입 모달이 렌더링 됩니다', async () => {
        const user = userEvent.setup()
        const TestComponent = (): JSX.Element => {
            const setModalKey = useContext(ModalDispatchContext)
            const showLoginModal = () => {
                setModalKey('LoginModal')
            }
            return <button onClick={showLoginModal}>loginModal</button>
        }
        const { container } = render(
            <ModalContextProvider>
                <TestComponent />
            </ModalContextProvider>
        )

        const showLoginModalButton = screen.getByRole('button', {
            name: 'loginModal',
        })
        expect(showLoginModalButton).toBeInTheDocument()
        await user.click(showLoginModalButton)

        const loginModal = screen.getByTestId('LoginModal')
        expect(loginModal).toBeInTheDocument()

        const signupButton = screen.getByRole('button', { name: '회원가입' })
        expect(signupButton).toBeInTheDocument()
        await user.click(signupButton)
        const SignupModal = screen.getByTestId('SignupModal')
        expect(SignupModal).toBeInTheDocument()
        expect(loginModal).not.toBeInTheDocument()
        expect(container).toMatchSnapshot()
    })
    describe('[로그인 실패 시]', () => {
        test('이메일이 존재하지 않을 때 에러 메시지를 렌더링 합니다.', async () => {
            interceptLoginFailureOnUserId()

            const user = userEvent.setup()
            const { container } = render(<LoginModal />)
            const emailInput =
                screen.getByPlaceholderText('email을 입력해 주세요')
            const submitButton = screen.getByRole('button', { name: '로그인' })

            await user.click(emailInput)
            await user.keyboard('user1')
            await user.tab()
            await user.keyboard('password1')
            await user.click(submitButton)
            const errorMessage =
                await screen.findByText('사용자가 존재하지 않습니다')
            expect(errorMessage).toBeInTheDocument()
            expect(container).toMatchSnapshot()
        })
        test('잘못된 비밀번호 입력시, 에러메시지를 렌더링 합니다.', async () => {
            interceptLoginFailureOnPassword()

            const user = userEvent.setup()
            const { container } = render(<LoginModal />)
            const emailInput =
                screen.getByPlaceholderText('email을 입력해 주세요')
            const submitButton = screen.getByRole('button', { name: '로그인' })

            await user.click(emailInput)
            await user.keyboard('user1')
            await user.tab()
            await user.keyboard('password1')
            await user.click(submitButton)
            const errorMessage =
                await screen.findByText('비밀번호가 일치하지 않습니다')
            expect(errorMessage).toBeInTheDocument()
            expect(container).toMatchSnapshot()
        })
    })
    describe('[로그인 성공 시]', () => {
        test('로그인 모달이 사라집니다.', async () => {
            interceptLoginSuccess()
            const user = userEvent.setup()

            const TestComponent = (): JSX.Element => {
                const setModalKey = useContext(ModalDispatchContext)
                const showLoginModal = () => {
                    setModalKey('LoginModal')
                }
                return (
                    <div>
                        <h1>TestComponent</h1>
                        <button onClick={showLoginModal}>loginModal</button>
                    </div>
                )
            }

            const { container } = render(
                <ModalContextProvider>
                    <TestComponent />
                </ModalContextProvider>
            )

            const showLoginModalButton = screen.getByRole('button', {
                name: 'loginModal',
            })
            expect(showLoginModalButton).toBeInTheDocument()
            await user.click(showLoginModalButton)

            const loginModal = screen.getByTestId('LoginModal')
            expect(loginModal).toBeInTheDocument()

            const emailInput =
                screen.getByPlaceholderText('email을 입력해 주세요')
            const submitButton = screen.getByRole('button', { name: '로그인' })

            await user.click(emailInput)
            await user.keyboard('user1')
            await user.tab()
            await user.keyboard('password1')
            await user.click(submitButton)

            await waitForElementToBeRemoved(loginModal)
            expect(container).toMatchSnapshot()

            //    await waitFor(() => { // ! await이 붙어야 함

            //     expect(showLoginModalButton).toBeInTheDocument()
            //     expect(container).toMatchSnapshot()
            //     })
        })
    })
})

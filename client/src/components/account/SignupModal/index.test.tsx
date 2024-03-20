import React from 'react'
import { render, screen } from '@testing-library/react'
import SignupModal from '.'

describe('<SignupModal />', () => {
    test.only('컴포넌트가 정상적으로 렌더링 됩니다.', () => {
        const { container } = render(<SignupModal />)
        /**
         * label, role placeholder 활용하기
         *
         * 라벨이랑 인풋창
         *
         *
         * 리팩할거는 각 창을 컴포넌트로 만들어서 재활용 하기
         * 중복확인 버튼 여부반 props로 넘겨주면 될듯??
         */
        const title = screen.getByRole('heading', { level: 1 })

        const input = screen.getByLabelText('이메일 주소')
        const duplicateCheckButton = screen.getByRole('button', {
            name: 'account',
        })
        /**
         * TODO : 중복확인 버튼이 두개가 있는데 name으로 구분이 안됨
         *
         * name이 필요한가?
         *
         */
        expect(input).toBeInTheDocument()
        expect(duplicateCheckButton).toBeInTheDocument()

        const inputNames = ['account', 'nickname', 'password', 'passwordCheck']
        const testCases = [{ inputName: 'account' }]
        expect(title).toBeInTheDocument()
    })
    describe('[이메일 입력 관련 테스트 그룹]', () => {})
    test('잘못된 형식의 이메일 주소를 입력할 경우, 유효성 메시지가 나타납니다.', () => {})
    test('중복확인에 마우스를 올릴 경우 hover 효과가 나타납니다', () => {})
    test('잘못된 형식의 닉네임을 입력할 경우, 유효성 메시지가 나타납니다.', () => {})
    test('잘못된 형식의 비밀번호를 입력할 경우, 유효성 메시지가 나타납니다.', () => {})
    test('비밀번호 확인란에 동일한 비밀번호를 입력하지 않을 경우, 유효성 메시지가 나타납니다.', () => {})
    test('하나라도 유효성에 통과하지 못한다면 회원가입 버튼은 비활성화 됩니다', () => {})
    test('로그인 버튼을 누를 경우 회원가입 모달이 사라지고 로그인 모달이 렌더링 됩니다.', () => {})
    test('회원가입 성공 시, 회원가입 모달이 사라지고 성공 메시지가 담긴 모달이 렌더링 되며 3초후 사라집니다', () => {})
    test('서버와의 오류로 회원가입 실패시, 에러 메시지를 담은 모달이 렌더링 됩니다', () => {})
})

import React from 'react'
import { render } from "@testing-library/react"
import { MemoryRouter } from 'react-router-dom'
import Header from "."


//? authState가 undefined일 때도 타입을 명시해 줘야되지 않나??

const dummyData = {
    authState : {
      userId: 0,
      account: '',
      nickname: '',
      defaultPic: '',
      loginStatus: false,
    },

}
const {authState} = dummyData;

describe('<Header />', () => {
    it('컴포넌트를 성공적으로 렌더링 합니다', () => {
        render(
        <MemoryRouter initialEntries={['/']}>
            <Header authState={authState} setAuthState={} setIsLoginModal={} />
        </MemoryRouter>
        )
    })
})
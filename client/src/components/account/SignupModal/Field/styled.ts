import styled from 'styled-components'

// export const Container = styled.div`
//     display: flex;
//     justify-content: space-between;
//     height: 1.8rem;

//     label {
//         font-size: 1rem;
//         height: 100%;
//         display: flex;
//         align-items: center;
//     }
// `

export const Container = styled.div`
    & > div {
        display: flex;
        justify-content: space-between;

        align-items: center;
        margin-bottom: 0.4rem;
    }
`
export const FieldInfo = styled.div`
    display: flex;
`

export const Message = styled.div<{
    checkType: string
    isValid: boolean
    isUnique?: boolean
}>`
    font-size: 0.8rem;
    font-weight: bold;
    font-family: 'NanumSquareRound';
    word-break: normal;
    padding-left: 0.5rem;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: ${({ isValid, checkType }) =>
        isValid === false
            ? 'var(--primaryPink)'
            : checkType === 'nickname' || checkType === 'account'
              ? 'orange'
              : 'var(--primaryBlue)'};
    color: ${({ isUnique }) => isUnique && 'var(--primaryBlue)'};
`

export const Input = styled.input`
    width: 100%;
    height: 2.5rem;
    margin-bottom: 1rem;
    border: 1px solid lightgray;
    border-radius: 0.3rem;
    padding: 0.5rem;
`
export const Button = styled.button`
    background-color: var(--mainColor);
    color: white;
    margin: 0 0.1rem;
    margin-left: 1rem;
    height: fit-content;
    padding: 0.2rem;
    border-radius: 0.2rem;
    font-size: 0.9rem;
    transition: all 0.2s;

    &:disabled {
        background-color: darkgray;
        &:hover {
            background-color: darkgray;
        }
    }
    &:hover {
        background-color: var(--primaryBlue);
    }
`

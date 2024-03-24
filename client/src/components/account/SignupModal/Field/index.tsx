import React, { memo, useState } from 'react'
import { Button, Container, FieldInfo, Input, Message } from './styled'
import { fields } from '../validation'
import { FieldItem, FieldType, UserInfo, ValidateFuncParams } from '../types'

type Props = {
    // // type: FieldType
    // updateUserInfo: ({ type, value }: { type: string; value: string }) => void
    // updateUniqueState: (type: FieldType) => Promise<void>
    // message: string
    // fieldStatus: { isValid: boolean; isUnique?: boolean }
    duplicationCheck?: boolean
    type: string
    name: string
    message: string
    updateValidState: ({
        type,
        value,
    }: {
        type: FieldType
        value: string
    }) => void
}
export const Field = memo(
    ({
        // updateUserInfo,
        // message,
        // fieldStatus,
        // updateUniqueState,
        duplicationCheck,
        type,
        name,
        message,
        updateValidState,
    }: Props) => {
        console.log(name, 'render')

        // const {
        //     fieldType,
        //     inputType,
        //     required,
        //     labelText,
        //     needDuplicateCheck,
        //     messages,
        //     regex,
        // } = fields.find((field) => field.fieldType === type) as FieldItem
        // const { isValid, isUnique } = fieldStatus

        // const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        //     const value = e.target.value

        //     updateUserInfo({ type: fieldType, value })
        //     // setValue(value)
        //     // setIsUnique(false)
        //     // const validStatus = validate({
        //     //     type: fieldType,
        //     //     value,
        //     //     regex,
        //     // })
        //     // setIsValid(validStatus)
        //     // if (validStatus === true) {
        //     //     if (
        //     //         (fieldType === 'account' || fieldType === 'nickname') &&
        //     //         messages.duplicateCheck
        //     //     ) {
        //     //         setMessage(messages.duplicateCheck)
        //     //     } else {
        //     //         setMessage(messages.valid)
        //     //     }
        //     // } else {
        //     //     value ? setMessage(messages.inValid) : setMessage('')
        //     // }

        //     // const nextUserInfo = {
        //     //     [fieldType]: {
        //     //         value,
        //     //         isValid: validStatus,
        //     //         isUnique,
        //     //     },
        //     // }

        //     // updateInfo(nextUserInfo)
        // }
        // const onClickHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
        //     e.preventDefault()
        //     if (!isValid) return
        //     updateUniqueState(fieldType)

        //     // try {
        //     //     const isDuplicated = await duplicateCheckFromAPI(fieldType, value)
        //     //     console.log(isDuplicated, 'here')

        //     //     if (isDuplicated) {
        //     //         throw new Error('Duplicated')
        //     //     }
        //     //     setIsUnique(true)
        //     //     setMessage(messages.valid)
        //     //     const nextUserInfo = {
        //     //         [fieldType]: {
        //     //             value,
        //     //             isValid,
        //     //             isUnique: true,
        //     //         },
        //     //     }
        //     //     updateInfo(nextUserInfo)

        //     //     //TODO : 메시지 처리랑 유저정보 업데이트 처리 해줘야됨
        //     //     // setValidMsg((prevMsg) => ({
        //     //     //     ...prevMsg,
        //     //     //     [checkType]: message[checkType].unique,
        //     //     // }))
        //     //     // setUserInfo((prevInfo) => ({
        //     //     //     ...prevInfo,
        //     //     //     [checkType]: {
        //     //     //         ...prevInfo[checkType],
        //     //     //         isUnique: true,
        //     //     //     },
        //     //     // }))
        //     // } catch (err: unknown) {
        //     //     console.log('캐치??', typeof err)
        //     //     console.dir(err)

        //     //     if (err instanceof Error) {
        //     //         if (err.message === 'Duplicated') {
        //     //             console.log('에러 찍힘??')

        //     //             messages.exist ? setMessage(messages.exist) : setMessage('')
        //     //             const nextUserInfo = {
        //     //                 [fieldType]: {
        //     //                     value,
        //     //                     isValid,
        //     //                     isUnique: false,
        //     //                 },
        //     //             }
        //     //             updateInfo(nextUserInfo)

        //     //             //TODO : 메시지 처리랑 유저정보 업데이트 처리 해줘야됨
        //     //             // setUserInfo((prevInfo) => ({
        //     //             //     ...prevInfo,
        //     //             //     [checkType]: {
        //     //             //         ...prevInfo[checkType],
        //     //             //         isUnique: false,
        //     //             //     },
        //     //             // }))
        //     //             // setValidMsg((prevMsg) => ({
        //     //             //     ...prevMsg,
        //     //             //     [checkType]: message[checkType].exist,
        //     //             // }))
        //     //         }
        //     //     }
        //     // }
        // }
        const onBlurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
            const type = e.target.name as FieldType
            const value = e.target.value
            updateValidState({ type, value })
        }
        const onClickHandler = () => {}

        return (
            <Container>
                {/* <div>
                <FieldInfo>
                    <label htmlFor={fieldType}>{labelText}</label>
                    <Message checkType={fieldType} isValid={isValid}>
                        {message}
                    </Message>
                </FieldInfo>

                {needDuplicateCheck && (
                    <Button
                        name={fieldType}
                        onClick={onClickHandler}
                        disabled={!isValid || isUnique}
                    >
                        중복 확인
                    </Button>
                )}
            </div>
            <Input
                onBlur={onBlurHandler}
                id={fieldType}
                name={fieldType}
                type={inputType}
                required={required}
                onChange={onChangeHandler}
            /> */}
                <div>
                    {/**
                     * // TODO
                     * // Problem
                     * - 문제가 css랑 button 활성화 하는데 isValid, isUnique가 들어가야됨
                     * - updateInfo에 들어가 있음 해당 사항들은
                     * 넘어오는게
                     * props
                     * updateValidState
                     * name
                     * type
                     * message
                     * duplicatioinCheck
                     *
                     * 계속 바뀌는건 updateValidState
                     *
                     *
                     * // Solution
                     *
                     *  - memo를 해주면
                     *
                     *
                     */}
                    <FieldInfo>
                        <label htmlFor={name}>{name}</label>
                        <Message>{message}</Message>
                    </FieldInfo>
                    {duplicationCheck && (
                        <Button
                            name={type}
                            onClick={onClickHandler}
                            // disabled={!isValid || isUnique}
                        >
                            중복 확인
                        </Button>
                    )}
                </div>
                <Input
                    type={type}
                    id={name}
                    onBlur={onBlurHandler}
                    name={name}
                />
            </Container>
        )
    }
)

// export default memo(Field)

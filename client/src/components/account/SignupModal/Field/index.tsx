import React, { useState } from 'react'
import { Button, Container, FieldInfo, Input, Message } from './styled'
import { fields } from '../validation'
import { FieldItem, FieldType, UserInfo, ValidateFuncParams } from '../types'

type Props = {
    type: FieldType
    validate: ({ type, value, regex }: ValidateFuncParams) => boolean
    updateInfo: (userInfo: UserInfo) => void
    duplicateCheckFromAPI: (type: FieldType, value: string) => Promise<boolean>
    password?: string
}
export const Field = ({
    type,
    updateInfo,
    validate,
    duplicateCheckFromAPI,
}: Props) => {
    const {
        fieldType,
        inputType,
        required,
        labelText,
        needDuplicateCheck,
        messages,
        regex,
    } = fields.find((field) => field.fieldType === type) as FieldItem
    const [value, setValue] = useState('')
    const [message, setMessage] = useState('')
    const [isValid, setIsValid] = useState(false)
    const [isUnique, setIsUnique] = useState(false)

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setValue(value)
        setIsUnique(false)
        const validStatus = validate({
            type: fieldType,
            value,
            regex,
        })
        setIsValid(validStatus)
        if (validStatus === true) {
            if (
                (fieldType === 'account' || fieldType === 'nickname') &&
                messages.duplicateCheck
            ) {
                setMessage(messages.duplicateCheck)
            } else {
                setMessage(messages.valid)
            }
        } else {
            value ? setMessage(messages.inValid) : setMessage('')
        }

        const nextUserInfo = {
            [fieldType]: {
                value,
                isValid: validStatus,
                isUnique,
            },
        }

        updateInfo(nextUserInfo)
    }
    const onClickHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (!isValid) return

        try {
            const isDuplicated = await duplicateCheckFromAPI(fieldType, value)
            console.log(isDuplicated, 'here')

            if (isDuplicated) {
                throw new Error('Duplicated')
            }
            setIsUnique(true)
            setMessage(messages.valid)
            const nextUserInfo = {
                [fieldType]: {
                    value,
                    isValid,
                    isUnique: true,
                },
            }
            updateInfo(nextUserInfo)

            //TODO : 메시지 처리랑 유저정보 업데이트 처리 해줘야됨
            // setValidMsg((prevMsg) => ({
            //     ...prevMsg,
            //     [checkType]: message[checkType].unique,
            // }))
            // setUserInfo((prevInfo) => ({
            //     ...prevInfo,
            //     [checkType]: {
            //         ...prevInfo[checkType],
            //         isUnique: true,
            //     },
            // }))
        } catch (err: unknown) {
            console.log('캐치??', typeof err)
            console.dir(err)

            if (err instanceof Error) {
                if (err.message === 'Duplicated') {
                    console.log('에러 찍힘??')

                    messages.exist ? setMessage(messages.exist) : setMessage('')
                    const nextUserInfo = {
                        [fieldType]: {
                            value,
                            isValid,
                            isUnique: false,
                        },
                    }
                    updateInfo(nextUserInfo)

                    //TODO : 메시지 처리랑 유저정보 업데이트 처리 해줘야됨
                    // setUserInfo((prevInfo) => ({
                    //     ...prevInfo,
                    //     [checkType]: {
                    //         ...prevInfo[checkType],
                    //         isUnique: false,
                    //     },
                    // }))
                    // setValidMsg((prevMsg) => ({
                    //     ...prevMsg,
                    //     [checkType]: message[checkType].exist,
                    // }))
                }
            }
        }
    }

    return (
        <Container>
            <div>
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
                id={fieldType}
                name={fieldType}
                type={inputType}
                value={value}
                required={required}
                onChange={onChangeHandler}
            />
        </Container>
    )
}

export type UserInfo = {
    [x: string]: {
        value: string
        isValid: boolean
        isUnique?: boolean
    }
}
export type FieldItem = {
    fieldType: FieldType
    inputType: string
    required: boolean
    labelText: string
    needDuplicateCheck: boolean
    regex: RegExp
    messages: {
        duplicateCheck?: string | undefined
        inValid: string
        valid: string
        exist?: string | undefined
    }
}
export type ValidateFuncParams = {
    type: FieldType
    value: string
    regex: RegExp
    password?: string
}
export type Progress = 'inProgress' | 'success' | 'failed'
export type FieldType = 'account' | 'nickname' | 'password' | 'passwordCheck'
export type userInfo = {
    [index: string]: {
        text: string
        isValid: boolean
        isUnique?: boolean
    }
}
export type ValidationRegex = {
    [index: string]: RegExp
    account: RegExp
    nickname: RegExp
    password: RegExp
}

export type ValidationMessages = {
    [key in FieldType]: {
        duplicateCheck?: string
        inValid: string
        valid: string
        exist?: string
    }
}

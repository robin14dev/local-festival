import { ValidationMessages, ValidationRegex } from './types'

export const validationRegex: ValidationRegex = {
    account: /[a-z0-9_!#$%^&*()-]+\@+[a-z0-9]+\.[a-z]+/,
    nickname: /^[가-힣|a-z|A-Z|0-9|]{4,8}$/,
    password: /^.*(?=^.{8,}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!~@#$%^&+=]).*$/,
}

export const validationMessages: ValidationMessages = {
    account: {
        duplicateCheck: '중복 확인을 눌러주세요',
        inValid: '유효하지 않은 이메일 형식 입니다',
        exist: '이미 사용중인 이메일 입니다.',
        valid: '가입이 가능한 이메일입니다',
    },
    nickname: {
        duplicateCheck: '중복 확인을 눌러주세요',
        inValid: '영문, 한글, 숫자 포함 4자에서 8자 이하여야 합니다',
        exist: '이미 사용중인 닉네임 입니다.',
        valid: '사용이 가능한 닉네임입니다',
    },
    password: {
        valid: '사용이 가능한 비밀번호 입니다',
        inValid: '영문, 숫자, 특수문자 조합으로 최소 8자리 이상이여야 합니다',
        exist: '새로운 비밀번호는 이전의 비밀번호와 같을 수 없습니다',
    },
    passwordCheck: {
        valid: '비밀번호가 일치합니다',
        inValid: '비밀번호가 일치하지 않습니다',
    },
}

export const fields = [
    {
        fieldType: 'account',
        inputType: 'email',
        required: true,
        labelText: '이메일 주소',
        needDuplicateCheck: true,
        regex: validationRegex['account'],
        messages: validationMessages['account'],
    },
    {
        fieldType: 'nickname',
        inputType: 'text',
        required: true,
        labelText: '닉네임',
        needDuplicateCheck: true,
        regex: validationRegex['nickname'],
        messages: validationMessages['nickname'],
    },
    {
        fieldType: 'password',
        inputType: 'password',
        required: true,
        labelText: '비밀번호',
        needDuplicateCheck: false,
        regex: validationRegex['password'],
        messages: validationMessages['password'],
    },
    {
        fieldType: 'passwordCheck',
        inputType: 'password',
        required: true,
        labelText: '비밀번호 확인',
        needDuplicateCheck: false,
        regex: validationRegex['passwordCheck'],
        messages: validationMessages['passwordCheck'],
    },
]

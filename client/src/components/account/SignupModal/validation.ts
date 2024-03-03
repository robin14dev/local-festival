type Message = {
  [index: string]: {
    success?: string;
    fail: string;

    exist?: string;
    unique?: string;
  };
};
export type Progress = "inProgress" | "success" | "failed";

export type userInfo = {
  [index: string]: {
    text: string;
    isValid: boolean;
    isUnique?: boolean;
  };
};

type Rgx = {
  [index: string]: RegExp;
  account: RegExp;
  nickname: RegExp;
  password: RegExp;
};

export const rgx: Rgx = {
  account: /[a-z0-9_!#$%^&*()-]+\@+[a-z0-9]+\.[a-z]+/,
  nickname: /^[가-힣|a-z|A-Z|0-9|]{4,8}$/,
  password: /^.*(?=^.{8,}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!~@#$%^&+=]).*$/,
};
export const message: Message = {
  account: {
    success: "중복 확인을 눌러주세요",
    fail: "유효하지 않은 이메일 형식 입니다",
    exist: "이미 사용중인 이메일 입니다.",
    unique: "가입이 가능한 이메일입니다",
  },
  nickname: {
    success: "중복 확인을 눌러주세요",
    fail: "영문, 한글, 숫자 포함 4자에서 8자 이하여야 합니다",
    exist: "이미 사용중인 닉네임 입니다.",
    unique: "사용이 가능한 닉네임입니다",
  },
  password: {
    success: "사용이 가능한 비밀번호 입니다",
    fail: "영문, 숫자, 특수문자 조합으로 최소 8자리 이상이여야 합니다",
    exist: "새로운 비밀번호는 이전의 비밀번호와 같을 수 없습니다",
  },
  passwordCheck: {
    success: "비밀번호가 일치합니다",
    fail: "비밀번호가 일치하지 않습니다",
  },
  curPassword: {
    fail: "기존 비밀번호가 일치하지 않습니다",
  },
};
export function validate(
  type: string,
  value: string,
  rgx: Rgx,
  password: string
) {
  // userInfo의 전체 키를 타입으로 하고 싶을 때

  //#1 빈값일때는 메시지 안보이게하고 return false
  if (value === "") {
    return false;
  }

  //#2 빈값이 아닐때 정규식 체크

  if (rgx[type]) {
    return rgx[type].test(value) ? true : false;
  } else {
    return password === value ? true : false;
  }
}

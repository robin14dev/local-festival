import scope from ".";

const interceptLoginFailureOnUserId = () => {
    scope.post('/users/signin')
    .replyWithError({response : {data : {message : "User Doesn't Exist"}}})
}
const interceptLoginFailureOnPassword = () => {
    scope.post('/users/signin')
    .replyWithError({response : {data : {message : "Wrong account And Password Combination"}}})
}

const interceptLoginSuccess = () => {
    scope.post('/users/signin')
    .reply(200,{message : "login success" , info : {
        token : 'mockAccessToken',
        userId : 1,
        account : 'user1',
        nickname : 'nickname1',
        defaultPic : ''
    }})
}

export {interceptLoginFailureOnUserId, interceptLoginFailureOnPassword, interceptLoginSuccess}
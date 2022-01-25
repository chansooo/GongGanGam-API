const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
exports.getTest = async function (req, res) {
    return res.send(response(baseResponse.SUCCESS))
}

/**
 * API No. 4
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/users
 */
exports.postUsers = async function (req, res) {

    /**
     * Body: nickname, birthYear, gender
     */
    const {nickname, birthYear, gender} = req.body;

    // 빈 값 체크
    if (!nickname)
        return res.send(response(baseResponse.USER_USERID_EMPTY));

    if (!birthYear)
        return res.send(response(baseResponse.USER_BIRTHYEAR_EMPTY));

    if (!gender)
        return res.send(response(baseResponse.USER_GENDER_EMPTY));
    //길이 체크
    if (nickname.length > 45)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH))

    // createUser 함수 실행을 통한 결과 값을 signUpResponse에 저장
    const signUpResponse = await userService.createUser(
        nickname,
        birthYear,
        gender
    );

    // signUpResponse 값을 json으로 전달
    return res.send(signUpResponse);
};

/**
 * API No. 5
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/users/:userIdx
 * path variable : userIdx
 * body : nickname, birthYear, gender
 */
exports.patchUsers = async function (req, res) {


    const userIdx = req.params.userIdx;
    const {nickname,birthYear,gender} = req.body;

    // JWT는 이 후 주차에 다룰 내용
    if (!nickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

    const editUserInfo = await userService.editUser(userIdx, nickname, birthYear, gender);
    return res.send(editUserInfo);

};


/**
 * API No. 6
 * API Name : 특정 유저 조회 API
 * [GET] /app/users/:userIdx
 */
exports.getUserById = async function (req, res) {

    /**
     * Path Variable: userIdx
     */
    const userIdx = req.params.userIdx;
    if (!userIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    // userId를 통한 유저 검색 함수 호출 및 결과 저장
    const userByUserIdx = await userProvider.retrieveUser(userIdx);
    return res.send(response(baseResponse.SUCCESS, userByUserIdx));
};

exports.patchUsers = async function (req, res) {


    const userIdx = req.params.userIdx;
    const nickname = req.body.nickname;
    const birthYear = req.body.birthYear;
    const age = req.body.age;
    const gender = req.body.gender;


    if (!nickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));
    const editUserInfo = await userService.editUser(nickname, birthYear, gender,userIdx);
    return res.send(editUserInfo);

};

/**
 * API No. 7
 * API Name : 탈퇴하기 API
 * [PATCH] /app/users/:userIdx/status
 * Path Variable : userIdx, status
 * body : status
 */
exports.patchUsersStatus = async function (req, res) {


    const userIdx = req.params.userIdx;
    const status = req.body.status;



    if (!status) return res.send(errResponse(baseResponse.USER_STATUS_EMPTY));
    const editUserStatus = await userService.editUserStatus(userIdx,status);
    return res.send(editUserStatus);

};

/**
 * API No. 9
 * API Name : 받은 일기 알림 설정
 * [PATCH] /app/users/:userIdx/push/diary
 * path variable : userIdx, diary
 * body : diaryPush
 */
exports.patchDiaryPush = async function (req, res) {


    const userIdx = req.params.userIdx;
    const diaryPush = req.body.diaryPush;


    // JWT는 이 후 주차에 다룰 내용
    if (!diaryPush) return res.send(errResponse(baseResponse.USER_DIARY_PUSH_EMPTY));

    const editDiaryPush = await userService.editDiaryPush(userIdx, diaryPush);
    return res.send(editDiaryPush);

};

/** API No. 10
 * API Name : 받은 답장 알림 설정
 * [PATCH] /app/users/:userIdx/push/answer
 * path variable : userIdx, answer
 * body : diaryPush
 */
exports.patchPushAnswer = async function (req, res) {


    const userIdx = req.params.userIdx;
    const answerPush = req.body.answerPush;


    if (!answerPush) return res.send(errResponse(baseResponse.USER_ANSWER_PUSH_EMPTY));

    const editAnswerPush = await userService.editDiaryPush(userIdx, answerPush);
    return res.send(editAnswerPush);

};

/** API No. 11
 * API Name : 받은 채팅 알림 설정
 * [PATCH] /app/users/:userIdx/push/chat
 * path variable : userIdx, chat
 * body : chatPush
 */

exports.patchPushChat = async function (req, res) {


    const userIdx = req.params.userIdx;
    const chatPush = req.body.chatPush;


    if (!chatPush) return res.send(errResponse(baseResponse.USER_CHAT_PUSH_EMPTY));

    const editChatPush = await userService.editChatPush(userIdx, chatPush);
    return res.send(editChatPush);

};






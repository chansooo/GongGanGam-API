
module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0. 테스트 API
    app.get('/app/test', user.getTest)

    // 4. 유저 생성 (회원가입) API
    app.post('/app/users', user.postUsers);

    // 5. 회원 정보 수정 API
    app.patch('/app/users/:userIdx', user.patchUsers);

    // 6. 특정 유저 조회 API
    app.get('/app/users/:userIdx', user.getUserById);

    // 7. 탈퇴하기 API
    app.patch('/app/users/:useIdx/status', user.patchUsersStatus);

    // 9. 받은 일기 알림 설정
    app.patch('/app/users/:userIdx/push/diary', user.patchDiaryPush);

    // 10. 받은 답장 알림 설정
    app.patch('/app/users/:userIdx/push/answer', user.patchPushAnswer);

    // 11. 받은 채팅 알림 설정
    app.patch('/app/users/:userIdx/push/chat', user.patchPushChat);



};
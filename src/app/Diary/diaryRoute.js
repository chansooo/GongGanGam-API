module.exports = function(app){
    const diary = require('./diaryController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 12. 받은 일기 리스트 조회 API
    app.get('/app/diarys/share', diary.getSharedDiarys);

    // 13. 받은 답장 리스트 조회 API
    app.get('/app/diarys/answer', diary.getAnswerList);

    // 14. 받은 일기 조회 API
    app.get('/app/diarys/share/:diaryIdx', diary.getSharedDiaryDetail);

    // 15. 받은 답장 조회 API
    app.get('/app/diarys/answer/:diaryIdx', diary.getAnswer);

    // 16. 나의 다이어리 조회(캘린더 - 이모티콘) API
    app.get('/app/diarys', diary.getDiarys);

    // 17. 그날의 다이어리 조회 API
    app.get('/app/diarys/detail', diary.getDiaryDetail);

    // 18. 다이어리 쓰기 & 공유하기 API
    app.post('/app/diarys', diary.postDiary);

    // 19. 답장하기 API
    app.post('/app/diarys/answer', diary.postAnswer);

    // 20. 다이어리 삭제하기 API
    app.patch('/app/diarys/:diaryIdx/status', diary.patchDiaryStatus);

    // 21. 다이어리 수정하기 API
    app.patch('/app/diarys/:diaryIdx', diary.patchDiary);

};


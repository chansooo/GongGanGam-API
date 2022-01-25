
// 해당 달의 이모티콘들 조회
async function selectMonthDiary(connection, params) {
    const selectMonthDiaryQuery = `
        select date_format(diaryDate, '%e') as day, emoji
        from Diary
        where userIdx=1 and year(diaryDate) - ? = 0 and month(diaryDate) - ? =0  and status = 'ACTIVE'
        order by diaryDate;
    `;
    const [monthRows] = await connection.query(selectMonthDiaryQuery, params);
    return monthRows;
}

// 그날의 다이어리 가져오기
async function selectDiary(connection, params) {
    const selectDeliveryQuery = `
        select diaryIdx, emoji, date_format(updatedAt, '%Y년 %c월 %e일') as diaryDate, contents, imgUrl as image
        from Diary
        where userIdx=1 and year(diaryDate) - ? = 0 and month(diaryDate) - ? =0
          and day(diaryDate) - ? = 0  and status = 'ACTIVE';
                `;
    const [diaryInfo] = await connection.query(selectDeliveryQuery, params);
    return diaryInfo;
}

// 그날의 다이어리에서 그 다이어리의 답장 가져오기
async function selectDiaryAnswer(connection, diaryIdx) {
    const selectDeliveryQuery = `
        select answerIdx, answerUserIdx as userIdx, nickname, profImg as userProfImg,
               date_format(User.updatedAt, '%y.%m.%d') as answerTime, answerContents
        from Answer join User on answerUserIdx=User.userIdx
        where diaryIdx=?;
                `;
    const [diaryInfo] = await connection.query(selectDeliveryQuery, diaryIdx);
    return diaryInfo;
}


// 공유된 다이어리 리스트 조회(최종)
async function selectShareDiaryList(connection, userIdx) {
    const selectAnswerQuery = `
        select DiaryShare.diaryIdx, Diary.userIdx, nickname as userNickname, profImg as userProfImg, contents as diaryContents,
               date_format(diaryDate, '%y.%m.%d') as diaryDate, isRead
        from DiaryShare join Diary on Diary.diaryIdx=DiaryShare.diaryIdx
                        join User on Diary.userIdx = User.userIdx
        where shareUserIdx=? order by diaryDate;
                `;
    const [diaryInfo] = await connection.query(selectAnswerQuery, userIdx);
    return diaryInfo;
}

// 공유된 다이어리 가져오기(최종)
async function selectShareDiary(connection, diaryIdx) {
    const selectDeliveryQuery = `
        select Diary.userIdx, nickname as userNickname, profImg as userProfImg, diaryIdx,
               date_format(diaryDate, '%Y년 %c월 %e일') as diaryDate, contents as diaryContent, imgUrl as diaryImg
        from Diary join User on Diary.userIdx=User.userIdx
        where diaryIdx=?;
                `;
    const [diaryInfo] = await connection.query(selectDeliveryQuery, diaryIdx);
    return diaryInfo;
}

// 받은 답장 리스트 가져오기
async function selectAnswer(connection, userIdx) {
    const selectAnswerQuery = `
        select answerIdx, User.userIdx, nickname as userNickname, profImg as userProfImg, answerContents,
               date_format(Answer.updatedAt, '%y.%m.%d') as answerDate, isRead
        from Answer join Diary on Diary.diaryIdx=Answer.diaryIdx
                    join User on Diary.userIdx = User.userIdx
        where answerUserIdx=? order by Answer.updatedAt;
                `;
    const [diaryInfo] = await connection.query(selectAnswerQuery, userIdx);
    return diaryInfo;
}

// 받은 답장 가져오기
async function selectAnswerDetail(connection, params) {
    const selectDeliveryQuery = `
        select answerIdx, User.userIdx, nickname as userNickname, profImg as userProfImg,
               date_format(Answer.updatedAt, '%Y년 %c월 %e일') as answerDate, answerContents
        from Answer join Diary on Diary.diaryIdx=Answer.diaryIdx
                    join User on Diary.userIdx = User.userIdx
        where Answer.diaryIdx=? and answerUserIdx=? and Answer.status='ACTIVE';
                `;
    const [diaryInfo] = await connection.query(selectDeliveryQuery, params);
    return diaryInfo;
}

// 다이어리 조회(답장 조회)
async function selectDiaryInfo(connection, diaryIdx) {
    const selectAnswerQuery = `
        select diaryIdx, emoji, date_format(diaryDate, '%Y년 %c월 %e일') as diaryDate, contents as diaryContent
        from Diary
        where diaryIdx = ?;
                `;
    const [diaryInfo] = await connection.query(selectAnswerQuery, diaryIdx);
    return diaryInfo;
}


// 랜덤의 유저 가져오기
async function selectRandUser(connection, userIdx) {
    const selectDeliveryQuery = `
        select userIdx
        from User
        where userIdx != ?
        order by rand() limit 1;
                `;
    const [diaryInfo] = await connection.query(selectDeliveryQuery, userIdx);
    return diaryInfo;
}

// 유저 생성
async function insertDiary(connection, insertDiaryParams) {
    const insertDiaryQuery = `
        INSERT INTO Diary(userIdx, diaryDate, emoji, contents, shareAgree)
        VALUES (?, ?, ?, ?, ?);
    `;
    const insertHeartRow = await connection.query(
        insertDiaryQuery,
        insertDiaryParams
    );

    return insertHeartRow;
}

// 답장하기
async function insertAnswer(connection, insertAnswerParams) {
    const insertAnswerQuery = `
        INSERT INTO Answer(diaryIdx, answerUserIdx, answerContents)
        VALUES (?, ?, ?);
    `;
    const insertAnswerRow = await connection.query(
        insertAnswerQuery,
        insertAnswerParams
    );

    return insertAnswerRow;
}

// 다이어리 status를 F로 수정하기
async function updateDiaryStatus(connection, diaryIdx) {
    const params = ['INACTIVE', diaryIdx];
    const updateReviewQuery = `
        UPDATE Diary 
        SET status = ?
        WHERE diaryIdx = ?;`;
    const updateUserRow = await connection.query(updateReviewQuery, params);
    return updateUserRow[0];
}

// 다이어리 수정하기
async function updateDiary(connection, params) {
    const updateReviewQuery = `
        UPDATE Diary 
        SET diaryDate = ?, emoji = ?, contents = ?, shareAgree = ?, status = ?
        WHERE diaryIdx = ?;`;
    const updateUserRow = await connection.query(updateReviewQuery, params);
    return updateUserRow[0];
}

// 존재하는 사용자인지 확인
async function checkUserExists(connection, userIdx) {
    const selectUserQuery = `
        select userIdx
        from User
        where userIdx=?;
                `;
    const [diaryInfo] = await connection.query(selectUserQuery, userIdx);
    return diaryInfo;
}

// 존재하는 다이어리인지 확인
async function checkDiaryExists(connection, diaryIdx) {
    const selectUserQuery = `
        select diaryIdx, userIdx
        from Diary
        where diaryIdx=?;
                `;
    const [diaryInfo] = await connection.query(selectUserQuery, diaryIdx);
    return diaryInfo;
}

module.exports = {
    selectMonthDiary, selectDiary, selectDiaryAnswer,
    insertDiary, updateDiaryStatus, checkUserExists, checkDiaryExists, selectAnswer,
    selectAnswerDetail, insertAnswer, selectRandUser, updateDiary,
    selectShareDiaryList, selectShareDiary, selectDiaryInfo
};

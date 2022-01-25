const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const diaryDao = require("./diaryDao");

// Provider: Read 비즈니스 로직 처리


exports.retrieveMonthList = async function (year, month) {
    const params = [year, month];
    const connection = await pool.getConnection(async (conn) => conn);
    const monthList = await diaryDao.selectMonthDiary(connection, params);

    connection.release();

    return monthList;
};

exports.retrieveDiary = async function (year, month, day) {
    const params = [year, month, day];
    const connection = await pool.getConnection(async (conn) => conn);
    const diary = await diaryDao.selectDiary(connection, params);

    if (!diary) {
        console.log(diary)
        const diaryAnswer = await diaryDao.selectDiaryAnswer(connection, diary[0].diaryIdx);
        console.log(diaryAnswer)
        diary[0].answer = diaryAnswer[0];
    }

    connection.release();

    return diary;
};

exports.retrieveSharedDiaryList = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const shareList = await diaryDao.selectShareDiaryList(connection, userIdx);
    const shareResult = {'diarys' : shareList}

    connection.release();

    return shareResult;
};

exports.retrieveSharedDiary = async function (diaryIdx) {

    const connection = await pool.getConnection(async (conn) => conn);
    const shareList = await diaryDao.selectShareDiary(connection, diaryIdx);

    connection.release();

    return shareList;
};

exports.retrieveAnswerList = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const answerList = await diaryDao.selectAnswer(connection, userIdx);

    connection.release();

    return answerList;
};

exports.retrieveAnswer = async function (diaryIdx, userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);

    const diary = await diaryDao.selectDiaryInfo(connection, diaryIdx);
    const params = [diaryIdx, userIdx];
    const answer = await diaryDao.selectAnswerDetail(connection, params);
    const result = {'diary' : diary, 'answer' : answer};

    connection.release();

    return result;
};

exports.checkUser = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const user = await diaryDao.checkUserExists(connection, userIdx);

    connection.release();

    return user;
};

exports.checkDiary = async function (diaryIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const diary = await diaryDao.checkDiaryExists(connection, diaryIdx);

    connection.release();

    return diary;
};
const jwtMiddleware = require("../../../config/jwtMiddleware");
const diaryProvider = require("../../app/Diary/diaryProvider");
const diaryService = require("../../app/Diary/diaryService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const formidable = require('formidable')
const fs = require('fs');

/**
 * API No. 12
 * API Name : 받은 일기 리스트 조회 API
 * [GET] /app/diarys/share
 */
exports.getSharedDiarys = async function (req, res) {

    const userIdx = 1;
    const sharedDiaryResult = await diaryProvider.retrieveSharedDiaryList(userIdx);
    return res.send(response(baseResponse.SUCCESS, sharedDiaryResult));

};

/**
 * API No. 13
 * API Name : 받은 답장 리스트 조회 API
 * [GET] /app/diarys/answer
 */
exports.getAnswerList = async function (req, res) {
    const userIdx = 1;

    const answerResult = await diaryProvider.retrieveAnswerList(userIdx);
    return res.send(response(baseResponse.SUCCESS, answerResult));

};

/**
 * API No. 14
 * API Name : 받은 일기 조회 API
 * [GET] /app/diarys/share/:diaryIdx
 */
exports.getSharedDiaryDetail = async function (req, res) {

    const diaryIdx = req.params.diaryIdx;
    const userIdx = 1;

    //if (!diaryIdx) return res.send(errResponse(baseResponse.DIARY_DIARYIDX_EMPTY));

    const sharedDiaryResult = await diaryProvider.retrieveSharedDiary(diaryIdx, userIdx);
    if (sharedDiaryResult.length<1) return res.send(errResponse(baseResponse.DIARY_DIARYIDX_NOT_EXIST));
    return res.send(response(baseResponse.SUCCESS, sharedDiaryResult));

};

/**
 * API No. 15
 * API Name : 받은 답장 조회 API
 * [GET] /app/diarys/answer/:diaryIdx
 */
exports.getAnswer = async function (req, res) {

    const diaryIdx = req.params.diaryIdx;
    const userIdx = 1;

    //if (!diaryIdx) return res.send(errResponse(baseResponse.DIARY_DIARYIDX_EMPTY));

    // 존재하는 유저인지 확인
    const userCheckResult = await diaryProvider.checkUser(userIdx);
    if (userCheckResult.length<1) return res.send(errResponse(baseResponse.USER_NOT_EXIST));
    // 존재하는 다이어리인지 확인
    const diaryCheckResult = await diaryProvider.checkDiary(diaryIdx);
    if (diaryCheckResult.length<1) return res.send(errResponse(baseResponse.DIARY_DIARYIDX_NOT_EXIST));
    // 내가 받은 다이어리인지 확인
    if (diaryCheckResult[0].userIdx != userIdx) return res.send(errResponse(baseResponse.ANSWER_USERIDX_INVALID));

    const answerResult = await diaryProvider.retrieveAnswer(diaryIdx, userIdx);
    if (answerResult.answer.length<1) return res.send(errResponse(baseResponse.ANSWER_EMPTY));
    return res.send(response(baseResponse.SUCCESS, answerResult));

};

/**
 * API No. 16
 * API Name : 나의 다이어리 조회(캘린더 - 이모티콘) API
 * [GET] /app/diary?year=&month=
 */
exports.getDiarys = async function (req, res) {

    /**
     * Query String: year, month
     */
    const year = req.query.year;
    const month = req.query.month;

    if (!year) return res.send(errResponse(baseResponse.DIARY_YEAR_EMPTY));
    if (!month) return res.send(errResponse(baseResponse.DIARY_MONTH_EMPTY))

    const monthDiaryResult = await diaryProvider.retrieveMonthList(year, month);
    return res.send(response(baseResponse.SUCCESS, monthDiaryResult));

};


/**
 * API No. 17
 * API Name : 그날의 다이어리 조회 API
 * [GET] /app/diary/detail?year=&month=&day=
 */
exports.getDiaryDetail = async function (req, res) {

    /**
     * Query String: year, month, day
     */
    const year = req.query.year;
    const month = req.query.month;
    const day = req.query.day;

    if (!year) return res.send(errResponse(baseResponse.DIARY_YEAR_EMPTY));
    if (!month) return res.send(errResponse(baseResponse.DIARY_MONTH_EMPTY));
    if (!day) return res.send(errResponse(baseResponse.DIARY_DAY_EMPTY));

    const diaryResult = await diaryProvider.retrieveDiary(year, month, day);
    return res.send(response(baseResponse.SUCCESS, diaryResult));

};

/**
 * API No. 18
 * API Name : 다이어리 쓰기 &공유하기 API
 * [POST] /app/diarys
 */
exports.postDiary = async function (req, res) {

    /**
     * Body: emoji, date, content, shareAgree
     */

    const {emoji, year, month, day, content, shareAgree} = req.body;

    const userIdx = 1;

    if (!year) return res.send(errResponse(baseResponse.DIARY_YEAR_EMPTY));
    if (!month) return res.send(errResponse(baseResponse.DIARY_MONTH_EMPTY));
    if (!day) return res.send(errResponse(baseResponse.DIARY_DAY_EMPTY));

    let date = year;
    //if (!req.files) console.log('no file');
    //else console.log(req.files.uploadFile);

    if (month < 10) {
        date = date + '-0' +month;
        if (day < 10) date = date + '-0' + day;
        else date = date + '-' + day;
    } else {
        date = date + '-' + month;
        if (day < 10) date = date + '-0' + day;
        else date = date + '-' + day;
    }

    console.log(date);


    // 사진 있으면 S3에 사진 올리고 그 링크도 넣기.. 사진 있는 경우와 없는 경우도 나눠서?
    // Service에서 다이어리 만들고 shareAgree가 T면 DiaryShare에 추가해주기 (Transaction 사용해서)
    const postdiaryResponse = await diaryService.createDiary(userIdx, date, emoji, content, shareAgree);
    return res.send(postdiaryResponse);

};

/**
 * API No. 10
 * API Name : 다이어리 답장하기 API
 * [POST] /app/diarys/answer
 */
exports.postAnswer = async function (req, res) {

    /**
     * Body: content, diaryIdx
     */

    const {content, diaryIdx} = req.body;

    const userIdx = 1;

    const postAnswerResponse = await diaryService.createAnswer(userIdx, diaryIdx, content);
    return res.send(postAnswerResponse);

};

/**
 * API No. 20
 * API Name : 다이어리 삭제하기 API
 * [POST] /app/diarys/:diaryIdx/status
 */
exports.patchDiaryStatus = async function (req, res) {

    /**
     * Body: emoji, date, content, shareAgree
     */

    const diaryIdx = req.params.diaryIdx;
    const userIdx = 1;

    const patchdiaryResponse = await diaryService.updateDiaryStatus(userIdx, diaryIdx);
    return res.send(patchdiaryResponse);

};

/**
 * API No. 21
 * API Name : 다이어리 수정하기 API
 * [POST] /app/diarys/:diaryIdx
 */
exports.patchDiary = async function (req, res) {

    /**
     * Body: emoji, date, content, shareAgree
     */

    const diaryIdx = req.params.diaryIdx;
    const {emoji, year, month, day, content, shareAgree} = req.body;

    if (!year) return res.send(errResponse(baseResponse.DIARY_YEAR_EMPTY));
    if (!month) return res.send(errResponse(baseResponse.DIARY_MONTH_EMPTY));
    if (!day) return res.send(errResponse(baseResponse.DIARY_DAY_EMPTY));

    let date = year;

    if (month < 10) {
        date = date + '-0' +month;
        if (day < 10) date = date + '-0' + day;
        else date = date + '-' + day;
    } else {
        date = date + '-' + month;
        if (day < 10) date = date + '-0' + day;
        else date = date + '-' + day;
    }
    const userIdx = 1;

    const patchdiaryResponse = await diaryService.updateDiary(diaryIdx, userIdx, date, emoji, content, shareAgree);
    return res.send(patchdiaryResponse);

};
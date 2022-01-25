
// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
    INSERT INTO User(nickname, birthYear, gender)
    VALUES (?, ?, ?);
  `;
  const insertUserInfoRow = await connection.query(
      insertUserInfoQuery,
      insertUserInfoParams
  );

  return insertUserInfoRow;
}

// 모든 유저 조회
async function selectUser(connection) {
  const selectUserListQuery = `
    SELECT nickname,birthYear, gender
    FROM User;
  `;
  const [userRows] = await connection.query(selectUserListQuery);
  return userRows;
}

// 닉네임으로 회원 조회
async function selectUserNickname(connection, nickname) {
  const selectUserNicknameQuery = `
    SELECT nickname
    FROM User
    WHERE nickname=?;
  `;
  const [nicknameRows] = await connection.query(selectUserNicknameQuery, nickname);
  return nicknameRows;
}

// userId 회원 조회
async function selectUserId(connection, userIdx) {
  const selectUserIdQuery = `
    SELECT  nickname, birthYear, diaryPush, answerPush, chatPush, profImg
    FROM User
           LEFT JOIN Push ON Push.useridx=User.useridx
    WHERE User.userIdx = ?;
  `;
  const [userRow] = await connection.query(selectUserIdQuery, userIdx);
  return userRow;
}


// 패스워드 체크

async function selectUserPassword(connection, selectUserPasswordParams) {
  const selectUserPasswordQuery = `
    SELECT email, nickname, password
    FROM User
    WHERE email = ? AND password = ?;`;
  const selectUserPasswordRow = await connection.query(
      selectUserPasswordQuery,
      selectUserPasswordParams
  );

  return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, email) {
  const selectUserAccountQuery = `
    SELECT status, id
    FROM User
    WHERE email = ?;`;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      email
  );
  return selectUserAccountRow[0];
}


async function updateUserInfo(connection,nickname, birthYear, gender,userIdx ) {
  const updateUserQuery = `
    UPDATE User
    SET nickname=?, birthYear=?, gender=?
    WHERE userIdx = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [nickname,birthYear, gender, userIdx]);
  return updateUserRow[0];
}

async function updateUserStatus(connection,  userIdx, status) {
  const updateUserStatusQuery = `
    UPDATE User
    SET status = 'INACTIVE'
    WHERE userIdx = ?;`;
  const updateUserStatusRow = await connection.query(updateUserStatusQuery, [status, userIdx]);
  return updateUserStatusRow[0];
}

async function updateDiaryPush(connection, userIdx, diaryPush) {

  const updateDiaryPushQuery = `
    UPDATE Push
    SET diaryPush = ?
    WHERE userIdx = ?;`;
  const updateDiaryPushRow = await connection.query(updateDiaryPushQuery,[diaryPush, userIdx]);
  return updateDiaryPushRow[0];
}

async function updateAnswerPush(connection, userIdx, answerPush){
  const updateAnswerPushQuery = `
    UPDATE Push
    SET answerPush = ?
    WHERE userIdx = ?;`;
  const updateAnswerPushRow = await connection.query(updateAnswerPushQuery,[answerPush, userIdx]);
  return updateAnswerPushRow[0];
}

async function updateChatPush(connection, userIdx, chatPush){
  const updateChatPushQuery = `
    UPDATE Push
    SET chatPush = ?
    WHERE userIdx = ?;`;
  const updateChatPushRow = await connection.query(updateChatPushQuery,[chatPush, userIdx]);
  return updateChatPushRow[0];
}

module.exports = {
  selectUser,
  selectUserNickname,
  selectUserId,
  insertUserInfo,
  selectUserPassword,
  selectUserAccount,
  updateUserInfo,
  updateUserStatus,
  updateDiaryPush,
  updateAnswerPush,
  updateChatPush,
};

let sessionModel;

module.exports = (injectedSessionModel) => {

  sessionModel = injectedSessionModel;


  return {

      saveAccessToken: saveAccessToken,
      getSessionFromBearerToken: getSessionFromBearerToken

  }
}

async function saveAccessToken(accessToken, username, expires){

  await sessionModel.create({
    username: username,
    access_token: accessToken,
    expires: expires,
  })
  .catch(err => {
    console.log('save access token ' + err);
  });
}

async function getSessionFromBearerToken(accessToken){

  session = await sessionModel.findOne({
    where: {
      access_token: accessToken
    }
  });

  return session;
}

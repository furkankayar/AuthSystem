const Op = require('sequelize').Op
let accountModel;
let resetTokenModel;
let bcrypt;
let crypto;
let nodemailer;


module.exports = (injectedAccountModel, injectedResetTokenModel, injectedBcrypt, injectedCrypto, injectedNodemailer) => {

  accountModel = injectedAccountModel;
  resetTokenModel = injectedResetTokenModel;
  bcrypt = injectedBcrypt;
  crypto = injectedCrypto;
  nodemailer = injectedNodemailer;

  return {
      registerAccount: registerAccount,
      getAccountFromCredentials: getAccountFromCredentials,
      getAccountByUsername: getAccountByUsername,
      checkUsername: checkUsername,
      checkEmail: checkEmail,
      forgotPassword: forgotPassword,
      checkResetToken: checkResetToken,
      setNewPassword: setNewPassword
  }
}

async function setNewPassword(req, res){

  const password = req.body.password;
  const token = req.body.token;
  let tokenModel = null;
  let username = null;
  let account = null;
  let hash = null;

  if (!isString(token) || !isString(password)){
    return sendResponse(res, "Missing token or password", true);
  }

  try{
    tokenModel = await resetTokenModel.findOne({
      where: {
        reset_token: token,
        expires: {
          [Op.gt]: Date.now()
        }
      }
    });
  }
  catch(err){
    return sendResponse(res, "Database error has occured", true);
  }

  if(tokenModel === null){
    return sendResponse(res, "Token is not valid or expired", true);
  }

  hash = bcrypt.hashSync(tokenModel.username + password, bcrypt.rounds);

  try{
    account = await accountModel.findOne({
      where: {
        username: tokenModel.username
      }
    });

    if(account === null){
      return sendResponse(res, "Account that have this token is not found", true);
    }

    await account.update({
      password_key: hash
    });

    return sendResponse(res, "Password has been updated", false);
  }
  catch(err){
    return sendResponse(res, "Database error has occured", true);
  }
}

async function checkResetToken(req, res){

  const token = req.body.token;
  let tokenModel = null;

  if (!isString(token)) {
    return sendResponse(res, "Missing token", true);
  }

  try{
    tokenModel = await resetTokenModel.findOne({
      where: {
        reset_token: token,
        expires: {
          [Op.gt]: Date.now()
        }
      }
    });
  }
  catch(err){
    return sendResponse(res, "Database error has occured", true);
  }

  if(tokenModel === null){
    return sendResponse(res, "Token is not valid or expired", true);
  }

  return sendResponse(res, "Token is valid", false);
}

async function forgotPassword(req, res){

  const email = req.body.email;
  let account = null;
  let token = null;

  if(!isString(email)){
    return sendResponse(res, "Email required", true);
  }

  try{
   account = await accountModel.findOne({
      where: {
        email: email,
      }
    });
  }
  catch(err){
    return sendResponse(res, "Database error has occured", true);
  }

  if(account === null){
    return sendResponse(res, "Email has not been found", true);
  }


  token = crypto.randomBytes(50).toString('hex');

  try{
    await resetTokenModel.create({
      username: account.username,
      reset_token: token,
      expires: Date.now() + 3600000
    });
  }
  catch(err){
    return sendResponse(res, "Database error has occured", true);
  }


  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth:{
      user: 'dbms.info.test@gmail.com', // STORE AS Process.ENV
      pass: '123123123Db'
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: 'dbms.info.test@gmail.com',
    to: `${account.email}`,
    subject: `Reset password`,
    text: `Reset password link: http://localhost:8080/#/pages/recover_password/${token}\n`
  };

  try{
    await transporter.sendMail(mailOptions, (err, response) => {
      if(err){
        return sendResponse(res, "Error occured while sending email", true);
      }
      else{
        return sendResponse(res, "Recovery email sent", false);
      }
    });
  }
  catch(err){
    return sendResponse(res, "Error occured while sending email", false);
  }
}

async function getAccountFromCredentials(username, password){

  let account = await accountModel.findOne({
    where: {
      username: username
    }
  });

  if(account != null && bcrypt.compareSync(username + password, account.password_key)){
    return account;
  }

  return null;
}

async function getAccountByUsername(username){

  let account = null

  try{
    account = await accountModel.findOne({
      where: {
        username: username
      }
    });
  }
  catch(err){
    console.log(err);
  }
  return account;
}

async function registerAccount(req, res){

  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  if(!isString(username) || !isString(password) || !isString(email)){

    return sendResponse(res, "Invalid Credentials", true);
  }

  try{
    let hash = bcrypt.hashSync(username + password, bcrypt.rounds);
    await accountModel.create({
      username: username,
      password_key: hash,
      email: email
    });
  }
  catch(err){
    return sendResponse(res, "Registration failed",{
      name: err.name,
    });
  }

  return sendResponse(res, "Registration successful", null);
}

async function checkUsername(req, res){

  const username = req.body.username;
  let account = null;

  if(!isString(username)){

    return sendResponse(res, "Invalid username", true);
  }

  try{
     account = await accountModel.findOne({
      where: {
        username: username
      }
    });
  }
  catch(err){
    return sendResponse(res, "An error occured", true);
  }

  if(account != null){
    return sendResponse(res, "Username exists", true);
  }

  return sendResponse(res, "Username available", false);
}

async function checkEmail(req, res){

  const email = req.body.email;
  let account = null;

  if(!isString(email)){

    return sendResponse(res, "Invalid email", true);
  }

  try{
    account = await accountModel.findOne({
      where: {
        email: email
      }
    });
  }
  catch(err){
    return sendResponse(res, "An error occured", true);
  }

  if(account != null){
    return sendResponse(res, "Email exists", true);
  }

  return sendResponse(res, "Email available", false);
}



function sendResponse(res, message, error){

  res
    .status(200)
    .json({
      'message': message,
      'error': error,
    })
}

function isString(parameter){

  return parameter != null && (typeof parameter === "string" || paramater instanceof String) ? true : false;
}

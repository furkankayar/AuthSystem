let accountLogModel;
let groupLogModel;
let groupPermissionLogModel;
let permissionLogModel;
let resetTokenLogModel;
let sessionLogModel;
let userLogModel;
let userPermissionLogModel;
let has_user_permissionView;

module.exports = (injectedAccountLogModel, injectedGroupLogModel, injectedGroupPermissionLogModel, injectedPermissionLogModel, injectedResetTokenLogModel, injectedSessionLogModel, injectedUserLogModel, injectedUserPermissionLogModel, injectedHas_user_permissionModel) => {

  accountLogModel = injectedAccountLogModel;
  groupLogModel = injectedGroupLogModel;
  groupPermissionLogModel = injectedGroupPermissionLogModel;
  permissionLogModel = injectedPermissionLogModel;
  resetTokenLogModel = injectedResetTokenLogModel;
  sessionLogModel = injectedSessionLogModel;
  userLogModel = injectedUserLogModel;
  userPermissionLogModel = injectedUserPermissionLogModel;
  has_user_permissionView = injectedHas_user_permissionModel;

  return {
      getAccountLogs: getAccountLogs,
      getGroupLogs: getGroupLogs,
      getGroupPermissionLogs: getGroupPermissionLogs,
      getPermissionLogs: getPermissionLogs,
      getResetTokenLogs: getResetTokenLogs,
      getSessionLogs: getSessionLogs,
      getUserLogs: getUserLogs,
      getUserPermissionLogs: getUserPermissionLogs
  }
}

async function getAccountLogs(req, res){

  const endpoint = '/read_account_log';
  const token = req.headers.authorization.substr(7);
  let result;
  let account_logs;

  if(!isString(token) || !isString(endpoint)){
    return sendResponse(res, "Invalid token or endpoint", true);
  }

  try{
    result = await has_user_permissionView.findOne({
      where: {
        access_token: token,
        api_endpoint: endpoint
      }
    });
  }
  catch(err){
    return sendResponse(res, "Database error occured", true);
  }

  if(result === null){
    return sendResponse(res, "Unauthorized access", true);
  }

  if(result.access_token !== token || result.api_endpoint !== endpoint){
    return sendResponse(res, "Unauthorized access", true);
  }

  try{
    account_logs = await accountLogModel.findAll(
      {
        order:[
          ['action_time', 'DESC']
        ],
        raw: true
      });
  }
  catch(err){
    return sendResponse(res, "Database error occured", true);
  }

  return sendResponse(res, account_logs, false);

}

async function getGroupLogs(req, res){

  const endpoint = '/read_group_log';
  const token = req.headers.authorization.substr(7);
  let result;
  let group_logs;

  if(!isString(token) || !isString(endpoint)){
    return sendResponse(res, "Invalid token or endpoint", true);
  }

  try{
    result = await has_user_permissionView.findOne({
      where: {
        access_token: token,
        api_endpoint: endpoint
      }
    });
  }
  catch(err){
    return sendResponse(res, "Database error occured", true);
  }

  if(result === null){
    return sendResponse(res, "Unauthorized access", true);
  }

  if(result.access_token !== token || result.api_endpoint !== endpoint){
    return sendResponse(res, "Unauthorized access", true);
  }

  try{
    group_logs = await groupLogModel.findAll(
      {
        order:[
          ['action_time', 'DESC']
        ],
        raw: true
      });
  }
  catch(err){
    return sendResponse(res, "Database error occured", true);
  }

  return sendResponse(res, group_logs, false);

}

async function getGroupPermissionLogs(req, res){

  const endpoint = '/read_group_permission_log';
  const token = req.headers.authorization.substr(7);
  let result;
  let group_permission_logs;

  if(!isString(token) || !isString(endpoint)){
    return sendResponse(res, "Invalid token or endpoint", true);
  }

  try{
    result = await has_user_permissionView.findOne({
      where: {
        access_token: token,
        api_endpoint: endpoint
      }
    });
  }
  catch(err){
    return sendResponse(res, "Database error occured", true);
  }

  if(result === null){
    return sendResponse(res, "Unauthorized access", true);
  }

  if(result.access_token !== token || result.api_endpoint !== endpoint){
    return sendResponse(res, "Unauthorized access", true);
  }

  try{
    group_permission_logs = await groupPermissionLogModel.findAll(
      {
        order:[
          ['action_time', 'DESC']
        ],
        raw: true
      });
  }
  catch(err){
    return sendResponse(res, "Database error occured", true);
  }

  return sendResponse(res, group_permission_logs, false);

}

async function getPermissionLogs(req, res){

  const endpoint = '/read_group_permission_log';
  const token = req.headers.authorization.substr(7);
  let result;
  let permission_logs;

  if(!isString(token) || !isString(endpoint)){
    return sendResponse(res, "Invalid token or endpoint", true);
  }

  try{
    result = await has_user_permissionView.findOne({
      where: {
        access_token: token,
        api_endpoint: endpoint
      }
    });
  }
  catch(err){
    return sendResponse(res, "Database error occured", true);
  }

  if(result === null){
    return sendResponse(res, "Unauthorized access", true);
  }

  if(result.access_token !== token || result.api_endpoint !== endpoint){
    return sendResponse(res, "Unauthorized access", true);
  }

  try{
    permission_logs = await permissionLogModel.findAll(
      {
        order:[
          ['action_time', 'DESC']
        ],
        raw: true
      });
  }
  catch(err){
    return sendResponse(res, "Database error occured", true);
  }

  return sendResponse(res, permission_logs, false);

}

async function getResetTokenLogs(req, res){

  const endpoint = '/read_reset_token_log';
  const token = req.headers.authorization.substr(7);
  let result;
  let reset_token_logs;

  if(!isString(token) || !isString(endpoint)){
    return sendResponse(res, "Invalid token or endpoint", true);
  }

  try{
    result = await has_user_permissionView.findOne({
      where: {
        access_token: token,
        api_endpoint: endpoint
      }
    });
  }
  catch(err){
    return sendResponse(res, "Database error occured", true);
  }

  if(result === null){
    return sendResponse(res, "Unauthorized access", true);
  }

  if(result.access_token !== token || result.api_endpoint !== endpoint){
    return sendResponse(res, "Unauthorized access", true);
  }

  try{
    reset_token_logs = await resetTokenLogModel.findAll(
      {
        order:[
          ['action_time', 'DESC']
        ],
        raw: true
      });
  }
  catch(err){
    return sendResponse(res, "Database error occured", true);
  }

  return sendResponse(res, reset_token_logs, false);

}

async function getSessionLogs(req, res){

  const endpoint = '/read_session_log';
  const token = req.headers.authorization.substr(7);
  let result;
  let session_logs;

  if(!isString(token) || !isString(endpoint)){
    return sendResponse(res, "Invalid token or endpoint", true);
  }

  try{
    result = await has_user_permissionView.findOne({
      where: {
        access_token: token,
        api_endpoint: endpoint
      }
    });
  }
  catch(err){
    return sendResponse(res, "Database error occured", true);
  }

  if(result === null){
    return sendResponse(res, "Unauthorized access", true);
  }

  if(result.access_token !== token || result.api_endpoint !== endpoint){
    return sendResponse(res, "Unauthorized access", true);
  }

  try{
    session_logs = await sessionLogModel.findAll(
      {
        order:[
          ['action_time', 'DESC']
        ],
        raw: true
      });
  }
  catch(err){
    return sendResponse(res, "Database error occured", true);
  }

  return sendResponse(res, session_logs, false);

}

async function getUserLogs(req, res){

  const endpoint = '/read_user_log';
  const token = req.headers.authorization.substr(7);
  let result;
  let user_logs;

  if(!isString(token) || !isString(endpoint)){
    return sendResponse(res, "Invalid token or endpoint", true);
  }

  try{
    result = await has_user_permissionView.findOne({
      where: {
        access_token: token,
        api_endpoint: endpoint
      }
    });
  }
  catch(err){
    return sendResponse(res, "Database error occured", true);
  }

  if(result === null){
    return sendResponse(res, "Unauthorized access", true);
  }

  if(result.access_token !== token || result.api_endpoint !== endpoint){
    return sendResponse(res, "Unauthorized access", true);
  }

  try{
    user_logs = await userLogModel.findAll(
      {
        order:[
          ['action_time', 'DESC']
        ],
        raw: true
      });
  }
  catch(err){
    return sendResponse(res, "Database error occured", true);
  }

  return sendResponse(res, user_logs, false);

}

async function getUserPermissionLogs(req, res){

  const endpoint = '/read_user_permission_log';
  const token = req.headers.authorization.substr(7);
  let result;
  let user_permission_logs;

  if(!isString(token) || !isString(endpoint)){
    return sendResponse(res, "Invalid token or endpoint", true);
  }

  try{
    result = await has_user_permissionView.findOne({
      where: {
        access_token: token,
        api_endpoint: endpoint
      }
    });
  }
  catch(err){
    return sendResponse(res, "Database error occured", true);
  }

  if(result === null){
    return sendResponse(res, "Unauthorized access", true);
  }

  if(result.access_token !== token || result.api_endpoint !== endpoint){
    return sendResponse(res, "Unauthorized access", true);
  }

  try{
    user_permission_logs = await userPermissionLogModel.findAll(
      {
        order:[
          ['action_time', 'DESC']
        ],
        raw: true
      });
  }
  catch(err){
    return sendResponse(res, "Database error occured", true);
  }

  return sendResponse(res, user_permission_logs, false);

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

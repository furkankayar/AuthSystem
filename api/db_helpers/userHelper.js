let userModel;
let has_user_permissionView;
let account_userView;
let user_permissionView;
let sequelize;

module.exports = (injectedUserModel, injectedHas_user_permissionView, injectedAccount_userView, injectedUser_permissionView, injectedSequelize) => {

  userModel = injectedUserModel;
  has_user_permissionView = injectedHas_user_permissionView;
  account_userView = injectedAccount_userView;
  user_permissionView = injectedUser_permissionView;
  sequelize = injectedSequelize;

  return {
      getUserById: getUserById,
      checkAccess: checkAccess,
      getUsers: getUsers,
      getUserByUserId: getUserByUserId,
      updateUser: updateUser,
      getUserPermissions: getUserPermissions,
      updateUserGroup: updateUserGroup
  }
}

async function getUserById(userId){

  let user = await userModel.findOne({
    where: {
      user_id: userId
    }
  });

  return user;
}

async function checkAccess(req, res){

  const endpoint = req.body.endpoint;
  const token = req.headers.authorization.substr(7);
  let result;

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
    return sendResponse(res, "Cannot access this endpoint", true);
  }

  if(result.access_token !== token || result.api_endpoint !== endpoint){
    return sendResponse(res, "Cannot access this endpoint", true);
  }

  return sendResponse(res, "Access granted", false);

}

async function getUsers(req, res){

  const endpoint = '/read_users';
  const token = req.headers.authorization.substr(7);
  let result;
  let users = [];

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
    return sendResponse(res, "Cannot access this endpoint", true);
  }

  if(result.access_token !== token || result.api_endpoint !== endpoint){
    return sendResponse(res, "Cannot access this endpoint", true);
  }
  try{
    users = await account_userView.findAll({
      raw: true
    });
  }
  catch(err){
    return sendResponse(res, "Database error occured", true);
  }

  sendResponse(res, users, false);
}

async function getUserByUserId(req, res){

  const endpoint = '/read_user';
  const token = req.headers.authorization.substr(7);
  const user_id = req.body.user_id;
  let result;
  let user;

  if(!isString(token) || !isString(endpoint) || !isString(user_id)){
    return sendResponse(res, "Invalid token, endpoint or user id", true);
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
    return sendResponse(res, "Cannot access this endpoint", true);
  }

  if(result.access_token !== token || result.api_endpoint !== endpoint){
    return sendResponse(res, "Cannot access this endpoint", true);
  }
  try{
    user = await account_userView.findOne({
      where: {
        'user_id': user_id
      },
      raw: true
    });
  }
  catch(err){
    return sendResponse(res, "Database error occured", true);
  }

  sendResponse(res, user, false);
}

async function updateUser(req, res){

  const endpoint = '/update_user';
  const token = req.headers.authorization.substr(7);
  const username = req.body.username;
  const email = req.body.email;
  const password_key = req.body.password_key;
  const is_active = req.body.is_active;
  const birthdate = req.body.birthdate;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const mobile = req.body.mobile;
  const address = req.body.address;
  const group_name = req.body.group_name;
  const new_user_permissions = req.body.user_permission === undefined ? [] : req.body.user_permission;
  const user_id = req.body.user_id;
  let user_permissions = [];
  let result;

  if(!isString(token) || !isString(endpoint) ||
     !isString(username) || !isString(email) ||
     !isString(password_key)  || !isString(mobile)  ||
     !isString(address) || !isString(is_active) ||
     !isString(birthdate) || !isString(first_name) ||
     !isString(last_name) || !isString(group_name) || !isString(user_id) || new_user_permissions === null){
    return sendResponse(res, "Invalid token, endpoint or data", true);
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
    return sendResponse(res, "Cannot access this endpoint", true);
  }

  if(result.access_token !== token || result.api_endpoint !== endpoint){
    return sendResponse(res, "Cannot access this endpoint", true);
  }
  try{
    await account_userView.update({
      email: email,
      password_key: password_key,
      is_active: is_active,
      first_name: first_name,
      last_name: last_name,
      mobile: mobile,
      address: address,
      group_name: group_name
    },
    {
      where: {
        username: username
      }
    });


    if(birthdate !== null && birthdate !== ''){
      await account_userView.update({
        birthdate: birthdate
      },{
        where: {
          username: username
        }
      });
    }

    // UPDATE PERMISSIONS
    user_permissions = await user_permissionView.findAll(
      {
        raw: true,
        where: {
          user_id: user_id
        }
      })

    new_user_permissions.forEach(async (permission) => {
      if (user_permissions.filter(p => p.permission_id == permission.permission_id).length <= 0) {
        if (permission.permission_id !== null){
          try{
            await user_permissionView.create({
              user_id: user_id,
              permission_id: permission.permission_id
            });
          }
          catch(err){
            console.log(err)
          }
        }
      }
    });

    user_permissions.forEach(async (permission) => {
      if (new_user_permissions.filter(p => p.permission_id == permission.permission_id).length <= 0) {
        if (permission.permission_id !== null){
          // console.log('remove ' + permission.permission_name);
          await user_permissionView.destroy({
            where: {
              user_id: user_id,
              permission_id: permission.permission_id
            }
          });
        }
      }
    });
  }
  catch(err){
    return sendResponse(res, "Database error occured", true);
  }

  sendResponse(res, "Update successful", false);
}

async function getUserPermissions(req, res){

  const endpoint = '/read_user_permissions';
  const token = req.headers.authorization.substr(7);
  const user_id = req.body.user_id;
  let result;
  let user_permissions = [];
  let all_permissions = [];

  if(!isString(token) || !isString(endpoint) || !isString(user_id)){
    return sendResponse(res, "Invalid token, endpoint or user id", true);
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

  if(!isString(token) || !isString(endpoint)){
    return sendResponse(res, "Invalid token or endpoint", true);
  }

  if(result.access_token !== token || result.api_endpoint !== endpoint){
    return sendResponse(res, "Unauthorized access", true);
  }

  try{
    all_permissions = (await sequelize.query('SELECT * FROM all_permissions_without_group_permissions('+ user_id +');',
      {
        raw: true
      }))[0];

    user_permissions = await user_permissionView.findAll({
      raw: true,
      where: {
        user_id: user_id
      }
    });
  }
  catch(err){
    return sendResponse(res, "Database error occured", true);
  }

  return sendResponse(res, { all_permissions: all_permissions, user_permission: user_permissions }, false);

}

async function updateUserGroup(req, res){

  const endpoint = '/update_user';
  const token = req.headers.authorization.substr(7);
  const group_name = req.body.group_name;
  const username = req.body.username;
  let result;

  if(!isString(token) || !isString(endpoint) || !isString(group_name) || !isString(username)){
    return sendResponse(res, "Invalid token, endpoint or data", true);
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
    return sendResponse(res, "Cannot access this endpoint", true);
  }

  if(result.access_token !== token || result.api_endpoint !== endpoint){
    return sendResponse(res, "Cannot access this endpoint", true);
  }
  try{
    await account_userView.update({
      group_name: group_name
    },
    {
      where: {
        username: username
      }
    });
  }
  catch(err){
    return sendResponse(res, "Database error occured", true);
  }

  sendResponse(res, "Update successful", false);
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

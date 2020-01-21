let groupModel;
let permissionModel;
let group_permissionView;
let has_user_permissionView;

module.exports = (injectedGroupModel, injectedPermissionModel, injectedGroup_permissionView, injectedHas_user_permissionModel) => {

  groupModel = injectedGroupModel;
  permissionModel = injectedPermissionModel;
  group_permissionView = injectedGroup_permissionView;
  has_user_permissionView = injectedHas_user_permissionModel;

  return {
      getGroups: getGroups,
      getGroupPermissions: getGroupPermissions,
      updateGroupPermissions: updateGroupPermissions,
      getPermissions: getPermissions,
      createGroup: createGroup,
      deleteGroup: deleteGroup
  }
}

async function getGroups(req, res) {

  const endpoint = '/read_groups';
  const token = req.headers.authorization.substr(7);
  let result;
  let groups;

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

  if(!isString(token) || !isString(endpoint)){
    return sendResponse(res, "Invalid token or endpoint", true);
  }

  if(result.access_token !== token || result.api_endpoint !== endpoint){
    return sendResponse(res, "Unauthorized access", true);
  }

  try{
    groups = await groupModel.findAll(
      {
        raw: true
      });
  }
  catch(err){
    return sendResponse(res, "Database error occured", true);
  }

  return sendResponse(res, groups, false);

}

async function getGroupPermissions(req, res) {

  const endpoint = '/read_group_permissions';
  const token = req.headers.authorization.substr(7);
  const group_id = req.body.group_id;
  let result;
  let group_permissions = [];
  let permissions = [];

  if(!isString(token) || !isString(endpoint) || !isString(group_id)){
    return sendResponse(res, "Invalid token, endpoint or group id", true);
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
    permissions = await permissionModel.findAll(
      {
        attributes: ['permission_id', 'permission_name'],
        raw: true
      });
    group_permissions = await group_permissionView.findAll(
      {
        attributes: ['permission_id', 'permission_name'],
        raw: true,
        where: {
          group_id: group_id
        }
      })
  }
  catch(err){
    return sendResponse(res, "Database error occured", true);
  }

  return sendResponse(res, { all_permissions: permissions, group_permission: group_permissions }, false);

}

async function updateGroupPermissions(req, res) {

  const endpoint = '/update_group_permissions';
  const token = req.headers.authorization.substr(7);
  const group_id = req.body.group_id;
  const group_name = req.body.group_name;
  const new_group_permissions = req.body.group_permission === undefined ? [] : req.body.group_permission
  let result;
  let group_permissions = [];

  if(!isString(token) || !isString(endpoint) || !isString(group_id) || !isString(group_name) || new_group_permissions === null){
    return sendResponse(res, "Invalid token, endpoint, group id, group name or permission array", true);
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
    group_permissions = await group_permissionView.findAll(
      {
        attributes: ['permission_id', 'permission_name'],
        raw: true,
        where: {
          group_id: group_id
        }
      })

    new_group_permissions.forEach(async (permission) => {
      if (group_permissions.filter(p => p.permission_id == permission.permission_id).length <= 0) {
        if (permission.permission_id !== null){
          // console.log('add ' + permission.permission_name);
          await group_permissionView.create({
            group_id: group_id,
            permission_id: permission.permission_id
          });
        }
      }
    });

    group_permissions.forEach(async (permission) => {
      if (new_group_permissions.filter(p => p.permission_id == permission.permission_id).length <= 0) {
        if (permission.permission_id !== null){
          // console.log('remove ' + permission.permission_name);
          await group_permissionView.destroy({
            where: {
              group_id: group_id,
              permission_id: permission.permission_id
            }
          });
        }
      }
    });

    await groupModel.update(
      {
        group_name: group_name
      },
      {
        where: {
          group_id: group_id
        }
      });
  }
  catch(err){
    return sendResponse(res, "Database error occured", true);
  }

  return sendResponse(res, "Group has been updated", false);

}

async function getPermissions(req, res) {

  const endpoint = '/read_permissions';
  const token = req.headers.authorization.substr(7);
  let result;
  let permissions;

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

  if(!isString(token) || !isString(endpoint)){
    return sendResponse(res, "Invalid token or endpoint", true);
  }

  if(result.access_token !== token || result.api_endpoint !== endpoint){
    return sendResponse(res, "Unauthorized access", true);
  }

  try{
    permissions = await permissionModel.findAll(
      {
        raw: true
      });
  }
  catch(err){
    return sendResponse(res, "Database error occured", true);
  }

  return sendResponse(res, permissions, false);

}

async function createGroup(req, res) {

  const endpoint = '/create_group';
  const token = req.headers.authorization.substr(7);
  const group_name = req.body.group_name;
  const group_permissions = req.body.group_permissions === undefined ? [] : req.body.group_permissions
  let result;
  let group;

  if(!isString(token) || !isString(endpoint) || !isString(group_name) || group_permissions === null){
    return sendResponse(res, "Invalid token, endpoint, group name or permission array", true);
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

    await groupModel.create({
      group_name: group_name
    });

    group = await groupModel.findOne({
      where: {
        group_name: group_name
      }
    })

    if(group === null || group === undefined) throw "Create Error";

    group_permissions.forEach(async (permission) => {
      await group_permissionView.create({
        group_id: group.group_id,
        permission_id: permission.permission_id
      });
    });
  }
  catch(err){
    return sendResponse(res, "Database error occured", true);
  }

  return sendResponse(res, "Group has been created", false);

}

async function deleteGroup(req, res) {

  const endpoint = '/delete_group';
  const token = req.headers.authorization.substr(7);
  const group_id = req.body.group_id;
  let result;
  let groups;

  if(!isString(token) || !isString(endpoint) || !isString(group_id)){
    return sendResponse(res, "Invalid token, group_id or endpoint", true);
  }

  if(group_id == 1 || group_id == '1'){
    return sendResponse(res, "This group cannot be deleted", true);
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
    await groupModel.destroy(
      {
        where: {
          group_id: group_id
        }
      });
  }
  catch(err){
    return sendResponse(res, "Database error occured", true);
  }

  return sendResponse(res, "Group has been deleted", false);

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

module.exports = (router, expressApp, accountDBHelper, sessionDBHelper, userDBHelper, logsDBHelper, groupDBHelper, bcrypt) => {

  router.post('/register', accountDBHelper.registerAccount);
  router.post('/login', expressApp.oauth.grant());
  router.post('/check_username', accountDBHelper.checkUsername); //CHECKS USERNAME IF IT IS USED
  router.post('/check_email', accountDBHelper.checkEmail);
  router.post('/forgot_password', accountDBHelper.forgotPassword);
  router.post('/set_new_password', accountDBHelper.setNewPassword);
  router.post('/is_reset_token_valid', accountDBHelper.checkResetToken);
  router.post('/check_access', expressApp.oauth.authorise(), userDBHelper.checkAccess);

  router.post('/read_account_log', expressApp.oauth.authorise(), logsDBHelper.getAccountLogs);
  router.post('/read_group_log', expressApp.oauth.authorise(), logsDBHelper.getGroupLogs);
  router.post('/read_group_permission_log', expressApp.oauth.authorise(), logsDBHelper.getGroupPermissionLogs);
  router.post('/read_permission_log', expressApp.oauth.authorise(), logsDBHelper.getPermissionLogs);
  router.post('/read_reset_token_log', expressApp.oauth.authorise(), logsDBHelper.getResetTokenLogs);
  router.post('/read_session_log', expressApp.oauth.authorise(), logsDBHelper.getSessionLogs);
  router.post('/read_user_log', expressApp.oauth.authorise(), logsDBHelper.getUserLogs);
  router.post('/read_user_permission_log', expressApp.oauth.authorise(), logsDBHelper.getUserPermissionLogs);

  router.post('/read_users', expressApp.oauth.authorise(), userDBHelper.getUsers);
  router.post('/read_user', expressApp.oauth.authorise(), userDBHelper.getUserByUserId);
  router.post('/update_user', expressApp.oauth.authorise(), userDBHelper.updateUser);
  router.post('/update_user_group', expressApp.oauth.authorise(), userDBHelper.updateUserGroup);
  router.post('/create_group', expressApp.oauth.authorise(), groupDBHelper.createGroup);
  router.post('/read_groups', expressApp.oauth.authorise(), groupDBHelper.getGroups);
  router.post('/delete_group', expressApp.oauth.authorise(), groupDBHelper.deleteGroup);
  router.post('/read_group_permissions', expressApp.oauth.authorise(), groupDBHelper.getGroupPermissions);
  router.post('/update_group_permissions', expressApp.oauth.authorise(), groupDBHelper.updateGroupPermissions);
  router.post('/read_permissions', expressApp.oauth.authorise(), groupDBHelper.getPermissions);
  router.post('/read_user_permissions', expressApp.oauth.authorise(), userDBHelper.getUserPermissions);

  router.post('/is_token_valid', expressApp.oauth.authorise(), async (req, res) => {

    let token = req.headers.authorization.substr(7);
    let session = await sessionDBHelper.getSessionFromBearerToken(token);

    res
      .status(200)
      .json({
        'code': 200,
        'message': 'Authenticated',
        'username': session.username
      });

  });

  router.post('/get_account', expressApp.oauth.authorise(), async (req, res) => {

    let token = req.headers.authorization.substr(7); // Discard Bearer part of token
    let session = await sessionDBHelper.getSessionFromBearerToken(token);
    let account = await accountDBHelper.getAccountByUsername(session.username);
    let user = await userDBHelper.getUserById(account.user_id);

    return res
      .status(200)
      .json({
        'code': 200,
        'username': account.username,
        'email': account.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'birthdate': user.birthdate,
        'mobile': user.mobile,
        'address': user.address
      });

  });

  router.post('/update_personal_info', expressApp.oauth.authorise(), async (req, res) => {

    let token = req.headers.authorization.substr(7); // Discard Bearer part of token
    let firstName = req.body.first_name;
    let lastName = req.body.last_name;
    let birthdate = req.body.birthdate;
    let address = req.body.address;
    let mobile = req.body.mobile;
    let email = req.body.email;
    let password = req.body.password;


    if(!isString(token) || !isString(firstName) || !isString(lastName) || !isString(birthdate) || !isString(address) ||
      !isString(mobile) || !isString(email) || !isString(password)){
      return sendResponse(res, "Missing fields!", true);
    }

    try{
      let session = await sessionDBHelper.getSessionFromBearerToken(token);
      let account = await accountDBHelper.getAccountByUsername(session.username);
      let user = await userDBHelper.getUserById(account.user_id);

      if (account == null || user == null){
        return sendResponse(res, "Unexpected error!", true);
      }

      if (password.length >= 6 && password !== ''){
        let hash = bcrypt.hashSync(account.username + password, bcrypt.rounds);
        await account.update({
          email: email,
          password_key: hash
        });
      }
      else{
        await account.update({
          email: email
        });
      }

      await user.update({
        first_name: firstName,
        last_name: lastName,
        address: address,
        mobile: mobile
      })

      if(birthdate !== null && birthdate != ''){
        await user.update({
          birthdate: birthdate
        });
      }
    }
    catch(err){
      return sendResponse(res, "Database error has occured", true);
    }

    return sendResponse(res, "Personal info has updated successfully", false);
  });


  return router;
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

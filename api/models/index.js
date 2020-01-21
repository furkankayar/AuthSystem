
//Database definition schema

var Sequelize = require('sequelize');
var sequelize = new Sequelize('nodejs', 'furkan', '756ee75b', // SAVE CONFIG AS ENV VAR
  {
    host: 'localhost',
    dialect: 'postgres',
    pool:{
      max: 5,
      min: 0,
      idle: 10000
    },
    logging: false
  });


var group = require('./group');
var GroupModel = group.GroupModel(sequelize, Sequelize);
var GroupLog = group.GroupLog(sequelize, Sequelize);
var user = require('./user');
var UserModel = user.UserModel(sequelize, Sequelize, GroupModel);
var UserLog = user.UserLog(sequelize, Sequelize);
var account = require('./account');
var AccountModel = account.AccountModel(sequelize, Sequelize, UserModel);
var AccountLog = account.AccountLog(sequelize, Sequelize);
var permission = require('./permission');
var PermissionModel = permission.PermissionModel(sequelize, Sequelize);
var PermissionLog = permission.PermissionLog(sequelize, Sequelize);
var group_permission = require('./group_permission');
var Group_PermissionModel = group_permission.Group_PermissionModel(sequelize, Sequelize, GroupModel, PermissionModel);
var Group_PermissionLog = group_permission.Group_PermissionLog(sequelize, Sequelize);
var user_permission = require('./user_permission');
var User_PermissionModel = user_permission.User_PermissionModel(sequelize, Sequelize, UserModel, PermissionModel);
var User_PermissionLog = user_permission.User_PermissionLog(sequelize, Sequelize);
var session = require('./session');
var SessionModel = session.SessionModel(sequelize, Sequelize, AccountModel);
var SessionLog = session.SessionLog(sequelize, Sequelize);
var reset_token = require('./reset_token');
var ResetTokenModel = reset_token.ResetTokenModel(sequelize, Sequelize, AccountModel);
var ResetTokenLog = reset_token.ResetTokenLog(sequelize, Sequelize);

var views = require('./views');
var Has_user_permissionView = views.has_user_permissionView(sequelize, Sequelize);
var Account_userView = views.account_userView(sequelize, Sequelize);
var Group_permissionView = views.group_permissionView(sequelize, Sequelize);
var User_permissionView = views.user_permissionView(sequelize, Sequelize);

const db = {};


/*sequelize.sync().then(() => {
  return sequelize.query("SELECT now() as datetime", {type: sequelize.QueryTypes.SELECT});
}).then(result => {
  console.log("Database connection successful. " + result[0].datetime);
}).catch(err => {
  console.log("Database connection failed.\nERROR: " + err.name);
});*/


let seq_models = [];
let seq_views = [];
sequelize.modelManager.forEachModel(model => {
  if (model && model.options.sync !== false) {
    seq_models.push(model);
  }
  else{
    seq_views.push(model);
  }
});
Sequelize.Promise.each(seq_models, model => {
  return model.sync();
});
Sequelize.Promise.each(seq_views, view => {
  return view.options.classMethods.createView();
});




db.GroupModel = GroupModel;
db.GroupLog = GroupLog;
db.UserModel = UserModel;
db.UserLog = UserLog;
db.AccountModel = AccountModel;
db.AccountLog = AccountLog;
db.PermissionModel = PermissionModel;
db.PermissionLog = PermissionLog;
db.Group_PermissionModel = Group_PermissionModel;
db.Group_PermissionLog = Group_PermissionLog;
db.User_PermissionModel = User_PermissionModel;
db.User_PermissionLog = User_PermissionLog;
db.SessionModel = SessionModel;
db.SessionLog = SessionLog;
db.ResetTokenModel = ResetTokenModel;
db.ResetTokenLog = ResetTokenLog;
db.Has_user_permissionView = Has_user_permissionView;
db.Account_userView = Account_userView;
db.Group_permissionView = Group_permissionView;
db.User_permissionView = User_permissionView;

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;

const user_permission = {};

function user_permissionModel(sequelize, Sequelize, user, permission) {
  var User_Permission = sequelize.define('auth_user_permission', {
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    permission_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  },{
    timestamps: false,
    freezeTableName: true
  });

  User_Permission.belongsTo(user, {
    foreignKey: 'user_id',
    onDelete: 'cascade',
    onUpdate: 'cascade'
  });

  User_Permission.belongsTo(permission, {
    foreignKey: 'permission_id',
    onDelete: 'cascade',
    onUpdate: 'cascade'
  });

  return User_Permission;
};

function user_permissionLog(sequelize, Sequelize) {
  var User_PermissionLog = sequelize.define('auth_user_permission_log', {
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    permission_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    crud_operation: {
      type: Sequelize.CHAR(1),
      allowNull: false
    },
    action_time: {
      type: Sequelize.DATE,
      allowNull: false
    }
  },{
    timestamps: false,
    freezeTableName: true
  });

  User_PermissionLog.removeAttribute('id');

  return User_PermissionLog;
};

user_permission.User_PermissionModel = user_permissionModel;
user_permission.User_PermissionLog = user_permissionLog;

module.exports = user_permission;

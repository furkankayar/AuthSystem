const permission = {};

function permissionModel(sequelize, Sequelize){
  var PermissionModel = sequelize.define('auth_permission', {
    permission_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    permission_name: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    api_endpoint: {
      type: Sequelize.STRING(100),
      allowNull: false
    }
  },{
    timestamps: false,
    freezeTableName: true
  });

  return PermissionModel;
};

function permissionLog(sequelize, Sequelize){
  var PermissionLog = sequelize.define('auth_permission_log', {
    permission_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    permission_name: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    api_endpoint: {
      type: Sequelize.STRING(100),
      allowNull: false
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

  PermissionLog.removeAttribute('id');

  return PermissionLog;
};

permission.PermissionModel = permissionModel;
permission.PermissionLog = permissionLog;

module.exports = permission;

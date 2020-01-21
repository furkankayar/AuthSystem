const group_permission = {};

function group_permissionModel(sequelize, Sequelize, group, permission) {
  var Group_Permission = sequelize.define('auth_group_permission', {
    group_id: {
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

  Group_Permission.belongsTo(group, {
    foreignKey: 'group_id',
    onDelete: 'cascade',
    onUpdate: 'cascade'
  });

  Group_Permission.belongsTo(permission, {
    foreignKey: 'permission_id',
    onDelete: 'cascade',
    onUpdate: 'cascade'
  });

  return Group_Permission;
};

function group_permissionLog(sequelize, Sequelize) {
  var Group_PermissionLog = sequelize.define('auth_group_permission_log', {
    group_id: {
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

  Group_PermissionLog.removeAttribute('id');

  return Group_PermissionLog;
};

group_permission.Group_PermissionModel = group_permissionModel;
group_permission.Group_PermissionLog = group_permissionLog;

module.exports = group_permission;

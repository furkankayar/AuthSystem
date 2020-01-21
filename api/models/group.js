const group = {};

function groupModel(sequelize, Sequelize){
  var GroupModel = sequelize.define('auth_group',{
    group_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    group_name: {
      type: Sequelize.STRING(100),
      allowNull: false
    }
  },{
    timestamps: false,
    freezeTableName: true
  });

  return GroupModel;
};

function groupLog(sequelize, Sequelize){
  var GroupLog = sequelize.define('auth_group_log',{
    group_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    group_name: {
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

  GroupLog.removeAttribute('id');

  return GroupLog;
};

group.GroupModel = groupModel;
group.GroupLog = groupLog;

module.exports = group;

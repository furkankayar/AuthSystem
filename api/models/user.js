const user = {};

function userModel(sequelize, Sequelize, group){
  var UserModel = sequelize.define('auth_user', {
    user_id:{
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    first_name:{
      type: Sequelize.STRING(100), //VARCHAR(100)
    },
    last_name:{
      type: Sequelize.STRING(100),
    },
    birthdate: {
      type: Sequelize.DATEONLY,
    },
    mobile: {
      type: Sequelize.STRING(100),
    },
    address: {
      type: Sequelize.TEXT,
    },
    group_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  },{
    timestamps: false,
    freezeTableName: true
  });

  UserModel.belongsTo(group, {
    foreignKey: 'group_id',
    onDelete:'set default',
    onUpdate:'cascade'
  });

  return UserModel;
};

function userLog(sequelize, Sequelize){
  var UserLog = sequelize.define('auth_user_log', {
    user_id:{
      type: Sequelize.INTEGER,
      allowNull: false
    },
    first_name:{
      type: Sequelize.STRING(100), //VARCHAR(100)
    },
    last_name:{
      type: Sequelize.STRING(100),
    },
    birthdate: {
      type: Sequelize.DATEONLY,
    },
    mobile: {
      type: Sequelize.STRING(100),
    },
    address: {
      type: Sequelize.TEXT,
    },
    group_id: {
      type: Sequelize.INTEGER,
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

  UserLog.removeAttribute('id');

  return UserLog;
};

user.UserModel = userModel;
user.UserLog = userLog;


module.exports = user;

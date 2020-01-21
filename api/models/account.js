const account = {};

function accountModel(sequelize, Sequelize, user){
  var Account = sequelize.define('auth_account', {
    username: {
      type: Sequelize.STRING(100),
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true
    },
    password_key: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    }
  },{
    timestamps: false,
    freezeTableName: true
  });

  Account.belongsTo(user, {
    foreignKey: 'user_id',
    onDelete: 'no action',
    onUpdate: 'cascade'
  });

  return Account;
};

function accountLog(sequelize, Sequelize){
  var Account_Log = sequelize.define('auth_account_log', {
    username: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    password_key: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    user_id: {
      type: Sequelize.INTEGER,
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
    freezeTableName: true,
  });

  Account_Log.removeAttribute('id');

  return Account_Log;
};

account.AccountModel = accountModel;
account.AccountLog = accountLog;

module.exports = account;

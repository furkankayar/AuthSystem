const reset_token = {};

function resetTokenModel(sequelize, Sequelize, account){
  var ResetToken = sequelize.define('auth_reset_token', {
    username: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    reset_token: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    expires: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  },{
    timestamps: false,
    freezeTableName: true
  });

  ResetToken.belongsTo(account, {
    foreignKey: 'username',
    onDelete: 'cascade',
    onUpdate: 'cascade'
  });

  ResetToken.removeAttribute('id');

  return ResetToken;
};

function resetTokenLog(sequelize, Sequelize){
  var ResetTokenLog = sequelize.define('auth_reset_token_log', {
    username: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    reset_token: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    expires: {
      type: Sequelize.DATE,
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

  ResetTokenLog.removeAttribute('id');

  return ResetTokenLog;
};


reset_token.ResetTokenModel = resetTokenModel;
reset_token.ResetTokenLog = resetTokenLog;

module.exports = reset_token;

const session = {};

function sessionModel(sequelize, Sequelize, account){
  var Session = sequelize.define('auth_session', {
    username: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    access_token: {
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

  Session.belongsTo(account, {
    foreignKey: 'username',
    onDelete: 'cascade',
    onUpdate: 'cascade'
  });

  Session.removeAttribute('id');

  return Session;
};

function sessionLog(sequelize, Sequelize){
  var SessionLog = sequelize.define('auth_session_log', {
    username: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    access_token: {
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

  SessionLog.removeAttribute('id');

  return SessionLog;
};


session.SessionModel = sessionModel;
session.SessionLog = sessionLog;

module.exports = session;

const views = {};

function has_user_permissionView(sequelize, Sequelize){
  var has_user_permissionModel = sequelize.define('has_user_permission', {
    access_token:{
      type: Sequelize.STRING(100)
    },
    api_endpoint:{
      type: Sequelize.STRING(100)
    }
  },
  {
    timestamps: false,
    freezeTableName: true,
    sync: false,
    classMethods: {
     createView: () => {
       return sequelize.query("CREATE OR REPLACE VIEW has_user_permission AS\n" +
                                 "SELECT access_token, api_endpoint FROM auth_user\n" +
                                 "INNER JOIN auth_group_permission ON auth_group_permission.group_id = auth_user.group_id\n" +
                                 "INNER JOIN auth_permission ON auth_group_permission.permission_id = auth_permission.permission_id\n" +
                                 "INNER JOIN auth_account ON auth_account.user_id = auth_user.user_id\n" +
                                 "INNER JOIN auth_session ON auth_session.username = auth_account.username\n" +
                                 "UNION\n" +
                                 "SELECT access_token, api_endpoint FROM auth_user\n" +
                                 "INNER JOIN auth_user_permission ON auth_user_permission.user_id = auth_user.user_id\n" +
                                 "INNER JOIN auth_permission ON auth_user_permission.permission_id = auth_permission.permission_id\n" +
                                 "INNER JOIN auth_account ON auth_account.user_id = auth_user.user_id\n" +
                                 "INNER JOIN auth_session ON auth_session.username = auth_account.username;");
      }
    }
  });

  has_user_permissionModel.removeAttribute('id');
  return has_user_permissionModel;
}

function account_userView(sequelize, Sequelize){
  var account_userModel = sequelize.define('account_user', {
    username: {
      type: Sequelize.STRING(100),
    },
    email: {
      type: Sequelize.STRING(100),
    },
    password_key: {
      type: Sequelize.STRING(100),
    },
    is_active: {
      type: Sequelize.BOOLEAN,
    },
    user_id:{
      type: Sequelize.INTEGER,
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
    group_name: {
      type: Sequelize.STRING(100),
    }
  },
  {
    timestamps: false,
    freezeTableName: true,
    sync: false,
    classMethods: {
      createView: () => {
        return sequelize.query("CREATE OR REPLACE VIEW account_user AS\n" +
                                "SELECT a.username, a.email, a.password_key, a.is_active, a.user_id, u.first_name, u.last_name, u.birthdate, u.mobile, u.address, g.group_name\n" +
                                "FROM auth_account AS a\n" +
                                "INNER JOIN auth_user AS u ON a.user_id = u.user_id\n" +
                                "INNER JOIN auth_group AS g ON u.group_id = g.group_id");
      }
    }
  })

  account_userModel.removeAttribute('id');
  return account_userModel;
}

function group_permissionView(sequelize, Sequelize){
  var group_permissionModel = sequelize.define('group_permission', {
    group_id:{
      type: Sequelize.INTEGER,
    },
    permission_id:{
      type: Sequelize.INTEGER,
    },
    permission_name:{
      type: Sequelize.STRING(100), //VARCHAR(100)
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
    sync: false,
    classMethods: {
      createView: () => {
        return sequelize.query("CREATE OR REPLACE VIEW group_permission AS \n" +
                                "SELECT g.group_id, p.permission_id, p.permission_name FROM auth_group AS g\n" +
                                "LEFT JOIN auth_group_permission AS gp ON g.group_id = gp.group_id\n" +
                                "LEFT JOIN auth_permission AS p ON gp.permission_id = p.permission_id;");
      }
    }
  })

  group_permissionModel.removeAttribute('id');
  return group_permissionModel;
}

function user_permissionView(sequelize, Sequelize){
  var user_permissionModel = sequelize.define('user_permission', {
    user_id:{
      type: Sequelize.INTEGER,
    },
    permission_id:{
      type: Sequelize.INTEGER,
    },
    permission_name:{
      type: Sequelize.STRING(100), //VARCHAR(100)
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
    sync: false,
    classMethods: {
      createView: () => {
        return sequelize.query("CREATE OR REPLACE VIEW user_permission AS \n" +
                                "SELECT u.user_id, p.permission_id, p.permission_name FROM auth_user AS u\n" +
                                "LEFT JOIN auth_user_permission AS up ON u.user_id = up.user_id\n" +
                                "LEFT JOIN auth_permission AS p ON up.permission_id = p.permission_id;");
      }
    }
  })

  user_permissionModel.removeAttribute('id');
  return user_permissionModel;
}



views.has_user_permissionView = has_user_permissionView;
views.account_userView = account_userView;
views.group_permissionView = group_permissionView;
views.user_permissionView = user_permissionView;

module.exports = views;

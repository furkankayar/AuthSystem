
const bodyParser = require("body-parser");
const path = require("path");
const express = require("express");
const db = require("./models/index");
const cors = require("cors");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
bcrypt.rounds = 10;

const accountHelper = require('./db_helpers/accountHelper')(db.AccountModel, db.ResetTokenModel, bcrypt, crypto, nodemailer);
const sessionHelper = require('./db_helpers/sessionHelper')(db.SessionModel);
const userHelper = require('./db_helpers/userHelper')(db.UserModel, db.Has_user_permissionView, db.Account_userView, db.User_permissionView, db.sequelize);
const logsHelper = require('./db_helpers/logsHelper')(db.AccountLog, db.GroupLog, db.Group_PermissionLog, db.PermissionLog, db.ResetTokenLog, db.SessionLog, db.UserLog, db.User_PermissionLog, db.Has_user_permissionView);
const groupHelper = require('./db_helpers/groupHelper')(db.GroupModel, db.PermissionModel, db.Group_permissionView, db.Has_user_permissionView);

const app = express();
const port = process.env.PORT || "8000";
const router = express.Router();

const oAuth2Server = require('node-oauth2-server');
const oAuthModel = require('./authorization/accessTokenModel')(accountHelper, sessionHelper);

app.oauth = oAuth2Server({
    model: oAuthModel,
    grants: ['password'],
    debug: false
});

const authRouter = require('./authorization/authRouter')(router, app, accountHelper, sessionHelper, userHelper, logsHelper, groupHelper, bcrypt);

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json()); //It is required to be able to use req.body


app.use('/auth', cors(), authRouter);

app.use(app.oauth.errorHandler())



app.listen(port, () => {
  console.log('Listening to requests on http://localhost:' + port);

});

var io = require('socket.io').listen(7777);
console.log('Listening to new sockets on http://localhost:7777');
var count = 0;

io.sockets.on('connection', socket => {
    count++;
    io.sockets.emit('message' , {count:count});
    socket.on('disconnect', () => {
      count--;
    })
});

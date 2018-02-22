const UserController = require('../controllers').users;
const Validator = require('../middlewares/validator');
const AuthMiddlewares = require('../middlewares/auth');

module.exports = (app) => {

  //Signup and login api
  app.post('/api/login',Validator.loginRequest ,UserController.login);
  app.post('/api/signup',UserController.signup);
  
  //List and get user api
  app.get('/api/users/',UserController.listUsers);
  app.get('/api/users/:user_id',UserController.getUserById);

  //Apis related to connections
  app.post('/api/connections/addfriends',Validator.friendList,UserController.addFriends);
  app.post('/api/connections/check',UserController.checkConnection);
  app.get('/api/connections/list_user_friends_table',UserController.listUserFriendsTable);
  app.get('/api/connections/delete_user_friends_rows',UserController.deleteUserFriendsTable);


  app.get('/api',  (req, res) => res.status(200).send({
    message: 'Welcome to friends network!',
  }));

};

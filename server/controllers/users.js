const User = require('../models/user');
const PasswordHash = require('password-hash');
const jwt = require('jwt-simple');
const Queue = require('queue-fifo');
const config = require('../config');
const friendsUtil = require('./utils/friendsUtil');
const _ = require('underscore');
const promise = require('promise');
const nextLevel = 'end';

const self = module.exports = {

  signup : (req, res) => {
      let request = req.body;
      let name = request.name;
      let password = request.password;
      //Generate hash from the password
      let hashedPassword = PasswordHash.generate(password);
      //store user data to DB
      User.createUser(name,hashedPassword)
      .then((user)=>{
        if(user){
          delete user.password; 
          res.json({'status':200, 'message':'ok','data':user});
        }else{
          res.json({'status':401,'error':'User not saved'});
        }
        
      }).catch((err)=>{
        res.json({"status":405, "error" : err});
      });
  },

  addFriends : (req, res) => {
      let request = req.body;
      let user_id = request.user_id;
      let friendList = request.friendList;
      console.log(friendList);
      let user_friend_array = [];
      _.each(friendList,(friend_id)=>{
        let user_friend = {
          user_id : request.user_id,
          friend_id : friend_id
        }
        user_friend_array.push(user_friend);
      })
      User.makeFriends(user_friend_array).then((user)=>{
        res.json({'status':200,'message':user});
      }).catch((err)=>{
        res.json({"status":405, "error" : err});
      });
  },

  login : (req, res) => {
      let token = '';
      let valid = false;
      let loggedInUser = null;
      User.getUser(req.body.name).then((user) => {
        if(!user)
           res.json({'status':401,'error': "User not found"});
        else{
           loggedInUser = user;
           valid = PasswordHash.verify(req.body.password, user.password);   //verify password
           if(!valid){
               res.json({'status':400,'error': "Username or password wrong"});
            }else{
               delete user.password;
               token = jwt.encode(user, config.JWT_token, 'HS512');
               return User.getFriends(user.id);   //Fetch friend ist from DB and chain the promise
            }
        }
      }).then((friends) => {  //Promise from getFriends DB function
          loggedInUser.friends = friends;
          loggedInUser.token = token;
          res.json({
              'status':200,
              'message':'ok',
              'user': loggedInUser
          });

      }).catch((err) =>{
          res.json({'status':405,'error':err});
      });
  },



  listUsers : (req, res) => {
      //req.params.challenge_id;
      User.listUsers().then((users) => {
        if(!users)
          res.json({'status':401,'error': "Users not found"});
        else{
             res.json({
               'status':200,
                'message':'ok',
                'user': users
              });
        }
      }).catch((err) =>{
          res.json({'status':405,'error':err});
      });
  },

  getUserById : (req, res) => {
      let user = null;
      User.getUserById(req.params.user_id).then((dbuser) => {
        if(!dbuser)
          res.json({'status':401,'error': "User not found"});
        else{
          user = dbuser;
          return User.getFriends(user.id);  
        }
      }).then((friends)=>{
          user.friends = friends;
          console.log(user);
          res.json({
             'status':200,
             'message':'ok',
             'user': user
           });
      }).catch((err) =>{
          res.json({'status':405,'error':err});
      });
  },


 //api to check if users are connected and find distance between them
  checkConnection : (req, res) => {
      let queue = new Queue();
      let user =req.body.userId;
      let friend = req.body.friendId;
      let discovered = [];  //To maintain visited node

      discovered[user] = true;
      queue.enqueue(user);      //inserting source node to queue
      queue.enqueue(nextLevel); //insert flag for each level traversed
      
      //Recursive method for breadth first search(BFS) on friends table
      let getConnections = new promise((resolve,reject) =>{
        friendsUtil.recursiveGetFriends(friend,queue,discovered,0,resolve,reject);
      })
      //Handling promise of recursive breadth first search
      getConnections.then((distance)=>{
        if(distance != -999) // -999 denotes no connection found
          res.json({'status':200, message : 'Connection distance : '+distance});
        else
          res.json({'status':200, message : 'No connections found'})
      }).catch((err)=>{
        res.json({'status':400,'error' : err});
      })
  },


  listUserFriendsTable : (req, res) => {
      User.listUserFriends().then((user_friends) => {
        if(!user_friends)
          res.json({'status':401,'error': "user_friends not found"});
        else{
             res.json({
               'status':200,
                'message':'ok',
                'user_friends': user_friends
              });
        }
      }).catch((err) =>{
          res.json({'status':405,'error':err});
      });
  },


  deleteUserFriendsTable : (req, res) => {
      User.deleteUserFriends().then((user_friends) => {
        if(!user_friends)
          res.json({'status':401,'error': "user_friends  not found"});
        else{
             res.json({
               'status':200,
                'message':'ok',
                'user_friends': 'user_friends deleted'
              });
        }
      }).catch((err) =>{
          res.json({'status':405,'error':err});
      });
  },

};



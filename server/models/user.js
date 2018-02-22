const knex = require('./index').knex;
const ModelUtility = require('./index').utilities;
const promise = require('promise')

const user_columns = [
	'id','name','created_at','updated_at'
]
const self = module.exports = {
    getUser : (name) =>{
        let query = knex.from('users').where('name', '=', name).select('*')
        return new promise((resolve,reject) =>{
            query.then((result) => {
                resolve(result[0]);
            }).catch((err) =>{
                reject(err);
            });
        }); 
    },

    getUserById : (id) =>{
        let query = knex.from('users').where('id', '=', id).select(user_columns)
        let user = null;
        return new promise((resolve,reject) =>{
            query.then((dbUser) => {
                user = dbUser[0];
                resolve(user);
            }).catch((err) =>{
                reject(err);
            });
        }); 
    },

    listUsers : () =>{
        let query = knex.from('users').select(user_columns)
        return new promise((resolve,reject) =>{
            query.then((users) => {
                resolve(users);
            }).catch((err) =>{
                reject(err);
            });
        }); 
    },

    createUser : (name,password) =>{
        let query = knex('users').insert({
            name : name,
            password : password,
            created_at : new Date(),
            updated_at : new Date()
        }).returning(user_columns);
        
        return new promise((resolve,reject) =>{
            query.then((user) => {
                resolve(user);
            }).catch((err) =>{
                if(err.code == 23505){
                    reject('name '+name+' already exists');
                }
                reject(err);
            });
        }); 
    },

    makeFriends : (user_friends) =>{
        console.log(user_friends);
        let query = knex.batchInsert('user_friends',user_friends,30).returning(['id','user_id','friend_id']);
        
        return new promise((resolve,reject) =>{
            query.then((user_friend_ids) => {
                resolve(user_friend_ids);
            }).catch((err) =>{
                
                reject(err.detail);
            });
        }); 
    },

    getFriends : function (user_id) {
        let query  = knex.raw('select case when user_id='+user_id+' then friend_id ELSE user_id end from user_friends where user_id ='+user_id+'  or friend_id ='+user_id)
        return new promise((resolve,reject) =>{ 
                query.then((friends) => {
                    resolve(friends.rows);
                }).catch((err) =>{
                    reject(err);
                });
        });
    },

    listUserFriends : () =>{
        let query = knex.from('user_friends').select(['user_id','friend_id']).orderBy('user_id','friend_id');
        return new promise((resolve,reject) =>{
            query.then((userFriends) => {
                resolve(userFriends);
            }).catch((err) =>{
                reject(err);
            });
        }); 
    },

    deleteUserFriends : () =>{
        let query = knex.from('user_friends').del();
        return new promise((resolve,reject) =>{
            query.then((userFriends) => {
                resolve(userFriends);
            }).catch((err) =>{
                reject(err);
            });
        }); 
    },
    
}

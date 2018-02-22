const validator = require('node-validator');

function isInteger(variable){
	let check = false;
	if(typeof variable==='number' && variable%1==0 ) {
	    check =  true;
	}
	return check;
}

module.exports = {
	loginRequest :  (req, res, next) => {
		let body = req.body;
		if(!body.name ){
			res.json({'statusCode' : 400, 'statusMessage': 'name field required'})
		}
		if(!body.password || body.password.length <5){
			res.json({'statusCode' : 400, 'statusMessage': 'password field invalid'})
		}else{
			next();
		}
	},

	friendList :  (req, res, next) => {
		let friendList = req.body.friendList;
		if(friendList && Array.isArray(friendList)){
			if(!friendList.every(isInteger))
				res.json({'statusCode' : 400, 'statusMessage': 'friendList not an integer array'})
			else{
				next();
			}
		}else{
			next();
		}
	}

}
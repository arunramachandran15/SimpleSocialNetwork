var config = require('../config');
var jwt = require('jwt-simple');


module.exports = {
isLoggedIn : function(req, res, next)	{
		try{
			console.log('hello');
			var secret = config.JWT_token;
			var decoded = jwt.decode(req.headers['x-access-token'], secret);
			req.user = decoded;
			if(req.user.id) {
				next();
			} else {
				res.json({"status": 400, "error":"Not authorized"});
			}

		}
		catch(err){
			res.json({"status": 400, "error":"Not authorized"});
		}
	},
}
var mixinFunctions = {
	FNMGroupSecurity_Settings:{
		store: false,
		groupChannel: false,
		userChannel: false,
		permissionChannel: false,
		method: 'inorout',
		loginTimeout: 0,
		unprotectedTopics: {
			'init': true,
			'FNMGroupSecurity.Login': true,
			'FNMGroupSecurity.Logout': true,
			'FNMGroupSecurity.MustLogin': true,
			//'FNMGroupSecurity.LoginTimeoutReached': true,
			'FNMGroupSecurity.LoginFailed': true,
			'FNMGroupSecurity.LoginSuccessful': true
		},
		protectedTopics:{
			'FNMGroupSecurity':{
				'AddGroup':{},
				'UpdateGroup':{},
				'DeleteGroup':{},
				'FindGroups':{},
				'AddUser':{},
				'UpdateUser':{},
				'DeleteUser':{},
				'AddUserToGroup':{},
				'RemoveUserFromGroup':{},
				'SetGroupPermission':{},
				'SetUserPermission':{},
			}
		}
	},
	init: function(cfg){
		var thisNode = this;
		//add properties that are needed by this mixin
	
		thisNode.TunnelManager.configureManager({
			allowed: function(action, tunnel, topic, message, callback){
				if(!tunnel.isLoggedIn){
					tunnel.isLoggedIn = false;
				}
				
				var isAllowed = true;
				
				thisNode.FNMGroupSecurity_GetUserPermission({
					user: tunnel.authUser?tunnel.authUser.id:false,
					topic: topic,
					message: message
				}, function(err, hasPermission, permission){
					if(callback){
						callback(err, hasPermission);
					}
				});
				
				return false;
			}
		});
		
		thisNode.on('tunnelready', function(destination, tunnel){
			
			if(thisNode.FNMGroupSecurity_Settings.loginTimeout>0){
				thisNode.sendEvent(destination, 'FNMGroupSecurity.MustLogin', {
					timeout: thisNode.FNMGroupSecurity_Settings.loginTimeout
				});
				
				setTimeout(function(){
					if(!tunnel.isLoggedIn){
						thisNode.sendEvent(destination, 'FNMGroupSecurity.LoginTimeoutReached', {});
						thisNode.TunnelManager.deregisterTunnel(destination);	
					}
				}, thisNode.FNMGroupSecurity_Settings.loginTimeout*1000); //inout supploied in seconds	
			}
			
		});
		
		//add Events that are Tracked by this mixin
		thisNode.on('FNMGroupFNMGroupSecurity.AddGroup', function(message, rawMessage){
			thisNode.FNMGroupSecurity_AddGroup(message, rawMessage);
		});
		
		thisNode.on('FNMGroupSecurity.UpdateGroup', function(message, rawMessage){
			thisNode.FNMGroupSecurity_UpdateGroup(message, rawMessage);
		});
		
		thisNode.on('FNMGroupSecurity.DeleteGroup', function(message, rawMessage){
			thisNode.FNMGroupSecurity_DeleteGroup(message, rawMessage);
		});
		
		thisNode.on('FNMGroupSecurity.FindGroups', function(message, rawMessage){
			thisNode.FNMGroupSecurity_FindGroups(message, rawMessage);
		});
		
		thisNode.on('FNMGroupSecurity.AddUser', function(message, rawMessage){
			thisNode.FNMGroupSecurity_AddUser(message, rawMessage);
		});
		
		thisNode.on('FNMGroupSecurity.UpdateUser', function(message, rawMessage){
			thisNode.FNMGroupSecurity_UpdateUser(message, rawMessage);
		});
		
		thisNode.on('FNMGroupSecurity.RemoveUser', function(message, rawMessage){
			thisNode.FNMGroupSecurity_RemoveUser(message, rawMessage);
		});
		
		thisNode.on('FNMGroupSecurity.Login', function(message, rawMessage){
			thisNode.FNMGroupSecurity_Login(message, rawMessage);
		});
		
		thisNode.on('FNMGroupSecurity.Logout', function(message, rawMessage){
			thisNode.FNMGroupSecurity_Logout(message, rawMessage);
		});
		
		thisNode.on('FNMGroupSecurity.FindUsers', function(message, rawMessage){
			thisNode.FNMGroupSecurity_FindUsers(message, rawMessage);
		});
		
		thisNode.on('FNMGroupSecurity.AddUserToGroup', function(message, rawMessage){
			thisNode.FNMGroupSecurity_AddUserToGroup(message, rawMessage);
		});
		
		thisNode.on('FNMGroupSecurity.RemoveUserFromGroup', function(message, rawMessage){
			thisNode.FNMGroupSecurity_RemoveUserFromGroup(message, rawMessage);
		});
		
		thisNode.on('FNMGroupSecurity.SetGroupPermission', function(message, rawMessage){
			thisNode.FNMGroupSecurity_SetGroupPermission(message, rawMessage);
		});
		
		thisNode.on('FNMGroupSecurity.SetUserPermission', function(message, rawMessage){
			thisNode.FNMGroupSecurity_SetUserPermission(message, rawMessage);
		});
		
		//Process any supplied configuration options
		
		if(cfg){
			
			if(cfg.store){
				thisNode.FNMGroupSecurity_Settings.store = Store;
			}
			
			if(cfg.groupChannel){
				thisNode.FNMGroupSecurity_Settings.groupChannel = cfg.groupChannel;
			}else{
				thisNode.FNMGroupSecurity_Settings.groupChannel = 'groups';
			}
			
			if(cfg.userChannel){
				thisNode.FNMGroupSecurity_Settings.userChannel = cfg.groupChannel;
			}else{
				thisNode.FNMGroupSecurity_Settings.userChannel = 'users';
			}
			
			
			if(cfg.permissionChannel){
				thisNode.FNMGroupSecurity_Settings.permissionChannel = cfg.permissionChannel;
			}else{
				thisNode.FNMGroupSecurity_Settings.permissionChannel = 'permissions';
			}
			
			if(cfg.method){
				thisNode.FNMGroupSecurity_Settings.method = cfg.method;
			}
			
			if(cfg.loginTimeout>0){
				thisNode.FNMGroupSecurity_Settings.loginTimeout = cfg.loginTimeout;
			}
		}else{
			thisNode.FNMGroupSecurity_Settings.groupChannel = 'groups';
			thisNode.FNMGroupSecurity_Settings.userChannel = 'users';
		}
	},
	FNMGroupSecurity_Allowed: function(message, rawMessage){
		return true;
	},
	FNMGroupSecurity_AddGroup: function(message, rawMessage){
		var thisNode = this;
		var originalArgs = arguments;
		thisNode.StorageManager.save(message, thisNode.FNMGroupSecurity_Settings.store, thisNode.FNMGroupSecurity_Settings.groupChannel, function(err, records){
			if(!err){
				thisNode.emit('FNMGroupSecurity.GroupSaved', records[0]);
			}else{
				thisNode.emit('FNMGroupSecurity.GroupSaveError', {
					error: err,
					group: message
				});
			}
			
			if((typeof (originalArgs[originalArgs.length-1]))=='function'){ 
				var callback = originalArgs[originalArgs.length-1];
				callback(err, records[0]);
			}
		});
	},
	FNMGroupSecurity_UpdateGroup: function(){
		var thisNode = this;
		var originalArgs = arguments;
		thisNode.StorageManager.save(message, thisNode.FNMGroupSecurity_Settings.store, thisNode.FNMGroupSecurity_Settings.groupChannel, function(err, records){
			if(!err){
				thisNode.emit('FNMGroupSecurity.GroupSaved', records[0]);
			}else{
				thisNode.emit('FNMGroupSecurity.GroupSaveError', {
					error: err,
					group: message
				});
			}
			
			if((typeof (originalArgs[originalArgs.length-1]))=='function'){ 
				var callback = originalArgs[originalArgs.length-1];
				callback(err, records[0]);
			}
		});
	},
	FNMGroupSecurity_DeleteGroup: function(){
		
	},
	FNMGroupSecurity_FindGroups: function(){
		
	},
	FNMGroupSecurity_AddUser: function(message, rawMessage){
		var thisNode = this;
		var originalArgs = arguments;
		thisNode.StorageManager.save(message, thisNode.FNMGroupSecurity_Settings.store, thisNode.FNMGroupSecurity_Settings.userChannel, function(err, records){
			if(!err){
				thisNode.emit('FNMGroupSecurity.UserSaved', records[0]);
			}else{
				thisNode.emit('FNMGroupSecurity.UserSaveError', {
					error: err,
					group: message
				});
			}
			
			if((typeof (originalArgs[originalArgs.length-1]))=='function'){ 
				var callback = originalArgs[originalArgs.length-1];
				callback(err, records[0]);
			}
		});
	},
	FNMGroupSecurity_UpdateUser: function(message, rawMessage){
		var thisNode = this;
		var originalArgs = arguments;
		
		thisNode.StorageManager.save(message, thisNode.FNMGroupSecurity_Settings.store, thisNode.FNMGroupSecurity_Settings.userChannel, function(err, records){
			if(!err){
				thisNode.emit('FNMGroupSecurity.UserSaved', records[0]);
			}else{
				thisNode.emit('FNMGroupSecurity.UserSaveError', {
					error: err,
					group: message
				});
			}
			
			if((typeof (originalArgs[originalArgs.length-1]))=='function'){ 
				var callback = originalArgs[originalArgs.length-1];
				callback(err, records[0]);
			}
		});
	},
	FNMGroupSecurity_DeleteUser: function(){
		
	},
	FNMGroupSecurity_Login: function(message, rawMessage){
		var thisNode = this;
		var originalArgs = arguments;
		
		thisNode.StorageManager.findOne(message, thisNode.FNMGroupSecurity_Settings.store, thisNode.FNMGroupSecurity_Settings.userChannel, function(err, recs){
			if(!err){
				if(recs.length>0){
					thisNode.TunnelManager.getTunnel(rawMessage._message.sender).isLoggedIn = true;
					thisNode.TunnelManager.getTunnel(rawMessage._message.sender).authUser = recs[0];
					thisNode.emit('FNMGroupSecurity.UserLoggedIn', recs[0]);
					thisNode.sendEvent(rawMessage._message.sender, 'FNMGroupSecurity.LoginSuccessful', recs[0]);
				}else{
					thisNode.emit( 'FNMGroupSecurity.UserLoginFailed', message, rawMessage);
					thisNode.sendEvent(rawMessage._message.sender, 'FNMGroupSecurity.LoginFailed', {message: 'Invalid Username or Password'});
				}
			}else{
				thisNode.emit('FNMGroupSecurity.UserLoginError', message, rawMessage);
				thisNode.sendEvent(rawMessage._message.sender, 'FNMGroupSecurity.LoginFailed', err);
			}
			
			if((typeof (originalArgs[originalArgs.length-1]))=='function'){ 
				var callback = originalArgs[originalArgs.length-1];
				callback(err, records[0]);
			}
		});
	},
	FNMGroupSecurity_Logout: function(message, rawMessage){
		var thisNode = this;
		var originalArgs = arguments;
		
		var user = thisNode.TunnelManager.getTunnel(rawMessage._message.sender).authUser;
		thisNode.TunnelManager.deregisterTunnel(rawMessage._message.sender, function(err){
			if(!err){
				//TODO: load user information
				thisNode.emit('FNMGroupSecurity.UserLoggedOut', {
					user: user
				});
			}else{
				thisNode.sendEvent(rawMessage._message.sender, 'FNMGroupSecurity.UserLogoutError', {});
			}
			
			if((typeof (originalArgs[originalArgs.length-1]))=='function'){ 
				var callback = originalArgs[originalArgs.length-1];
				callback(err, records[0]);
			}
		});
	},
	FNMGroupSecurity_FindUsers: function(message, rawMessage){
		
	},
	FNMGroupSecurity_AddUserToGroup: function(message, rawMessage){
		
	},
	FNMGroupSecurity_RemoveUserFromGroup: function(message, rawMessage){
		
	},
	FNMGroupSecurity_SetGroupPermission: function(message, rawMessage){
		
	},
	FNMGroupSecurity_GetGroupPermission: function(message, rawMessage){
		
	},
	FNMGroupSecurity_SetUserPermission: function(message, rawMessage){
		var thisNode = this;
		var user = message.user;
		var topic = message.topic;
		var isAllowed = message.allowed;
		topicParts = topic.split('.');
		
		function setObjectKey(obj, topicParts, value, callback){
			var key = topicParts.shift();
			if(!obj[key]){
				obj[key] = {};
			}
			
			if(topicParts.length==0){
				obj[key] = value;
				return obj;
			}else{
				return setObjectKey(obj[key], topicParts, value, callback);
			}
		}
		
		var callback = false;
		
		var originalArgs = arguments;
		setObjectKey(thisNode.FNMGroupSecurity_Settings.protectedTopics, (topic+'.'+user).split('.'), isAllowed);
		
		console.log(thisNode.FNMGroupSecurity_Settings.protectedTopics);
		if((typeof (originalArgs[originalArgs.length-1]))=='function'){ 
			var callback = originalArgs[originalArgs.length-1];
			callback(false, topic, user, isAllowed);
		}
	},
	FNMGroupSecurity_GetUserPermission: function(message, rawMessage){
		var thisNode = this;
		var err = false;
		var userId = message.user;
		var topic = message.topic;
		var allowed = false;
		var permission = false; //used mainly by the more advanced security types
		
		if(!userId){ //only hope is if the event is in the unprotected list
			if(thisNode.FNMGroupSecurity_Settings.unprotectedTopics){
				allowed = true;
				permission = true;
			}
		}else{
			switch(thisNode.FNMGroupSecurity_Settings.method){
				case 'inorout': // you can do anything if you're logged in, nothing if you're not
					if(userId){
						allowed = true;
						permission = true;
					}
					break;
				case 'simple': // a group or user can be assigned a true or false as to whether they are allowed to access certain functions
					console.log('checking permission tree for: '+topic);
					var topicParts = topic.split('.');
					function checkForKey(object, keyParts){
						var keyPart = keyParts.shift();
						console.log('checking for: '+keyPart);
						console.log(object);
						if(object[keyPart]){
							if(keyParts.length==0){
								return true;
							}else{
								return checkForKey(object[keyPart], keyParts);
							}
						}else{
							return false;	
						}
					}
					//add the user id on the end because that's how the tree is setup i.e. mixin.topic.user1id, mixin.topic.user2id
					console.log('USER:'+userId);
					topicParts.push(userId);
					allowed = checkForKey(thisNode.FNMGroupSecurity_Settings.protectedTopics, topicParts);
					permission = allowed;
					break;
				case 'permission':
					//TODO: find permission information for the supplied user/topic combination
					console.log('here');
					break;
				default: 
				
					break;
			}
		}
		
		if((typeof (arguments[arguments.length-1]))=='function'){ 
			var callback = arguments[arguments.length-1];
			callback(err, allowed, permission);
		}
	}
}

if (typeof define === 'function' && define.amd) {
	define(mixinFunctions);
} else {
	module.exports = mixinFunctions;
}
	
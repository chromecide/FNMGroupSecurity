var mixinFunctions = {
	FNMGroupSecurity_Settings:{
		store: false,
		groupChannel: false,
		userChannel: false
	},
	init: function(cfg){
		var thisNode = this;
		//add properties that are needed by this mixin
	
		//add Events that are emitted by this mixin
		thisNode.on('Security.AddGroup', function(message, rawMessage){
			thisNode.FNMSecurity_AddGroup(message, rawMessage);
		});
		
		thisNode.on('Security.RemoveGroup', function(message, rawMessage){
			thisNode.FNMSecurity_AddGroup(message, rawMessage);
		});
		
		thisNode.on('Security.AddUser', function(message, rawMessage){
			thisNode.FNMSecurity_AddGroup(message, rawMessage);
		});
		
		thisNode.on('Security.RemoveUser', function(message, rawMessage){
			thisNode.FNMSecurity_AddGroup(message, rawMessage);
		});
		
		thisNode.on('Security.AddUserToGroup', function(message, rawMessage){
			thisNode.FNMSecurity_AddGroup(message, rawMessage);
		});
		
		thisNode.on('Security.RemoveUserFromGroup', function(message, rawMessage){
			thisNode.FNMSecurity_AddGroup(message, rawMessage);
		});
		
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
		}else{
			thisNode.FNMGroupSecurity_Settings.groupChannel = 'groups';
			thisNode.FNMGroupSecurity_Settings.userChannel = 'users';
		}
	},
	FNMGroupSecurity_AddGroup: function(message, rawMessage){
		var thisNode = this;
		var originalArgs = arguments;
		thisNode.StorageManager.save(message, thisNode.FNMGroupSecurity_Settings.store, thisNode.FNMGroupSecurity_Settings.groupChannel, function(err, records){
			if(!err){
				thisNode.emit('Security.GroupSaved', records[0]);
			}else{
				thisNode.emit('Security.GroupSaveError', {
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
	FNMGroupSecurity_RemoveGroup: function(){
		
	},
	FNMGroupSecurity_AddUser: function(message, rawMessage){
		var thisNode = this;
		var originalArgs = arguments;
		thisNode.StorageManager.save(message, thisNode.FNMGroupSecurity_Settings.store, thisNode.FNMGroupSecurity_Settings.userChannel, function(err, records){
			if(!err){
				thisNode.emit('Security.UserSaved', records[0]);
			}else{
				thisNode.emit('Security.UserSaveError', {
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
	FNMGroupSecurity_RemoveUser: function(){
		
	},
	FNMGroupSecurity_ValidateUser: function(message, rawMessage){
		var thisNode = this;
		
		thisNode.StorageManager.findOne(message, thisNode.FNMGroupSecurity_Settings.store, thisNode.FNMGroupSecurity_Settings.userChannel, function(){
			console.log(arguments);
		})
	},
	FNMGroupSecurity_AddUserToGroup: function(){
		
	},
	FNMGroupSecurity_RmoveUserFromGroup: function(){
		
	}
}

if (typeof define === 'function' && define.amd) {
	define(mixinFunctions);
} else {
	module.exports = mixinFunctions;
}
	
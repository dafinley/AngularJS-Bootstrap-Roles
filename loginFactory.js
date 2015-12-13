'use strict';

angular.module('angularjsbs').factory('loginFactory',['$http', '$q', function($http, $q){
  
   var ajsbsFactory = {};
   $http.defaults.useXDomain = true;
   
   ajsbsFactory.login = function(user){
     
     var deferred = $q.defer();
     
     deferred.resolve(user);
     
     /*
     
     $http({
       method:'POST',
       url:'http://randomurl.com', data:{user:user}
       
     }).success(function(data){
       
       defer.resolve(data);
       
     }).error(function(err){
       deferred.reject(err);
       
     });
     
     */
     
     return deferred.promise;
     
     
   }
   
  
   
   return ajsbsFactory;

  
  }]);
  
  angular.module('angularjsbs').constant('AUTH_EVENTS', {
	loginSuccess: 'auth-login-success',
	loginFailed: 'auth-login-failed',
	logoutSuccess: 'auth-logout-success',
	sessionTimeout: 'auth-session-timeout',
	notAuthenticated: 'auth-not-authenticated',
	notAuthorized: 'auth-not-authorized'

});

angular.module('angularjsbs').constant('USER_ROLES', {
	all: '*',
	superAdmin: 'superAdmin',
	admin: 'admin',
	normal: 'normal'
});

angular.module('angularjsbs').service('Session', function(){
	this.create = function(id, role, code){
		this.id = id;
		this.role = role;
		this.roleCode = code;

	};

	this.destroy = function(){
		this.id = null;
		this.role = null;
		this.roleCode = null;
	};

     return this;

});

angular.module('angularjsbs').factory('AuthService',['$http', 'Session', function($http, Session){

	var authService = {};
	
	authService.redirect = true;

	authService.newSession = function(user){
		Session.create(user.id, user.role, user.roleCode);

		return user;
	}

	authService.logout = function(){

		//var token = Session.id;
		Session.destroy();
		
		/*
		
	    
		$http({
			method: 'POST',
			url:'http://randomurl.com/api/logout', data:{token:token}
		//    url:'http://localhost:9190/api/logout', data:{token:token}
		});
		
		*/

	}

	authService.isAdmin = function(){
	
		return !!Session.id && (Session.roleCode === USER_ROLES.admin || Session.roleCode === USER_ROLES.superAdmin);
	}

	authService.isAuthenticated = function(){

		return !!Session.id;
	}

	authService.isAuthorized = function(authorizedRoles){
	
		if(!angular.isArray(authorizedRoles)){
			authorizedRoles = [authorizedRoles];
		}

		
		return (authService.isAuthenticated() &&
			authorizedRoles.indexOf(Session.roleCode) !== -1);
	};

	return authService;


}]);

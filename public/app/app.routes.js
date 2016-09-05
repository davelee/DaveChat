(function () {
	'use strict';

	var daveChat = angular.module('DaveChat');

	daveChat.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

		$locationProvider.html5Mode(true);
    
    $urlRouterProvider.otherwise('/');
    
    $stateProvider

    	.state('base', {
    		url: '/',
    		controller: function ($state) {
					var savedAccount = JSON.parse(localStorage.getItem('account'));
					var account = (savedAccount == null) ? {} : savedAccount;
					if (account.nickname != null && account.nickname != "") {
						$state.go('chat');
					} else {
						$state.go('login');
					}
    		}
    	})

      .state('login', {
      	url: '/',
      	templateUrl: "/chat/app/components/login/welcome.html",
      	controller: "LoginController",
      	controllerAs: "vm"
      })

      .state('chat', {
        url: '/',
        templateUrl: "/chat/app/components/chat/chat.html",
        controller: "ChatController",
        controllerAs: 'vm'
	    });
	});
})();
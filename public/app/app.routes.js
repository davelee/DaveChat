(function () {
	'use strict';

	var daveChat = angular.module('DaveChat');

	daveChat.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/');
    
    $stateProvider
        
      .state('chat', {
          url: '/',
          templateUrl: "/chat/app/components/chat/chat.html",
          controller: "ChatController",
          controllerAs: 'vm'
      });
	});
})();
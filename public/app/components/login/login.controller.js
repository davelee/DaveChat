(function () {

	'use strict';

	var daveChat = angular.module('DaveChat');

	daveChat.controller('LoginController', LoginController);

	function LoginController($state, auth) {
		console.log("Initializing LoginController...");

		var vm = this;

		vm.loginData = {};
		var account = auth.getAccount();

		vm.login = function () {
			account.nickname = vm.loginData.nickname;
			auth.setAccount(account);
			$state.go('chat');
		}
	}
})();
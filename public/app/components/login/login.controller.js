(function () {

	var daveChat = angular.module('DaveChat');

	daveChat.controller('LoginController', LoginController);

	function LoginController($scope, close) {
		console.log("Initializing LoginController...");
	}

})();
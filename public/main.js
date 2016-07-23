(function () {

	var dave_chat = angular.module('DaveChat', ['luegg.directives']);

	dave_chat.controller('ChatController', ChatController);

	function ChatController ($scope) {

		$scope.init = function () {

			$scope.messages = [];

			var server = io.connect('http://localhost:8081');

			$("#messageForm").submit(function (e) {
				e.preventDefault();	
				var message = $('#messageInput').val();
				$('#messageInput').val('');
				server.emit('messages', message);
			});	

			server.on('connect', function () {
				var nickname = prompt("What is your nickname?");
				server.emit('join', nickname);
			});

			server.on('messages', function (data) {
				$scope.messages.push(data);
				$scope.$evalAsync();
			});

		};
	}
})();
(function () {

	var dave_chat = angular.module('DaveChat', ['luegg.directives']);

	dave_chat.controller('ChatController', ChatController);

	function ChatController ($scope) {

		$scope.init = function () {

			$scope.messages = [];

			var notificationAudio = new Audio('assets/notification.mp3');

			var server = io.connect(SERVER);

			$("#messageForm").submit(function (e) {
				e.preventDefault();	
				var message = $('#messageInput').val();
				$('#messageInput').val('');
				server.emit('messages', message);
			});	

			server.on('connect', function () {
				var savedNickname = localStorage.getItem('nickname');
				var nickname = (savedNickname === null) ? 
												prompt("What is your nickname?") : savedNickname;
				localStorage.setItem("nickname", nickname);
				server.emit('join', nickname);
			});

			server.on('messages', function (data) {
				$scope.messages.push(data);
				$scope.$evalAsync();
				notificationAudio.play();
			});

		};
	}
})();
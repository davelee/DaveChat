(function () {

	var dave_chat = angular.module('DaveChat', ['luegg.directives']);

	dave_chat.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
            }
        });
    };
	});

	dave_chat.controller('ChatController', ChatController);

	function ChatController ($scope) {
		var vm = this; 

		vm.init = function () {

			vm.messages = [];
			vm.messageForm = {};

			var notificationAudio = new Audio('assets/notification.mp3');

			var server = io.connect(SERVER);

			vm.sendMessage = function () {	
				var message = $('#messageInput').val();
				$('#messageInput').val('');

				// Emit message event with message content
				server.emit('message', message);
			};	

			// Listen for successful connection event
			server.on('connect', function () {
				var savedNickname = localStorage.getItem('nickname');
				var nickname = (savedNickname === null) ? 
												prompt("What is your nickname?") : savedNickname;
				localStorage.setItem("nickname", nickname);

				// Emit join event with chosen nickname
				server.emit('join', nickname);
			});

			// Listen for the 'message' event
			server.on('message', function (data) {
				vm.messages.push(data);
				$scope.$evalAsync();

				notificationAudio.play();
			});
		};
	}
})();
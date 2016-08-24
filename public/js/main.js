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

			vm.clients = {};
			vm.messages = [];
			vm.messageForm = {};

			var notificationAudio = new Audio('assets/notification.mp3');

			// Get/set account from localStorage
			var savedAccount = JSON.parse(localStorage.getItem('account'));
			vm.account = (savedAccount == null) ? {} : savedAccount;

			// Connect to server
			var server = io.connect(SERVER);

			// Send message event handler
			vm.sendMessage = function () {	
				var message = $('#messageInput').val();
				$('#messageInput').val('');

				// Emit message event with message content
				server.emit('message', message);
			};

			vm.filterConnectedClients = function(clients) {
				var result = {};
    		angular.forEach(clients, function(value, key) {
	        if (!value.disconnected) {
	            result[key] = value;
	        }
    		});
    		return result;
			};

			// Listen for successful connection event
			server.on('connect', function () {

				// Save id to identify own messages
				// vm.clientId = this.id;

				while (vm.account.nickname == null || vm.account.nickname == "") {
					vm.account.nickname = prompt("What is your nickname?")
					localStorage.setItem("account", JSON.stringify(vm.account));
				}

				// Emit join event with chosen nickname
				server.emit('join', vm.account);
			});

			// Listen on identity event to save uuid generated by server
			server.on('identity', function (uuid) {
				vm.account.uuid = uuid;
				localStorage.setItem("account", JSON.stringify(vm.account));
			});

			// Listen on client-join event to get list of current users in the chat
			server.on('client-join', function (account) {
				vm.clients[account.uuid] = account;
				$scope.$evalAsync();
			});

			// Listen on client-left event to cleanup disconnected clients
			server.on('client-left', function(account) {
				var client = vm.clients[account.uuid];
				if (client) {
					client.disconnected = true;
					$scope.$evalAsync(); 
				}
			});

			// Listen for the 'message' event
			server.on('message', function (message) {

				// Set ingoing vs outgoing
				if (vm.account.uuid == message.sender.uuid)
					message.isSender = true;
				else
					notificationAudio.play();

				if (vm.clients[message.sender.uuid]) {
					vm.clients[message.sender.uuid].lastMessage = message;
				}

				vm.messages.push(message);
				$scope.$evalAsync();
			});
		};
	}
})();
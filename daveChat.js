var express =  require('express');
var app = express();
var favicon = require('serve-favicon');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var redis = require('redis');
var redisClient = redis.createClient();
var uuid = require('node-uuid');

// Port to have this server listen on.
var port = 8081;

app.use(favicon(__dirname + '/public/favicon.ico'));


// Listen for new connection
io.on('connection', function(client) {
	console.log('Client connected...');

	// Listen on 'join' event for client
	client.on('join', function (account) {

		if ( (!account.hasOwnProperty('uuid')) || account.uuid == null) {
			account.uuid = uuid.v4();
			client.emit('identity', account.uuid);
		}
		client.account = account;

		console.log(client.account.nickname + ' joined the chat...');
		console.log(client.account.nickname + " has id: " + client.account.uuid);

		// Tell all clients about new client
		client.broadcast.emit('client-join', client.account);

		// Emit list of clients to new client
		io.of("/").clients(function (error, clients) {
			clients.forEach(function (cli) {
				var cliObj = io.sockets.connected[cli];
				if (cliObj.account != null) {
					client.emit('client-join', cliObj.account);
				}
			});
		});

		// Get all messages from redis
		redisClient.lrange('messages', 0, -1, function (err, messages) {
			if (messages) {
				messages.reverse();
				
				// Send each existing message to client for chat context
				messages.forEach(function (message) {
					message = JSON.parse(message);
					client.emit('message', message);
				});
			}
		});
	});

	// Listen on 'message' event from client
	client.on('message', function(data) {

		var sender = client.account;

		var message = {
			sender: sender,
			content: data,
			timestamp: new Date()
		};

		client.broadcast.emit('message', message);
		client.emit('message', message);

		var stringMessage = JSON.stringify(message);
		console.log(stringMessage);

		redisClient.lpush('messages', stringMessage, function (err, response) {
			redisClient.ltrim('messages', 0, 100);
		});
	});

	// Listen on disconnect event for the client
	client.on('disconnect', function() {
		if (client.account)
			console.log("Client: " + client.account.nickname + " has disconnected...");
			client.broadcast.emit('client-left', client.account);
		}
	});

});

console.log("Starting up DaveChat, listening on port " + port);
server.listen(port);
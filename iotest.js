var express =  require('express');
var app = express();
var favicon = require('serve-favicon');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var redis = require('redis');
var redisClient = redis.createClient();

app.use(favicon(__dirname + '/public/favicon.ico')); 

io.on('connection', function(client) {
	console.log('Client connected...');

	client.on('join', function (name) {
		client.nickname = name;
		console.log(client.nickname + ' joined the chat...');

		redisClient.lrange('messages', 0, -1, function (err, messages) {
			if (messages) {
				messages.reverse();
				messages.forEach(function (message) {
					message = JSON.parse(message);
					client.emit('message', message);
				});
			}
		});
	});

	client.on('message', function(data) {

		var message = {
			sender: client.nickname,
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
});

server.listen(8081);
var express =  require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var redis = require('redis');
var redisClient = redis.createClient();

app.use("/", express.static(__dirname + '/public'));

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
					client.emit('messages', message.name + ': ' + message.data);
				});
			}
		});
	});

	client.on('messages', function(data) {

		var nickname = client.nickname;

		client.broadcast.emit('messages', nickname + ': ' + data);
		client.emit('messages', nickname + ': ' + data);

		var message = JSON.stringify({name : nickname, data: data});
		console.log(message);

		redisClient.lpush('messages', message, function (err, response) {
			redisClient.ltrim('messages', 0, 10);
		});
	});
});

app.get('/', function (request, response) {
		response.sendFile("index.html");
});

server.listen(8081);
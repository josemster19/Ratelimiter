
var http = require('http')
var fs = require('fs')

var queue = [];

var serverFunction = function(request, response) {
	if (request.url == '/') {
		response.writeHead(200, {'Content-Type': 'text/html'})
		fs.createReadStream('index.html').pipe(response)
	} else {
		queue.push({request: request, response: response})
	}
}

http.createServer(serverFunction).listen(8081);

console.log("Server started!")

// ################# TODO #########################

var TokenBucket = function(refill_rate, max_tokens) {
	var tokens = 0;

	this.getOneToken = function(callback) { 
			if(tokens > 0){
				tokens--
				callback(true)
			}else{
				callback(false)
			}	
	}

	this.addToken = function() {
		tokens = tokens	+ refill_rate
		if(tokens > max_tokens){
			tokens = max_tokens	
		}
	}


	setInterval(this.addToken,1000)


}


var tokenBucket = new TokenBucket(3, 10);

var realServerFunction = function() {




	if(queue.length > 0){
		tokenBucket.getOneToken(function(bool){
			if(bool){
				var o = queue.shift();
				o.response.writeHead(200, {'Content-Type': 'text/html'})
				o.response.write(o.request.url)
				o.response.end()
				realServerFunction()
			}
		})
	}
		
	
	







}

setInterval(realServerFunction, 100);




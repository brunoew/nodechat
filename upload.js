var http = require('http');
var fs 	 = require('fs');

http.createServer(function(request, response){
   response.writeHead(200);
   var newFile = fs.createWriteStream('arquivo.txt');
   var fileBytes = request.headers['content-length'];
   var uploaded = 0;

   request.pipe(newFile);

   request.on('data', function(chunk){
   	uploaded += chunk.length;
   	var progress = (uploaded / fileBytes) * 100;
   	response.write("* "+parseInt(progress, 10)+"%n");
   });

}).listen(9988);
console.log("Listening");
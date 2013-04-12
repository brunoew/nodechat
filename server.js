var app = require('http').createServer(handler),
    io = require('socket.io').listen(app)

app.listen(8084)

//Variáveis globais
var users = []
var dadosUsuarios = []

function handler (req, res) {
    res.writeHead(200)
    res.end("Servidor criado")
}

io.sockets.on('connection', function (socket) {
  var dados = null
  users[socket.id] = socket

  socket.emit('welcome') //Envia uma mensagem de boas vindas

  socket.on('auth', function(data){ //Recebe os dados do usuario
      dados = {dados: data, socket: socket.id}
      dadosUsuarios[socket.id] = dados

      for(i in users){
        users[i].emit('online', dados)
        
        if(users[i].id != socket.id)
          socket.emit('online', dadosUsuarios[users[i].id])
      }
  })

  socket.on('receive', function (data) { //ao receber uma mensagem, notifica atualiza o chat de todos os usuarios
    for(i in users){
      users[i].emit('receive', {usuario: dados, msg: data.msg})
    }
  })

  socket.on('disconnect', function(sck){ //Desconexão do usuário
      delete users[socket.id]
      delete dadosUsuarios[socket.id]

      for(i in users){
        users[i].emit('offline', {usuario: dados, socket: socket.id})
      }

  })

})
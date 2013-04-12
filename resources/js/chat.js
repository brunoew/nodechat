var socket = io.connect('http://192.168.25.11:8084');

socket.on('connect', function(){
    console.log('usuario conectado');
    $("#auth").show();
    $("#chat").hide();
});

socket.on('receive', function(data){
    console.log(data);
});

socket.on('online', function(usuario){
    $("#userArea ul").append("<li id='"+usuario.socket+"'>"+usuario.dados.nome+" <small>("+usuario.dados.email+")</small></li>");
});

socket.on('offline', function(dados){
    $("#"+dados.socket).remove();
});

socket.on('receive', function(data){
    console.log(data);

    var by = data.usuario.socket == socket.socket.sessionid ? "by_me" : "by_user";
    var date = new Date();

    $("#msgArea ul").append('<li class="'+by+'">'+
                          '<a><img alt="usuario" src="resources/img/chat_user.png"></a>'+
                          '<div class="messageArea">'+
                          '<span class="aro"></span>'+
                            '<div class="infoRow">'+
                            '<span class="name"><strong>'+data.usuario.dados.nome+'('+data.usuario.dados.email+')</strong> postou:</span>'+
                            '<span class="time">'+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+'</span>'+
                          '</div>'+
                          '<br class="clear">'+
                          data.msg+
                          '</div></li>');

    var m = document.getElementById('msgArea')
    m.scrollTop = m.scrollHeight;
});
      

    
$(function(){
    $("#auth form").bind('submit', function(e){
        e.preventDefault();
        var dados = { nome: $("#nome").val(), email: $("#email").val() };
        socket.emit('auth', dados);
        $("#auth").hide();
        $("#chat").show();
    });


    $("#chat form").bind('submit', function(e){
        e.preventDefault();
        socket.emit('receive', {msg: $("#msg").val()} );
        $("#msg").val("").focus();
    });
});
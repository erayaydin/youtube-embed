var socket = io.connect("http://127.0.0.1:3000");

$("#form").submit(function(){
    var code = $("#code").val();
    socket.emit("Update", code);
    return false;
});

socket.on('update', function(data){
    var link = "https://www.youtube.com/embed/"+data+"?autoplay=1";
    $("#youtube").attr("src", link);

    $("#code").attr("placeholder", data);
});
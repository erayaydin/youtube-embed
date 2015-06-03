var express      = require("express"),
    http         = require("http"),
    path         = require("path"),
    favicon      = require("serve-favicon"),
    logger       = require("morgan"),
    cookieParser = require("cookie-parser"),
    bodyParser   = require("body-parser"),
    forms        = require("forms"),
    csurf        = require("csurf");

var app = express();
var server = http.Server(app);
var io  = require("socket.io")(server);

app.set('views', path.join(__dirname, "views"));
app.set('view engine', "jade");

app.use(favicon(__dirname + "/public/favicon.ico"));
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname + "/public")));

// Routes
app.get("/", function(req, res){
    res.render("homepage", {
        title: "Homepage!",
        content: "What a lovely homepage :)"
    });
});

// 404 Handler
app.use(function(req, res, next){
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// Development Error Handler
if(app.get('env') === "development"){
    app.use(function(err, req, res, next){
        res.status(err.status || 500);
        res.render("error", {
            message: err.message,
            error: err
        });
    });
}

// Production Error Handler
app.use(function(err, req, res, next){
    res.status(err.status || 500);
    res.render("error", {
        message: err.message,
        error: {}
    });
});

// Socket.io Events
var currentID;
io.on('connection', function (socket) {
    console.log("user connected!");

    socket.emit("update", currentID);

    socket.on("Update", function(data) {
        console.log("New Video ID: "+data);
        currentID = data;
        io.emit("update", data);
    });

    socket.on('disconnect', function () {
        console.log("user disconnected!");
    });
});

server.listen(3000);
var requirejs = require('requirejs');

requirejs.config({
    nodeRequire: require
});

requirejs(

    ['http', 'express', 'johnny-five'],

    function(http, express, five) {

        var isOn = false;

        var board = new five.Board();

        board.on("ready", function() {  
          led = new five.Led(13);
          board.repl.inject({
            led: led
          });
        })

        var server = express();
        
        server.configure(function(){
            server.set('port', 8888);        
            server.use(express.bodyParser());
        });
        
        server.get('/', function(req, res) {
            res.writeHeader(200, {"Content-Type": "text/html"});
            res.write('Nothing!\n');
            res.end();
        });

        server.get('/toggle', function(req, res) {

            (isOn) ? led.off() : led.on();

            isOn = !isOn;

            console.log(led.value);

            res.writeHeader(200, {"Content-Type": "text/html"});
            res.write('Nothing!\n');
            res.end();
        });

        http.createServer(server).listen(server.get('port'), function(){
            console.log('Express server listening on port ' + server.get('port'));
        }); 
        
    }
);
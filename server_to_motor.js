var requirejs = require('requirejs');

requirejs.config({
    nodeRequire: require
});

requirejs(

    ['http', 'express', 'johnny-five'],

    function(http, express, five) {

        var board = new five.Board(),
            motor;

        board.on("ready", function() {  

            // Create a new `motor` hardware instance.
            motor = new five.Motor({
                pin: 9
            });

            // Inject the `motor` hardware into
            // the Repl instance's context;
            // allows direct command line access
            board.repl.inject({
                motor: motor
            });

            // Motor Event API

            // "start" events fire when the motor is started.
            motor.on("start", function( err, timestamp ) {
                console.log( "start", timestamp );

                // Demonstrate motor stop in 2 seconds
                board.wait( 2000, function() {
                  motor.stop();
                });
            });

            // "stop" events fire when the motor is started.
            motor.on("stop", function( err, timestamp ) {
                console.log( "stop", timestamp );
            });


        });

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

        server.get('/revup', function(req, res) {

            motor.start();

            res.writeHeader(200, {"Content-Type": "text/html"});
            res.write('Nothing!\n');
            res.end();
        });

        http.createServer(server).listen(server.get('port'), function(){
            console.log('Express server listening on port ' + server.get('port'));
        }); 
        
    }
);
var express = require('express');
var io = require('socket.io');
var csv = require('ya-csv');
var geocoder = require('geocoder');
var $ =require('jquery');
var fs = require('fs');
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = mongoose.SchemaTypes.ObjectId;
var geo= new Schema({
     lat: Number
    ,lon: Number
    ,cap: Number
    ,count: Number
    ,type: String
})
var interests;
mongoose.connect('mongodb://localhost/sharry');
var geoModel = mongoose.model('geos', geo);





var dati=[];
var j=0;





var nUt=0;


/*reader.addListener('data', function(data) {
    var i=0;
    while(data[i]!=null ){
        if(i==1 && data[i]!=""){
            dati[j]=data[i];
            j++;

        }

        i++;

    }
});
reader.addListener('end',gohead);
 */

var app = express.createServer(
    express.bodyParser()
    , express.static(__dirname + "/public")
    , express.cookieParser()
    , express.session({ secret:'desrever'})
),io = io.listen(app);
io.set('log level', 1);


app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.register('.html', require('jade'));
    app.use(express.compiler({ src:__dirname + '/views', enable:['less'] }));
});

app.get('/', function (req, res) {



    res.render('index');


});
var z=0;
var ci=0;
var cord=[];
var socdone=false;
code(1);


function soc(){


            io.sockets.on('connection', function (socket) {
                var p=0;
                socket.on('createEvent',function(where){
                    console.log("ciao");
                    if(where.indexOf(",")!=-1)
                        where=where+", karlskrona";
                    geocoder.geocode(where,function ( err, data ){
                        var obj= JSON.parse(JSON.stringify(data));

                        if(obj.status=="OVER_QUERY_LIMIT"){
                            console.log(JSON.stringify("OVER_QUERY_LIMIT"));


                        }
                        else if(obj.results[0]!=null){
                            var lat1=obj.results[0].geometry.location.lat;
                            var lon1=obj.results[0].geometry.location.lng;

                            cord[p]=[lat1,lon1];

                            console.log(cord[p]);


                        }


                        socket.emit('cord', cord[p]);




                    });
                });



            });



}
function find(x){




           code(x);




}
function code(x){

    var lat1="";
    var lon1="";

    console.log(dati.length);









        soc();











}




app.listen(8000);

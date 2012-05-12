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

     if(!socdone){
            io.sockets.on('connection', function (socket) {
                var p=0;
                socket.on('createEvent',function(event){

                    geocoder.geocode("kanstrasse, Berlin",function ( err, data ){
                        var obj= JSON.parse(JSON.stringify(data));

                        if(obj.status=="OVER_QUERY_LIMIT"){
                            console.log(JSON.stringify("OVER_QUERY_LIMIT"));


                        }
                        else if(obj.results[0]!=null){
                            var lat1=obj.results[0].geometry.location.lat;
                            var lon1=obj.results[0].geometry.location.lng;

                            cord[6]=[lat1,lon1];

                            console.log(cord[6]);


                        }


                    });
                });

                while(p<cord.length){

                    socket.emit('cord', cord[p]);

                    p++;
                }
                socdone=true;

            });
     }
    else{
         io.sockets.emit('cord',  cord[cord.length-1]);
     }

}
function find(x){




           code(x);




}
function code(x){

    var lat1="";
    var lon1="";

    console.log(dati.length);







                        cord[0]=[ 52.51580 ,13.32024];
                        cord[1]=[ 52.54337 ,13.42392];
                        cord[2]=[ 52.46605 ,13.42461];
                        cord[3]=[ 52.50285 ,13.40950];
                        cord[4]=[ 52.55047 ,13.34976];
                        cord[5]=[ 52.811397 ,13.669480];


        soc();











}




app.listen(8000);

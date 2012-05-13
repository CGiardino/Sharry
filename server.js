var express = require('express');
var io = require('socket.io');
var csv = require('ya-csv');
var geocoder = require('geocoder');
var $ =require('jquery');
var fs = require('fs');
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = mongoose.SchemaTypes.ObjectId;
var event= new Schema({
     lat: Number
    ,lon: Number
    ,title: String
    ,skill:Number
    ,when: String
    ,where: String
    ,comments: String
    ,date: { type: Date, default: Date.now}
    })

mongoose.connect('mongodb://localhost/sharry');
var evModel = mongoose.model('event', event);


setInterval(function(){
    var now= new Date();
    evModel.find({},function(err,docs){



            for(var i=0;i<docs.length; i++){

                var dp= docs[0].date;
                dp.setHours(dp.getHours()+48);

                if(dp.getTime()<now.getTime())
                    for(j in events)
                        if(events[j].lat==docs[i].lat && events[j].lon==docs[i].lon)
                            events.splice(j,1);

            }

    });
},180000);
var events=[];
function getEvents(){
    evModel.find({},function(err,docs){
         for(var i=0;i<docs.length; i++){
              events[i]=docs[i];
           }
    });
};
getEvents();
var dati=[];
var j=0;










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

code(1);


function soc(){


            io.sockets.on('connection', function (socket) {

                for(var i=0;i<events.length; i++){
                    var ev=[events[i].lat,events[i].lon,events[i].title,events[i].skill,events[i].when,events[i].where,events[i].comments];
                    socket.emit('cord',ev);

                }

                var p=0;
                socket.on('removeEvent',function(info){
                        var where=info;
                    console.log(where);
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

                                for(var i=0; i<events.length;i++ )
                                {

                                    if(events[i].lat==lat1 && events[i].lon==lon1)
                                        events.splice(i,1);
                                }




                            }

                            evModel.findOne({'lat':lat1,'lon':lon1},function (err,doc1){
                                console.log("c1111,"+lat1+","+lon1);
                                if(doc1!=null){

                                    doc1.remove();
                                }

                            });
                            socket.emit('removedEvent', cord[p]);




                        });

                });
                socket.on('createEvent',function(info){
                    console.log(info);
                    where=info[3];

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

                            cord[p]=[lat1,lon1,info[0],info[1],info[2],info[3],info[4]];
                            events[events.length]={lat:lat1,lon:lon1,title:info[0],skill:info[1],when:info[2],where:info[3],comments:info[4]};




                        }

                        evModel.findOne({'lat':lat1,'lon':lon1},function (err,doc1){
                           if(doc1==null){
                                var doc= new evModel();
                                doc.lat=lat1;
                                doc.lon=lon1;
                                doc.title= info[0];
                                doc.where=info[3];
                                doc.skill=info[1];
                                doc.when=info[2];
                                doc.comments=info[4];
                                doc.save();
                           }
                           else
                              console.log("event already exists");
                        });
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
        soc();
}




app.listen(8000);

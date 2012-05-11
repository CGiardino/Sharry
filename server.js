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
mongoose.connect('mongodb://localhost/milkplease');
var geoModel = mongoose.model('geos', geo);




var dati=[];
var j=0;
var MailChimp=require('mailchimp');
var MailChimpWebhook = MailChimp.MailChimpWebhook;

var MailChimpExportAPI = MailChimp.MailChimpExportAPI;




var apiKey = 'ad35e8926f0c786cc82e302c3134f786-us4';
var webhook = new MailChimpWebhook(apiKey,{port:8100, secure:false});
try {
    var exportApi = new MailChimpExportAPI(apiKey, { version : '1.0', secure: false });

} catch (error) {
    console.log('Error: ' + error);
}
var nUt=0;
function readList(){
    nUt=0;
    j=0;
    interests=[0,0,0,0,0];
    geoModel.update({},{count:0},{multi:true},function(err,data){});
    exportApi.list({ id : '2091439f7f'  }, function (data) {

        if (data.error)
            console.log('Error: '+data.error+' ('+data.code+')');
        else{
            var i=1;


            while(data[i]!=null){
                nUt++;
                if(data[i][3]!=null)    {



                         if( data[i][3].indexOf("Poter ricevere la spesa rimanendo a casa.")!=-1)
                             interests[0]++;

                         if( data[i][3].indexOf("Guadagnare facendo piccole consegne per altri utenti.")!=-1)
                             interests[1]++;

                         if( data[i][3].indexOf("Voglio offrire il servizio di Milk")!=-1)
                             interests[2]++;

                         if( data[i][3].indexOf("Pubblicizzare i miei prodotti tramite suggerimenti sponsorizzati.")!=-1)
                             interests[3]++;

                         if( data[i][3].indexOf("Sono curioso")!=-1)
                             interests[4]++;


                     }

                if(data[i][1]!=null && data[i][1]!=""){

                    dati[j]=data[i][1];

                    j++;

                }
                i++;
            }
            populate(0);
        }

    });
    }
readList();
function populate(j){

            if(j<dati.length)
                geoModel.findOne({'cap':dati[j]},function (err,doc){

                    if(doc==null){

                        var geoInstance= new geoModel();
                        geoInstance.cap=dati[j];


                        geoInstance.save(function(err,docs){});



                    }
                    else{



                    }
                    populate(++j);

                });
            else

                    gohead();
}

webhook.on('error', function (message) {
    console.log('Error: '+message);
});

webhook.on('subscribe', function (data) {


    readList();
    console.log("ecco"+data);
});
webhook.on('unsubscribe', function (data, meta) {
    readList();
});

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
function gohead(){
    z++;
    find(z);
}


function soc(){

     if(!socdone){
            io.sockets.on('connection', function (socket) {
                var p=0;

                socket.emit('interests',interests);
                while(p<cord.length){

                    socket.emit('cord', cord[p]);

                    p++;
                }
                socdone=true;
                socket.emit('nUtenti',nUt);
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




app.listen(8080);

var express = require('express');
var router = express.Router();
var mongo = require('./mongodb/mongo');
var session = require('client-sessions');
var url='mongodb://dheemanth10:Dheemanth0@ds117422.mlab.com:17422/project-281'
var expressSessions = require("express-session");


router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

var dummy="dummy";

router.post('/login', function (req, res, next) {

    var email = req.body.email;
    var password = req.body.password;
    console.log("reached login");

    mongo.connect(function (db) {
        var coll = db.collection('user');
        coll.findOne({'email': email, 'password': password}, function (err, user) {
            if (err) {
                res.json({
                    status: '401'
                });
            }
            if (!user) {
                console.log('User Not Found with email ' + email);
                res.json({
                    status: '401'
                });
            }
            else {
                // dummy=user.Username;
                res.json({
                    email: email,
                    status: 200,
                    value: user
                });
            }
        });
    });
});


router.post('/signup', function (req, res, next) {

    var email = req.body.email;
    var Username = req.body.username;
    var password = req.body.password;

    console.log("email :" + email);
    console.log("UserName :" + Username);

    var data = {Username : Username,
        email : email,
        password : password
    }
    mongo.connect(function(db){
        console.log("Connected to MongoDB at ",url);

        var coll = db.collection('user');
        coll.findOne({'email':email},function (err,user) {
            if(err){
                console.log("sending status 401")
                res.json({
                    status : '401'
                });
            }
            else if(user){
                console.log("sending status 401")
                res.json({
                    status : '401'
                });
            }

            else{
                mongo.insertDocument(db,'user',data,function (err,results) {
                    if (err) {
                        console.log("sending status 401")
                        res.json({
                            status: '401'
                        });
                    }
                    else {
                        console.log("User Registered")
                        var path = results["ops"][0]["_id"];
                        console.log(path);
                        res.json({
                            status: 200,
                        });
                    }
                });
            }
        })
    });
});

router.post('/temp', function (req, res, next) {

    var body = req.body;
    console.log("reached temp");

    mongo.connect(function (db) {
        console.log("Connected to MongoDB at ",url);
        var coll = db.collection('Temperature');
        coll.find({}).toArray(function (err, user) {
            if (err) {
                res.json({
                    status: '401'
                });
            }
            if (!user) {
                console.log('Temperature ' + user);
                res.json({
                    status: '401'
                });
            }
            else {
                // dummy=user.Username;
                console.log('Temperature ' + user[user.length-1].value);
                let last_temp=user[user.length-1].value;
                res.json({
                    temperature: last_temp,
                    // value:user
                });
            }
        });
    });
});

router.post('/humid', function (req, res, next) {
    console.log("reached humid");

    mongo.connect(function (db) {
        console.log("Connected to MongoDB at ",url);
        var coll = db.collection('Humidity');
        coll.find({}).toArray(function (err, user) {
            if (err) {
                res.json({
                    status: '401'
                });
            }
            if (!user) {
                console.log('Temperature ' + user);
                res.json({
                    status: '401'
                });
            }
            else {
                console.log('Temperature ' + user[user.length-1].value);
                let last_temp=user[user.length-1].value;
                res.json({
                    humidity: last_temp,
                });
            }
        });
    });
});

router.post('/table', function (req, res, next) {
    console.log("reached table");
    var device_type = req.body.device_type+" Sensor";
    var street_name = req.body.street_name;

    console.log("device_type :" + device_type);
    console.log("street_name :" + street_name);
    mongo.connect(function (db) {
        console.log("Connected to MongoDB at ",url);
        var coll = db.collection('Table');
        if(device_type!=="All Sensor" || street_name!=="All"){
            coll.find({'devicetype': device_type, 'location': street_name}).toArray(function (err, user) {
                if (err) {
                    res.json({
                        status: '401'
                    });
                }
                if (!user) {
                    console.log('Temperature ' + user);
                    res.json({
                        status: '401'
                    });
                }
                else {
                    // dummy=user.Username;
                    console.log("Table-->",user);
                    res.json({
                        deviceData: user
                    });
                }
            });
        }
        else{
            coll.find({}).toArray(function (err, user) {
                if (err) {
                    res.json({
                        status: '401'
                    });
                }
                if (!user) {
                    console.log('Temperature ' + user);
                    res.json({
                        status: '401'
                    });
                }
                else {
                    // dummy=user.Username;
                    console.log("Table-->",user);
                    res.json({
                        deviceData: user
                    });
                }
            });
        }
    });
});

router.post('/getMovieHalls', function (req, res, next) {

    var result = [];
    var monthcheck='';
    var month_inp=0;
    var final=[];
    if(req.body.month==='on') {
        console.log("its a month");
        switch (req.body.month_inp) {
            case 'Jan':
                month_inp = 1;
                break;
            case 'Feb':
                month_inp = 2;
                break;
            case 'Mar':
                month_inp = 3;
                break;
            case 'Apr':
                month_inp = 4;
                break;
            case 'May':
                month_inp = 5;
                break;
            case 'jun':
                month_inp = 6;
                break;
            case 'Jul':
                month_inp = 7;
                break;
            case 'Aug':
                month_inp = 8;
            case 'Sep':
                month_inp = 9;
                break;
            case 'Oct':
                month_inp = 10;
                break;
            case 'Nov':
                month_inp = 11;
                break;
            case 'Dec':
                month_inp = 12;
                break;
        }
        if(month_inp>=10)
            monthcheck = req.body.year_inp+'-'+month_inp;
        else
            monthcheck = req.body.year_inp+'-'+'0'+month_inp;

        console.log("monthcheck:",monthcheck);
    }
    console.log("Reached all get halls",req.body);
    var year_inp=req.body.year_inp;
    mongo.connect(function (db) {
        console.log("Connected to MongoDB at ", url)

        mongo.connect(function (db) {
            if(req.body.sensor=='Temperature')
                var coll = db.collection('Temperature');
            else if(req.body.sensor=='humidity')
                var coll = db.collection('Temperature');
            else
                var coll = db.collection('Light_Sensor');

            console.log("dummy");
            coll.find({}).toArray(function (err, user) {
                if (err) {
                    console.log("err")
                    res.json({
                        status: '401'
                    });
                }
                else {
                    //console.log("no err",user)


                    user.map(row=>{

                        // console.log('typeof timestamp:',typeof(row.timestamp));
                        // console.log('typeof req.year_inp:',typeof(req.body.year_inp));
                        // console.log('timestamp:',row.timestamp);
                        // console.log('year_inp:',req.body.year_inp);
                        if(req.body.year=='on') {
                            if (row.timestamp.indexOf(req.body.year_inp) != -1) {
                                result.push(row);
                            }
                        }

                        else if(req.body.month=='on')
                        {
                            if (row.timestamp.indexOf(monthcheck) != -1) {
                                result.push(row);
                            }

                        }

                        else if(req.body.date=='on')
                        {
                            if (row.timestamp.indexOf(req.body.date_inp) != -1) {
                                result.push(row);
                            }

                        }

                    });
                    let i;
                    for(i=0;i<10 && i<result.length;i++)
                    {
                        final.push(result[i]);
                    }

                    res.json({
                        readings: final
                    });

                }
            });
        });
    });
});



router.post('/addsensor', function (req, res, next) {
    console.log("in addhall");

    var devicetype = req.body.sensor_name;
    var location = req.body.location;
    var installed = req.body.date_inp;
    var data = {
        devicetype : devicetype,
        location : location,
        installed : installed
    }

    mongo.connect(function(db){
        console.log("Connected to MongoDB at ",url)


            mongo.insertDocument(db, 'Table', data, function (err, results) {
                if (err) {
                    console.log("sending status 401")
                    res.json({
                        status: false
                    });
                }
                else {
                    console.log("sensor added successfully")
                    var path = results["ops"][0]["_id"];
                    console.log(path);
                    res.json({
                        status: true,
                    });
                }
            });



    });
});


router.post('/delsensor', function (req, res, next) {
    console.log("in addhall");

console.log("devicet:",req.body.del)
    var devicetype = req.body.del;
    var data = {
        devicetype : devicetype,

    }

    mongo.connect(function(db){
        console.log("Connected to MongoDB at ",url)


        mongo.deleteDocument(db, 'Table', data, function (err, results) {
            if (err) {
                console.log("sending status 401")
                res.json({
                    status: false
                });
            }
            else {
                res.json({
                    status: true,
                });
            }
        });



    });
});


router.post('/viewsensors', function (req, res, next) {


    var hallId = req.body.hallId;
    console.log("in viewAllUsers",hallId);

    mongo.connect(function(db){
        console.log("Connected to MongoDB at ",url)
        var coll = db.collection("Table");
        coll.find().toArray(function(err, user) {

            if (err) {
                console.log("sending status 401")
                res.json({
                    status: false
                });
            }
            else {
                //var path = results["ops"][0]["_id"];
                console.log("all useres",user);

                res.json({
                    value:user,
                    status: true,
                });
            }
        });
    });
});



router.post('/logout', function(req,res){
    var session=req.session;
    dummy="dummy";
    console.log("In logout ", req.session.user)
    session.user = null;
    session.destroy();
    res.json({
        status:'200',
        message : "Logged Out."
    });
});
module.exports = router;
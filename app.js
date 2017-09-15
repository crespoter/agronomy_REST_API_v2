/*
REST API for recieving farmer details
list of services:
*villages list      /villagelist
*village name lookup with id        /villagelookup/:villageid
*average profit of all villages     /profit/all
*profit of a single village         /profit/village/:villageid
*profit of a particular person      /profit/person/:personid

*/
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var multer = require('multer');
var fs = require('fs');


var app = express();

//Connection to mongodb hosted at mlab.com  and starting the server 
/*
MongoDB user details :
username : crespoter
password : blanserver
*/
MongoClient.connect("mongodb://crespoter:blanserver@ds157233.mlab.com:57233/farmer_details", (err, database) => {
    if (err)
        console.log(err);
    db = database;
    app.listen(process.env.PORT || 3000, () => {
        console.log("listening to port " + process.env.PORT);
    });
});

//SETS views,view engine,bodyparser,public directory etc
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//INDEX REDIRECTION FOR API DOCUMENTATION

app.get('/', (req, res) => {
    res.redirect("https://github.com/crespoter/agronomy_REST_API");
});
//REST API to return list of all villages
app.get('/villagelist', (req, res) => {
    db.collection("villages").find().toArray((err, results) => {
        res.json(results);
    });
});

//REST API to lookup villages with their ids
/*
    Returns a json with the following elements:
    success  < -  true if lookup is successfull false if it failed
    village_name <-  village name of id lookup .... Only available if lookup is successfull
*/

app.get('/villageidlookup/:villageid', (req, res) => {
    db.collection("villages").find({ _id: ObjectID(req.params.villageid) }).toArray((err, results) => {
        var retJson = {};
        if (results.length == 0) {
            retJson.success = false;
            res.json(retJson);
        }
        else {
            retJson.success = true;
            retJson.village_name = results[0].village_name;
            res.json(retJson);
        }
    });
})


//################################################################################# PROFIT ######################################################################

//REST API to get profit of a paricular village
/*
    return json with the following elements:
    success: true if village id found false if failed
    rest of the json will only be available if success is true
    profts: an array of json objects containing followin info:
        date : date the profit was recorded in the format mm-yyyy
        profit : profit gained during this period
*/
app.get('/profit/village/:villageid', (req, res) => {
    console.log(req.params.villageid);
    db.collection("profit").find({ village_id: req.params.villageid}).toArray((err, results) => {
        var retJson = {};
        if (results.length == 0) {
            retJson.success = false;
            res.json(retJson);
        }
        else {
            retJson.success = true;
            retJson.profits = results;
            res.json(results);
        }
    })
});


//REST API to get profit of a paricular person
/*
    return json with the following elements:
    success: true if person id found false if failed
    rest of the json will only be available if success is true
    profts: an array of json objects containing followin info:
        date : date the profit was recorded in the format mm-yyyy
        profit : profit gained during this period
*/

app.get('/profit/person/:username', (req, res) => {
    db.collection("profit_person").find({ person_username: req.params.username }).toArray((err, results) => {
        var retJson = {};
        if (results.length == 0) {
            retJson.success = false;
            res.json(retJson);
        }
        else {
            retJson.success = true;
            retJson.profits = results;
            res.json(results);
        }
    });
});





//REST API to get average profits of all village
/*
    returns a json with the following elements:
    village_info : an array of json objects containing following info :
        date: date of profit in format mm-yyyy
        profit : profit gained during this period        
*/
app.get('/profit/all', (req, res) => {
    db.collection("profit_all").find().toArray((err, results) => {
        retJson = {
            village_info: results
        };
        res.json(retJson);
    });
});


/////////////################################  CROPS   #######################################////////////////////////////////////////////////////


//REST API to get list of average distribution of crops cultivated
/*
    return json with the following elements:
    crops: an array of json objects containing followin info:
        date : date the profit was recorded in the format mm-yyyy
        crop_cultivated : crop cultivated in that period
        area : area that crop was cultivated
*/
app.get('/cropcultivated/all', (req, res) => {
    db.collection("crop_cultivated").find().toArray((err, results) => {
        retJson = {
            crops: results
        };
        res.json(retJson);
    });
});


//REST API to get average distribution of crops cultivated in a village
/*
    return json with the following elements:
    crops: an array of json objects containing followin info:
        villageid : village id
        date : date the profit was recorded in the format mm-yyyy
        crop_cultivated : crop cultivated in that period
        area : area that crop was cultivated
*/
app.get('/cropcultivated/village/:villageid', (req, res) => {
    db.collection("crop_cultivated_village").find({ "village_id": req.params.villageid }).toArray((err, results) => {
        retJson = {
            crops: results
        };
        res.json(retJson);
    });
});



//REST API to get average distribution of crops cultivated by a user
/*
    return json with the following elements:
    crops: an array of json objects containing followin info:
        username: username
        date : date the profit was recorded in the format mm-yyyy
        crop_cultivated : crop cultivated in that period
        area : area that crop was cultivated
*/
app.get('/cropcultivated/person/:username', (req, res) => {
    db.collection("crop_cultivated_person").find({ "username": req.params.username }).toArray((err, results) => {
        retJson = {
            crops: results
        };
        res.json(retJson);
    });
});

//######################################################################  PESTS    ################################################################################

//REST API to get list of average loss by pests
/*
    return json with the following elements:
    pests: an array of json objects containing followin info:
        date : date the pest was recorded in the format mm-yyyy
        pest_name : pest name
        loss : loss made by that pest
*/
app.get('/pests/all', (req, res) => {
    db.collection("pest_all").find().toArray((err, results) => {
        retJson = {
            pests: results
        };
        res.json(retJson);
    });
});


//REST API to get average loss by pests in a particular village
/*
    return json with the following elements:
    pests: an array of json objects containing followin info:
        villageid : village id
        date : date the profit was recorded in the format mm-yyyy
        pest_name : pest name
        loss : loss made by that pest in INR
*/
app.get('/pests/village/:villageid', (req, res) => {
    db.collection("pest_village").find({ "village_id": req.params.villageid }).toArray((err, results) => {
        retJson = {
            pests: results
        };
        res.json(retJson);
    });
});



//REST API to get average distribution of loss due to pests by a user
/*
    return json with the following elements:
    pests: an array of json objects containing following info:
        username: username
        date : date the loss was recorded in the format mm-yyyy
        pest_name : pest name
        loss : loss made by that pest in INR
*/
app.get('/pests/person/:username', (req, res) => {
    db.collection("pest_person").find({ "username": req.params.username }).toArray((err, results) => {
        retJson = {
            oests: results
        };
        res.json(retJson);
    });
});


//######################################################################  LAND DISTRIBUTION    ################################################################################

//REST API to get list of average land distribution
/*
    return json with the following elements:
    lands: an array of json objects containing followin info:
        date : date the land distribution was recorded in the format mm-yyyy
        land_type : land type
        area : area of that type
*/
app.get('/land/all', (req, res) => {
    db.collection("land_all").find().toArray((err, results) => {
        retJson = {
            land: results
        };
        res.json(retJson);
    });
});


//REST API to get average land distribution in a particular village
/*
    return json with the following elements:
    land: an array of json objects containing followin info:
        villageid : village id
        date : date the land distribution was recorded in the format mm-yyyy
        land_type : pest name
        area : area of that type
*/
app.get('/land/village/:villageid', (req, res) => {
    db.collection("land_village").find({ "village_id": req.params.villageid }).toArray((err, results) => {
        retJson = {
            land: results
        };
        res.json(retJson);
    });
});



//REST API to get average land distribution by a user
/*
    return json with the following elements:
    land: an array of json objects containing following info:
        username: username
        date : date the loss was recorded in the format mm-yyyy
        land_type : pest name
        area : area of that type
*/
app.get('/land/person/:username', (req, res) => {
    db.collection("land_person").find({ "username": req.params.username }).toArray((err, results) => {
        retJson = {
            land: results
        };
        res.json(retJson);
    });
});



//    FOR SUBMISSION ON 31- August
app.get('/householddetails/:id', (req, res) => {
    db.collection("Household").find({ "_id": ObjectID(req.params.id) }).toArray((err, results) => {
        if (results.length == 0)
        {
            res.json({ "success": false });
        }
        else
        {
            res.json({
                "success": true,
                "details": results[0]
            });
        }
    });
});

app.get('/member/:name', (req, res) => {
    db.collection("Member").find({ "name": req.params.name }).toArray((err, results) => {
        if (results.length == 0) {
            res.json({ "success": false });
        }
        else {
            res.json({
                "success": true,
                "details": results[0]
            });
        }
    });
});

app.get('/farms/:householdid', (req, res) => {
    db.collection("Farms").find({ household_id: req.params.householdid }).toArray((err, results) => {
        if (results.length == 0) {
            res.json({ "success": false });
        }
        else {
            res.json({
                "success": true,
                "details": results
            });
        }
    });
});

app.get('/farms/location/:farmid', (req, res) => {
    db.collection("Farms_area").find({ farm_id: req.params.farmid }).toArray((err, results) => {
        if (results.length == 0) {
            res.json({ "success": false });
        }
        else {
            res.json({
                "success": true,
                "details": results
            });
        }
    });
});

app.get('/crops/:farmid', (req, res) => {
    db.collection("Crops").find({farm_id: req.params.farmid }).toArray((err, results)=>{
        if (results.length == 0) {
            res.json({ "success": false });
        }
        else {
            res.json({
                "success": true,
                "details": results
            });
        }
    });
});


app.get('/wells/:farmid', (req, res) => {
    db.collection("Wells").find({farm_id: req.params.farmid }).toArray((err, results) => {
        if (results.length == 0) {
            res.json({ "success": false });
        }
        else {
            res.json({
                "success": true,
                "details": results
            });
        }
    });
});


app.get('/wells/wateryield/:wellid', (req, res) => {
    db.collection("Water_yield").find({ well_id: req.params.wellid }).toArray((err, results) => {
        if (results.length == 0) {
            res.json({ "success": false });
        }
        else {
            res.json({
                "success": true,
                "details": results[0]
            });
        }
    });
});






app.get('/all/:name', (req, res) => {
    var retJson = {};
    db.collection("Member").find({ "name": req.params.name }).toArray((err, results) => {
        if (results.length == 0) {
            res.json({ "success": false });
        }
        else {

            retJson.member_details = results[0];
            db.collection("Household").find({ "_id": ObjectID(results[0]["household-id"]) }).toArray((err, results) => {
                if (results.length == 0) {
                    res.json({ "success": false });
                }
                else {
                    retJson.household_details = results[0];
                    db.collection("Farms").find({ "householdid": retJson.household_details._id + '' }).toArray((err, results) => {
                        retJson.farm_details = results[0];
                        var farmid = results[0]._id + "";
                        db.collection("Farms_area").find({ farm_id: results[0]._id +"" }).toArray((err, results) => {
                            if (results.length == 0) {
                                res.json({ "success": false });
                            }
                            else {
                                retJson.farm_area = results[0];
                                db.collection("Crops").find({ farm_id: farmid}).toArray((err, results) => {
                                    if (results.length == 0) {
                                        res.json({ "success": false });
                                    }
                                    else {
                                        retJson.crop_details = results[0];
                                        db.collection("Wells").find({ farm_id: farmid }).toArray((err, results) => {
                                            if (results.length == 0) {
                                                res.json({ "success": false });
                                            }
                                            else {
                                                retJson.well_details = results[0];
                                                db.collection("Water_yield").find({ well_id: results[0]._id+"" }).toArray((err, results) => {
                                                    if (results.length == 0) {
                                                        res.json({ "success": false });
                                                    }
                                                    else {
                                                        retJson.waterYield = results[0];
                                                        res.json(retJson);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    });

                }
            });
        }
    });
});





app.get('/addphoto', (req, res) => {
    ssn = req.session;
    res.sendFile("webpages/addphotos.html", { root: 'public' });
});

var upload = multer({
    dest: path.join(__dirname,'/public/upload')
});

app.post('/upload', upload.single('userPhoto'),function (req, res) {
    if (req.file) {
        fs.rename(req.file.path, req.file.path + '.jpg', function (err) {
            console.log(err);
        });
        var save = {
            hid: req.body.householdid,
            filename: req.file.filename+'.jpg'
        };
        db.collection("household_images").save(save);
        return res.end('File Successfully Uploaded');
    }
    res.end('Missing file');
});

app.get('/householdimage/:hid', (req, res) => {
    db.collection("household_images").find({ hid: req.params.hid }).toArray((err, data)=>{
        res.sendFile('/upload/' + data[0].filename, { root: 'public' });
    });
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

/*
    Intellectual property belongs to group 10 for ITS project of IIIT Sricity
*/
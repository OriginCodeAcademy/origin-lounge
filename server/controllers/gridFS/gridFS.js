var Grid = require('gridfs-stream');
var mongoose = require('mongoose');
var conn = mongoose.connection;

Grid.mongo = mongoose.mongo;

// get a specific file (accessed at GET http://localhost:3000/api/files/{file_id})
module.exports.getSpecificFile = function (req, res){

	console.log("hit the /files get route");

    // see what the request looks like
    //console.log(req);
    console.log(req.params.file_id);
    var gfs = Grid(conn.db);

    // finds the specific file by id
    gfs.files.find({ "_id": mongoose.Types.ObjectId(req.params.file_id) }).toArray(function (err, files) {

        // if no results returned, send message that file was not found
        if(files.length===0){
            return res.status(400).send({
                message: 'File not found'
            });
        }

       // console.log(files);
        //console.log(files.length);

        // unsure why there is a need to specify the filename or contentType
        var readstream = gfs.createReadStream({
              filename: files[0].filename,
              contentType: files[0].contentType
        });

        // not sure if this is needed or not, but keeping it in here for now...
        res.set('Content-Type', files[0].contentType);
        // This allows the client to directly download the file requested, if requesting the file via an href
        // path within an html element
        res.set('Content-Disposition', 'attachment; filename=' + files[0].filename);
        console.log(res);
        // set up the readstream pipe to send the result out as a html response
        readstream.pipe(res);
    });

};

// get all files associated with a specific chat (Accessed at GET http://localhost:3000/api/files/chat/{chat_id})
module.exports.getFilesInAChat = function (req, res){

    console.log("hit the /files/chat get route");

    var gfs = Grid(conn.db);

    // why the need for the .toArray, when with other non-GridFS routes there is no need...?
    gfs.files.find({"metadata.chatid": req.params.chat_id}).toArray(function(err, files) {
        if (err)
            res.send(err);
        res.json(files);
        
    });

};

// write a file (accessed at POST http://localhost:3000/api/files)
module.exports.postAFile = function(req, res){

    console.log("hit the /files post route");
    
    // lets see what the request looks like
    console.log(req);

    var part = req.files.file;

    // add the user who uploaded the file to the metadata field of the GridFS file document
    var metadata = {
        username: req.body.username,
        chatid: req.body.chatid,
        documentThumbnailIcon: req.body.documentThumbnailIcon
    };

    console.log(metadata);
    
    var gfs = Grid(conn.db);
    // writes the file provided to the GridFS collections and gives it a name
    // the name is specified by the filename field
    
    // opens a write stream with the follow parameters
    var writeStream = gfs.createWriteStream({
        filename: part.name,
        mode: 'w',
        content_type: part.mimetype,
        metadata: metadata
    });

    // close event that's triggered when you call writeStream.end()?
    writeStream.on('close', function(file) {
        console.log("in callback function of writeStream.on('close')");
        // send back the fileid
        res.json({
            id: file._id,
            dateUploaded: file.uploadDate
        });
    });

    // writes the data to GridFS?
    writeStream.write(part.data);
    console.log("after writeStream.write()");
    // closes the write stream
    writeStream.end();
    console.log("after writeStream.end()");

};
'use strict';
// const mongodb = require('mongodb');
var mongoose = require('mongoose')
const Music = require("../model/music");
const User = require("../model/user");
// let db = 'mongodb://127.0.0.1:27017/aStream'
const ObjectId = mongoose.Types.ObjectId;
const multer = require('multer')
const path = require('path')
const fs = require('fs');

const { Readable } = require('stream');

const upload = multer({

    storage: multer.diskStorage({
        // destination: 'public',

        destination: (req, file, cb) => {
            if (file.fieldname === "music") {
                cb(null, 'public/music');
            } else { // else uploading image
                cb(null, 'public/image');
            }
        },

        filename: (req, file, cb) => {

            // console.log(req.body , "this is req.body inside ... .")
            if (file.fieldname === "music") {
                cb(null, Date.now() + path.extname(file.originalname))
            } else { // else uploading image
                cb(null, Date.now() + path.extname(file.originalname))
            }
            // const name = file.originalname
        },
    }),
    limits: {
        fileSize: 1000000
    },
    // fileFilter(req, file, cb) {
    //     if (file.fieldname === "resume") { // if uploading resume
    //         if (
    //           file.mimetype === 'application/pdf'
    //         ) { 
    //           cb(null, true);
    //         } else {
    //           cb(null, false); 
    //         }
    //       } else { 
    //         if (
    //           file.mimetype === 'image/png' ||
    //           file.mimetype === 'image/jpg' ||
    //           file.mimetype === 'image/jpeg'
    //         ) { 
    //           cb(null, true);
    //         } else {
    //           cb(null, false); // else fails
    //         }
    //       }
    // }
}).fields([
    {
        name: 'music', maxCount: 1
    },
    {
        name: 'image', maxCount: 1
    },
]
)


exports.uploadSong = async function (req, res) {
    try {

        upload(req, res,
            async (err) => {
                if (err) {
                    // console.log(err);
                    return res.json({
                        status: 400,
                        error: "true",
                        message: "Upload Request Validation Failed",
                    })
                }
                else {
                    if (!req.body.name || !req.body.desc) {
                        return res.json({
                            status: 400,
                            error: "true",
                            message: "name and desc is required",
                        })
                    }

                    // console.log(req.body);
                    // console.log(req.files.music[0].filename);

                    let a = await Music.create({
                        song: req.files.music[0].filename,
                        name: req.body.name, // sanitize: convert email to lowercase
                        image: req.files.image[0].filename,
                        description: req.body.desc,
                    });
                    // console.log(req.files, "this is file")

                    if (a) {
                        return res.json(a)
                    }
                    // console.log(a);
                }
            }

        );


        // const { user_id, email } = req.user;

        // // if (!req.file) {
        // //     return res.status(400).send("Not any File is received ")

        // // } else {
        //     // const user = await User.findById({_id:ObjectId(user_id)},{password:0,__v:0});
        //     // console.log(user,'file received');
        //     // if(user){
        //     // console.log(req.file, "this is file");
        //     const user = await User.findOne({ email }, { email: 1 });
        //     // console.log(user , "this is user");
        //     // console.log(bcrypt.compare(password, user.password)  ,"value")
        //     if (user) {

        //         let data = await User.updateOne({ email },
        //             { profile_image: req.file.filename });
        //         // send Data


        //         if (data) {
        //             let obj_res = {
        //                 msg: "profile uploaded sucessfully",

        //             }
        //             return res.status(200).json(obj_res);
        //         }

        //     } else {
        //         return res.status(400).send("User not found");
        //     }

    } catch (err) {
        console.log(err);
    }
};

exports.getSong = async function (req, res) {
    try {

        const { email } = req.user;


        const user = await User.findOne({ email }, { email: 1 });
        if (user) {

            let data = await Music.find({}, { __v: 0 });
            // console.log(data , "this is data")

            await Promise.all(data.map(async (obj) => {

                // obj.song = path.join(__dirname, '..', "public", "image", "/", `${obj.song}`)
                obj.song = `http://127.0.0.1:3001/api/v1/music/${obj.song}`
                // obj.image = path.join(__dirname, '..', "public", "image", "/", `${obj.image}`)
                obj.image = `http://127.0.0.1:3001/api/v1/image/${obj.image}`

            }))
            // send Data
            if (data) {
                return res.json({
                    data: data,
                    status: 200,
                    error: "true",
                    message: "Music list",
                })
            }

        } else {
            return res.json({
                status: 400,
                error: "true",
                message: "User not Found",
            })
        }



    } catch (err) {
        console.log(err);
    }
};

exports.updateSong = async function (req, res) {
    try {
        const { user_id, email } = req.user;
        const { id } = req.params;
        const user = await User.findOne({ email }, { email: 1 });
        if (user) {

            const music = await Music.find({ _id: ObjectId(id) });
            // console.log(music , "this is data")
            if (music) {
                await Music.update({ _id: ObjectId(id) },
                    function (err, data) {
                        if (err) {
                            return res.json({
                                status: 400,
                                error: "true",
                                message: "db error",
                            })
                        }
                        else {
                            return res.json({
                                // data: music,
                                status: 200,
                                error: "flase",
                                message: "data deleted sucesfully",
                            })
                        }
                    });


            } else {
                return res.json({
                    status: 400,
                    error: "true",
                    message: "provide valid music id",
                })
            }
        }



    } catch (err) {
        console.log(err);
    }
};

exports.deleteSong = async function (req, res) {
    try {
        const { email } = req.user;
        const { id } = req.params;
        const user = await User.findOne({ email }, { email: 1 });
        if (user) {
            const music = await Music.find({ _id: ObjectId(id) });
            // console.log(music , "this is data")
            if (music) {
                await Music.remove({ _id: ObjectId(id) },
                    function (err, data) {
                        if (err) {
                            return res.json({
                                status: 400,
                                error: "true",
                                message: "db error",
                            })
                        }
                        else {
                            return res.json({
                                // data: music,
                                status: 200,
                                error: "flase",
                                message: "data deleted sucesfully",
                            })
                        }
                    });


            } else {
                return res.json({
                    status: 400,
                    error: "true",
                    message: "provide valid music id",
                })
            }

        } else {
            return res.json({
                status: 400,
                error: "true",
                message: "User not Found",
            })
        }



    } catch (err) {
        console.log(err);
    }
};

exports.playSong = async function (req, res) {
    try {
        // const {  email } = req.user;
        const { name } = req.params;
        // const user = await User.findOne({ email }, { email: 1 });
        // if (user) {
        const get_music = await Music.find({ _id: ObjectId(name) });
        // console.log(get_music , "this is get_music")

        var music = `public/music/${get_music[0].song}`;

        // console.log(music , "this is music");
        var stat = fs.statSync(music);
        // range = req.headers.range;
        var readStream;

        // if (range !== undefined) {
        //     var parts = range.replace(/bytes=/, "").split("-");

        //     var partial_start = parts[0];
        //     var partial_end = parts[1];

        //     if ((isNaN(partial_start) && partial_start.length > 1) || (isNaN(partial_end) && partial_end.length > 1)) {
        //         return res.sendStatus(500); //ERR_INCOMPLETE_CHUNKED_ENCODING
        //     }

        //     var start = parseInt(partial_start, 10);
        //     var end = partial_end ? parseInt(partial_end, 10) : stat.size - 1;
        //     var content_length = (end - start) + 1;

        //     res.status(206).header({
        //         'Content-Type': 'audio/mpeg',
        //         'Content-Length': content_length,
        //         'Content-Range': "bytes " + start + "-" + end + "/" + stat.size
        //     });

        //     readStream = fs.createReadStream(music, {start: start, end: end});
        // } else {
        res.header({
            'Content-Type': 'audio/mpeg',
            'Content-Length': stat.size
        });
        readStream = fs.createReadStream(music);
        // }
        readStream.pipe(res);
        // });

        // } else {
        //     return res.json({
        //         status: 400,
        //         error: "true",
        //         message: "User not Found",
        //     })
        // }



    } catch (err) {
        console.log(err);
    }
};
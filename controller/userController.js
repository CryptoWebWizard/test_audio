'use strict';

var mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
let TOKEN_KEY = "I_am_JWT"
const bcrypt = require('bcrypt')
const User = require("../model/user");
const ObjectId = mongoose.Types.ObjectId;


exports.register = async function (req, res) {
    try {
        // console.log(req.file)
        const { email, password, full_name } = req.body;
        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({ email });


        if (oldUser) {
            let jsonData = {
                status: 400,
                error: "true",
                message: "User Already Exist. Please Login",
                request: req.body,
            };
            return res.json(jsonData);
        }

        //Encrypt user password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await User.create({
            full_name,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
        });

        let jsonData = {
            status: 201,
            error: "false",
            message: "User register Sucessfully",
            request: req.body,
        };

        // return new user
        res.json(jsonData);
    } catch (err) {
        console.log(err);
    }
};

exports.login = async function (req, res) {
    try {
        // Get user input
        const { email, password } = req.body;

        // // Validate user input
        // if (!(email && password)) {
        //     res.status(400).send("All input is required");
        // }
        // Validate if user exist in our database
        const user = await User.findOne({ email });

        if (!user) {

            let jsonData = {
                status: 400,
                error: "true",
                message: "User is not Exits .. please signup",
                request: req.body,
            };
            return res.json(jsonData);
        }

        // console.log(user)
        // console.log(bcrypt.compare(password, user.password)  ,"value")
        if (user && await (bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign(
                { user_id: user._id, email },
                TOKEN_KEY,
                // {
                //     expiresIn: "2h",
                // }
            );
            let jsonData = {
                status: 200,
                data : token,
                error: "false",
                message: "login sucessfully completed",
                request: req.body,

            };
            return res.json(jsonData);
        } else {
            let jsonData = {
                status: 400,
                // data : token,
                error: "true",
                message: "Password is not match",
                request: req.body,

            };
            return res.json(jsonData);
        }

    } catch (err) {
        console.log(err);
    }
};

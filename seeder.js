const express = require("express");
const asyncHandler = require("express-async-handler");
require("dotenv").config();
const connectToDB = require("./config/db");
const bcrypt = require("bcryptjs");
const {User} = require("./models/User");
// Connection To Database
connectToDB();

// Init App
const app = express();


const data =
    {
        username: 'Admin',
        email: 'admin@gmail.com',
        password : 'Abc*1234',
        isAdmin : true
    }
;

async function seedData() {
    let checkUser = await User.findOne({
        username: data.username,
        email: data.email
    });
    if (checkUser) {
        console.log('already added');
    }else {
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
        user = new User(data);
        const result = await user.save();
        console.log('Added successfully');
    }
}

seedData();
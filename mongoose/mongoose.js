const mongoose = require('mongoose')
require('dotenv').config();

mongoose.set("strictQuery", true)
mongoose.connect(process.env.MONGOOSE, err => {
    if (err) return console.log(err.message);

    console.log("connected to Mongodb");
});
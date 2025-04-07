const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config();


const dbconnect = () => {
    try {
        mongoose.connect(process.env.MongoDb_URL)
        console.log('DataBase sccessfuly connected');
    } catch (e) {
        console.log('No connection',);
    }
}

module.exports = dbconnect
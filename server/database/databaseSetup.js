const mongoose = require('mongoose');
require('dotenv').config();
const mongodbUrl = process.env.MONGO_URL;
// const mongoUrl = 'mongodb://localhost:27017/authentication_authorization';

mongoose.connect(mongodbUrl,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

// event listener
db.on('connected', () => {
    console.log('successfully connected to mongodb server');
});

db.on('error', (err)=>{
    console.log('Error occured: ', err);
})

module.exports = db;
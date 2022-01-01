const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Business = require('../models/business');

mongoose.connect('mongodb://localhost:27017/yelp-clone', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Business.deleteMany({});
    for(let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const business = new Business({
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'serving burgers',
            location: `${cities[random1000].city}, ${cities[random1000].state}`
        });
        //console.log(business);

        await business.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Business = require('./models/business');
const Review = require('./models/review');
mongoose.connect('mongodb://localhost:27017/yelp-clone', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
})

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
    res.render('home');
})

app.get('/business', async(req, res) => {
    const business = await Business.find({});
    console.log(business);
    res.render('businesses/index', { business });
})

app.get('/business/new', async(req, res) => {
    res.render('businesses/new');
})

app.post('/business', async(req, res) => {
    const business = new Business(req.body.business);
    await business.save();
    res.redirect(`/business/${business._id}`);
})

app.get('/business/:id', async(req, res) => {
    const business = await Business.findById(req.params.id).populate('reviews');
    res.render('businesses/show', {business })
})

/* edit */
app.get('/business/:id/edit', async(req, res) => {
    const business = await Business.findById(req.params.id);
    res.render('businesses/edit', {business });
})

app.put('/business/:id', async(req, res) => {
    const { id } = req.params;
    const business = await Business.findByIdAndUpdate(id, { ...req.body.business });
    res.redirect(`/business/${business._id}`)
})

app.delete('/business/:id', async (req, res) => {
    const { id } = req.params;
    await Business.findByIdAndDelete(id);
    res.redirect('/business');
})

app.post('/business/:id/review', async(req, res) => {
    const business = await Business.findById(req.params.id);
    console.log("review content is "+ req.body.review.body);
    const review = new Review(req.body.review);
    business.reviews.push(review);
    await review.save();
    await business.save();
    res.redirect(`/business`);
})
app.delete('/business/:id/review/:id', async (req, res) => {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);
    res.redirect('/business');
})

app.get('/business/:id/reviewedit', async(req, res) => {
    const business = await Business.findById(req.params.id);
    res.render('/business/:id/reviewedit', {business });
})

app.put('/business/:id/review/:id', async(req, res) => {
    const { id } = req.params;
    const business = await Business.findByIdAndUpdate(id, { ...req.body.business });
    res.redirect(`/business/${business._id}`)
})


app.listen(3000, () => {
    console.log('Serving on port 3000');
})
const shortUrl = require('../models/shortUrl');
const express = require('express');
const router = express.Router();


// index route
router.get('/', async (req, res) => {
    const result = await shortUrl.find({});
    console.log(result)
    res.render('index', {shortUrl: result})
});

router.post('/shorten', async (req, res) => {
    const exists = await shortUrl.findOne({ fullUrl: req.body.url });
    if (exists) {
        req.flash('error', 'Url already shortened, Please check table')
        return res.redirect('/')
    }
   const short =  await shortUrl.create({
        fullUrl: req.body.url
    });
    req.flash('success', `Url has been shortened to ${short.shortUrl}`)
    res.redirect('/')
});
router.get('/:short', async (req, res) => {
   const short = await  shortUrl.findOne({
        shortUrl:req.params.short
   })
    if (short === null) {
        return res.sendStatus(404)
    }
    short.clicks++
    short.save()
    res.redirect(short.fullUrl)
})

module.exports = router
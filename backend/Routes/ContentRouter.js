const { Router } = require('express');
const ensureAuthenticated = require('../Middlewares/AuthJwt');
const router = require('express').Router()

router.get('/', ensureAuthenticated,(req, res) => {
    res.status(200).json([
        {
            name: "Feature1",
            description: "Lets to be in room"
        },
        {
            name: "Feature2",
            description: "Lets to take advise"
        }
    ])
});

module.exports = router;
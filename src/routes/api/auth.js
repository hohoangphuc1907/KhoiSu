'use strict';
const AuthController = require( '../../controllers/AuthCotroller' );
const express = require('express'),
    router = express.Router();
const passport = require('passport');
router.get('/', (req, res) => {
    res.send('Welcome to the auth')
});

router.post( '/login', AuthController.login );
router.get( '/test', AuthController.test );
router.post( '/logout', AuthController.logout );
module.exports = router;
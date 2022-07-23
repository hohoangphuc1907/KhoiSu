'use strict';
const NhaTroController = require('../../controllers/NhaTroController');
const express = require('express'),
    router = express.Router();
router.get('/', (req, res) => {
    res.send('Welcome to the categories')
});
router.get('/getAllNhaTro',NhaTroController.getNhaTro);
router.post('/themNhaTro',NhaTroController.insertNhaTro);
module.exports = router;
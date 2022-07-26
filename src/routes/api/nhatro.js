'use strict';
const NhaTroController = require('../../controllers/NhaTroController');
const express = require('express'),
    router = express.Router();
router.get('/', (req, res) => {
    res.send('Welcome to the categories')
});
router.get('/getAllNhaTro',NhaTroController.getNhaTro);
router.get('/:id/getDetailNhaTro',NhaTroController.getDetailMotel);
router.post('/themNhaTro',NhaTroController.insertNhaTro);
router.post('/updateNhaTro',NhaTroController.updateNhaTro);
router.delete('/:id/deleteNhaTro',NhaTroController.deletMotel);
module.exports = router;
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
router.post('/create_payment_url',NhaTroController.ThanhToanMoMo2);
router.get('/vnpay_ipn',NhaTroController.getThanhToan);
router.post('/updateNhaTro',NhaTroController.updateNhaTro);
router.delete('/:id/deleteNhaTro',NhaTroController.deletMotel);
module.exports = router;
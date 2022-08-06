const AuthCotroller = require('../../controllers/AuthCotroller');
const CPanelController = require('../../controllers/CPanelController')
const express = require( 'express' ), router = express.Router();


router.get('/', CPanelController.index )
router.get('/login', CPanelController.loginAuth )
router.get('/trangchu',AuthCotroller.checkLogin,CPanelController.trangchu )
router.get('/insertMotel',AuthCotroller.checkLogin, CPanelController.insertMotel )
router.get('/:id/detailMotel', AuthCotroller.checkLogin,CPanelController.getDetail )
router.post( '/auth', CPanelController.auth );
router.get( '/auth_callback', CPanelController.auth_callback );

module.exports = router;

const autoBind = require('auto-bind');
const { Controller } = require('../../system/controllers/Controller');
const { NhaTro } = require('../models/NhaTro');
const { NhaTroService } = require('../services/NhaTroService');
const multer = require('multer');
// const dateFormat = require('dateformat');
    
const fs = require('fs');
const nhatroService= new NhaTroService(new NhaTro().getInstance());
class NhaTroController extends Controller {
    constructor(service) {
        super(service);
        autoBind(this);
    }


    async getNhaTro(req, res, next) {
        try {
            const response = await this.service.getAll({ limit: 1000 });

            await res.status(response.statusCode).json(response);
        } catch (e) {
            // next(e);
        }
    }
    async insertNhaTro(req, res, next) {
        try {
            const {body} = req;
           
            const response = await this.service.insertNhaTro(body);
            return res.status(response.statusCode).json(response);
        } catch (e) {
            next(e);
        }
    }
    async deletMotel(req, res, next) {
        try {
          const { id } = req.params;
         
          const response = await nhatroService.deletMotel(id);
      
          return res.status(response.statusCode).json(response);
        } catch (e) {
          console.log(e);
        }
      }
      async getDetailMotel(req, res, next) {
        try {
          const { id } = req.params;
         
          const response = await nhatroService.getDetailMotel(id);
      
          return res.status(response.statusCode).json(response);
        } catch (e) {
          console.log(e);
        }
      }
    async updateNhaTro(req, res, next) {
        try {
            const {body} = req;
           
            const response = await this.service.updateNhaTro(body);
            return res.status(response.statusCode).json(response);
        } catch (e) {
            next(e);
        }
    }
    async thanhToan(req, res, next) {
      try {
          var ipAddr = req.headers['x-forwarded-for'] ||
          req.connection.remoteAddress ||
          req.socket.remoteAddress ||
          req.connection.socket.remoteAddress;
         
          var secretKey = "XONXIGDILZCDNHGZQKIQBOCLTOQISFIT";
          var vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
        
          var vnp_Params = {};
          vnp_Params['vnp_Amount'] = 16000 * 100;
          vnp_Params['vnp_Command'] = 'pay';
          vnp_Params['vnp_CreateDate'] = 20170829103111;
          vnp_Params['vnp_CurrCode'] = 'VND';
          vnp_Params['vnp_IpAddr'] = '13.160.92.202';
          vnp_Params['vnp_Locale'] = 'vn';
          vnp_Params['vnp_OrderInfo'] = 'Thanh toan tien dang tin';
          vnp_Params['vnp_OrderType'] = 'billpayment';
          vnp_Params['vnp_ReturnUrl'] = 'http://localhost:5555/cpanel/home/trangchu';
          vnp_Params['vnp_TmnCode'] = 'HIJ54KHQ';
          vnp_Params['vnp_TxnRef'] = '5';
          vnp_Params['vnp_Version'] = '2.1.0';
          // vnp_Params['vnp_Merchant'] = '';
  
          // vnp_Params['vnp_BankCode'] = 'NCB';
          
          vnp_Params=this.sortObject1(vnp_Params);
         
          var querystring = require('qs');
          var crypto = require("crypto"); 
          var signData = querystring.stringify(vnp_Params, { encode: false });
          var hmac = crypto.createHmac("SHA256", secretKey);
          var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
          vnp_Params['vnp_SecureHash'] = signed;
          vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
          console.log("--->",vnpUrl);
          res.redirect(vnpUrl)
        
      } catch (e) {
          next(e);
      }
  }
  async getThanhToan(req, res, next) {
    var vnp_Params = req.query;
    var secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    var config = require('config');
    var secretKey = config.get('vnp_HashSecret');
    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");     
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     
     

    if(secureHash === signed){
        var orderId = vnp_Params['vnp_TxnRef'];
        var rspCode = vnp_Params['vnp_ResponseCode'];
        //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
        res.status(200).json({RspCode: '00', Message: 'success'})
    }
    else {
        res.status(200).json({RspCode: '97', Message: 'Fail checksum'})
    }
  }

    sortObject1(obj) {
    var sorted = {};
    var str = [];
    var key;
    for (key in obj){
      if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
      }
    }
    str.sort();
      for (key = 0; key < str.length; key++) {
          sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
      }
      return sorted;
  }
   
     
}

module.exports = new NhaTroController(nhatroService);
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
         
          var secretKey = 'XONXIGDILZCDNHGZQKIQBOCLTOQISFIT';
          var vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
          const date = require('date-and-time');
          var day=new Date();
          const value = date.format(day,'YYYYMMDDHHmmss');
          const orderId = date.format(day,'HHmmss');
        

          var vnp_Params = {};
          vnp_Params['vnp_Version'] = '2.1.0';
          vnp_Params['vnp_Command'] = 'pay';
          vnp_Params['vnp_TmnCode'] = 'HIJ54KHQ';
          vnp_Params['vnp_Locale'] = 'vn';
          vnp_Params['vnp_CurrCode'] = 'VND';
          vnp_Params['vnp_TxnRef'] = orderId;
          vnp_Params['vnp_OrderInfo'] = 'Nap 100K cho so dienthoai 0934998386';
          vnp_Params['vnp_OrderType'] = 'other';
          vnp_Params['vnp_Amount'] = 16000 * 100;
          vnp_Params['vnp_ReturnUrl'] = 'http://localhost:5555/cpanel/home/insertMotel';
          vnp_Params['vnp_IpAddr'] = '127.0.0.1';
          vnp_Params['vnp_CreateDate'] = value;
          // vnp_Params['vnp_ExpireDate'] = '20220903172557';
          // vnp_Params['vnp_Merchant'] = '';
  
          vnp_Params['vnp_BankCode'] = 'NCB';
          
          vnp_Params=this.sortObject1(vnp_Params);
         
          var querystring = require('qs');
          var crypto = require("crypto"); 
         
          var signData = querystring.stringify(vnp_Params, { encode: false });
          var hmac = crypto.createHmac("sha512", secretKey);
          var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
          vnp_Params['vnp_SecureHash'] = signed;
          vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
         
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

    vnp_Params = this.sortObject1(vnp_Params);
    
    var secretKey = "XONXIGDILZCDNHGZQKIQBOCLTOQISFIT";
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
  async ThanhToanMoMo(req, res, next) {
              var urlMoMo={};
              var partnerCode = "MOMOFRBH20220804";
              var accessKey = "wZuJy9qGE4inb0Fe";
              var secretkey = "1eedPEP8L2k4eczwusTUvAUYxudVSM9k";
              var requestId = partnerCode + new Date().getTime();
              var orderId = requestId;
              var orderInfo = "pay with MoMo";
              var redirectUrl = "https://momo.vn/return";
              var ipnUrl = "https://callback.url/notify";
              // var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
              var amount = "15000";
              var requestType = "captureWallet"
              var extraData = ""; //pass empty value if your merchant does not have stores

              //before sign HMAC SHA256 with format
              //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
              var rawSignature = "accessKey="+accessKey+"&amount=" + amount+"&extraData=" + extraData+"&ipnUrl=" + ipnUrl+"&orderId=" + orderId+"&orderInfo=" + orderInfo+"&partnerCode=" + partnerCode +"&redirectUrl=" + redirectUrl+"&requestId=" + requestId+"&requestType=" + requestType
              //puts raw signature
              // console.log("--------------------RAW SIGNATURE----------------")
              // console.log(rawSignature)
              //signature
              const crypto = require('crypto');
              var signature = crypto.createHmac('sha256', secretkey)
                  .update(rawSignature)
                  .digest('hex');
              // console.log("--------------------SIGNATURE----------------")
              // console.log(signature)

              //json object send to MoMo endpoint
              const requestBody = JSON.stringify({
                  partnerCode : partnerCode,
                  accessKey : accessKey,
                  requestId : requestId,
                  amount : amount,
                  orderId : orderId,
                  orderInfo : orderInfo,
                  redirectUrl : redirectUrl,
                  ipnUrl : ipnUrl,
                  extraData : extraData,
                  requestType : requestType,
                  signature : signature,
                  lang: 'en'
              });
              //Create the HTTPS objects
              const https = require('https');
              const options = {
                  hostname: 'test-payment.momo.vn',
                  port: 443,
                  path: '/v2/gateway/api/create',
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Content-Length': Buffer.byteLength(requestBody)
                  }
              }
              //Send the request and get the response
               var req = https.request(options, data => {
                  // console.log(`Status: ${res.statusCode}`);
                  // console.log(`Headers: ${JSON.stringify(res.headers)}`);
                  data.setEncoding('utf8');
                  data.on('data', (body) => {
                      // console.log('Body: ');
                      
                      urlMoMo = JSON.parse(body);
                      // console.log('payUrl: ');
                      // console.log(JSON.parse(body).payUrl);
                      // urlMoMo=JSON.parse(body).payUrl;
                      console.log(body)
                      res.redirect(urlMoMo.payUrl);
                  });
                 
                  data.on('end', () => {
                      console.log('No more data in response.');
                     
                     
                  });    
              })

              req.on('error', (e) => {
                  console.log(`problem with request: ${e.message}`);
              });
              // write data to request body
              // console.log("Sending....")
              
              req.write(requestBody);
              req.end();
           
                   
  }
  
  async ThanhToanMoMo2(req, res, next) {
                var urlMoMo={};
                var accessKey = 'F8BBA842ECF85';
                var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
                var orderInfo = 'pay with MoMo';
                var partnerCode = 'MOMO';
                var redirectUrl = 'https://khoisu.herokuapp.com/cpanel/home/insertMotel';
                var ipnUrl = 'https://khoisu.herokuapp.com/cpanel/home/insertMotel';
                var requestType = "payWithMethod";
                var amount = '30000';
                var orderId = partnerCode + new Date().getTime();
                var requestId = orderId;
                var extraData ='';
                var paymentCode = 'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
                var orderGroupId ='';
                var autoCapture =true;
                var lang = 'vi';
                
                //before sign HMAC SHA256 with format
                //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
                var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
                //puts raw signature
              
                //signature
                const crypto = require('crypto');
                var signature = crypto.createHmac('sha256', secretKey)
                    .update(rawSignature)
                    .digest('hex');
               
                
                //json object send to MoMo endpoint
                const requestBody = JSON.stringify({
                    partnerCode : partnerCode,
                    partnerName : "Test",
                    storeId : "MomoTestStore",
                    requestId : requestId,
                    amount : amount,
                    orderId : orderId,
                    orderInfo : orderInfo,
                    redirectUrl : redirectUrl,
                    ipnUrl : ipnUrl,
                    lang : lang,
                    requestType: requestType,
                    autoCapture: autoCapture,
                    extraData : extraData,
                    orderGroupId: orderGroupId,
                    signature : signature
                });
                //Create the HTTPS objects
                const https = require('https');
                const options = {
                    hostname: 'test-payment.momo.vn',
                    port: 443,
                    path: '/v2/gateway/api/create',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(requestBody)
                    }
                }
                //Send the request and get the response
                req = https.request(options, data => {
                   
                    data.setEncoding('utf8');
                    data.on('data', (body) => {
                        urlMoMo = JSON.parse(body);
                        // console.log('payUrl: ');
                        // console.log(JSON.parse(body).payUrl);
                        // urlMoMo=JSON.parse(body).payUrl;
                   
                     
                        res.redirect(urlMoMo.payUrl);
                        
                    });
                    data.on('end', () => {
                        console.log('No more data in response.');
                    });
                })
                
                req.on('error', (e) => {
                    console.log(`problem with request: ${e.message}`);
                });
                // write data to request body
              
                req.write(requestBody);
                req.end();
    }
   
     
}

module.exports = new NhaTroController(nhatroService);
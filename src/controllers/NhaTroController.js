const autoBind = require('auto-bind');
const { Controller } = require('../../system/controllers/Controller');
const { NhaTro } = require('../models/NhaTro');
const { NhaTroService } = require('../services/NhaTroService');
const multer = require('multer');
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
    async updateNhaTro(req, res, next) {
        try {
            const {body} = req;
           
            const response = await this.service.updateNhaTro(body);
            return res.status(response.statusCode).json(response);
        } catch (e) {
            next(e);
        }
    }
   
     
}

module.exports = new NhaTroController(nhatroService);
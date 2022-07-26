'use strict';
const { Service } = require('../../system/services/Service');
const autoBind = require('auto-bind');
const config = require('../../config/config').getConfig();
const { HttpResponse } = require("../../system/helpers/HttpResponse");
const request = require('request');

class NhaTroService extends Service{
    constructor(model) {
        super(model);
        this.model = model;
        autoBind(this);
    }
    async cpanel_GetAll(query) {
        let { skip, limit, sortBy } = query;

        skip = skip ? Number(skip) : 0;
        limit = limit ? Number(limit) : 10;
        sortBy = sortBy ? sortBy : { 'createdAt': -1 };

        delete query.skip;
        delete query.limit;
        delete query.sortBy;

        // must call redis first

        try {
            const motel = await this.model
                .find(query)
                .sort(sortBy)
                .skip(skip)
                .limit(limit)
               
            // console.log(deps)
            return motel;
        } catch (errors) {
            throw errors;
        }

    }
    async getDetail(id) {
        try {
           
            const item = await this.model.findById(id);
            if (!item) {
                const error = new Error("Không tìm thấy cuốn sách này");
                error.statusCode = 404;
                throw error;
              }
           
            return new HttpResponse( item );
        } catch ( error ) {
            throw new Error('Có lỗi, bạn có thể thử lại sau nhen');
        }
    }
    async deletMotel(id) {
        try {
           
            const item = await this.model.findByIdAndDelete(id);
            if (!item) {
                const error = new Error("Không tìm thấy nhà trọ này");
                error.statusCode = 404;
                throw error;
              }
           
            return new HttpResponse( item );
        } catch ( error ) {
            throw new Error('Có lỗi, bạn có thể thử lại sau nhen');
        }
    }
    async getDetailMotel(id) {
        try {
           
            const item = await this.model.findById(id);
            if (!item) {
                const error = new Error("Không tìm thấy nhà trọ này");
                error.statusCode = 404;
                throw error;
              }
           
            return new HttpResponse( item );
        } catch ( error ) {
            throw new Error('Có lỗi, bạn có thể thử lại sau nhen');
        }
    }

    async insertNhaTro(body) {
        try {
            const {tieuDe,dienTich,giaPhong,hinhAnh,moTa ,sdt,diaChi} = body;
            const data = {
                tieuDe,
                dienTich,
                giaPhong,
                hinhAnh,
                moTa ,
                sdt,
                diaChi,
            }
           
            const item = await this.model.create( data );
            return new HttpResponse( item );
            
            
            
        } catch ( error ) {
            throw new Error('Có lỗi, bạn có thể thử lại sau nhen');;
        }
    }
    async updateNhaTro(body) {
        try {
            const {id,tieuDe,dienTich,giaPhong,hinhAnh,moTa ,sdt,diaChi} = body;
            const data = {
                tieuDe,
                dienTich,
                giaPhong,
                hinhAnh,
                moTa ,
                sdt,
                diaChi,
            }
           
            const item = await this.model.create( data );
            return new HttpResponse( item );
            
            
            
        } catch ( error ) {
            throw new Error('Có lỗi, bạn có thể thử lại sau nhen');;
        }
    }

   

 
}

module.exports = { NhaTroService };
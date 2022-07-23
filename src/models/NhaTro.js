const mongoose = require( 'mongoose' );
const { Schema } = require( 'mongoose' );
const uniqueValidator = require( 'mongoose-unique-validator' );

class NhaTro {
    static instance = null;
    initSchema() {
        const schema = new Schema({
            'tieuDe': {
                'type': String,
                'required': true,
            },
            'dienTich': {
                'type': String,
                'required': true,          
            },
            'giaPhong': {
                'type': String,
                'required': false,          
            },
            'hinhAnh': {
                'type': String,
                'required': false,          
            },
            'moTa': {
                'type': String,
                'required': false,          
            },
            'sdt': {
                'type': String,
                'required': false,          
            },
            'user': {
                'type': Schema.Types.ObjectId,
                'required': false,  
                'ref': 'user'        
            },
            'diaChi': {
                'type': String,
                'required': false,          
            },
        }, { 'timestamps': true } );

        schema.plugin( uniqueValidator );
        try {
            mongoose.model( 'nhatro', schema );
        } catch ( e ) {
            throw e;
        }
    }

    getInstance() {
        if (!NhaTro.instance) {
            this.initSchema();
            NhaTro.instance = mongoose.model( 'nhatro' );
        }        
        return NhaTro.instance;
    }
}

module.exports = { NhaTro };
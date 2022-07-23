const mongoose = require( 'mongoose' );
const { Schema } = require( 'mongoose' );
const uniqueValidator = require( 'mongoose-unique-validator' );

class User {
    static instance = null;
    initSchema() {
        const schema = new Schema({
            'email': {
                'type': String,
                'required': true,
            },
            'hoTen': {
                'type': String,
                'required': true,
            },
            'hinhAnh': {
                'type': String,
                'required': false,          
            },
            'fcmtokens': {
                'type': [{
                    'type': String,
                    'required': false,
                }],
                'required': false,
            },
            'soDu': {
                'type': String,
                'required': false,          
            },
            'diaChi': {
                'type': String,
                'required': false,          
            },
            'sdt': {
                'type': String,
                'required': false,  
                       
            },
        }, { 'timestamps': true } );
        schema.statics.findByEmail = function( email ) {
            return this.findOne( { 'email': email } );
        };
        schema.plugin( uniqueValidator );
        try {
            mongoose.model( 'user', schema );
        } catch ( e ) {
            throw e;
        }
    }

    getInstance() {
        if (!User.instance) {
            this.initSchema();
            User.instance = mongoose.model( 'user' );
        }        
        return User.instance;
    }
}

module.exports = { User };
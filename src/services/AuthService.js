'use strict';
const {UserService} = require('./UserService');
const autoBind = require('auto-bind');
const { HttpResponse } = require('../../system/helpers/HttpResponse');
const mongoose = require('mongoose');
const config = require('../../config/config').getConfig();

class AuthService {
    constructor(model, userModel) {
        this.model = model;
        this.userService = new UserService(userModel);
        autoBind(this);
    }

    async login(body){
        const { hoTen, email, hinhAnh, sdt, token_fcm } = body;
        //console.log("===> login", token_fcm);

        try {
            let account = await this.userService.findByEmail(email);
            if(!account){
                const data = {
                    fcmtokens: token_fcm ? [token_fcm] : [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    createdBy: null,
                    updatedBy: null,
                    hoTen, email, hinhAnh, sdt
                }
                account = await this.register(data);
            }

            // console.log("=====>", account.fcmtokens);
            
            if(token_fcm) {
                let checkFCM = account.fcmtokens.filter(i => i == token_fcm)[0];
                //console.log("===> checkFCM", checkFCM);
                if (!checkFCM && token_fcm){
                    account.fcmtokens = [...account.fcmtokens, token_fcm];
                    account.fcmtokens = account.fcmtokens.slice(Math.max(account.fcmtokens.lenght - 3, 0));
                    await this.userService.update(account._id, {fcmtokens: account.fcmtokens});
                }
            }
            let cacheUser = await this.userService.findInfoByEmail(email);
            cacheUser = cacheUser.data;
            const token = await this.model.generateToken(cacheUser);
            await this.model.create({ token, 'account': new mongoose.mongo.ObjectId(cacheUser._id) });
            const tokenData = await this.model.findOne({ 'token': token });

            const _tokenData = {
                _id: tokenData._id,
                token: tokenData.token,
                account: cacheUser,
            }
            return new HttpResponse(_tokenData);
        } catch (e) {
            console.log('>>>>>>>>79 Auth service error: ', e);
            throw e;
        }
    }

    async register(data) {
        try {
            return await this.userService.insert(data);
        } catch (error) {
            throw error;
        }
    }

    async logout(token, fcmtoken, account) {
        console.log("===> logout", token, fcmtoken, account);
        console.log("====> account", account.fcmtokens);
        try {
            await this.model.deleteOne({ token });
            account.fcmtokens = account.fcmtokens?.filter(item => item != fcmtoken);
            await this.userService.update(account._id, { fcmtokens: account.fcmtokens });
            return new HttpResponse({ 'logout': true });
        } catch (error) {
            throw new Error('Có lỗi, bạn có thể thử lại sau');;
        }
    }

    async checkLogin(token) {
        try {
            // Check if the token is in the Database
            const tokenInDB = await this.model.countDocuments({ token });
            if (!tokenInDB) {
                const error = new Error('Token không đúng');

                error.statusCode = 401;
                throw error;
            }
            // Check the token is a valid JWT
            const account = await this.model.decodeToken(token);
            if (!account) {
                const error = new Error('Token không đúng');

                error.statusCode = 401;
                throw error;
            }
            
            // Check the Extracted user is active in DB
            let userFromDb = await this.userService.findInfoByEmail(account.email);
            
            if (userFromDb.data) {
                return userFromDb.data;
            }
            const error = new Error('Token không đúng');

            error.statusCode = 401;
            throw error;

        } catch (e) {
            const error = new Error('Token không đúng');

            error.statusCode = 401;
            throw error;
        }
    }
}

module.exports = { AuthService };
const { AuthService } = require('./../services/AuthService');
const { UserService } = require('./../services/UserService');
const config = require('../../config/config').getConfig();
const { Auth } = require('./../models/Auth');
const { User } = require('../models/User');
const authService = new AuthService(new Auth().getInstance(), new User().getInstance());
const userService = new UserService(new User().getInstance());
const autoBind = require('auto-bind');

const { OAuth2Client } = require("google-auth-library"),
  client = new OAuth2Client(config.GOOGLE_CLIENT_ID);
class AuthCotroller {
    constructor(service) {
        this.service = service;
        autoBind(this);
    }

    async login(req, res, next) {
        try{
            const { token, token_fcm, } = req.body;
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: config.GOOGLE_CLIENT_ID
            });
            const { name, email, picture } = ticket.getPayload();
            const check_email = config.EMAIL_GOOGLE_TESTING;
            const body = {
                email: email,
                //role: config.USER_ROLE.EMPLOYEE,
                hoTen: name,
                hinhAnh: picture,
                sdt: " ",
                token_fcm: token_fcm
            }
            const response = await authService.login(body);
            await res.status(response.statusCode).json(response);
        }catch(e) {
            console.log('>>>>>>132 login error: ' + e);
            next(e);
        }
    }

    async checkLogin(req, res, next) {
        try {
            // const token = this.extractToken(req);
            const test=req.headers.cookie;
            const token=test.replace('token=', '');
            const response = await this.service.checkLogin(token);
            console.log(response);
            req.account = response;
            
            req.authorized = true;
            req.token = token;
            next();
        } catch (e) {
            next(e);
        }
    }


    async getPayBook(req, res, next) {
        try {
            const { id } = req.params;
            const response = await userService.getPayBook(id);
            await res.status(response.statusCode).json(response);
        } catch (errors) {
            throw errors;
        }
    }
    
    async postIdReadingBooks(req, res, next) {
        try {
            const { id, idBook } = req.body;
            const response = await userService.postIdReadingBooks(id,idBook);
            await res.status(response.statusCode).json(response);
        
        } catch (errors) {
            throw errors;
        }
    }

    async postChapterBought(req, res, next) {
        try {
            const { idUser, idChapter } = req.body;
            const response = await userService.postChapterBought(idUser, idChapter);
            await res.status(response.statusCode).json(response);
        }catch(e) {
            next(e);
        }
    }

    async  postFavoriteBooks(req, res, next) {
        try {
            const { id, idBook } = req.body;
            const response = await userService.postFavoriteBooks(id,idBook);
            await res.status(response.statusCode).json(response);
        
        } catch (errors) {
            throw errors;
        }
    }
   
    

    async logout(req, res, next) {
        try {
            const token = this.extractToken(req);
            const { fcmtoken } = req.body;
            req.account = await this.service.checkLogin(token);
            const response = await this.service.logout(token, fcmtoken, req.account);
            await res.status(response.statusCode).json(response);
        } catch (e) {
            next(e);
        }
    }

    extractToken(req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        } else if (req.cookies && req.cookies.token) {
            return req.cookies.token;
        }
        return null;
    }

    test(req, res, next) {
        try {
            // const response = await this.service.login( req.body.email, req.body.password );

            res.render('auth/login');
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new AuthCotroller(authService);

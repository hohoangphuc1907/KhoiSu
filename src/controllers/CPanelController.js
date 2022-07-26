const { AuthService } = require("../services/AuthService");
const { Auth } = require("../models/Auth");
const { User } = require("../models/User");
const config = require("../../config/config").getConfig();
const autoBind = require("auto-bind");
const google = require("googleapis").google,
  OAuth2 = google.auth.OAuth2;
const { OAuth2Client } = require("google-auth-library"),
  client = new OAuth2Client(config.GOOGLE_CLIENT_ID);
const authService = new AuthService(
  new Auth().getInstance(),
  new User().getInstance()
);
const request = require("request");
const { NhaTro } = require("../models/NhaTro");
const { NhaTroService } = require("../services/NhaTroService");
const { UserService } = require("../services/UserService");
const nhatroService = new NhaTroService( new NhaTro().getInstance()
);
const userService = new UserService(new User().getInstance());


class CPanelController {
  constructor() {
    autoBind(this);
  }

  async index(req, res, next) {
    try {
      res.render("index");
    } catch (e) {
      console.log(e);
    }
  }
  async loginAuth(req, res, next) {
    try {
      res.render("auth/index");
    } catch (e) {
      console.log(e);
    }
  }
  async trangchu(req, res, next) {
    try {
      const Name=req.account;
      const idUser=req.account._id;
      const user=await userService.findInfoById(idUser);
     
      const response = await nhatroService.cpanel_GetAll({limit:1000, user:req.account._id});
      res.render("book/tablebook", { response:response,Name:Name,user:user.data });
    } catch (e) {
      console.log(e);
    }
  }
  async gioithieu(req, res, next) {
    try {
      const Name=req.account;
      const idUser=req.account._id;
      const user=await userService.findInfoById(idUser);
     
      const response = await nhatroService.cpanel_GetAll({limit:1000});
      res.render("index", { response:response,Name:Name,user:user.data });
    } catch (e) {
      console.log(e);
    }
  }
  async insertMotel(req, res, next) {
    try {
      let shortlink =req.query.message; 
      if(shortlink===undefined){
        shortlink="";
      }
      const Name=req.account;
      const idUser=req.account._id;
      const user=await userService.findInfoById(idUser);
      const idAuthor=req.account._id;
      res.render("book/insertbook",{ idAuthor:JSON.stringify(idAuthor),
      shortlink:JSON.stringify(shortlink),Name:Name,user:user.data});
    } catch (e) {
      console.log(e);
    }
  }

  async getDetail(req, res, next) {
    try {
      const { id } = req.params;
      const Name=req.account;
      const idUser=req.account._id;
      const user=await userService.findInfoById(idUser);
      const response = await nhatroService.getDetail(id);
      let motel=response.data;
  
      res.render("book/updatebook", { datas:motel,
      _datas: JSON.stringify(motel),Name:Name,user:user.data });
    } catch (e) {
      console.log(e);
    }
  }

auth(req, res, next) {
    if (req.cookies && req.cookies.token) {
      res.redirect('/cpanel/home/trangchu');
      return;
    }
    const { campus_code } = req.body;
    const oauth2Client = new OAuth2(
      config.GOOGLE_CLIENT_ID,
      config.GOOGLE_CLIENT_SECRET,
      config.GOOGLE_REDIRECT_URL
    );
    const authLink = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: config.GOOGLE_SCOPE,
      prompt: "consent",
    });
    // res.cookie("campus_code", campus_code);
    res.redirect(authLink);
  }

  auth_callback(req, res, next) {
    try {
      const oauth2Client = new OAuth2(
        config.GOOGLE_CLIENT_ID,
        config.GOOGLE_CLIENT_SECRET,
        config.GOOGLE_REDIRECT_URL
      );
      if (req.query.error) {
        res.redirect("/cpanel/home/login");
      } else {
        oauth2Client.getToken(req.query.code, async function (err, token) {
          if (err) res.redirect("/cpanel/home/login");
          else {
            //console.log("token id", token.id_token);
            const ticket = await client.verifyIdToken({
              idToken: token.id_token,
              audience: config.GOOGLE_CLIENT_ID,
            });
            const { name, email, picture } = ticket.getPayload();
            const body = {
              email: email,
              //role: config.USER_ROLE.EMPLOYEE,
              hoTen: name,
              hinhAnh: picture,
              sdt: " ",
            };
            const account = await authService.login(body);
           
            res.cookie("token", account.data.token, {
              expires: new Date(Date.now() + config.COOKIE_TOKEN_LIFETIME),
              httpOnly: true,
            });
            res.redirect('/cpanel/home/trangchu');
          }
        });
      }
    } catch (e) {
      console.log(">>>>>>: ", e);
      next(e);
    }
  }


  
}

module.exports = new CPanelController();

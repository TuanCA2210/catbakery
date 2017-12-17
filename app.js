//1.require mongoose
const mongoose = require('mongoose')
const Human = require('./Model/Human')
const Bill = require('./Model/Bill')
const Cake = require('./Model/Cake')

const nodemailer = require('nodemailer');

//2.connect
const config = require('./config.json');
var url = config.connectionString;
var express = require("express");
var app = express();
var server = require("http").createServer(app);
var multer = require('multer');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy   = require('passport-local').Strategy;
var session      = require('express-session');
var cookieParser = require('cookie-parser');
var flash    = require('connect-flash');
var morgan       = require('morgan');
//cau hinh ejs
app.set("view engine","ejs");
app.set("views","./");
// call css
app.use('/AdminInterface',express.static(__dirname + '/views/Admin'));
app.use('/StaffInterface',express.static(__dirname + '/views/Staff'));
app.use(express.static(__dirname + '/views/User'));
app.use(express.static(__dirname + '/'));
server.listen(3000);
mongoose.connect(config.connectionString,(err)=>{
  if(err){
    console.log(err);
  }else {
    console.log('connect db success');;
  }
})
app.use(session({ secret: 'ILoveMyFamily' }));
app.use(cookieParser()); // sử dụng để đọc thông tin từ cookie
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(morgan('dev'));
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.urlencoded({
    extended: true
}));
// upload Image c
var storage = multer.diskStorage({
  destination : function(req,file,cb){cb(null,'./Upload')},
  filename : function(req,file,cb){cb(null,file.originalname)}
})

var upload = multer({storage : storage})




// router and function login
//login admin
require('./Controller/LoginController')(passport);
app.get('/AdminInterface/loginAD', function(req, res) {
    res.render('views/Admin/login', { message: req.flash('loginMessage') });
});

app.post('/AdminInterface/loginAD', passport.authenticate('local-login', {
    successRedirect : '/AdminInterface/Home',
    failureRedirect : '/AdminInterface/loginAD'

}));

app.get('/AdminInterface/Home',isLoggedIn,function(req,res){
    Cake.SortByQuantity().then(function(cake){
        Bill.SortByDate().then(function(bill){
        Human.View().then(function(user){
      res.render('views/Admin/Home',{username : req.user.name,link : req.user.linkImage, cake : cake, bill: bill, user : user})
})
})
})

})


//login staff
app.get('/StaffInterface/loginStaff', function(req, res) {
    res.render('views/Staff/login', { message: req.flash('loginMessage') });
});
app.post('/StaffInterface/loginStaff', passport.authenticate('local-loginStaff', {
    successRedirect : '/StaffInterface/HomeStaff',
    failureRedirect : '/StaffInterface/loginStaff'

}));
app.get('/StaffInterface/HomeStaff',isLoggedStaff,function(req,res){
    res.render('views/Staff/Home',{username : req.user.name,link : req.user.linkImage})
})
//Login User
app.get('/login', function(req, res) {
    res.render('views/User/Login', { message: req.flash('loginMessage') });
});
app.post('/login', passport.authenticate('local-loginUser', {
    successRedirect : 'HomeCakes',
    failureRedirect : '/login'

}));


//logout
 app.get('/logoutAD', function(req, res) {
     req.logout();
     res.redirect('/AdminInterface/loginAD');
 });
 app.get('/logoutStaff', function(req, res) {
     req.logout();
     res.redirect('/StaffInterface/loginStaff');
 });
 app.get('/logout', function(req, res) {
     req.logout();
     res.redirect('/HomeCakes');
 });
 function isLoggedIn(req, res, next) {
     if (req.isAuthenticated('local-login') && req.user.role ==3)
         return next();
     res.redirect('/AdminInterface/loginAD');
 };
 function isLoggedStaff(req, res, next) {
     if (req.isAuthenticated('local-loginStaff') && req.user.role ==2)
         return next();
     res.redirect('/StaffInterface/loginStaff');
 };
 function isLoggedUser(req, res, next) {
     if (req.isAuthenticated('local-loginUser') && req.user.role ==1)
         return next();
     res.redirect('/login');
 };


//Password staff

app.use('/StaffInterface/ForgotPasswordS', function(req,res){
    res.render('views/Staff/forgotPassword', { message: "" });
})
const passwordS = require('./Controller/HumanController/StaffController.js')
app.use('/RecoveryPasswordS',passwordS.ForgotPassword);

//admin forgot password
//get interface forgotpassword page
app.use('/AdminInterface/ForgotPasswordM', function(req,res){
    res.render('views/Admin/forgotPassword', { message: "" });
})

//executed send new password for email
const passwordA = require('./Controller/HumanController/AdminController.js')
app.use('/AdminInterface/RecoveryPasswordM',passwordA.ForgotPassword);




//router function admin

app.use('/AdminInterface',isLoggedIn,require('./router/Admin/routerHuman'));
app.use('/AdminInterface',isLoggedIn,require('./router/Admin/routerCategory'));
app.use('/AdminInterface',isLoggedIn,require('./router/Admin/routerCake'));
app.use('/AdminInterface',isLoggedIn,require('./router/Admin/routerEvent'));
app.use('/AdminInterface',isLoggedIn,require('./router/Admin/routerBlog'));
app.use('/AdminInterface',isLoggedIn,require('./router/Admin/routerBill'));
app.use('/AdminInterface',isLoggedIn,require('./router/Admin/routerRevenue'));



//router function staff
app.use('/StaffInterface',isLoggedStaff,require('./router/Staff/routerHuman'));
app.use('/StaffInterface',isLoggedStaff,require('./router/Staff/routerBill'));
app.use('/StaffInterface',isLoggedStaff,require('./router/Staff/routerCake'));
app.use('/StaffInterface',isLoggedStaff,require('./router/Staff/routerIntroduction'));



//router function user


const user = require('./Controller/UserController')

//HomeCakes

app.use('/HomeCakes', user.HomeCakes);

// app.use('/HomeCake',isLoggedUser, user.HomeCake);
//Cupcakes
app.use('/Cupcakes', user.Cupcakes);

//DetailCake
app.use('/DetailCake', user.DetailCake);

//event
app.use('/Event', user.Event);

//Blog
app.use('/Blog', user.Blog);

//BlogDetail
app.use('/BlogDetail', user.BlogDetail);

//Profile
app.use('/Profile',isLoggedUser, user.Profile);

//Update
app.use('/Update',isLoggedUser,upload.single("file"), user.UpdateUser);


//signup
app.use('/signup', user.signup);

//Contact
app.use('/Contact', user.Contact);

//About
app.use('/About', user.About);


//Cart
app.use('/Cart', user.Cart);


app.use('/CheckOut',user.CheckOut);
app.use('/ForgotPassword', function(req,res){
    res.render('views/User/forgotPassword', { message: "" });
})

app.use('/RecoveryPassword', user.ForgotPassword)

const Cake = require('../Model/Cake')
const Category = require('../Model/Category')
const Blog = require('../Model/Blog')
const Event = require('../Model/Event')
const Human = require('../Model/Human')
const Introduction = require('../Model/Introduction')
const Bill = require('../Model/Bill')
var exports = [];




//HomeCakes
exports.HomeCakes =  function (req, res){
  Event.ViewUser()
  .then(function(event_all){
    Category.ViewUser()
    .then(function(category){
      Introduction.View()
      .then(function(introduction){
        Cake.ViewUser()
        .then(function(cake){
          if(req.user){
            res.render("views/User/HomeCakes", {Introduction : introduction[0], resultEvent : event_all, resultCategory: category, result : cake ,user: req.user});
          }else{
            res.render("views/User/HomeCakes", {Introduction : introduction[0], resultEvent : event_all, resultCategory: category, result : cake ,user: ""});
          }
        })
      })
    })
  })
};


//Cupcakes
exports.Cupcakes =  function (req, res){
  var o_id = req.param('id');
  var id = require('mongodb').ObjectID(o_id);
  Event.ViewUser()
  .then(function(event_all){
    Category.ViewUser()
    .then(function(category){
      Introduction.View()
      .then(function(introduction){
        Cake.Search(id,"")
        .then(function(cake){
          if(req.user){
            res.render("views/User/Cupcakes", {Introduction : introduction[0], resultEvent : event_all, resultCategory: category, result : cake,user: req.user});
          }else{
            res.render("views/User/Cupcakes", {Introduction : introduction[0], resultEvent : event_all, resultCategory: category, result : cake,user: ""});
          }
        })
      })
    })
  })
};

//DetailCake
exports.DetailCake =  function (req, res){
  var o_id = req.param('id');
  var id = require('mongodb').ObjectID(o_id);
  Category.ViewUser()
  .then(function(category){
    Introduction.View()
    .then(function(introduction){
      Cake.SearchById(id)
      .then(function(cake){
        if(req.user){
          res.render("views/User/DetailCake", {Introduction : introduction[0], result : cake, resultCategory: category,user: req.user});
        }else{
          res.render("views/User/DetailCake", {Introduction : introduction[0], result : cake, resultCategory: category,user: ""});
        }
      })
    })
  })
};

//event
exports.Event =  function (req, res){
  var o_id = req.param('id');
  var id = require('mongodb').ObjectID(o_id);
  Category.ViewUser()
  .then(function(category){
    Introduction.View()
    .then(function(introduction){
      Event.SearchById(id,"")
      .then(function(event_all){
        if(req.user){
          res.render("views/User/Event", {Introduction : introduction[0], resultEvent : event_all, resultCategory: category,user: req.user});
        }else{
          res.render("views/User/Event", {Introduction : introduction[0], resultEvent : event_all, resultCategory: category,user: ""});
        }
      })
    })
  })
};

//Blog
exports.Blog =  function (req, res){
  var o_id = req.param('id');
  var id = require('mongodb').ObjectID(o_id);
  Category.ViewUser()
  .then(function(category){
    Introduction.View()
    .then(function(introduction){
      Blog.ViewUser()
      .then(function(blog){
        if(req.user){
          res.render("views/User/Blog", {Introduction : introduction[0], result : blog, resultCategory: category,user: req.user});
        }else{
          res.render("views/User/Blog", {Introduction : introduction[0], result : blog, resultCategory: category,user: ""});
        }
      })
    })
  })
};

//BlogDetail
exports.BlogDetail =  function (req, res){
  var o_id = req.param('id');
  var id = require('mongodb').ObjectID(o_id);
  Category.ViewUser()
  .then(function(category){
    Introduction.View()
    .then(function(introduction){
      Blog.blogDetail(id)
      .then(function(blog){
        if(req.user){
          res.render('views/User/BlogDetail',{Introduction : introduction[0], result : blog, resultCategory : category,user: req.user});
        }else{
          res.render('views/User/BlogDetail',{Introduction : introduction[0], result : blog, resultCategory : category,user: ""});
        }
      })
    })
  })
};

//Profile
exports.Profile =  function (req, res){
  var o_id = req.user._id;
  var id = require('mongodb').ObjectID(o_id);
  Bill.SearchByIDHuman(id)
  .then(function(bill){
    Category.ViewUser()
    .then(function(category){
      Introduction.View()
      .then(function(introduction){
        Human.SearchById(id)
        .then(function(user){
          res.render("views/User/Profile", {username : req.user.name,link : req.user.linkImage,resultCategory:category, Introduction : introduction[0],bill:bill, user: user , message :""});
        })
      })
    })
  })
};

//Contact
exports.Contact =  function (req, res){
  Category.ViewUser()
  .then(function(category){
    Introduction.View()
    .then(function(introduction){
      if(req.user){
        res.render("views/User/Contact", {Introduction : introduction[0], resultCategory: category,user: req.user});
      }else{
        res.render("views/User/Contact", {Introduction : introduction[0], resultCategory: category,user: ""});
      }
    })
  })
};

//About
exports.About =  function (req, res){
  Category.ViewUser()
  .then(function(category){
    Introduction.View()
    .then(function(introduction){
      if(req.user){
        res.render("views/User/About", {Introduction : introduction[0], resultCategory: category,user: req.user});
      }else{
        res.render("views/User/About", {Introduction : introduction[0], resultCategory: category,user: ""});
      }
})
  })
};


//Cart
exports.Cart =  function (req, res){
  var temp = req.body.cart.i ;
  var name_cake = req.body.cart.name_cake;
  var price = req.body.cart.price;
  var quantity = req.body.cart.quantity;
  var description = req.body.cart.description;
  var link_image = req.body.cart.link_image;
  var quantity_cake_store = req.body.cart.quan;
  var cake_ids = req.body.cart.cake_ids;
  var cart = [];

  // console.log(quantity_cake_store);
  // console.log("------------------------------------");
  // console.log(temp);
  // console.log(link_image);
  if(temp > 1 )
  {
    for(var i = 0 ; i < temp ; i++)
    {
      cart.push({"cake_ids":cake_ids[i] ,"image":link_image[i], "cake":name_cake[i], "description": description[i], "price" : price[i] , "quantity" : quantity[i]  ,"quantity_cake_store" : quantity_cake_store[i]});
    }
  }else{
    cart.push({"cake_ids":cake_ids, "image":link_image, "cake":name_cake, "description": description, "price" : price , "quantity" : quantity , "quantity_cake_store" : quantity_cake_store });
  }

  // console.log(cart)
  Category.ViewUser()
  .then(function(category){
    Introduction.View()
    .then(function(introduction){
      if(req.user){
        res.render("views/User/Cart", {Introduction : introduction[0], cart : cart, resultCategory : category, user: req.user});
      }else{
        res.render("views/User/Cart", {Introduction : introduction[0], cart : cart, resultCategory : category,user : ""});
      }
    });
  });
};


//Checkout
exports.CheckOut = function(req,res){

  var cake = req.body.checkout.cake;
  var price = req.body.checkout.price;
  var quantity = req.body.checkout.quantity;
  var phone = req.body.checkout.phone;
  var name = req.body.checkout.name;
  var email = req.body.checkout.email;
  var address = req.body.checkout.address;
  var value =[] ;
  var cake_ids = req.body.checkout.cake_ids;
  var cake_store = req.body.checkout.quantity_cake_store;
  for(var i = 0 ;i <cake.length;i++)
  {
    value.push({"cake_ids":cake_ids[i], "cake_name":cake[i], "price" : price[i] , "quantity" : quantity[i]  });
  }

  for(var i = 0 ; i < value.length; i++)
  {
    var id = require('mongodb').ObjectID(cake_ids[i]);
    var quan = parseInt(cake_store[i]) - parseInt(quantity[i]);
    Cake.updateQuantity(id,quan)
    .then(function(cake){})
  }



  Human.checkEmailAndPhone(email.toLowerCase(),"")
  .then(function(user){
    if(user.length>0)
    {
      Bill.Insert(user[0]._id,name,phone,address,email,value)
      .then(function(bill){
        res.redirect('/HomeCakes');
      })
    }else{
      Bill.InsertNoID(name,phone,address,email,value)
      .then(function(bill){
        res.redirect('/HomeCakes');
      })
    }
  })
  //
  // var MongoClient = require('mongodb').MongoClient;
  //
  // MongoClient.connect(url, function(err, db) {
  //   if (err) throw err;
  //   db.collection("Human").find({email : email.toLowerCase()}).toArray(function(err, result) {
  //     console.log(result.length);
  //     if(result.length > 0){
  //       var id = require('mongodb').ObjectID(result[0]._id);
  //
  //       BillModel.create({
  //         name_id: id,
  //         name : name,
  //         phone:phone,
  //         address : address,
  //         email:email,
  //         confirm : false,
  //         time : new Date(),
  //         cake : value
  //       })
  //       res.redirect("/HomeCakes");
  //     }else{
  //       console.log("am here");
  //       BillModel.create({
  //
  //         name : name,
  //         phone:phone,
  //         address : address,
  //         email:email,
  //         confirm : false,
  //         time : new Date(),
  //         cake : value
  //       })
  //       res.redirect("/HomeCakes");
  //     }
  //     db.close();
  //   })
  // })
}



//Update Information User
exports.UpdateUser = function(req,res){
  var o_id = req.user._id;
  var id = require('mongodb').ObjectID(o_id);
  var file = req.file;
  var name= req.body.user.name;
  var address= req.body.user.address ;
  var email = req.body.user.email.toLowerCase();
  var phone = req.body.user.phone;
  var note =  req.body.user.note;



  if(phone[0] != 0)
  {
    Bill.SearchByIDHuman(id)
    .then(function(bill){
      Category.ViewUser()
      .then(function(category){
        Introduction.View()
        .then(function(introduction){
          Human.SearchById(id)
          .then(function(user){
            res.render("views/User/Profile", {user: user,message:"Format Phone Number is not correct . Please Input again!",username : req.user.name,link : req.user.linkImage,resultCategory:category, Introduction : introduction[0],bill:bill});
          })
        })
      })
    })
  }else if (phone.length > 11 || phone.length< 10)
  {
    Bill.SearchByIDHuman(id)
    .then(function(bill){
      Category.ViewUser()
      .then(function(category){
        Introduction.View()
        .then(function(introduction){
          Human.SearchById(id)
          .then(function(user){
            res.render("views/User/Profile", {user: user,message:"Phone Number is not correct . Please Input again!",username : req.user.name,link : req.user.linkImage,resultCategory:category,Introduction : introduction[0],bill:bill});
          })
        })
      })
    })

  }else{
    Human.checkEmailAndPhone(email,phone)
    .then(function(user){
      if(user.length > 1 ){
        Bill.SearchByIDHuman(id)
        .then(function(bill){
          Category.ViewUser()
          .then(function(category){
            Introduction.View()
            .then(function(introduction){
              Human.SearchById(id)
              .then(function(users){
                res.render("views/User/Profile", {user: users,message:"Phone Number or Email has been exist . Please Try again!",username : req.user.name,link : req.user.linkImage,resultCategory:category, Introduction : introduction[0],bill:bill});
              })
            })
          })
        })

      }else{
        if(!file)
        {
          Human.Update(id,name,phone,"",email,address,note,"")
          .then(function(user) {
            res.redirect("/Profile");
          })
        }else{
          Human.Update(id,name,phone,"",email,address,note,req.file.path)
          .then(function(user) {
            res.redirect("/Profile");
          })
        }
      }
    })
  }
}


//sign up
exports.signup = function(req,res){
  var email = req.body.user.email.toLowerCase();
  var password = req.body.user.password;
  var re_password = req.body.user.re_password;
  var name = req.body.user.name;
  var email = req.body.user.email;

  if(password == re_password)
  {
    Human.checkEmailAndPhone(email,"")
    .then(function(user){
      if(user.length > 0 ){
        res.render("views/User/login",{message : "Email has been exist .Please try again !"});

      }else{
        Human.Insert(name,password,"",1,"",email,"","")
        res.render("views/User/login",{message: "Signup success"});;}
      })
    }else{
      res.render("views/User/login",{message : "Password and repeat password must be the same !!"});
    }
  }


  exports.ForgotPassword = function(req,res){
    var email = req.body.account.email.toLowerCase();
    Human.Search(email,1)
    .then(function(user){
      console.log(user.length);
      if(user.length == 0){

        res.render("views/Admin/forgotPassword", {message: "Email not exist"});
      }else{
        Human.sendEmail(email,1)
        res.render('views/Admin/login',{message : "password has been sent to your email"});


      }
    })
  }
  module.exports = exports;

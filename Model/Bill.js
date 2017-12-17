
const mongoose = require('mongoose')


//3.tao schema
const Schema = mongoose.Schema;

let BillSchema = new Schema({
  name_id :{
    type: Schema.Types.ObjectId,
    ref: 'Human'
  },
  name :{
    type: String,
    require : true
  },
  phone :{
    type : String,
    require :true
  },
  address: {
    type : String,
    require :true
  },
  email : {
    type :String,
    require : true
  },
  cake :[{
    cake_ids:{
      type: Schema.Types.ObjectId,
      ref: 'Cake'
    },
    cake_name:{
      type: String,
      require : true
    },
    price :{
      type : Number,
      require : true
    },
    quantity :{
      type : Number,
      require : true
    }
  } ],
  confirm:{
    type : Boolean,
    require: true
  },
  status : {
    type: Boolean
  },
  time :{
    type : Date,
    require: true
  },
  note : {
    type : String
  },
  staff_ids:{
    type: Schema.Types.ObjectId,
    ref: 'Human'
  },
  staff_email:{
    type:String
  }
}, {collection :'Bill'});

var Bill = mongoose.model('Bill', BillSchema);


function Insert(name_id,name,phone,address,email,cake) {
  return Bill
  .create({
    name_id : name_id,
    name:name,
    phone:phone,
    address:address,
    email:email,
    confirm:false,
    status:false,
    time : new Date(),
    note:"",
    staff_name:"",
    cake : cake
  })
  .then(function(bill) {
    return bill;
    console.log(bill);
  })
  .catch(function(err) {
    return(err);
  });
}
function InsertNoID(name,phone,address,email,cake) {
  return Bill
  .create({
    name:name,
    phone:phone,
    address:address,
    email:email,
    confirm:false,
    status:false,
    time : new Date(),
    note:"",
    staff_name:"",
    cake : cake
  })
  .then(function(bill) {
    return bill;
    console.log(bill);
  })
  .catch(function(err) {
    return(err);
  });
}


function View(){
  var date= new Date();
  return Bill
  .find({
    time : {"$lt": date}
  })
  .then(function(bill) {
    console.log(bill);
    return bill;
  })
  .catch(function(err) {
    return err;
  });
}

function SortByDate() {
  return Bill
  .find({confirm : true}).sort({date_create: -1})
  .then(function(bill) {
    return bill;
  })
  .catch(function(err) {
    return err;
  });
}

function Search(today_search,tomorrow_search) {

  return Bill
  .find({
    time : {"$gte": today_search, "$lt" : tomorrow_search}})
    .then(function(bill) {
      return bill;
    })
    .catch(function(err) {
      return(err);
    });

  }
  function SearchByIDHuman(id) {

    return Bill
    .find({name_id : id})
    .then(function(bill) {
      return bill;
    })
    .catch(function(err) {
      return(err);
    });

  }

  //
  //



  function updateNote(id,note,staff_ids,staff_email){
    return   Bill.updateOne({_id : id},{note:note,staff_ids:staff_ids,staff_email:staff_email})
    .then(function(bill) {
      return bill;
    })
    .catch(function(err) {
      return(err);
    });
  }


  function confirmBill(id,staff_ids,staff_email){
    return   Bill.updateOne({_id : id},{confirm : true,staff_ids:staff_ids,staff_email:staff_email})
    .then(function(bill) {
      return bill;
    })
    .catch(function(err) {
      return(err);
    });
  }


  function unConfirmBill(id,staff_ids,staff_email){
    return   Bill.updateOne({_id : id},{confirm : false,staff_ids:staff_ids,staff_email:staff_email})
    .then(function(Bill) {
      return Bill;
    })
    .catch(function(err) {
      return(err);
    });
  }

  function Seen(id,staff_ids,staff_email){
    return   Bill.updateOne({_id : id},{status : true,staff_ids:staff_ids,staff_email:staff_email})
    .then(function(Bill) {
      return Bill;
    })
    .catch(function(err) {
      return(err);
    });
  }

  function Revenue(){
    var date= new Date();
    return Bill
    .find({confirm: {$eq: true}})
    .then(function(bill) {
      console.log(bill);
      return bill;
    })
    .catch(function(err) {
      return err;
    });
  }

  function revenueSearch(today_search,tomorrow_search) {

    return Bill
    .find({
      time : {"$gte": today_search, "$lt" : tomorrow_search},confirm: {$eq: true}
    })
    .then(function(bill) {
      return bill;
    })
    .catch(function(err) {
      return(err);
    });

  }

  module.exports = {
    View : View,
    Search : Search,
    confirmBill : confirmBill,
    unConfirmBill : unConfirmBill,
    Revenue:Revenue,
    revenueSearch:revenueSearch,
    Seen:Seen,
    updateNote:updateNote,
    SortByDate:SortByDate,
    SearchByIDHuman:SearchByIDHuman,
    Insert : Insert,
InsertNoID:InsertNoID
  }

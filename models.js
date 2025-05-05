const mongoose = require('./dbconnection'); 


// Initialize the auto-increment plugin with the existing connection


// Define the User schema (saved in 'users' collection)

const userSchema = new mongoose.Schema({
  
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
   
    
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
}, { collection: 'users' });



// Define the Product schema (saved in 'products' collection)

const productSchema = new mongoose.Schema({
 
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  purchaseprice: {
    type: Number,
    required: true,
    min: 0,
  }, 

quantity: {
    type: Number,
    required: true,
    min: 0,
  },

profit: {
    type: Number,
   
    
  },

  supplier: {
    type: String,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },

dateUpdated: {
    type: Date,
    default: Date.now,
  },

}, { collection: 'products' });



// Define the Supplier schema (saved in 'suppliers' collection)
const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
 
    email: {
      type: String,
      
    },
    phone: {
      type: String,
      required: true,
    },
 
 
}, { collection: 'suppliers' });



const salesSchema = new mongoose.Schema({
  saleid: {
   type: Number,  
    unique: true,
    index: true,
    required: true

  },
  salesperson: { type: String, required: true },
  customername: { type: String, required: true , default:"walk in customer"},
  items: [
    {
      product: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      totalprice: { type: Number, required: true },
      profit: { type: Number, required: true },
    }
  ],
  totalitems: { type: Number, required: true },
  grandtotal: { type: Number, required: true },
  totalprofit: { type: Number, required: true },
  amountpaid: { type: Number, required: true },
  paymentmethod: { type: String, required: true },
  balance: { type: Number, required: true },
  date: { type: Date, default: Date.now }
}, { collection: 'sales' });




// Create models for each schema
const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Supplier = mongoose.model('Supplier', supplierSchema);
const Sales = mongoose.model('Sales', salesSchema);

// Export the models
module.exports = {
  User,
  Product,
  Supplier,
  Sales,
};
const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  addressLine: {type: String,required: true,trim: true},
  city: {type: String,required: true,trim: true},
  state: {type: String,required: true,trim: true},
  pinCode: {type: Number,required: true,trim: true},
  lat: {type: Number,required: true},
  long: {type: Number,required: true},
});

const productSchema = new mongoose.Schema({
  userId:{type:String,required:true},
  title: { type: String, required: true },
  category: { type: String, required: true },
  productAge: {type: Number, required:true},
  imageUrl: { type: String, required: true },
  condition: { type: String, required: true },
  productDescription:{ type: String, required: true },
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true }
},
);


const Product = mongoose.model("Product", productSchema);
const Location = mongoose.model('Location', LocationSchema);

module.exports = {Product , Location};

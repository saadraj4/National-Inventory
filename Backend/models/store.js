const mongoose = require("mongoose");

const StoreSchema = new mongoose.Schema(
  {
    
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Store = mongoose.model("store", StoreSchema);
module.exports = Store;

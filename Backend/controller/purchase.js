const Purchase = require("../models/purchase");
const purchaseStock = require("./purchaseStock");
const Product = require("../models/Product");

// Add Purchase Details
const addPurchase = (req, res) => {
  const addPurchaseDetails = new Purchase({
    userID: req.body.userID,
    ProductID: req.body.productID,
    QuantityPurchased: req.body.quantityPurchased,
    PurchaseDate: new Date().toLocaleDateString(),
    TotalPurchaseAmount: req.body.totalPurchaseAmount,
  });

  addPurchaseDetails
    .save()
    .then((result) => {
      purchaseStock(req.body.productID, req.body.quantityPurchased);
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(402).send(err);
    });
};

// Get All Purchase Data
const getPurchaseData = async (req, res) => {
  const findAllPurchaseData = await Purchase.find({"userID": req.params.userID})
    .sort({ _id: -1 })
    .populate("ProductID"); // -1 for descending order
  res.json(findAllPurchaseData);
};

// Get total purchase amount
const getTotalPurchaseAmount = async (req, res) => {
  let totalPurchaseAmount = 0;
  const purchaseData = await Purchase.find({"userID": req.params.userID});
  purchaseData.forEach((purchase) => {
    totalPurchaseAmount += purchase.TotalPurchaseAmount;
  });
  res.json({ totalPurchaseAmount });
};

const addStock = async (req,res)=> {
  console.log(req.body);
  const productID = req.body.productID;
  const quantityToAdd = req.body.quantity;

  try {
    const product = await Product.findOne({ _id: productID });
    const purchase = await Purchase.findOne({ ProductID: productID });
    if (purchase && product) {
      purchase.QuantityPurchased += quantityToAdd;
      product.stock += quantityToAdd;
      await purchase.save();
      await product.save();
      res.status(200).send(purchase);
    } else {
      res.status(404).send({ message: "Purchase not found" });
    }
  } catch (err) {
    res.status(500).send(err);
  }
  
}

module.exports = { addPurchase, getPurchaseData, getTotalPurchaseAmount, addStock };

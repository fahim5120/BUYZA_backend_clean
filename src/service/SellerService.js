const Seller = require("../modal/Seller");
const Address = require("../modal/Address");
const { getEmailFromJwt } = require("../util/jwtProvider");

exports.createSeller = async (sellerData) => {
  const existingSeller = await Seller.findOne({ email: sellerData.email });
  if (existingSeller) {
    throw new Error("Seller already exists, use a different email");
  }

  let savedAddress = sellerData.pickupAddress;
  savedAddress = await Address.create(sellerData.pickupAddress);
  const newSeller = new Seller({
    sellerName: sellerData.sellerName,
    email: sellerData.email,
    password: sellerData.password,
    pickupAddress: savedAddress._id,
    GSTIN: sellerData.GSTIN,
    password: sellerData.password,
    mobile: sellerData.mobile,
    bankDetails: sellerData.bankDetails,
    businessDetails: sellerData.businessDetails,
  });
  return await newSeller.save();
};



exports.getSellerByEmail = async (email) => {
  console.log("email: ", email);
  
  const seller = await Seller.findOne({ email });
  console.log(seller);
  
  if (!seller) {
    throw new Error("Seller not found");
  }
  return seller;
};

exports.getSellerProfile = async (jwt) => {
  const email = getEmailFromJwt(jwt);
  return this.getSellerByEmail(email);
};

exports.getSellerById = async (id) => {
  const seller = await Seller.findById(id);

  if (!seller) {
    throw new Error("Seller not found");
  }
  return seller;
};

exports.getAllSellers = async (status) => {
  return await Seller.find({ accountStatus: status });
};

exports.updateSeller = async (existingSeller, sellerData) => {
  return await Seller.findByIdAndUpdate(existingSeller._id, sellerData, {
    new: true,
  });
};

exports.updateSellerStatus = async (sellerId, status) => {
  return await Seller.findByIdAndUpdate(
    sellerId,
    { $set: { accountStatus: status } },
    { new: true }
  );
};

exports.deleteSeller = async (sellerId) => {
  return await Seller.findByIdAndDelete(sellerId);
};

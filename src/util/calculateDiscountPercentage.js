exports.calculateDiscountPercentage = (mrpPrice, sellingPrice) => {
  if (mrpPrice <= 0) {
 return  0;
  throw new Error("MRP must be greater than zero");
  }
  const discount = mrpPrice - sellingPrice;
  return Math.round((discount / mrpPrice) * 100);
};
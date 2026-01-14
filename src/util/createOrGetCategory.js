const Category = require("../modal/Category"); // ✅ ADD THIS

exports.createOrGetCategory = async (categoryId, lavel, parentId = null) => {
  let category = await Category.findOne({ categoryId });
  if (!category) {
    category = new Category({
      categoryId,
      level:lavel,
      parentCategory: parentId,
    });
    category = await category.save();
  }
  return category;
};
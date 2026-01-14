const HomeCategorySection = require('../domain/HomeCategorySection');
const Deal = require('../modal/Deal');
const DealService = require('./DealService');

class HomeService {
    async createHomePageData(allCategories) {
  // Filter categories based on their section
        const gridCategories = allCategories.filter(category => 
            category.section === HomeCategorySection.GRID
        );

         const shopByCategories = allCategories.filter(
            (category) => 
            category.section === HomeCategorySection.SHOP_BY_CATEGORIES
        );

         const electricCategories = allCategories.filter(category => 
            category.section === HomeCategorySection.ELECTRIC_CATEGORIES
        );

 const dealCategories = allCategories.filter(category => 
            category.section === HomeCategorySection.DEALS
        );


        const deals = await DealService.getDeals()





      const home = {
    grid: dealCategories,
   shopByCategories: shopByCategories,
    electricCategories: electricCategories,
    deals: deals,
   dealCategories: dealCategories
};

 return home; 

}
}
module.exports = new HomeService();

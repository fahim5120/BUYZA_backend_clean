const HomeCategoryService = require("../service/HomeCategoryService");
const HomeService = require("../service/HomeService");


class HomeCategoryController {

    // Create Home Categories
    async createHomeCategories(req, res) {
        try {
            const homeCategories = req.body; 
            const categories = await HomeCategoryService.createCategories(homeCategories);
            const home = await HomeService.createHomePageData(categories);
            return res.status(202).json(home); 
        } catch (error) {
            return res.status(500).json({ message: error.message }); // Handle errors
        }
    }

    // Get All Home Categories
    async getHomeCategory(req, res) {
        try {
            const categories = await HomeCategoryService.getAllHomeCategories();
            return res.status(200).json(categories);
        } catch (error) {
            return res.status(500).json({ message: error.message }); // Handle errors
        }
    }

    // Update Home Category
    async updateHomeCategory(req, res) {
        try {
            const id = req.params.id; // Get ID from route params
            const homeCategory = req.body;
            const updatedCategory = await HomeCategoryService.updateHomeCategory(homeCategory, id);
            return res.status(200).json(updatedCategory); 
        } catch (error) {
            return res.status(500).json({ message: error.message }); // Handle errors
        }
    }
}

module.exports = new HomeCategoryController();

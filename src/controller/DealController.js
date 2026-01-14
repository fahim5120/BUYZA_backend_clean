const DealService = require('../service/DealService'); // Adjust the path accordingly

class DealController {
    // Create a new deal

    async getAllDeals(req, res) {
        try {
            
            const deals = await DealService.getDeals();
            return res.status(200).json(deals); 
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    async createDeals(req, res) {
        try {
            const deal = req.body;
            const createdDeal = await DealService.createDeals(deal);
            return res.status(201).json(createdDeal); 
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Update an existing deal
    async updateDeal(req, res) {
        const { id } = req.params;
        const deal = req.body;
        try {
            const updatedDeal = await DealService.updateDeal(deal, id);
            return res.status(200).json(updatedDeal); 
        } catch (error) {
            return res.status(404).json({ error: error.message });
        }
    }

    // Delete a deal
    async deleteDeals(req, res) {
        const { id } = req.params;
        try {
            await DealService.deleteDeal(id);
            
            return res.status(202).json({message :"Deal deleted successfully"}); 
        } catch (error) {
            return res.status(404).json({ error: error.message });
        }
    }
}

module.exports = new DealController(); 

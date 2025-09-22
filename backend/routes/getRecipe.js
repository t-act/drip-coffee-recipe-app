const express = require('express');
const router = express.Router();
const recipes = require('../data/recipes.json');

router.post('/', (req, res) => {
    const { roast, taste, temperature, amount} = req.body;

    console.log('reqBody:', req.body);
    
    if (!roast || !taste || !temperature || !amount || isNaN(Number(amount))) {
        return res.status(400).json({ error: 'Missing Parameter' });
    }

    const numAmount = Number(amount);
    const recipe = recipes.find(r =>
        r.roast === roast &&
        r.taste === taste &&
        r.temperature === temperature &&
        Number(r.amount) === numAmount
    );

    console.log('recipes:', recipes);
    console.log('検索条件:', roast, taste, temperature, numAmount);

    if (!recipe) {
        return res.status(404).json({ error: 'No matching recipes found' })
    }

    const factor = numAmount / recipe.amount;
    const adjustedRecipe = JSON.parse(JSON.stringify(recipe));

    if (Array.isArray(adjustedRecipe.steps)) {
           adjustedRecipe.steps.forEach(step => {
            if (typeof step.water === 'number') {
                step.water = Math.round(step.water * factor);
            }
       });
    }
    adjustedRecipe.amount = numAmount;
    adjustedRecipe.beans_amount = Math.round(recipe.beans_amount * factor * 10) / 10;

    res.json(adjustedRecipe);
});

module.exports = router;
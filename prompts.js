var itemPrompt = {
        properties: {
            item_id: { 
                message: "Using the item_id, select an product you'd like",
                warning: 'Must select an ID of 1-8',
                validator: /^[0-8]*$/,
                name: "item_id",
            },
        }
};

var quantityPrompt = {
        properties: {
            quantity: {
                message: "How many would you like?",
                validator: /^[0-9]*$/,
                name: "stock",
            },
        }
};

exports.itemPrompt = itemPrompt;
exports.quantityPrompt = quantityPrompt;

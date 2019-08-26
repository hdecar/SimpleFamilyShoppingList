const mongoose = require('mongoose');

const listSchema = mongoose.Schema({
    _id: mongoose.SchemaTypes.ObjectId,
    items: [
        {
            itemId: mongoose.SchemaTypes.Number,
            item: String
        }
    ]
});

module.exports = mongoose.model('List', listSchema);
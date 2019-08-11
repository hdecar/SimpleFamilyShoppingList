const mongoose = require('mongoose');

const accountSchema = mongoose.Schema({
    _id: mongoose.SchemaTypes.ObjectId,
    listId: mongoose.SchemaTypes.ObjectId,
    email: {type: String, required: true},
    password: {type: String, required: true}
});

module.exports = mongoose.model('Account', accountSchema);
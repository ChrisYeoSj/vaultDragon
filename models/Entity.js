const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EntitySchema = new Schema({
    key: {type: String, required: true},
    value: {type: Object, required: true},
    timestamp: {type: Date, required: true, default: Date.now},
});

module.exports = mongoose.model('Entity', EntitySchema);

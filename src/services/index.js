const Entity = require('../models/Entity');
const EntityService = require('./entityService');

// more suitable for testing
module.exports = EntityService(Entity);

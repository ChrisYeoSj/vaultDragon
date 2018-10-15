module.exports = {
    database: {
        MONGO_URL: 'mongodb://localhost:27017/entitydb',
    },
    testDatabase:{
        MONGO_URL: 'mongodb://localhost:27017/test_entitydb',
    },
    dbCollection: {
       ENTITY_COLLECTION: 'entity',
    },
};

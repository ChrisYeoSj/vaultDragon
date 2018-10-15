const mongoose = require('mongoose');
const { MONGO_URL } = require('./constants').database;
const mongoDB = process.env.MONGODB_URI || MONGO_URL;
mongoose.connect(mongoDB);

const app = require('./src/app');

app.listen(3000, () => {
    console.log('Server is up and running on port number 3000');
});

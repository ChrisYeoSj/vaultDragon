const moment = require('moment');

module.exports = {
    getCurrentTimestamp() {
        return moment.utc().valueOf();
    },
};

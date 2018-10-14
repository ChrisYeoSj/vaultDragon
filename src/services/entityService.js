const moment = require('moment');

const createEntity = Entity => (key, value) => {

    if (!key || !value){
      throw new Error(`Missing Variables: Key: ${key}, Value: ${key}`)
    }

    const entity = new Entity(
        {
            key,
            value,
            timestamp: moment.utc(),
        }
    );
    return entity.save();
}

const findEntity = Entity => (key, timestamp) => {
    if (!key){
      throw new Error(`Missing Key: ${key}`);
    }
    //build our query
    const query = {
      $and: [{key}],
    };

    // if timestamp is available, lets query less than or equal to timestamp.
    // ie. if timestamp given is 6.04, it will find the record 6.04 or earlier.
    //
    if (timestamp){
      // timestamp is available
      // lets convert timestamp to utc;
      const ts = moment.unix(timestamp).utc();
      query.$and.push({ timestamp :{ $lte: ts }});
    }
    // sort descending by timestamp and limit of 1 results
    // (which is the latest result according to timestamp)
    return Entity.find(query).sort({timestamp: -1}).limit(1);
}

module.exports = Entity => {
  return {
    createEntity: createEntity(Entity),
    findEntity: findEntity(Entity)
  }
};

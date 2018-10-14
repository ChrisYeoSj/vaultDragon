const mongoose = require('mongoose');
const { MONGO_URL } = require('./constants').testDatabase;
const mongoDB = process.env.MONGODB_URI || MONGO_URL;
mongoose.connect(mongoDB);

const Entity = require('./src/models');

// tests for Create and Find Entities. Tests for models
describe("Tests for Entity Model", ()=>{

    beforeAll( async ()=>{
      //remove everything from test db before starting tests
      await Entity.remove({});
    })

    afterEach( async ()=>{
      //remove everything from test db after eachh tests
      await Entity.remove({});
    })

    afterAll( async ()=>{
      //close connection to mongodb
      await mongoose.connection.close();
    })

    // test for module whether defined
    it("Entity is defined", ()=>{
      expect(Entity).toBeDefined();
    })

    it("is able to FIND an Entity", async ()=>{
       // create an Entity first and save into the db
       const entity = new Entity(
           {
               '123',
               '456',
           }
       );
       entity.save();
       // start the GET entity test
       const getEntity = await User.findOne({key: '123'})
       const expectedValue = '456';
       const returnedValue = getEntity.value;
       // compare values
       expect(returnedValue).toEqual();
    })

    it("is able to SAVE an Entity", async ()=>{
        const entity = new Entity(
          {
            '123',
            '456'
          }
        )
        const entitySaved = await entity.save();
        const expectedValue = '456';
        const returnedValue = entitySaved.value;
        //compare these two
        expect(returnedValue).toEqual();
    }
})

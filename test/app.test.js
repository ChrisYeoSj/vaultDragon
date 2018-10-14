const app = require('../src/app');
const request = require('supertest');
const mongoose = require('mongoose');
const { MONGO_URL } = require('./constants').testDatabase;
const bodyParser = require('body-parser');
const mongoDB = MONGO_URL;
mongoose.connect(mongoDB);

const Entity = require('../src/models/Entity')

describe("app.js tests", () => {
    let server = null;

    it("app.js is defined and is a module", ()=>{
      expect(app).toBeDefined();
    })

    beforeAll(()=>{
      //init the server
      server = app.listen(3005);
      await Entity.remove({});
    })

    afterEach( async ()=>{
      //remove everything from test db after eachh tests
      await Entity.remove({});
    })

    afterAll((done)=>{
      Entity.remove({});
      mongoose.connection.close();
      server.close(done);
    })

    describe('Object Routes Testing', ()=>{
      it("can POST /Objects with valid object", async ()=>{
         await request(server)
         .post('/object')
         .send({
           '123':'456',
         })
         .set('Accept', 'application/json')
         .expect(200)
      })

      it("will reject POST /Objects with invalid object", async ()=>{
        await request(server)
        .post('/object')
        .expect(400);
      })

      it('can GET /Object with valid key', async ()=> {
        const entity = new Entity(
            {
                '123',
                '456',
            }
        );
        await entity.save();
        await request(server).get("/object/123").done((error, response)=>{
              expect(response.body.value).toEqual('456');
              done();
        });
      })

      it('cannot GET /Object with invalid key', async ()=>{
          await request(server).get('/object').expect(422);
      })

      it('can GET /Object with valid timestamp', async ()=>{
          const timestamp = moment.unix();
          const entity = new Entity(
              {
                  '123',
                  '456',
              }
          );
          await entity.save();
          await request(server).get(`/object/123?timestamp=${timestamp}`).expect(200);
      })

      it('cannot GET /Object with valid but OLDER timestamp', async ()=>{
          const timestamp = moment.unix() - 150;
          const entity = new Entity(
              {
                  '123',
                  '456',
              }
          );
          await entity.save();
          // should have no content;
          await request(server).get(`/object/123?timestamp=${timestamp}`).expect(204);
      })

      it('can GET /Object with valid but NEWER timestamp', async ()=>{

          const entity = new Entity(
              {
                  '123',
                  '456',
                  '2018-10-13T18:00:00+00:00',
              }
          );
          await entity.save();

          const entity2 = new Entity(
              {
                  '123',
                  '654',
                  '2018-10-13T18:05:00+00:00',
              }
          );
          await entity2.save();
          // should have key of 456
          await request(server).get(`/object/123?timestamp=1539453779`).done((error, response)=>{
            expect(response.body.value).toEqual('456');
            done();
          });
      })

      it('cannot GET /Object with an invalid timestamp', async ()=>{
          await request(server).get(`/object/123?timestamp=1a}`).expect(422);
      })

      it('cannot GET /Object with an missing object key', async ()=>{
          await request(server).get(`/object/`).expect(422);
      })

    })

})

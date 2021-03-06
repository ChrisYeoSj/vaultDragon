const EntityService = require('../src/services/entityService');
const sinon = require('sinon');

describe('EntityService Testing', ()=>{

    it("Entity is defined and is a module", () => {
      expect(EntityService).toBeDefined();
    });

    it('is able to create Entity', ()=>{
        //create a save function, which is a sinon spy
        const save = sinon.spy();
        let key = null;
        let value = null;

        // create a mock Entity Modal, no actual db calls.
        const mockedEntityModal = function(data) {
          key = data.key;
          value = data.value;
          return {
            ...data,
            save
          }
        }

        const entityService = EntityService(mockedEntityModal);
        entityService.createEntity('123', '456');

        // check to see if entity.save() in createEntity Service is called;
        const returnedValue = save.calledOnce;
        // we expect that .save() has been called once.
        const expectedValue = true;
        //compare
        expect(returnedValue).toEqual(expectedValue);
        // also check keys and values
        expect(key).toEqual('123');
        expect(value).toEqual('456');
    })

})

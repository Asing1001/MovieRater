import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as redisManager from '../data/redisManager';

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.should();
chai.use(sinonChai);

describe('redisManager', () => {
  let sandbox, stubGetCollection: sinon.SinonStub;
  before(() => {
    sandbox = sinon.sandbox.create();
  });

  after(() => {
    sandbox.restore();
  });

  describe('redisManager set and get', () => {
    it('should get value correctly', async function () {
      await redisManager.set("test",[1,2,3,4,5],5)
      const value = await redisManager.get("test");
      assert.isNotNull(value);
    });
  });
});

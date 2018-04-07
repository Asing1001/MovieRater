import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import cacheManager from '../data/cacheManager';
import * as memoryCache from 'memory-cache';
import { db } from "../data/db";


const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.should();
chai.use(sinonChai);

describe('cacheManager', () => {
  let sandbox, stubGetCollection: sinon.SinonStub;
  before(() => {
    sandbox = sinon.sandbox.create();
    stubGetCollection = sandbox.stub(db, 'getCollection');
  });

  after(() => {
    sandbox.restore();
  });

  describe('init cacheManager', () => {
    it('should init complete', async function () {
      stubGetCollection.returns([]);
      sandbox.stub(cacheManager,'setInTheaterMoviesCache').returns(Promise.resolve([]));
      await cacheManager.init()
    });
  });
});
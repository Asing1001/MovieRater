import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import cacheManager from '../data/cacheManager';
import { Mongo } from '../data/db';
import * as atmoviesTask from '../task/atmoviesTask';

chai.should();
chai.use(sinonChai);

describe('cacheManager', () => {
  let sandbox, stubGetCollection, stubUpdateSchedules: sinon.SinonStub;
  before(() => {
    sandbox = sinon.sandbox.create();
    stubGetCollection = sandbox.stub(Mongo, 'getCollection');
    stubUpdateSchedules = sandbox.stub(atmoviesTask, 'updateMoviesSchedules')
  });

  after(() => {
    sandbox.restore();
  });

  describe('init cacheManager', () => {
    it.only('should init complete', async function () {
      stubGetCollection.returns([]);
      stubUpdateSchedules.returns([])
      
      sandbox
        .stub(cacheManager, 'setRecentMoviesCache')
        .returns(Promise.resolve([]));
      sandbox
        .stub(cacheManager, 'setMoviesSchedulesCache')
        .returns(Promise.resolve([]));
      await cacheManager.init();
    });
  });
});

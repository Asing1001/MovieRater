import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { updatePttArticles } from '../task/pttTask';
import * as pttCrawler from '../crawler/pttCrawler';
import { Mongo } from '../data/db';
import PttPage from '../models/pttPage';

chai.use(sinonChai);

describe('pttCrawler', () => {
  let sandbox, stubUpdateDocument;

  before(() => {
    sandbox = sinon.sandbox.create();
    stubUpdateDocument = sandbox.stub(Mongo, 'updateDocument');
  });

  after(() => sandbox.restore());

  describe('updatePttArticles', () => {
    it('should get new pttArticles then updateDocument', async function () {
      const pttPage: PttPage = {
        pageIndex: 99999,
        url: 'http://ptt.test',
        articles: [{ title: 'test', url: 'http://article' }],
      };
      const stubGetDocument = sandbox
        .stub(Mongo, 'getDocument')
        .returns({ lastCrawlPttIndex: 9999 });
      const stubGetPttPage = sandbox
        .stub(pttCrawler, 'getPttPage')
        .returns(Promise.resolve(pttPage));
      await updatePttArticles(3);
      //updateMaPttIndex + 3 new pttArticles = 4 call count
      sandbox.assert.callCount(stubUpdateDocument, 4);
      sandbox.assert.calledThrice(stubGetPttPage);
    });
  });
});

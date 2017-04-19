import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { db } from "../data/db";
import { updateTheaterList, } from '../task/yahooTask';
import Theater from '../models/theater';
import * as theaterCrawler from '../crawler/theaterCrawler';

const should = chai.should();
chai.use(sinonChai);

describe('task', () => {
  let sandbox, stubUpdateDocument;

  before(() => {
    sandbox = sinon.sandbox.create();
    stubUpdateDocument = sandbox.stub(db, 'updateDocument');
  });

  after(() => sandbox.restore());

  describe('updateTheaterList', () => {
    it('should get theater list then updateDocument', async function () {
      const stubGetTheaterList = sandbox.stub(theaterCrawler, 'getTheaterList').returns([1]);
      await updateTheaterList();
      sandbox.assert.calledOnce(stubUpdateDocument);
      sandbox.assert.calledOnce(stubGetTheaterList);
    });
  });
});
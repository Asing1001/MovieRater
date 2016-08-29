import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {crawlYahoo} from '../crawler/yahooCrawler';
import {db} from '../db';
import * as fetch from 'node-fetch';

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.should();
chai.use(chaiAsPromised);

describe('Crawler', () => {
  describe('YahooCrawler', () => {
    it('should correctly get new data from yahoo', function () {
       
    });
  });
});
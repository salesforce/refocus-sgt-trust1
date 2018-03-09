/**
 * testConnection.js
 */
const chai = require('chai');
chai.use(require('chai-url'));
const expect = chai.expect;
const tu = require('../utils/testUtils');

describe('connection tests >', () => {
  before(tu.buildConnection);

  const ctx = {
    baseTrustUrl: 'https://trust.salesforce.com/api',
    statusLinkUrl: 'http://status.salesforce.com/status',
  };

  describe('prepareUrl >', () => {
    it('prepareUrl, default window', () => {
      const url = tu.prepareUrl(ctx);
      expect(url).to.have.protocol('https');
      expect(url).to.contain.hostname('trust.salesforce.com');
      expect(url).to.contain.path('/api/v1/instances/status/preview');
    });
  });

  describe('prepareHeaders >', () => {
    it('prepareHeaders, default', () => {
      const headers = tu.prepareHeaders(ctx);
      expect(headers).to.have.property('Accept', 'application/json');
    });
  });
});

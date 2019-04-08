/**
 * testConnection.js
 */
const chai = require('chai');
chai.use(require('chai-url'));
const expect = chai.expect;
const tu = require('../utils/testUtils');

describe('connection tests >', () => {
  before(tu.buildConnection);

  const aspects = [{ name: 'Trust', timeout: '5m' }];
  const subjects = [{ absolutePath: 'a.b.cdefg', name: 'cdefg' }];

  describe('prepareUrl >', () => {
    it('prepareUrl, default window', () => {
      const ctx = {
        baseTrustUrl: 'https://trust.salesforce.com/api',
        statusLinkUrl: 'http://status.salesforce.com/status',
      };
      const url = tu.prepareUrl(ctx, aspects, subjects);
      expect(url).to.have.protocol('https');
      expect(url).to.contain.hostname('trust.salesforce.com');
      expect(url).to.contain.path('/api/v1/instances/cdefg/status/preview?childProducts=false');
    });
  });

  describe('prepareHeaders >', () => {
    it('prepareHeaders, default', () => {
      const ctx = {
        baseTrustUrl: 'https://trust.salesforce.com/api',
        statusLinkUrl: 'http://status.salesforce.com/status',
      };
      const headers = tu.prepareHeaders(ctx);
      expect(headers).to.have.property('Accept', 'application/json');
    });
  });
});

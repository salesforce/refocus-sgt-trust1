/**
 * testTransform.js
 */
const expect = require('chai').expect;
const helpers = require('./transform.js').helpers;
const tu = require('../utils/testUtils');

describe('transform tests >', () => {
  before(tu.buildTransform);

  const ctx = {
    errorValue: '-1',
    baseTrustUrl: 'https://api.status.salesforce.com',
    statusLinkUrl: 'http://status.salesforce.com/status',
    statusMap: {
      OK: { value: '0' },
      INFORMATIONAL_NONCORE: { value: '1' },
      MAINTENANCE_NONCORE: { value: '1' },
      MINOR_INCIDENT_NONCORE: { value: '2' },
      MAJOR_INCIDENT_NONCORE: { value: '3' },
      INFORMATIONAL_CORE: { value: '1', messageCode: 'CORE' },
      MAINTENANCE_CORE: { value: '1', messageCode: 'CORE' },
      MINOR_INCIDENT_CORE: { value: '2', messageCode: 'CORE' },
      MAJOR_INCIDENT_CORE: { value: '3', messageCode: 'CORE' }
    },
  };
  const aspects = [{ name: 'trust1', timeout: '60s' }];
  const subject = { name: 'p1', absolutePath: 'dc1.sp1.p1' };
  const res = {
    body: {
      "key": "P1",
      "location": "NA",
      "environment": "production",
      "releaseVersion": "Winter '18 Patch 11.4",
      "releaseNumber": "210.11.4",
      "status": "OK",
      "isActive": true,
      "Products": [],
      "Incidents": [],
      "Maintenances": []
    },
  };
  const statusLinkUrl = 'https://status.salesforce.com';

  describe('transform >', () => {
    it('transform', () => {
      const samples = tu.doTransform(ctx, aspects, subject, res);
      expect(samples).to.be.an('array').with.length(1);
      expect(samples[0]).to.deep.equal({
        messageBody: '',
        messageCode: '',
        name: 'dc1.sp1.p1|trust1',
        relatedLinks: [
          {
            name: 'Trust',
            url: 'http://status.salesforce.com/status/P1',
          }
        ],
        value: '0',
       });
    });
  });

  describe('helpers >', () => {
    describe('toRelatedLink >', () => {
      it('OK', () => {
        expect(helpers.toRelatedLink(statusLinkUrl, subject.name))
        .to.deep.equal({
          name: 'Trust',
          url: `${statusLinkUrl}/${subject.name}`,
        });
      });
    });

    describe('response validation >', () => {
      it('must fail when invalid response', () => {
        const withoutRequiredkey = {
          body: [
            {
              "location": "NA",
              "environment": "production",
              "releaseVersion": "Winter '18 Patch 11.4",
              "releaseNumber": "210.11.4"
            }
          ]
        };
        const withInvalidType = {
          body: [
            {
              "key": 1,
              "location": 0,
              "status": "NOT_IN_ENUM",
              "environment": 1,
              "releaseVersion": 0,
              "releaseNumber": 0,
              "Products": {}
            }
          ]
        };
        [1, '', {}, { body: { a: '' } }, { body: [1,2] }, { body: [1] }, { body: [] },
          withoutRequiredkey, withInvalidType].forEach((it) => {
            expect(() => tu.validateResponse(it)).to.throw();
        });
      });
    });

    describe('truncateMessage >', () => {
      const msg = 'abcdefg hijklmnop';

      it('Must return expected result when msg is invalid', () => {
        [
          [null, null],
          ['', ''],
          [undefined, undefined],
        ].forEach((dataTable) => {
          const input = dataTable[0];
          const expectedResult = dataTable[1];
          expect(helpers.truncateMessage(input, 10)).to.equal(expectedResult);
        });
      });

      it('not too long, returns unmodified', () => {
        expect(helpers.truncateMessage(msg, 20)).to.equal('abcdefg hijklmnop');
      });

      it('too long, truncates', () => {
        expect(helpers.truncateMessage(msg, 10)).to.equal('abcdefg...');
      });

      it('must return unmodified when invalid max argument', () => {
        [undefined, 0, 3, '14'].forEach((max) => {
          expect(helpers.truncateMessage(msg, max)).to.equal(msg);
        });
      });
    });
  });
});

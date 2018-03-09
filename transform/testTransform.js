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
  const subjects = [
    { name: 'p1', absolutePath: 'dc1.sp1.p1' },
    { name: 'p2', absolutePath: 'dc1.sp1.p2' },
    { name: 'p3', absolutePath: 'dc2.sp1.p3' },
    { name: 'p5', absolutePath: 'dc2.sp1.p5' },
  ];
  const res = {
    body: [
      {
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
      {
        "key": "P2",
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
      {
        "key": "P3",
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
      {
        "key": "P4",
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
    ],
  };
  const statusLinkUrl = 'https://status.salesforce.com';

  describe('transform >', () => {
    it('transform', () => {
      const samples = tu.doTransform(ctx, aspects, subjects, res);
      expect(samples).to.be.an('array').with.length(4);
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
      expect(samples[1]).to.deep.equal({
        messageBody: '',
        messageCode: '',
        name: 'dc1.sp1.p2|trust1',
        relatedLinks: [
          {
            name: 'Trust',
            url: 'http://status.salesforce.com/status/P2',
          }
        ],
        value: '0',
       });
      expect(samples[2]).to.deep.equal({
        messageBody: '',
        messageCode: '',
        name: 'dc2.sp1.p3|trust1',
        relatedLinks: [
          {
            name: 'Trust',
            url: 'http://status.salesforce.com/status/P3',
          }
        ],
        value: '0',
       });
      expect(samples[3]).to.deep.equal({
        messageBody: 'Status for p5 not returned by ' +
          'https://api.status.salesforce.com/v1/instances/status/preview.',
        messageCode: '',
        name: 'dc2.sp1.p5|trust1',
        relatedLinks: [
          {
            name: 'Trust',
            url: 'http://status.salesforce.com/status/p5',
          }
        ],
        value: '-1',
       });
    });
  });

  describe('helpers >', () => {
    describe('toRelatedLink >', () => {
      it('OK', () => {
        subjects.forEach((s) => {
          expect(helpers.toRelatedLink(statusLinkUrl, s.name))
          .to.deep.equal({
            name: 'Trust',
            url: `${statusLinkUrl}/${s.name}`,
          });
        });
      });
    });

    describe('truncateMessage >', () => {
      const msg = 'abcdefg hijklmnop';

      it('null message', () => {
        expect(helpers.truncateMessage(null, 10)).to.equal(null);
      });

      it('empty message', () => {
        expect(helpers.truncateMessage('', 10)).to.equal('');
      });

      it('undefined message', () => {
        expect(helpers.truncateMessage(undefined, 10)).to.equal(undefined);
      });

      it('not too long, returns unmodified', () => {
        expect(helpers.truncateMessage(msg, 20))
        .to.equal('abcdefg hijklmnop');
      });

      it('too long, truncates', () => {
        expect(helpers.truncateMessage(msg, 10))
        .to.equal('abcdefg...');
      });

      it('max not a number, returns unmodified', () => {
        expect(helpers.truncateMessage(msg, '14')).to.equal(msg);
      });

      it('max undefined, returns unmodified', () => {
        expect(helpers.truncateMessage(msg)).to.equal(msg);
      });

      it('max 0, returns unmodified', () => {
        expect(helpers.truncateMessage(msg, 0)).to.equal(msg);
      });

      it('max 3, returns unmodified', () => {
        expect(helpers.truncateMessage(msg, 0)).to.equal(msg);
      });
    });
  });
});

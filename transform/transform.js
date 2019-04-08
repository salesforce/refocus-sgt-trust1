/**
 * transform.js
 */
module.exports = {
  transformBySubject(ctx, aspects, subject, res) {
    const collectUrl =
      `${ctx.baseTrustUrl}/v1/instances/${subject.name}/status/preview`;
    const smap = ctx.statusMap[res.body.status] ||
      { messageBody: '', messageCode: '' };
    const mbody = smap.messageBody || '' + (res.body.isActive ? '' :
      ' (this instance has isActive=false on trust) ');
    return [{
      messageBody: truncateMessage(mbody, 4096),
      messageCode: smap.messageCode || '',
      name: `${subject.absolutePath}|${aspects[0].name}`,
      relatedLinks: [toRelatedLink(ctx.statusLinkUrl, res.body.key)],
      value: smap.value || entry.status,
    }];
  },

  /**
   * Helpers (optional)
   *
   * Define helper functions here if you need to be able to test them directly.
   */
  helpers: {
    toRelatedLink(statusUrl, subjectName) {
      return ({name: 'Trust', url: `${statusUrl}/${subjectName}`});
    },
    truncateMessage(msg, max) {
      return (typeof max === 'number' && max >= 4 && typeof msg === 'string' &&
        msg.length > max) ?
        msg.substring(0, max - 3) + '...' : msg;
    },
  },

  contextDefinition: {
    errorValue: {
      required: false,
      default: '-1',
      description: 'An error sample\'s value, e.g. \'-1\'.',
    },
    baseTrustUrl: {
      required: true,
      description: 'The base url of your Trust1 API endpoint, e.g. ' +
        '\'https://api.status.salesforce.com\'.',
    },
    statusLinkUrl: {
      required: true,
      description: 'The base url of your Trust1 endpoint for a sample\'s ' +
        'related links, e.g. \'http://status.salesforce.com/status/\'.',
    },
    statusMap: {
      required: false,
      default: {
        OK: { value: '0' },
        INFORMATIONAL_NONCORE: { value: '1' },
        MAINTENANCE_NONCORE: { value: '1' },
        MINOR_INCIDENT_NONCORE: { value: '2' },
        MAJOR_INCIDENT_NONCORE: { value: '3' },
        INFORMATIONAL_CORE: {
          value: '1',
          messageCode: 'CORE'
        },
        MAINTENANCE_CORE: {
          value: '1',
          messageCode: 'CORE'
        },
        MINOR_INCIDENT_CORE: {
          value: '2',
          messageCode: 'CORE'
        },
        MAJOR_INCIDENT_CORE: {
          value: '3',
          messageCode: 'CORE'
        }
      },
      description: 'An object which maps each Trust1 status enum value to ' +
        'a sample value, messageCode and messageBody.',
    },
  },
  responseSchema: {
    "type": "object",
    "required": ["body"],
    "properties": {
      "body": {
        "type": "object",
        "required": ["key"],
        "properties": {
          "key": {
            "type": "string",
            "maxLength": 255,
          },
          "location": {
            "type": "string",
            "maxLength": 255,
          },
          "environment": {
            "type": "string",
            "maxLength": 255,
          },
          "releaseVersion": {
            "type": "string",
            "maxLength": 255,
          },
          "releaseNumber": {
            "type": "string",
            "maxLength": 255,
          },
          "status": {
            "type": "string",
            "enum": ["OK", "MAJOR_INCIDENT_CORE", "MINOR_INCIDENT_CORE",
              "MAINTENANCE_CORE", "MAJOR_INCIDENT_NONCORE",
              "MINOR_INCIDENT_NONCORE", "MAINTENANCE_NONCORE"],
            "maxLength": 255,
          },
          "isActive": {
            "type": "boolean",
          },
          "Products": {
            "type": "array",
          },
          "Incidents": {
            "type": "array",
          },
          "Maintenances": {
            "type": "array",
          },
          "Tags": {
            "type": "array",
          },
        },
      },
    },
  },
};

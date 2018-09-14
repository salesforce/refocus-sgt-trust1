/**
 * transform.js
 */
module.exports = {
  /**
   * Collect data from your connection.url for *all* the subjects in a single
   * request, transform and return array of samples.
   *
   * @param {Object} ctx - The context from the Sample Generator
   * @param {Array} aspects - Array of one or more aspects
   * @param {Array} subjects - Array of one or more subjects
   * @param {http.ServerResponse} res - The response object
   * @returns {Array} an array of samples
   */
  transformBulk(ctx, aspects, subjects, res) {
    const asp = aspects[0].name;
    const collectUrl = `${ctx.baseTrustUrl}/v1/instances/status/preview`;
    const sampleList = []; // Define the array of samples to return.

    /*
     * Map each subject's name (lowercase) to its absolutePath.
     */
    const subjectMap = {};
    subjects.forEach((s) =>
      subjectMap[s.name.toLowerCase()] = s.absolutePath);

    /*
     * Filter out subjects from the trust response body which are NOT in the
     * list of subjects provided by the SampleGenerator.
     */
    const trustStatusEntries = res.body.filter((entry) =>
      entry.hasOwnProperty('key') && subjectMap[entry.key.toLowerCase()]);

    /*
     * For each trust status entry that made it through the filter, generate
     * a sample and add it to the 'sampleList' array.
     */
    trustStatusEntries.forEach((entry) => {
      const smap =
        ctx.statusMap[entry.status] || { messageBody: '', messageCode: '' };
      const absPath = subjectMap[entry.key.toLowerCase()];
      sampleList.push({
        messageBody: truncateMessage(smap.messageBody || '', 4096),
        messageCode: smap.messageCode || '',
        name: `${absPath}|${asp}`,
        relatedLinks: [toRelatedLink(ctx.statusLinkUrl, entry.key)],
        value: smap.value || entry.status,
      });

      /*
       * Clear this entry from the subjectMap. We will generate error samples
       * for any subjects left in the subjectMap once we're out of this for
       * loop.
       */
      delete subjectMap[entry.key.toLowerCase()];
    }); // trustStatusEntries.forEach

    /*
     * For each subject provided by the SampleGenerator which was missing from
     * the trust response, generate an error sample and add it to the
     * 'sampleList' array.
     */
    Object.keys(subjectMap).forEach((s) => sampleList.push({
      messageBody: `Status for ${s} not returned by ${collectUrl}.`,
      messageCode: '',
      name: `${subjectMap[s]}|${asp}`,
      relatedLinks: [toRelatedLink(ctx.statusLinkUrl, s)],
      value: ctx.errorValue,
    }));

    /*
     * Return the array of samples.
     */
    return sampleList;
  },

  /**
   * Helpers (optional)
   *
   * Define helper functions here if you need to be able to test them directly.
   */
  helpers: {
    toRelatedLink(statusUrl, subjectName) {
      return ({ name: 'Trust', url: `${statusUrl}/${subjectName}` });
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
      description: 'The base url of your Trust1 API endpoint, e.g. \'https://api.status.salesforce.com\'.',
    },
    statusLinkUrl: {
      required: true,
      description: 'The base url of your Trust1 endpoint for a sample\'s related links, e.g. \'http://status.salesforce.com/status/\'.',
    },
    statusMap: {
      required: false,
      default: {
        OK: {
          value: '0'
        },
        INFORMATIONAL_NONCORE: {
          value: '1'
        },
        MAINTENANCE_NONCORE: {
          value: '1'
        },
        MINOR_INCIDENT_NONCORE: {
          value: '2'
        },
        MAJOR_INCIDENT_NONCORE: {
          value: '3'
        },
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
      description: 'An object which maps each Trust1 status enum value to a sample value, messageCode and messageBody.',
    },
  },
  responseSchema: {
      "type": "object",
      "required": ["body"],
      "properties": {
        "body": {
        "type": "array",
        "minItems": 1,
        "items": {
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
              "enum": ["OK", "MAJOR_INCIDENT_CORE", "MINOR_INCIDENT_CORE", "MAINTENANCE_CORE",
                "MAJOR_INCIDENT_NONCORE", "MINOR_INCIDENT_NONCORE", "MAINTENANCE_NONCORE"],
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
  },
};

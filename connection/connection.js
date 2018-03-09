/**
 * connection.js
 */
module.exports = {
  url: '{{baseTrustUrl}}/v1/instances/status/preview',
  headers: {
    Accept: 'application/json',
  },
  contextDefinition: {
    baseTrustUrl: {
      required: true,
      description: 'The base url of your Trust1 API endpoint, e.g. \'https://api.status.salesforce.com\'.',
    },
  },
};

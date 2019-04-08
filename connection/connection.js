/**
 * connection.js
 */
module.exports = {
  toUrl(ctx, aspects, subjects) {
    return `${ctx.baseTrustUrl}/v1/instances/${subjects[0].name}/status/preview?childProducts=false`;
  },
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

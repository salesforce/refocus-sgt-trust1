# refocus-sgt-trust1

Note: this repository is infrequently maintained.

## Description

A Refocus Sample Generator Template for generating samples based on Salesforce's Trust1 API.

## Context Variables

The following context variables may be specified by the Sample Generator and will be available to build the connection url, or as contexet data passed into the transform function and toUrl function:

- `baseTrustUrl` (required): The base url of your Trust1 API endpoint, e.g. `https://api.status.salesforce.com`.
- `errorValue`: An error sample's value, e.g. `-1`. Defaults to `-1` if not specified.
- `statusLinkUrl` (required): The base url of your Trust1 endpoint for a sample's related links, e.g. `http://status.salesforce.com/status/`.
- `statusMap`: An object which maps each Trust1 status enum value to a sample value, messageCode and messageBody. Defaults to the following if not specified:
	```json
		{
	        "OK": {
	          "value": "0"
	        },
	        "INFORMATIONAL_NONCORE": {
	          "value": "1"
	        },
	        "MAINTENANCE_NONCORE": {
	          "value": "1"
	        },
	        "MINOR_INCIDENT_NONCORE": {
	          "value": "2"
	        },
	        "MAJOR_INCIDENT_NONCORE": {
	          "value": "3"
	        },
	        "INFORMATIONAL_CORE": {
	          "value": "1",
	          "messageCode": "CORE"
	        },
	        "MAINTENANCE_CORE": {
	          "value": "1",
	          "messageCode": "CORE"
	        },
	        "MINOR_INCIDENT_CORE": {
	          "value": "2",
	          "messageCode": "CORE"
	        },
	        "MAJOR_INCIDENT_CORE": {
	          "value": "3",
	          "messageCode": "CORE"
	        }
	      }
	```

## Transform Algorithm

Generate a sample based on the instance status.

# Revision History

* 2.0.0 - Use individual instance API endpoint instead of bulk
* 1.0.2 - include isActive=false in sample messageBody when isActive=false

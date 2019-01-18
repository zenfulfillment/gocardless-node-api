const Promise = require('bluebird');
const request = require('request-promise');
const _ = require('lodash');

const rejectMissingUrl = () => Promise.reject(new Error('Missing url'));
const rejectMissingBody = () => Promise.reject(new Error('Missing body'));

const GOCARDLESS_API_URL = 'https://api.gocardless.com/';
const GOCARDLESS_SANDBOX_API_URL = 'https://api-sandbox.gocardless.com/';

module.exports = (accessToken) => {
  if (!accessToken) {
    throw new Error('Missing accessToken');
  }

  const isSandbox = (/^sandbox_/).test(accessToken);
  const baseUrl = isSandbox ? GOCARDLESS_SANDBOX_API_URL : GOCARDLESS_API_URL;

  function _request(args) {
    return request.defaults({
      baseUrl,
      json: true,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'GoCardless-Version': '2015-07-06'
      }
    })(args).promise();
  }

  return {
    get(url, qs = {}, {isFile = false} = {}) {
      if (_.isEmpty(url)) {
        return rejectMissingUrl();
      }

      const encoding = isFile ? {encoding: null} : {};

      const args = Object.assign({}, {url, method: 'GET', qs}, encoding);

      return _request(args);
    },

    post(url, body, {isFile = false} = {}) {
      if (_.isEmpty(url)) {
        return rejectMissingUrl();
      }

      if (_.isEmpty(body)) {
        return rejectMissingBody();
      }

      if (isFile) {
        return _request({url, method: 'POST', formData: body});
      }
      return _request({url, method: 'POST', body});
    },

    put(url, body = {}) {
      if (_.isEmpty(url)) {
        return rejectMissingUrl();
      }

      return _request({url, method: 'PUT', body});
    },

    del(url) {
      if (_.isEmpty(url)) {
        return rejectMissingUrl();
      }

      return _request({url, method: 'DELETE'});
    }
  };
};

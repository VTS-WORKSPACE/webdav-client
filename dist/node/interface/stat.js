"use strict";

const {
  merge
} = require("../merge.js");

const {
  handleResponseCode,
  processResponsePayload
} = require("../response.js");

const {
  parseXML,
  prepareFileFromProps
} = require("./dav.js");

const urlTools = require("../url.js");

const {
  encodePath,
  joinURL,
  prepareRequestOptions,
  request
} = require("../request.js");

function getStat(filename, options) {
  const requestOptions = {
    url: joinURL(options.remoteURL, encodePath(filename)),
    method: "POST",
    headers: {
      Accept: "text/plain",
      Depth: 0,
      // [VWORKSPACE] Fix PUT DELETE MOVE COPY PROPFIND is denine by Admin
      'Target-Request-Method': 'PROPFIND'
    },
    responseType: "text"
  };
  let response = null;
  prepareRequestOptions(requestOptions, options);
  return request(requestOptions).then(handleResponseCode).then(res => {
    response = res;
    return res.data;
  }).then(parseXML).then(xml => parseStat(xml, filename, options.details)).then(result => processResponsePayload(response, result, options.details));
}

function parseStat(result, filename, isDetailed = false) {
  let responseItem = null;

  try {
    responseItem = result.multistatus.response[0];
  } catch (e) {
    /* ignore */
  }

  if (!responseItem) {
    throw new Error("Failed getting item stat: bad response");
  }

  const {
    propstat: {
      prop: props
    }
  } = responseItem;
  const filePath = urlTools.normalisePath(filename);
  return prepareFileFromProps(props, filePath, isDetailed);
}

module.exports = {
  getStat,
  parseStat
};
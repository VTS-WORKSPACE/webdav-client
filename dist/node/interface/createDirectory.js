"use strict";

const responseHandlers = require("../response.js");

const {
  encodePath,
  joinURL,
  prepareRequestOptions,
  request
} = require("../request.js");

function createDirectory(dirPath, options) {
  const requestOptions = {
    url: joinURL(options.remoteURL, encodePath(dirPath)),
    method: "POST",
    // [VWORKSPACE] Fix PUT DELETE MOVE COPY PROPFIND is denine by Admin
    headers: {
      'Target-Request-Method': 'MKCOL'
    }
  };
  prepareRequestOptions(requestOptions, options);
  return request(requestOptions).then(responseHandlers.handleResponseCode);
}

module.exports = {
  createDirectory: createDirectory
};
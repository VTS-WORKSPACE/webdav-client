"use strict";

const responseHandlers = require("../response.js");

const {
  encodePath,
  joinURL,
  prepareRequestOptions,
  request
} = require("../request.js");

function moveFile(filename, destination, options) {
  const requestOptions = {
    url: joinURL(options.remoteURL, encodePath(filename)),
    method: "POST",
    headers: {
      Destination: joinURL(options.remoteURL, encodePath(destination)),
      // [VWORKSPACE] Fix PUT DELETE MOVE COPY PROPFIND is denine by Admin
      'Target-Request-Method': 'MOVE'
    }
  };
  prepareRequestOptions(requestOptions, options);
  return request(requestOptions).then(responseHandlers.handleResponseCode);
}

module.exports = {
  moveFile
};
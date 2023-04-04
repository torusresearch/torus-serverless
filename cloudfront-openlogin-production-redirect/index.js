"use strict";

const GLOBAL_VERSION = "v1";

exports.handler = (event, context, callback) => {
  const version = GLOBAL_VERSION;

  // Extract the request from the CloudFront event that is sent to Lambda@Edge
  const request = event.Records[0].cf.request;

  // Extract the URI from the request
  const olduri = request.uri;

  // if uri is like /v10/hello.js *(js|css|png|PNG|svg|html|jpg|JPG|jpeg|JPEG), then return same ^\/v[0-9][0-9]*\.(js|css|png|PNG|svg|html|jpg|JPG|jpeg|JPEG)$
  // if uri is like /v10/wallet non-extension files, then return app.openlogin.com/v10/index.html ^\/v[0-9][0-9]*\.[0-9][0-9]*\.[0-9][0-9]*\/[^\.]*$
  // if uri is like /v10 or /v10/, then return app.openlogin.com/v10/index.html ^\/v[0-9][0-9]*\.[0-9][0-9]*\.[0-9][0-9]*[\/]?$
  // if uri is like /embed.min.js *(js|css|png|PNG|svg|html|jpg|JPG|jpeg|JPEG), then return app.openlogin.com/${version}/embed.min.js ^\/..*\.(js|css|png|PNG|svg|html|jpg|JPG|jpeg|JPEG)$
  // if uri is like /wallet or /wallet/ , then return app.openlogin.com/${version}/index.html ^\/[^\.]*$
  // if uri is like /, then return app.openlogin.com/${version}/index.html app\.openlogin\.com\/$
  let newuri;
  if (RegExp(/^\/v[0-9][0-9]*\/..*\.(js|css|png|PNG|svg|html|jpg|JPG|jpeg|JPEG|JSON|json|txt|gif)$/).test(olduri)) {
    newuri = olduri;
  } else if (RegExp(/^\/v[0-9][0-9]*\/[^\.]*$/).test(olduri)) {
    const secondIndex = olduri.indexOf("/", 1);
    newuri = olduri.slice(0, secondIndex) + `/index.html`;
  } else if (RegExp(/^\/v[0-9][0-9]*[\/]?$/).test(olduri)) {
    const secondIndex = olduri.indexOf("/", 1);
    const slicedOrignal = secondIndex === -1 ? olduri : olduri.slice(0, secondIndex);
    newuri = slicedOrignal + `/index.html`;
  } else if (RegExp(/^\/..*\.(js|css|png|PNG|svg|html|jpg|JPG|jpeg|JPEG|JSON|json|txt|gif)$/).test(olduri)) {
    newuri = olduri.replace("/", `/${version}/`);
  } else if (RegExp(/^\/[^\.]*$/).test(olduri)) {
    newuri = `/${version}/index.html`;
  } else {
    newuri = `/${version}/index.html`;
  }

  // Log the URI as received by CloudFront and the new URI to be used to fetch from origin
  console.log("Old URI: " + olduri);
  console.log("New URI: " + newuri);

  // Replace the received URI with the URI that includes the index page
  request.uri = newuri;

  // Return to CloudFront
  return callback(null, request);
};

"use strict";
exports.handler = (event, context, callback) => {
  const response = event.Records[0].cf.response;
  const uri = event.Records[0].cf.request.uri;
  const headers = response.headers;

  headers["cache-control"] = [
    {
      key: "Cache-Control",
      value: "max-age=3600"
    }
  ];

  if (uri.includes("service-worker.js")) {
    headers["service-worker-allowed"] = [
      {
        key: "Service-Worker-Allowed",
        value: "/"
      }
    ];
  }

  headers["strict-transport-security"] = [
    {
      key: "Strict-Transport-Security",
      value: "max-age=31536000; includeSubdomains; preload"
    }
  ];

  headers["x-content-type-options"] = [
    {
      key: "X-Content-Type-Options",
      value: "nosniff"
    }
  ];

  headers["x-xss-protection"] = [
    {
      key: "X-XSS-Protection",
      value: "1; mode=block"
    }
  ];

  headers["referrer-policy"] = [
    {
      key: "Referrer-Policy",
      value: "same-origin"
    }
  ];

  callback(null, response);
};

const redirect = (request, callback) => {
  const location = request.querystring ? `${request.uri}/?${request.querystring}` : `${request.uri}/`

  const response = {
    status: '301',
    statusDescription: 'Moved Permanently',
    headers: {
      location: [{
        key: 'Location',
        value: location
      }]
    }
  };
  callback(null, response);
}

module.exports.handleIndexes = (uri) => {
  if (uri.endsWith('/')) {
    console.log(`'index.html' appended to request.uri: ${uri}`);
    return `${uri}index.html`;
  }

  return uri;
}

module.exports.handleRedirect = (request, callback) => {
  if (!request.uri.endsWith('/') && !request.uri.includes('.')) {
    console.log(`301 redirect ${request.uri} to ${request.uri}/`);
    redirect(request, callback);
  }
}

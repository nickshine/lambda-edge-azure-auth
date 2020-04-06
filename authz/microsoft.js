function isAuthorized(decoded, request, callback, unauthorized, internalServerError, config) {
  callback(null, request);
}

function getSubject(decoded) {
  return decoded.payload.upn || decodec.payload.sub;
}

exports.isAuthorized = isAuthorized;
exports.getSubject = getSubject;

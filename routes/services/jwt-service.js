var jwt = require('jsonwebtoken');

var supersecretpasswordkey = '8cb7c908ec5690db341e66fdf8';

function generate() {
  return jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
    data: {
      username: 'Admin'
    }
  }, supersecretpasswordkey);
}

function decode(token) {
  return jwt.decode(token);
}

function verifyToken(token) {
  if (token == undefined || token == null) {
    return {
      error: 'No token present'
    }
  }
  var decoded = '';
  try {
    decoded = jwt.verify(token, supersecretpasswordkey);
  } catch (err) {
    return {
      error: err
    };
  }
  return jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
    data: decoded.data
  }, supersecretpasswordkey);
}

module.exports = {
  generate: generate,
  decode: decode,
  verify: verifyToken
};

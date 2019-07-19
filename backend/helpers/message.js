const ethUtil = require("ethereumjs-util");

function getSignInMessage(randomNumber) {
  return `Torus Signin - ${randomNumber}`;
}

function getAddressFromSignedMessage(message, signed_message) {
  const msgHash = ethUtil.hashPersonalMessage(ethUtil.toBuffer(message));
  const signature = ethUtil.toBuffer(signed_message);
  const sigParams = ethUtil.fromRpcSig(signature);
  const publicKey = ethUtil.ecrecover(msgHash, sigParams.v, sigParams.r, sigParams.s);
  const sender = ethUtil.publicToAddress(publicKey);
  return ethUtil.bufferToHex(sender);
}

module.exports.getSignInMessage = getSignInMessage;
module.exports.getAddressFromSignedMessage = getAddressFromSignedMessage;

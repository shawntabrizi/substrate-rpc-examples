// browserify dependencies.js > bundle.js

let utils = require('@polkadot/util');
let util_crypto = require('@polkadot/util-crypto');
let keyring = require('@polkadot/keyring');

window.utils = utils;
window.util_crypto = util_crypto;
window.keyring = keyring;

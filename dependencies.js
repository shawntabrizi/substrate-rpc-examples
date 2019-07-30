// browserify dependencies.js > bundle.js

let util = require('@polkadot/util');
let util_crypto = require('@polkadot/util-crypto');
let keyring = require('@polkadot/keyring');

window.util = util;
window.util_crypto = util_crypto;
window.keyring = keyring;

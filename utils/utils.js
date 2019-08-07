/* Balance to Hex (Little Endian) */
let b2h = {
	"balance": document.getElementById("balance-b2h"),
	"hex": document.getElementById("hex-b2h")
};

b2h.balance.addEventListener("input", bn2hex);
b2h.hex.addEventListener("input", hex2bn);

function bn2hex() {
	try {
		b2h.hex.value = util.bnToHex(b2h.balance.value, { isLe: true});
	} catch(e) {
		b2h.hex.value = "Error";
		console.error(e);
	}
}

function hex2bn() {
	try {
		b2h.balance.value = util.hexToBn(b2h.hex.value, { isLe: true});
	} catch(e) {
		b2h.balance.value = "Error";
		console.error(e);
	}
}

/* AccountId to Hex */
let a2h = {
	"account": document.getElementById("account-a2h"),
	"hex": document.getElementById("hex-a2h")
};

a2h.account.addEventListener("input", account2hex);
a2h.hex.addEventListener("input", hex2account);

function account2hex() {
	try {
		a2h.hex.value = util.u8aToHex(keyring.decodeAddress(a2h.account.value));
	} catch(e) {
		a2h.hex.value = "Error";
		console.error(e);
	}
}

function hex2account() {
	try {
		a2h.account.value = keyring.encodeAddress(a2h.hex.value);
	} catch(e) {
		a2h.account.value = "Error";
		console.error(e);
	}
}

/* Blake-256 a String */
let b256 = {
	"input": document.getElementById("input-b256"),
	"hash": document.getElementById("hash-b256")
};

b256.input.addEventListener("input", blake2string);

function blake2string() {
	try {
		b256.hash.innerText = util_crypto.blake2AsHex(b256.input.value, 256);
	} catch(e) {
		b256.hash.innerText = "Error";
		console.error(e);
	}
}

/* XXHash a String */
let xx128 = {
	"input": document.getElementById("input-xx128"),
	"hash": document.getElementById("hash-xx128")
};

xx128.input.addEventListener("input", xxhash2string);

function xxhash2string() {
	try {
		xx128.hash.innerText = util_crypto.xxhashAsHex(xx128.input.value, 128);
	} catch(e) {
		xx128.hash.innerText = "Error";
		console.error(e);
	}
}

/* Seed to Address */
let s2a = {
	"address": document.getElementById("address-s2a"),
	"seed": document.getElementById("seed-s2a")
};

s2a.seed.addEventListener("input", seed2address);

function seed2address() {
	try {
		let k = new keyring.Keyring({ type: "sr25519" });
		let user = k.addFromUri(s2a.seed.value);
		s2a.address.innerText = user.address;
	} catch(e) {
		s2a.address.innerText = "Error";
		console.error(e);
	}
}


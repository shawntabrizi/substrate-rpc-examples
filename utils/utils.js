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

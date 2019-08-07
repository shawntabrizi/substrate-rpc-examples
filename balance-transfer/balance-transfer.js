const BOB = "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty";

function AliceKey() {
	const k = new keyring.Keyring({ type: "sr25519" });
	
}

async function transfer() {
  // Instantiate the API
  const api = await ApiPromise.create();

  // Constuct the keying after the API (crypto has an async init)
  const keyring = new keyring.Keyring({ type: "sr25519" });

  // Add alice to our keyring with a hard-deived path (empty phrase, so uses dev)
  const alice = keyring.addFromUri("//Alice");

  // Create a extrinsic, transferring 12345 units to Bob
  const transfer = api.tx.balances.transfer(BOB, 12345);

  // Sign and send the transaction using our account
  const hash = await transfer.signAndSend(alice);

  console.log("Transfer sent with hash", hash.toHex());
}

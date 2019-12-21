/* Start Setup Stuff */
let runtime_storage = {
  module_name: document.getElementById("runtime-storage-module-name"),
  function_name: document.getElementById("runtime-storage-function-name"),
  key_1: document.getElementById("runtime-storage-key-1"),
  output: document.getElementById("runtime-storage-output")
};

runtime_storage.module_name.addEventListener("input", print_runtime_storage);
runtime_storage.function_name.addEventListener("input", print_runtime_storage);
runtime_storage.key_1.addEventListener("input", print_runtime_storage);

print_runtime_storage();
/* End Setup Stuff */

async function print_runtime_storage() {
  // Clear output field
  runtime_storage.output.innerText = "";
  runtime_storage.output.innerText +=
    "// First we need to generate the storage key (`parameter`)" + "\n";
  let parameter = get_runtime_storage_parameter(
    runtime_storage.module_name.value,
    runtime_storage.function_name.value,
    runtime_storage.key_1.value,
  );

  runtime_storage.output.innerText += "Storage Key Parameter: " + parameter + "\n";
  let new_request = get_storage_request(0, parameter);
  runtime_storage.output.innerText +=
    "Request:   " + (await new_request.text()) + "\n";
  make_request(parameter);
}

function get_runtime_storage_parameter(module_name, function_name, key_1) {
  runtime_storage.output.innerText +=
    "// We do this using the `module_name`, `function_name`, and `key` (optional)" +
    "\n";
  if (key_1) {
    runtime_storage.output.innerText +=
      "// A `key` is provided in this example, so this is how we generate the storage parameter:" +
      "\n";
    runtime_storage.output.innerText +=
      "\n" + get_runtime_storage_parameter_with_key.toString() + "\n\n";
    return get_runtime_storage_parameter_with_key(
      module_name,
      function_name,
      key_1
    );
  } else {
    runtime_storage.output.innerText +=
      "// No `key` is provided in this example." + "\n";
    runtime_storage.output.innerText +=
      "\n" + get_runtime_storage_parameter_without_key.toString() + "\n\n";
    return get_runtime_storage_parameter_without_key(
      module_name,
      function_name
    );
  }
}

function get_runtime_storage_parameter_with_key(
  module_name,
  function_name,
  key
) {
  // We use xxhash 128 for strings the runtime developer can control
  let module_hash = util_crypto.xxhashAsU8a(module_name, 128);
  let function_hash = util_crypto.xxhashAsU8a(function_name, 128);

  // We use blake2 256 for strings the end user can control
  let key_hash = util_crypto.blake2AsU8a(keyToBytes(key));

  // Special syntax to concatenate Uint8Array
  let final_key = new Uint8Array([
    ...module_hash,
    ...function_hash,
    ...key_hash,
  ]);

  // Return a hex string
  return util.u8aToHex(final_key);
}

function get_runtime_storage_parameter_without_key(module_name, function_name) {
  // We use xxhash 128 for strings the runtime developer can control
  let module_hash = util_crypto.xxhashAsU8a(module_name, 128);
  let function_hash = util_crypto.xxhashAsU8a(function_name, 128); 

  // Special syntax to concatenate Uint8Array
  let final_key = new Uint8Array([
    ...module_hash,
    ...function_hash
  ])

  // Return a hex string
  return util.u8aToHex(final_key);
}

function keyToBytes(key) {
  let key_bytes = keyring.decodeAddress(key)
    ? keyring.decodeAddress(key)
    : util.stringToU8a(key);
  return key_bytes;
}

function get_storage_request(endpoint, parameter) {
  let request = new Request(endpoint, {
    method: "POST",
    body: JSON.stringify({
      id: 1,
      jsonrpc: "2.0",
      method: "state_getStorage",
      params: [parameter]
    }),
    headers: { "Content-Type": "application/json" }
  });
  return request;
}

function make_request(parameter, endpoint = "http://localhost:9933/") {
  let request = get_storage_request(endpoint, parameter);
  fetch(request)
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error("Something went wrong on api server!");
      }
    })
    .then(response => {
      runtime_storage.output.innerText +=
        "Response:  " + JSON.stringify(response) + "\n";
      console.debug(response);
    })
    .catch(error => {
      if (endpoint == "http://localhost:9933/") {
        // Fallback to public endpoint
        make_request(
          parameter,
          "https://dev-node.substrate.dev:9933/"
        );
      } else {
        console.error(error);
      }
    });
}

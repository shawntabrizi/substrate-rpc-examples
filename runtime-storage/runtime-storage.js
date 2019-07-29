/* Start Setup Stuff */
let runtime_storage = {
  module_name: document.getElementById("runtime-storage-module-name"),
  function_name: document.getElementById("runtime-storage-function-name"),
  key: document.getElementById("runtime-storage-key"),
  output: document.getElementById("runtime-storage-output")
};

runtime_storage.module_name.addEventListener("input", print_runtime_storage);
runtime_storage.function_name.addEventListener("input", print_runtime_storage);
runtime_storage.key.addEventListener("input", print_runtime_storage);

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
    runtime_storage.key.value
  );

  runtime_storage.output.innerText += "Parameter: " + parameter + "\n";
  let new_request = get_storage_request(0, parameter);
  runtime_storage.output.innerText +=
    "Request:   " + (await new_request.text()) + "\n";
  make_request(parameter);
}

function get_runtime_storage_parameter(module_name, function_name, key) {
  runtime_storage.output.innerText +=
    "// We do this using the `module_name`, `function_name`, and `key` (optional)" +
    "\n";
  if (key) {
    runtime_storage.output.innerText +=
      "// A `key` is provided in this example, so this is how we generate the storage parameter:" +
      "\n";
    runtime_storage.output.innerText +=
      "\n" + get_runtime_storage_parameter_with_key.toString() + "\n\n";
    return get_runtime_storage_parameter_with_key(
      module_name,
      function_name,
      key
    );
  } else {
    runtime_storage.output.innerText +=
      "// No `key` is provided in this example." + "\n";
    runtime_storage.output.innerText +=
      "\n" + get_runtime_storage_parameter_without_key.toString() + "\n\n";
    return get_runtime_storage_parameter_without_key(
      module_name,
      function_name,
      key
    );
  }
}

function get_runtime_storage_parameter_with_key(
  module_name,
  function_name,
  key
) {
  // Special syntax to concatenate Uint8Array
  let a = new Uint8Array([
    ...utils.stringToU8a(module_name + " " + function_name),
    // Key may have many forms
    ...keyToBytes(key)
  ]);
  // We use blake2 for maps (for security), with bit-length 256
  return util_crypto.blake2AsHex(a, 256);
}

function get_runtime_storage_parameter_without_key(module_name, function_name) {
  // Special syntax to concatenate Uint8Array
  let a = utils.stringToU8a(module_name + " " + function_name);
  // We use xxhash for Storage Values, with bit-length 128
  return util_crypto.xxhashAsHex(a, 128);
}

function keyToBytes(key) {
  let key_bytes = keyring.decodeAddress(runtime_storage.key.value)
    ? keyring.decodeAddress(runtime_storage.key.value)
    : utils.stringToU8a(runtime_storage.key.value);
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

function make_request(parameter, endpoint = "http://localhost:9933") {
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
      if (endpoint == "http://localhost:9933") {
        // Fallback to public endpoint
        make_request(
          parameter,
          "https://substrate-rpc.parity.io/state_getStorage"
        );
      } else {
        console.error(error);
      }
    });
}

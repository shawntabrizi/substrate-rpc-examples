let output_raw = document.getElementById("metadata-output-raw");
let output_decoded = document.getElementById("metadata-output-decoded");

function get_metadata_request() {
  let request = new Request("http://localhost:9933", {
    method: "POST",
    body: JSON.stringify({
      id: 1,
      jsonrpc: "2.0",
      method: "state_getMetadata",
    }),
    headers: { "Content-Type": "application/json" }
  });
  return request;
}

function make_request() {
  let request = get_metadata_request();
  fetch(request)
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error("Something went wrong on api server!");
      }
    })
    .then(response => {
      decode_metadata(response.result);
      console.debug(response);
    })
    .catch(error => {
      console.error(error);
    });
}

function decode_metadata(metadata) {
  output_raw.innerText += metadata;
  let decoded = new TextDecoder().decode(utils.hexToU8a(metadata)); 
  output_decoded.innerText += decoded;
}

make_request();

document.getElementById("metadata-request").innerText = get_metadata_request.toString();

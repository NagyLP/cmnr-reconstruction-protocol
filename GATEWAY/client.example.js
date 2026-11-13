// Example HTTP client for a chatbot/tool that can call public HTTPS endpoints.
// The challenge needs only arithmetic; no GitHub login, API key or code execution
// by the chatbot is required if it can read the challenge and make the POST call.
// Usage: node client.example.js https://YOUR-WORKER.workers.dev
const base = process.argv[2];
if (!base) throw new Error("Usage: node client.example.js https://your-worker.example");

const payload = {
  protocol: "CMNR",
  protocol_version: "0.2",
  provider: "Example provider",
  model: "Example model",
  model_identity_basis: "SELF_REPORTED",
  access_mode: "NOT_ACCESSED",
  files_read: [],
  challenge_input: "",
  challenge_result: null,
  application_status: "UNVERIFIED",
  report: "Replace with the factual report produced by the model.",
  limitations: ["Example payload; no repository file was read."]
};

async function main() {
  const challengeResponse = await fetch(base + "/challenge");
  if (!challengeResponse.ok) throw new Error("Challenge request failed: " + challengeResponse.status);
  const { challenge } = await challengeResponse.json();
  const nonce = challenge.split(".")[1];
  const answer = Array.from(nonce).reduce((sum, digit) => sum + parseInt(digit, 16), 0) % 97;
  const response = await fetch(base + "/submit", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ challenge, answer, payload })
  });
  const result = await response.json();
  console.log(response.status, JSON.stringify(result, null, 2));
  if (!response.ok) process.exitCode = 1;
}

main().catch(err => { console.error(err); process.exitCode = 1; });

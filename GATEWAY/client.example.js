// Example Node.js client for a chatbot/tool that can make HTTP requests.
// Usage: node client.js https://YOUR-WORKER.workers.dev
const crypto = require("node:crypto");

const base = process.argv[2];
if (!base) throw new Error("Usage: node client.js https://your-worker.example");

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
  report: "Replace this example with the factual report produced by the model.",
  limitations: ["Example payload; no repository file was read."]
};

function leadingZeroBits(hex) {
  let n = 0;
  for (const c of hex) {
    const v = parseInt(c, 16);
    if (v === 0) n += 4;
    else { n += Math.clz32(v) - 28; break; }
  }
  return n;
}

async function main() {
  const challengeResponse = await fetch(base + "/challenge");
  if (!challengeResponse.ok) throw new Error("Challenge request failed: " + challengeResponse.status);
  const { challenge, difficulty } = await challengeResponse.json();
  const nonce = challenge.split(".")[1];
  const payloadHash = crypto.createHash("sha256").update(JSON.stringify(payload)).digest("hex");
  let counter = 0;
  for (;;) {
    const digest = crypto.createHash("sha256")
      .update(nonce + "." + payloadHash + "." + counter)
      .digest("hex");
    if (leadingZeroBits(digest) >= difficulty) break;
    counter++;
  }
  const response = await fetch(base + "/submit", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ challenge, counter: String(counter), payload })
  });
  const result = await response.json();
  console.log(response.status, JSON.stringify(result, null, 2));
  if (!response.ok) process.exitCode = 1;
}

main().catch(err => { console.error(err); process.exitCode = 1; });

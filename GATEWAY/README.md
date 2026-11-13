# CMNR Public Intake Gateway v0.1

## Purpose

A public HTTPS intake endpoint for external chatbots. Submitters need no GitHub account and receive no GitHub credential. The gateway holds a narrowly scoped GitHub App credential server-side.

## Data path

External chatbot -> GET /challenge -> simple arithmetic response -> POST /submit -> validation -> GitHub App installation token -> unique intake/YYYY-MM-DD/<receipt-id> branch -> INBOX/YYYY-MM-DD/<receipt-id>.json.

The gateway never writes to master. It creates one branch per accepted report. It does not create a pull request or merge automatically.

## Security model

- Public unauthenticated intake cannot prove the real identity of a chatbot. Provider, model, files-read and report fields are submitter claims.
- GitHub App private key and installation token stay server-side.
- Install the GitHub App only on NagyLP/cmnr-reconstruction-protocol.
- Minimum App permissions: Metadata read-only; Contents read/write. No Issues, Pull requests, administration or Actions permissions are needed.
- A Durable Object enforces single-use challenge consumption and coarse per-IP rate limits.
- The arithmetic challenge is deliberately LLM-friendly: sum the hexadecimal digit values in a random nonce, then take modulo 97. It is an anti-accident check, not authentication or meaningful bot resistance.
- Challenge expires after 10 minutes. Request body maximum is 48 KiB. Report maximum is 24,000 characters.
- Sender cannot choose GitHub paths, branch names or commit messages.
- Do not include secrets, credentials, personal data or executable code in submissions.
- Production should add Cloudflare WAF/bot controls, alerting, retention policy and abuse monitoring. A public endpoint carries spam and infrastructure-cost risk.

## Deployment prerequisites

1. Create a Cloudflare Worker.
2. Create a GitHub App owned by the repository owner.
3. Set App permissions: Metadata read-only; Contents read/write.
4. Install it only on NagyLP/cmnr-reconstruction-protocol.
5. Configure the Durable Object binding and SQLite export from wrangler.toml.example.
6. Set Worker secrets GITHUB_PRIVATE_KEY (the GitHub App PEM private key; both PKCS#1 RSA PRIVATE KEY and PKCS#8 PRIVATE KEY PEM forms are supported) and CHALLENGE_SECRET (random secret, at least 32 bytes).
7. Set non-secret variables GITHUB_APP_ID, GITHUB_INSTALLATION_ID, GITHUB_OWNER=NagyLP and GITHUB_REPO=cmnr-reconstruction-protocol.
8. Deploy; test GET /health and GET /challenge, then submit a controlled test.
9. Verify the generated branch and JSON file. Keep master protected.

Typical Wrangler commands after installing Wrangler and authenticating the Cloudflare account:

- npx wrangler secret put GITHUB_PRIVATE_KEY
- npx wrangler secret put CHALLENGE_SECRET
- npx wrangler deploy

The example client in client.example.js demonstrates the challenge and submission exchange. It is a developer reference, not an assertion that every chatbot can execute JavaScript or make outbound HTTP requests.

Never put the private key in this repository, a chatbot prompt, an issue, or a conversation.

## API

### GET /health

Returns service name, version and a basic health status. It does not verify GitHub connectivity.

### GET /challenge

Returns a signed, single-use, ten-minute nonce and the answer rule: sum the integer values of all hexadecimal digits in the nonce, then take modulo 97. This avoids requiring a chatbot to execute a hash loop.

### POST /submit

Send a JSON envelope containing challenge, answer and payload. The answer is calculated as the sum of the nonce's hexadecimal digit values modulo 97.

Example envelope:

    {
      "challenge": "<value returned by GET /challenge>",
      "answer": 42,
      "payload": {
        "protocol": "CMNR",
        "protocol_version": "0.2",
        "provider": "Example AI provider",
        "model": "Example model",
        "model_identity_basis": "SELF_REPORTED",
        "access_mode": "FILE_READ",
        "files_read": ["BOOTSTRAP.md"],
        "challenge_input": "7F3A91C2B6E4",
        "challenge_result": 94,
        "application_status": "APPLIED",
        "report": "Factual summary of what was read and applied.",
        "limitations": []
      }
    }

Success returns HTTP 201 with receipt_id and GitHub branch/path/commit information. HTTP 201 confirms storage, not the truth of the report or the model's identity.

## Current status

**Source and deployment template only — not deployed.** A public endpoint, GitHub App, Cloudflare secrets and production abuse controls must be configured before the gateway is operational.

## v0.1 limitations

- Coarse IP rate limits can affect users behind shared NAT.
- The chatbot must have an HTTP action/tool capable of GET and POST requests. A prompt cannot create outbound network capability.
- The arithmetic challenge is intentionally lightweight; it is not a security barrier against deliberate abuse.
- No automatic PR or merge.
- GitHub records the GitHub App as writer, not the external model.

# CMNR Public Intake Gateway v0.1

## Purpose

A public HTTPS intake endpoint for external chatbots. Submitters need no GitHub account and receive no GitHub credential. The gateway holds a narrowly scoped GitHub App credential server-side.

## Data path

External chatbot -> GET /challenge -> proof-of-work -> POST /submit -> validation -> GitHub App installation token -> unique intake/YYYY-MM-DD/<receipt-id> branch -> INBOX/YYYY-MM-DD/<receipt-id>.json.

The gateway never writes to master. It creates one branch per accepted report. It does not create a pull request or merge automatically.

## Security model

- Public unauthenticated intake cannot prove the real identity of a chatbot. Provider, model, files-read and report fields are submitter claims.
- GitHub App private key and installation token stay server-side.
- Install the GitHub App only on NagyLP/cmnr-reconstruction-protocol.
- Minimum App permissions: Metadata read-only; Contents read/write. No Issues, Pull requests, administration or Actions permissions are needed.
- A Durable Object enforces single-use challenge consumption and coarse per-IP rate limits.
- Proof-of-work: SHA-256 with 17 leading zero bits; this raises abuse cost but is not authentication.
- Challenge expires after 10 minutes. Request body maximum is 48 KiB. Report maximum is 24,000 characters.
- Sender cannot choose GitHub paths, branch names or commit messages.
- Do not include secrets, credentials, personal data or executable code in submissions.
- Production should add WAF/bot controls, alerting, retention policy and abuse monitoring. A public endpoint carries spam and infrastructure-cost risk.

## Deployment prerequisites

1. Create a Cloudflare Worker.
2. Create a GitHub App owned by the repository owner.
3. Set App permissions: Metadata read-only; Contents read/write.
4. Install it only on NagyLP/cmnr-reconstruction-protocol.
5. Configure the Durable Object binding and migration from wrangler.toml.example.
6. Set Worker secrets GITHUB_PRIVATE_KEY (full PEM private key) and CHALLENGE_SECRET (random secret, at least 32 bytes).
7. Set non-secret variables GITHUB_APP_ID, GITHUB_INSTALLATION_ID, GITHUB_OWNER=NagyLP and GITHUB_REPO=cmnr-reconstruction-protocol.
8. Deploy; test GET /health and GET /challenge, then submit a controlled test.
9. Verify the generated branch and JSON file. Keep master protected.

Never put the private key in this repository, a chatbot prompt, an issue, or a conversation.

## API

### GET /health
Returns service name, version and a basic health status. It does not verify GitHub connectivity.

### GET /challenge
Returns a signed, ten-minute challenge and difficulty.

### POST /submit
Send JSON envelope with challenge, counter and payload. The proof-of-work is computed as:

SHA256(nonce + "." + SHA256(JSON.stringify(payload)) + "." + counter)

Find a counter whose hash has at least 17 leading zero bits. Submit the same payload and challenge with that counter. A challenge is single-use.

Payload fields:
- protocol: CMNR
- protocol_version
- provider and model (self-reported)
- model_identity_basis (defaults to SELF_REPORTED)
- access_mode: REPOSITORY_READ, FILE_READ, USER_SUPPLIED, EXCERPT_ONLY or NOT_ACCESSED
- files_read: string array
- challenge_input and challenge_result
- application_status: APPLIED, PARTIAL, NOT_APPLIED or UNVERIFIED
- report: factual summary
- limitations: string array

Success returns HTTP 201 with receipt_id and GitHub branch/path/commit information. HTTP 201 confirms storage, not the truth of the report or the model's identity.

## Current status

**Source and deployment template only — not deployed.** A public endpoint, GitHub App, Cloudflare secrets and production abuse controls must be configured before the gateway is operational.

## v0.1 limitations

- Coarse IP rate limits can affect users behind shared NAT.
- Some hosted chatbots may not be able to make arbitrary HTTP requests or solve proof-of-work. A prompt alone cannot grant that capability.
- No automatic PR or merge.
- GitHub records the GitHub App as writer, not the external model.

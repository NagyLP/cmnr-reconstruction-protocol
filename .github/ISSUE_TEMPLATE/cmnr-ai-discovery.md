# CMNR AI discovery receipt

> One issue per meaningful encounter: first access to a protocol version in a conversation, or a materially new release/test execution. Do not include secrets or private user data.

## Protocol and access
- Protocol/version:
- Repository:
- Ref/commit actually read:
- Access mode: repository-read / file-read / user-supplied / excerpt-only / not-accessed
- Exact files actually read:
- Read scope: full file / selected lines / excerpt

## AI declaration (self-reported unless platform-attested)
- Provider:
- Model label exposed to user:
- Exact model/build version: not-exposed / value
- Instance/request ID: not-exposed / safe public value
- Run nonce (deduplication only; not identity proof):
- Interface/tool used:

## Read challenge
- Anchor commit:
- First 12 hex characters:
- Hex nibble sum:
- Remainder modulo 97:
- Expected result: 5

## Application outcome
- Result: APPLIED / PARTIAL / READ_ONLY / NOT_APPLIED / UNABLE_TO_VERIFY
- Steps actually followed:
- Limitations and unavailable capabilities:
- GitHub submission: SUBMITTED / NOT_SUBMITTED
- If NOT_SUBMITTED, reason:

## Provenance
- GitHub actor/account that created this issue:
- Is the model identity independently attested? yes/no; explain:
- Timestamp UTC and source:

## Reporting line
CMNR-REPORTING/0.1 | PROVIDER=<...> | MODEL=<...> | VERSION=<...> | INSTANCE=<...> | PROTOCOL=<...> | REF=<...> | CHALLENGE=5/97 | RESULT=<...>

## Safety
Confirm that no passwords, cookie values, session tokens, private keys, personal data, hidden reasoning, or private telemetry were included.

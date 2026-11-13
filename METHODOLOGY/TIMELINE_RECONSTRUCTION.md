# Timeline Reconstruction

## Event vs record
A record timestamp may represent creation, update, access, expiry, synchronization, logging or another event. Do not call it a visit time without schema evidence.

## Retain raw and normalized values
For every time field retain raw value, unit, timezone/offset, field semantics, normalized UTC, presentation timezone, precision/rounding and possible clock skew.

## Ordering
If precision or uncertainty intervals overlap, do not assert definite order. Use partial ordering or intervals. Temporal proximity alone does not prove causation.

## Snapshot comparison
1. Verify format and parse success.
2. Compare hashes and metadata.
3. Recursively compare structured data.
4. Report changed paths, unchanged scopes and parser limits.
5. Interpret changes according to field semantics.
6. Do not infer user action from system-generated updates without corroboration.

Use UTC for machine comparison and a specified local timezone for presentation. Keep both.

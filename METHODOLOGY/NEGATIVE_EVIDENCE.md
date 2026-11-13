# Negative Evidence and Event Exclusion

Absence of a record is not automatically evidence that an event did not occur. Before using a missing trace against hypothesis H, assess:

1. Generation expectation: would H normally generate the trace?
2. Preservation: would the trace survive until acquisition?
3. Coverage: does the source cover the relevant device, account, application, time and event class?
4. Detection: could the acquisition/parser/search method reliably detect it?

Also consider deletion, rotation, cache eviction, synchronization, clock error, parser incompatibility and alternative technical paths.

For expected trace E: LR- = P(not E | H) / P(not E | not H). A small LR- may weigh against H only if probabilities are defensibly estimated. Never invent probabilities.

Labels: not observed; expected but absent under validated coverage; not expected/not diagnostic; source incomplete; detection uncertain; excluded under stated assumptions; unresolved.

Never claim an event did not happen solely because a log entry, cookie, cache item or browser-history row was not found.

# Multi-Model Evaluation Protocol

Purpose: measure whether models apply CMNR correctly, not whether they can repeat its vocabulary.

1. Freeze protocol version and test set.
2. Record provider/model/version/date.
3. Run each case without CMNR (baseline).
4. Run the same case with the same CMNR prompt.
5. Optionally run prompt plus examples.
6. Keep inputs, tools and settings comparable.
7. Score with CORE/SCORING.md.
8. Evaluate critical failures separately.
9. Blind-review borderline cases where possible.
10. Report run count, missing data, variance and evaluator disagreement.

Metrics: weighted score; critical logic-gate pass rate; fabrication rate; unsupported-certainty rate; negative-evidence error rate; attribution error rate; reproducibility.

Improvement on synthetic tests is preliminary evidence of protocol adherence under tested conditions, not proof of general intelligence improvement, persistent learning or training.

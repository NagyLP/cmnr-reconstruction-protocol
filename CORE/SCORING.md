# CMNR Quality Evaluation v0.3-proposed

| Dimension | Weight |
|---|---:|
| Factual accuracy | 30% |
| Evidence and source quality | 24% |
| Uncertainty handling | 16% |
| Logical consistency | 22% |
| Completeness | 4% |
| Practical applicability | 4% |
| **Total** | **100%** |

The first three weights are retained. Logical consistency rises from 16% to 22%. Completeness falls from 8% to 4%; practical applicability from 6% to 4%.

Score each dimension 0–5. Weighted score = sum((dimension score / 5) × weight × 100).

## Critical logic gate
Mark FAIL if a material conclusion contains a direct contradiction, does not follow from evidence, conflates incompatible timestamps, infers causation from proximity alone, ignores a material alternative, treats missing trace as proof without validating generation/preservation/coverage/detection, or misrepresents provenance.

A failed critical gate cannot be averaged away by a high numerical score.

## Interpretation
90–100 strong; 80–89 good; 70–79 provisional; 50–69 weak; below 50 unreliable for substantive conclusions. These are proposed thresholds, not externally validated cutoffs.

This is an external response-evaluation framework. It does not modify neural weights, gradients, activations, optimizer state, training data or model-wide behavior.

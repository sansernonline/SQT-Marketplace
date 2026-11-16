# Sources · decision-scoring

The main sources really opened on 2026-10-27. Each method has at least 3 independent sources, and the full list is kept in this work's research round. Several originals (Savage 1951 · Fishburn 1967 · Malcolm 1959 · Bradley & Terry 1952 · Dantzig 1957) are under copyright, so they are cited through works that cite the original.

| Method | Main source | Note |
|---|---|---|
| minimax regret | [Stoye 2011 · Axioms for Minimax Regret](https://stoye.economics.cornell.edu/docs/AxiomsRegret.pdf) · [TU Delft · Games Against Nature](https://ocw.tudelft.nl/wp-content/uploads/Lecture_Slides_Chapter_10_.pdf) | |
| weighted sum + min-max | [Roszkowska 2026 · Entropy 28(1):114](https://pmc.ncbi.nlm.nih.gov/articles/PMC12839561/) · [Krishnan 2022 · Frontiers in Big Data](https://www.frontiersin.org/journals/big-data/articles/10.3389/fdata.2022.990699/full) | |
| Shifting weights to see sensitivity | [O'Shea et al. 2026 · weight stability intervals of WSM](https://research.ucc.ie/en/publications/weight-stability-intervals-for-multi-criteria-decision-analysis-u/) | Weak: only the abstract was seen · ±20% is self-set |
| PERT 3-point (in `model-scorecard`) | [IBM · PERT General Information Manual E20-8067-1](https://bitsavers.org/pdf/ibm/generalInfo/E20-8067-1_PERT_A_Dynamic_Project_Planning_and_Control_Method.pdf) | |
| Eisenhower | [Eisenhower 1954 · speech at Evanston](https://www.presidency.ucsb.edu/documents/address-the-second-assembly-the-world-council-churches-evanston-illinois) | He quoted someone else · the 4-box table came later from Covey |
| Goodhart's law | [Strathern 1997 · Improving ratings](https://www.gwern.net/doc/statistics/decision/1997-strathern.pdf) · [Manheim & Garrabrant · arXiv 1803.04585](https://arxiv.org/pdf/1803.04585) | Strathern 1997: "when a measure becomes a target, it ceases to be a good measure" |
| Bradley-Terry + position bias | [Chatbot Arena · arXiv 2403.04132](https://arxiv.org/pdf/2403.04132) · [Zheng et al. · arXiv 2306.05685](https://arxiv.org/pdf/2306.05685) · [Wang et al. · arXiv 2305.17926](https://arxiv.org/pdf/2305.17926) | Computed with the MM method of Hunter 2004 (original not opened) |
| WSJF | [SAFe · WSJF](https://framework.scaledagile.com/wsjf) | |
| RICE | [Intercom · RICE](https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/) | Only one primary source, and it is by the method's inventor |
| knapsack | [Duke CS 330 · Greedy Algorithm II](https://courses.cs.duke.edu/spring20/compsci330/lecture8scribe.pdf) | Greedy by best ratio is optimal only when fractions can be taken, so every set is tried when there are 20 items or fewer |
| marginal value of a review round | none | Value and decay rate are self-set, not measured · the stop-when-no-progress rule comes from `team-roles` |

## Real example (run 2026-10-27)

Task: choose 1 fund of 3, accepting risk no higher than level 6, minimum purchase no more than 1,000 baht (hypothetical numbers in `templates/score.json`). Command: `node decide.mjs score templates/score.json`. Result: fund C was cut because its risk is level 8, though its return is the highest · fund A scored 60, B 40 · shifting each criterion's weight ±20%, A stayed at rank 1, so it is called stable.

Self-test: `node decide.mjs --self-test` passed 19/19 on 2026-10-27.

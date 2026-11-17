# Evidence register: The Tophet of Carthage

Status: **no claim is human-verified yet.** In `claims.json`, every claim is set to `verified: false` until a researcher has checked it against the sources.
Source IDs refer to `sources.md`.

**Classifications:**
- **VERIFIED_FACT:** directly supported by primary evidence or by consistent, credible scholarship.
- **SCHOLARLY_INTERPRETATION:** a reading of the evidence held by named scholars and contested by others.
- **HYPOTHESIS:** a specific proposed explanation, weaker or narrower than an interpretation.
- **UNRESOLVED_QUESTION:** open on current evidence.

**Strength:** Strong · Moderate · Weak.

**Mapping to the pipeline's labels** (`claims.json` / on-screen badge):

| Register class | Pipeline label | Badge on screen |
|---|---|---|
| VERIFIED_FACT | `fact` | none |
| SCHOLARLY_INTERPRETATION | `interpretation` + `attribution` | "Interpretation" with the scholars' names (e.g. "Smith et al. 2011, 2013") |
| HYPOTHESIS | `hypothesis` | "Hypothesis" |
| UNRESOLVED_QUESTION | `open-question` | "Unresolved question" |

> Editorial decision of 2026-11-17: scholarly interpretations are always attributed by name, in narration and on screen. The schema rejects an interpretation without an attribution, and the checker requires each scene's attribution to match its claim.

---

## A. Historical context

### C01: Carthage's foundation and destruction
- **Claim:** Carthage was founded by Phoenician settlers on the coast of present-day Tunisia, traditionally in the 9th century BC, and was destroyed by Rome in 146 BC.
- **Class:** VERIFIED_FACT · **Strength:** Strong for 146 BC. The founding date is a *traditional literary* date.
- **Sources:** S17 (via secondary listings); S7 (end of Tanit III in 146 BC).
- **Limitations:** Narrate the founding date as "traditionally". Don't give 814 BC as a fact.
- **Narration:** "Carthage, founded by Phoenician settlers, traditionally in the 9th century BC, and destroyed by Rome in 146 BC."

### C02: UNESCO status
- **Claim:** The Archaeological Site of Carthage has been on the UNESCO World Heritage List since 1979.
- **Class:** VERIFIED_FACT · **Strength:** Moderate. The UNESCO page itself could not be read automatically.
- **Sources:** S17.
- **Narration:** Optional on-screen text only.

## B. The site and its discovery

### C03: Origin of the name "tophet"
- **Claim:** "Tophet" is a modern scholarly name taken from the Hebrew Bible, where Topheth is a place near Jerusalem condemned for child burning.
- **Class:** VERIFIED_FACT · **Strength:** Moderate.
- **Sources:** S16 (Jer 7:31; 2 Kgs 23:10); S7.
- **Limitations:** The Carthaginians' own name for the site was not established in our sources (gap). Check the verse wording against a named translation.
- **Narration:** "Archaeologists call it the tophet, a name borrowed from the Bible, not from the Carthaginians themselves."

### C04: Discovery in 1921
- **Claim:** The Carthage tophet was discovered in December 1921, when Paul Gielly saw an antiquities trafficker removing stelae by moonlight and alerted the Tunis police chief, François Icard. The two then bought the land and began excavating.
- **Class:** VERIFIED_FACT · **Strength:** Moderate. It comes from a single detailed account by a later excavator, and Wikipedia gives a consistent but unsourced version.
- **Sources:** S7.
- **Narration:** "In December 1921, a man was spotted digging up carved stones by moonlight, on the edge of Tunis."

### C05: Excavation history
- **Claim:** The site was excavated in 1921–22 and 1924, by a Franco-American expedition in 1925 that removed around 1,000 urns in one season, in 1934–36 and in the 1940s, by the American ASOR team under Lawrence Stager in 1976–79, and by Tunisian-led teams in 2014–18.
- **Class:** VERIFIED_FACT · **Strength:** Strong for the American excavations. The 2014–18 dates come from S9 only.
- **Sources:** S7; S9.
- **Narration:** "In a single season in 1925, diggers lifted out around a thousand urns, recording little about where each one lay."

### C06: Location
- **Claim:** The precinct lies close to Carthage's ancient harbours, about 50 m west of the rectangular commercial harbour.
- **Class:** VERIFIED_FACT · **Strength:** Strong.
- **Sources:** S7.

### C07: Period of use
- **Claim:** The precinct was used for roughly six centuries, from around the 8th century BC until 146 BC.
- **Class:** VERIFIED_FACT · **Strength:** Moderate.
- **Sources:** S7 (Harden's phases Tanit I c. 800–600, II c. 600–300, III c. 300–146 BC; earliest urns 8th century BC).
- **Limitations:** The Tunisian excavations report stratigraphy from the 6th century BC in their area (S18 via S9). The start date may vary across the precinct.
- **Narration:** "For roughly six centuries, until the city fell in 146 BC…"

## C. The physical evidence

### C08: Contents of the urns
- **Claim:** The urns contain the cremated remains of very young humans and of young animals, mainly lambs, with some kids, birds and fish.
- **Class:** VERIFIED_FACT · **Strength:** Strong.
- **Sources:** S7; S1; S19 via S9.
- **Narration:** "Inside: the burnt bones of babies, and of young lambs."

### C09: Humans and animals together
- **Claim:** Some urns held only animal remains, and some held a human infant and a lamb together.
- **Class:** VERIFIED_FACT · **Strength:** Strong that both kinds exist. **Weak for any count**: published figures disagree (S9).
- **Sources:** S7; S1; S9.
- **Limitations:** Never narrate the number or share of animal-only or mixed urns.
- **Narration:** "Some urns held only lambs. Some held a baby and a lamb, burned together."

### C10: How many urns
- **Claim:** The 1976–79 American excavation recovered several hundred urns from a trench of about 150 m².
- **Class:** VERIFIED_FACT · **Strength:** Strong for "several hundred". Weak for any exact figure (444, 445, "over 200" and 348/334 analysed all appear in different sources).
- **Sources:** S7; S1; S4; S9.
- **Narration:** "Hundreds of urns, from a patch of ground smaller than a tennis court." *(A tennis court is about 260 m², so 150 m² fits. Confirm before use.)*

### C11: The 20,000-urn estimate
- **Claim:** The excavators estimated that as many as 20,000 urns may have been deposited between 400 and 200 BC.
- **Class:** SCHOLARLY_INTERPRETATION (an extrapolation) · **Strength:** Weak. It projects from urn density in one excavated area, and we have not read the source directly.
- **Sources:** S14 (via a secondary copy).
- **Limitations:** It is a 1984 estimate, not a count, and it is **not a count of sacrifices**.
- **Narration:** Avoid. If used, say: "The excavators once estimated that as many as twenty thousand urns might lie here, an estimate, not a count."

### C12: The vow inscriptions
- **Claim:** Many stelae carry Punic inscriptions recording a vow to the goddess Tanit, "Face of Ba'l", and the god Ba'l Ḥammon, often ending with a formula meaning the god heard the dedicant's voice and blessed him.
- **Class:** VERIFIED_FACT · **Strength:** Strong.
- **Sources:** S7 (fig. 16, the ʿEsmun-ḥilleṣ stela, with transliteration and translation).
- **Narration:** "Carved above many urns are words of thanks: a promise made to the gods, and kept, *because he heard my voice and blessed me*." *(Paraphrase. Credit the translation if quoted.)*

### C13: The word "mlk"
- **Claim:** Some tophet inscriptions use the word "mlk". Many scholars, following Eissfeldt (1935), read it as a term for a type of offering rather than the name of a god "Moloch".
- **Class:** SCHOLARLY_INTERPRETATION · **Strength:** Moderate.
- **Sources:** S7 (citing Eissfeldt 1935, which we have not read).
- **Limitations:** We have not read the specialist epigraphy. How often *mlk* appears at Carthage is unclear, and Wikipedia describes it as rare. **A Punic epigraphy specialist needs to check this.**
- **Narration:** "A few inscriptions use a word, *mlk*, that many scholars read as the name of an offering."

### C14: Amulets
- **Claim:** A minority of urns, roughly a quarter to a third depending on how they are counted, contained beads and amulets placed after cremation. They occur only with human remains.
- **Class:** VERIFIED_FACT · **Strength:** Strong that amulets occur only with humans. Moderate for the proportion.
- **Sources:** S7; S20 via S9.
- **Narration:** "Some babies were given necklaces of protective charms, laid in the urn after the fire."

### C15: The priest stela
- **Claim:** A 4th-century BC stela from the tophet shows a priest holding an infant. Stager reads it as preparation for sacrifice, and Schwartz et al. read the child as already dead.
- **Class:** VERIFIED_FACT (the image exists) plus SCHOLARLY_INTERPRETATION (its meaning) · **Strength:** Strong for the image, contested for its meaning.
- **Sources:** S7.
- **Narration:** "Even this image divides experts. Is the priest carrying a living child, or a dead one?"

## D. Written sources

### C16: Diodorus
- **Claim:** The Greek historian Diodorus Siculus (1st century BC) wrote that during a siege in 310 BC, the Carthaginians sacrificed 200 children of noble families to Cronus, describing a bronze statue with outstretched hands above a fiery pit.
- **Class:** VERIFIED_FACT (*that the text says this*) · **Strength:** Strong.
- **Sources:** S12.
- **Limitations:** **The event itself is unverified.** Diodorus wrote about 250 years later, as an outsider.
- **Narration:** "Writing some two and a half centuries later, the Greek historian Diodorus claimed…"

### C17: Plutarch
- **Claim:** Plutarch (1st–2nd century AD) described Carthaginian parents offering their children to Cronus, people buying children from the poor, mothers forbidden to weep, and music drowning out the cries.
- **Class:** VERIFIED_FACT (*that the text says this*) · **Strength:** Strong.
- **Sources:** S13.
- **Limitations:** It is a moral essay against superstition, written long after Carthage's fall.
- **Narration:** Attribute it explicitly to Plutarch. Do not dramatise.

### C18: The authors were outsiders
- **Claim:** The surviving accounts of Carthaginian child sacrifice were written by Greek and Roman authors, not by Carthaginians, and several were written after Rome destroyed the city.
- **Class:** VERIFIED_FACT · **Strength:** Strong.
- **Sources:** S12; S13; S1; S15.
- **Narration:** "Every account we have was written by Carthage's rivals, or by writers living long after its fall."

## E. Distribution and origins

### C19: Where tophets are found
- **Claim:** Tophets are known at Phoenician and Punic sites in North Africa, Sicily and Sardinia, but no convincing example has been found in the Phoenician homeland in the Levant.
- **Class:** VERIFIED_FACT · **Strength:** Moderate. It is based on the abstract of S10 and the map in S7.
- **Sources:** S10; S7.
- **Narration:** "Precincts like this appear across Phoenician colonies in the central Mediterranean, yet none convincingly in Phoenicia itself."

### C20: Origin of the tradition
- **Claim:** Whether the tophet tradition came from the Phoenician homeland or developed in the western colonies is debated. Xella argues for Levantine roots, probably from Tyre.
- **Class:** UNRESOLVED_QUESTION · **Strength:** n/a.
- **Sources:** S10.

## F. The bone evidence

### C21: Same sample, two answers
- **Claim:** Two teams of specialists analysed cremated remains from the same 1976–79 excavations and reached opposite conclusions.
- **Class:** VERIFIED_FACT · **Strength:** Strong.
- **Sources:** S4 (both studies used the same ASOR sample); S1; S2.
- **Narration:** "Two teams of experts. The same bones. Opposite answers." **(The core of the hook.)**

### C22: The "not sacrifice" reading
- **Claim:** Schwartz and colleagues found that a large share of the infants were prenatal or died around birth. They argue the age profile matches natural perinatal mortality, and that tophets were burial places for those who died shortly before or after birth, whatever the cause. They do not rule out occasional sacrifice.
- **Class:** SCHOLARLY_INTERPRETATION · **Strength:** Moderate.
- **Sources:** S1 (348 urns, 540 individuals); S3; S6.
- **Limitations:** Smith et al. dispute their age estimates (C24).
- **Narration:** "One team concluded most of these children died before or around birth, from natural causes, and were given a special burial."

### C23: The "sacrifice" reading
- **Claim:** Smith and colleagues concluded that most of the infants died at about one to one and a half months old. They argue this profile is unlike that of infant cemeteries and supports sacrifice.
- **Class:** SCHOLARLY_INTERPRETATION · **Strength:** Moderate.
- **Sources:** S2; S4; S7.
- **Limitations:** Schwartz et al. dispute their method (C24).
- **Narration:** "The other team concluded most were around one month old: alive, and too old to be stillborn. To them, that pointed to sacrifice."

### C24: Why the methods disagree
- **Claim:** The disagreement turns on method: how much cremation shrinks bones and teeth, whether cremation can erase the neonatal line in tooth enamel, and which bones and reference standards to use.
- **Class:** VERIFIED_FACT (*that these are the points in dispute*) · **Strength:** Strong.
- **Sources:** S1; S6; S7.
- **Narration:** "The answer depends on tiny details: how much bone shrinks in a fire, and whether a faint line in a baby's tooth survives the flames."

### C25: The neonatal line
- **Claim:** A neonatal line forms in tooth enamel when a baby survives birth by some days. Schwartz et al. found it in 24 of 50 individuals they sampled.
- **Class:** VERIFIED_FACT (*the finding*) · **Strength:** Strong for the observation. Its *interpretation* is disputed.
- **Sources:** S1; S7.
- **Limitations:** Smith et al. argue that cremation can obliterate the line.
- **Narration:** Use as a visual explainer. Attribute the 24-of-50 figure to the 2010 study.

### C26: The vow argument
- **Claim:** Supporters of sacrifice argue that because the inscriptions record vows fulfilled after a god granted a request, the offerings were deliberate gifts, which they see as unlikely for babies who had already died.
- **Class:** SCHOLARLY_INTERPRETATION · **Strength:** Moderate.
- **Sources:** S7.
- **Limitations:** Opponents propose other readings. Bénichou-Safar's alternative is known here only through Stager's summary, which is a gap.

### C27: The animal-substitution argument
- **Claim:** Because lambs received the same treatment as infants, sometimes on the same pyre, some scholars argue animals and infants were equivalent offerings.
- **Class:** SCHOLARLY_INTERPRETATION · **Strength:** Moderate.
- **Sources:** S7; S19 via S9.
- **Limitations:** The same evidence fits a rite in which a sacrificed animal accompanied a child who had died naturally.

## G. Current state and open questions

### C28: Infants missing from ordinary cemeteries
- **Claim:** Infants are rare in Carthage's ordinary cemeteries. Both sides agree on this but disagree about what it means.
- **Class:** VERIFIED_FACT · **Strength:** Moderate.
- **Sources:** S7 (citing Bénichou-Safar 1982); S6.

### C29: State of the debate today
- **Claim:** A 2024 independent review of the latest specialist volume concluded that the interpretation of the Carthage tophet remains as uncertain as ever, and the final report of the 1970s excavations is still unpublished.
- **Class:** VERIFIED_FACT (*the reviewer's conclusion and publication status*) · **Strength:** Strong.
- **Sources:** S9; S7.
- **Narration:** "A century after its discovery, the most recent expert assessment still calls the evidence uncertain."

### C30: The Zita study
- **Claim:** A 2024 study of 12 cremated children from the tophet at Zita in Tunisia, a site used after Carthage's fall, found evidence of hard lives and possible systemic illness, careful burial, and no concrete indication of sacrifice. Its authors could not say whether the site was a cemetery, a sacrificial area or both.
- **Class:** VERIFIED_FACT (*the study's findings*) · **Strength:** Strong. **It applies to Zita, not to Carthage.**
- **Sources:** S8.
- **Narration:** "At another Tunisian tophet, researchers found children who had been sick, and buried with care."

### C31: The spring-rite hypothesis
- **Claim:** Stager proposed that the offerings were made periodically in spring, based on the ages of the lambs.
- **Class:** HYPOTHESIS · **Strength:** Weak to moderate.
- **Sources:** S7.

### C32: The central question
- **Claim:** Whether the infants buried in the Carthage tophet were sacrificed (all, some or none) remains unresolved.
- **Class:** UNRESOLVED_QUESTION.
- **Sources:** S9; S8; S2–S6.
- **Narration:** "Were these children offered to the gods, or mourned and given to them? The evidence has not yet given a final answer."

### C33: Routine or crisis
- **Claim:** If sacrifice took place, it is unresolved whether it was routine (seasonal vows) or exceptional (in times of crisis, as Diodorus describes).
- **Class:** UNRESOLVED_QUESTION.
- **Sources:** S7; S12.

---

## Claims that must not be made

| Do not say | Why | Say instead |
|---|---|---|
| "Archaeologists found 20,000 sacrificed children." | 20,000 is a 1984 *extrapolation of urns*. Urns are not individuals, and sacrifice is unproven. | C11 wording, or omit it. |
| "Science has proven the Carthaginians sacrificed children." / "…has proven they didn't." | Neither side has proven its case. The 2024 review calls the evidence uncertain. | C32 |
| "Carthaginians threw babies into a burning bronze statue." (as fact) | This is Diodorus's account, written about 250 years later by an outsider. | C16, attributed. |
| "Molech/Moloch was the god of Carthage." | "mlk" is probably a type of offering, and the gods named are Ba'l Ḥammon and Tanit. | C12, C13 |
| "The Romans invented the story." | Hostile sources do not prove invention, and Greek accounts predate Roman dominance. | C18 |
| Any exact percentage of fetuses, newborns or 1-month-olds as "the" answer | The figures differ between teams and between publications by the same team. | Attribute each figure to its study, or describe it qualitatively. |
| Any exact urn total or animal-only urn count | Published counts conflict (S9). | "Hundreds", "around a thousand in 1925". |
| Exact founding year (814 BC) as fact | It is a literary tradition. | "Traditionally in the 9th century BC." |

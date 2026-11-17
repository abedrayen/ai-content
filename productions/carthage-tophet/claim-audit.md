# Claim audit: carthage-tophet

Audited 2026-11-17 against the sources in `sources.md`, re-reading passages where needed.
**Editor decision 2026-11-17: all ✏️ corrections approved and applied to `claims.json`.** No claim's `verified` flag was changed. The 🔍 items remain open.
**`verified` stays `false` on every claim in `claims.json`.** This audit is a researcher's recommendation. Under the pipeline's rules, only a human who has read the sources may set `verified: true`. The audit does not change `claims.json`. It proposes corrections for the editor to accept or reject.

## How to read this audit
**Checks per claim:**
- **Traceable:** the cited source exists and was located.
- **Supports:** the passage we actually read supports the claim as worded.
- **Class:** the classification is appropriate.
- **Attribution:** for interpretations, the named scholars hold the stated view, checked against their own publication wherever possible.

**Recommendation:**
- ✅ **Ready for human sign-off:** the source passage supports the claim as worded, or with the minor correction shown.
- ✏️ **Correct first:** the wording overstates the evidence or is ambiguous. Apply the correction, then sign off.
- 🔍 **Needs research:** the cited source was not read deeply enough, or does not itself state the claim.
- ⛔ **Exclude:** keep it out of narration.

**Classes:** VERIFIED_FACT (pipeline `fact`), SCHOLARLY_INTERPRETATION (`interpretation` + attribution), HYPOTHESIS (`hypothesis`), UNRESOLVED_QUESTION (`open-question`), SPECULATION (`speculation`).
No claim in the register is SPECULATION, and the script uses none.

## New sources consulted for this audit
- **S1, re-read:** the full abstract and Methods (neonatal line definition) of Schwartz et al. 2010.
- **Wikipedia, "Tophet":** read only as a pointer, never cited as a source. It states that archaeologists applied the biblical name to Carthaginian precincts, citing Hoyos 2021. It says Punic inscriptions call these sites *bt* or *qdš*, without an inline citation. It asserts that "most scholars agree" the rite was child sacrifice. The last claim is noted as a **caution**, not used.
- **Still blocked:** the Xella 2023 abstract (De Gruyter returned HTTP 405).

## Summary

| Recommendation | Claims |
|---|---|
| ✅ Ready for sign-off | c04, c05, c06, c08, c09, c12, c16, c17, c20, c23, c24, c26, c28, c30, c31, c32, c33 |
| ✏️ Correct first | c07, c10, c14, c18, c21, c22, c25, c27, c29 |
| 🔍 Needs research | c01, c02, c03, c13, c15, c19 |
| ⛔ Exclude | c11 |

## Claim by claim

### c01: Carthage's founding and destruction (VERIFIED_FACT) · 🔍
- **Traceable:** S17 (UNESCO) was blocked, and the content was confirmed only through secondary listings. S7 supports 146 BC as the end of Tanit III.
- **Supports:** 146 BC yes. The "traditionally 9th century BC" founding comes from UNESCO-derived listings only.
- **Action:** read the UNESCO page in a browser, or cite a standard history (e.g. Lancel 1995, *Carthage: A History*, listed in S7's bibliography). The Short only needs "modern Tunisia" as on-screen location text, which is uncontroversial. Sign off the 146 BC and Tunisia parts once the UNESCO page is read.

### c02: UNESCO 1979 (VERIFIED_FACT) · 🔍
- **Supports:** secondary listings only. Read the UNESCO page directly. Not used in the Short.

### c03: "Tophet" is a biblical name (VERIFIED_FACT) · 🔍
- **Supports:** S16 shows the biblical place-name. **S7 does not explicitly say scholars borrowed the name.** Wikipedia says so, citing Hoyos 2021, which we have not read.
- **Action:** find a scholarly statement (Hoyos 2021, or Xella ed. 2013). Also check Wikipedia's uncited statement that Punic inscriptions use *bt*/*qdš* for these sites. If confirmed, it is a strong story point. The Short uses the word "tophet" as a label only and makes no claim about where it comes from.

### c04: The 1921 discovery (VERIFIED_FACT) · ✅
- **Supports:** S7 tells the full story (Gielly, the trafficker removing stelae by moonlight, Icard, purchase of about 1,060 m²).
- **Note:** this rests on a single detailed account, written by a later excavator.

### c05: About 1,000 urns in 1925 (VERIFIED_FACT) · ✅
- **Supports:** S7, which says 1,000 urns were removed over a three-month season by Kelsey's Franco-American expedition.
- **Minor wording:** name Kelsey's expedition in research documents. "Little stratigraphic recording" fairly paraphrases S7's criticism of that dig.

### c07: Six centuries of use (VERIFIED_FACT) · ✏️
- **Supports:** S7 (Harden's phasing c. 800–146 BC; the earliest urns are 8th century BC).
- **Issue:** the Tunisian 2014–18 excavations report stratigraphy from the 6th century BC in their area (S18, known only through S9). The start date is the excavators' phasing, not a settled fact for the whole precinct.
- **Correction:** "Used for roughly six centuries, from around the 8th century BC according to the excavators' dating, until 146 BC."

### c08: Contents of the urns (VERIFIED_FACT) · ✅
- **Supports:** S7 names very young humans, lambs or kids, and birds, with burnt fish bones in two urns. S1's abstract says the urns hold cremated remains of very young animals and humans, sometimes mixed together.

### c09: Animal-only and mixed urns (VERIFIED_FACT) · ✅
- **Supports:** S7; S1's abstract. Never narrate counts.

### c10: Several hundred urns from about 150 m² (VERIFIED_FACT) · ✏️
- **Issue:** S7 is internally inconsistent: it gives 444 urns from the 150 m² trench in one place and "over 200" urns in seven months in another.
- **Correction:** "The 1976–79 excavation recovered hundreds of urns from a trench of roughly 150 m²." Don't compare it to a tennis court unless needed.

### c11: The 20,000-urn estimate · ⛔
- **Excluded** by editorial decision, and S14 has not been read in the original.

### c12: The vow inscriptions (VERIFIED_FACT) · ✅
- **Supports:** S7 fig. 16 gives the ʿEsmun-ḥilleṣ stela with transliteration and translation (to Tanit, Face of Ba'l, and Ba'l Ḥammon, "because he heard his voice and blessed him"). S7 also says the word *ndr* ("vow") appears on most inscribed stelae.
- **Note:** if the translation is quoted on screen, credit it to S7.

### c13: The word "mlk" (SCHOLARLY_INTERPRETATION) · 🔍
- **Issue:** our attribution "Eissfeldt 1935 and later scholars (per Stager 2014)" is too vague. "Later scholars" names no one. S7 cites Eissfeldt and gives Stager's own reading of *mlk ʾmr*, but we have read neither Eissfeldt nor any epigraphic study.
- **Correction of attribution once researched:** "Eissfeldt 1935; Stager 2014". Read Eissfeldt, or Mosca 2013, first. Not used in the Short.

### c14: Amulets (VERIFIED_FACT) · ✏️
- **Supports:** S7 (about 25% of infant urns, placed after cremation, absent from animal burials). S20 via S9 (31% of 445 urns, or 43% of urns with human remains, depending on what is counted).
- **Correction:** "Some urns containing human remains also held beads and amulets, added after cremation; none were found in burials of animals alone." Drop the proportion.

### c15: The priest stela (SCHOLARLY_INTERPRETATION) · 🔍
- **Attribution check failed:** Schwartz et al.'s reading ("the child is already dead") is known **only through Stager's description** (S7). We have not read Schwartz et al. 2012 for this point.
- **Action:** read S3 before using it. Not used in the Short.

### c16: Diodorus's account (VERIFIED_FACT about the text) · ✅
- **Supports:** S12, Loeb 20.14.4–6, read in full: 200 of the noblest children sacrificed publicly, and a bronze image of Cronus with a fiery pit.
- **Keep:** this is a fact about what the text says. The event itself is unverified.

### c17: Plutarch's account (VERIFIED_FACT about the text) · ✅
- **Supports:** S13, ch. 13, read in full.

### c18: The accounts were written by outsiders (VERIFIED_FACT) · ✏️
- **Issue:** "Greek and Roman authors" goes beyond what we read. Diodorus, Plutarch and Kleitarchos are all Greek writers, and we have read no Latin author on this. The research files also said "no Carthaginian narrative account survives", which has no source yet.
- **Correction:** "The surviving accounts of Carthaginian child sacrifice that we have examined were written by Greek authors, not by Carthaginians." Add a source before saying that no Carthaginian narrative survives.
- **Script wording:** "Greek writers accused Carthage of sacrificing children. None of them was Carthaginian."

### c19: Where tophets are found (VERIFIED_FACT) · 🔍
- **Supports:** S7 fig. 1 maps tophets in Sicily, Sardinia and North Africa, which supports the distribution. **The statement that no convincing example exists in the Phoenician homeland** came from a search-engine excerpt of a 2023 *Journal of Ancient History* abstract. We could not confirm which article it belongs to, because both De Gruyter pages blocked us. S9 confirms only that Xella treats the eastern absence as not proving the practice was absent.
- **Action:** read the Xella 2023 abstract in a browser. Until then, narrate only the distribution. Not used in the Short.

### c20: Origin of the tradition (UNRESOLVED_QUESTION) · ✅
- **Supports:** S9 (Xella argues for Levantine roots despite the eastern absence) and S10's metadata. **Add S9 as a source.**

### c21: Same sample, conflicting conclusions (VERIFIED_FACT) · ✏️
- **Supports:** S4's extract states both studies used the same ASOR sample. S4 notes Smith analysed 334 urns and Schwartz 348, so Schwartz used 14 extra urns.
- **Issue:** "**opposite** conclusions" overstates the gap. Schwartz et al. accept that occasional sacrifice may have happened (S1, abstract), while Smith et al. argue most were sacrificed.
- **Correction:** "Two teams of specialists analysed cremated remains from largely the same 1976–79 excavated collection and reached conflicting conclusions about how the infants died."
- **Script wording:** "the same burnt bones… conflicting conclusions."

### c22: The cemetery interpretation (SCHOLARLY_INTERPRETATION) · ✏️
- **Attribution check:** ✅ against the original. S1's abstract (re-read in full) concludes that tophets were cemeteries for those who died shortly before or after birth, whatever the cause. It frames this as compatible with the Carthaginians having **occasionally sacrificed humans**. S3's extract says the case for sacrifice is "at best, not proven". S6's abstract replies to Smith et al.
- **Issue:** "a large share… prenatal or died around birth" is loose. The abstract says most fell between prenatal and 5–6 postnatal months, with a significant presence of prenates.
- **Correction:** "Schwartz and colleagues found most individuals were between late fetal and about six months old, with many prenatal; they argue this matches natural perinatal mortality and that tophets were cemeteries for those who died shortly before or after birth, whatever the cause, while acknowledging the Carthaginians may occasionally have sacrificed humans."
- **Attribution text unchanged:** "Schwartz et al. 2010, 2012, 2017".

### c23: The sacrifice interpretation (SCHOLARLY_INTERPRETATION) · ✅
- **Attribution check:** ✅ against the original extracts. Smith et al. 2011 found the majority died between one and one and a half months, and concluded sacrifice was "very probable". The 2013 extract says the age distribution supports their contention of infant sacrifice.
- **Note:** say "argue", not "show".

### c24: The methodological dispute (VERIFIED_FACT) · ✅
- **Supports:** S1 (heat-shrinkage test of up to 25%), S6's abstract (disputing Smith's criticisms), S7 (summary of Smith's position that cremation can erase the neonatal line).

### c25: The neonatal line (VERIFIED_FACT) · ✏️
- **Issue:** "survives birth by some days" is imprecise.
- **Correction from S1 Methods:** the neonatal line "is observable in individuals who survive at least 7 to 10–15 days ex utero". Schwartz et al. found it in 24 of 50 individuals sampled.
- **Correction:** "A neonatal line forms in tooth enamel only if a baby survives at least about one to two weeks after birth (Schwartz et al. 2010). Schwartz et al. found it in 24 of 50 individuals sampled; Smith et al. argue cremation can erase it."

### c26: The vow argument (SCHOLARLY_INTERPRETATION) · ✅
- **Attribution check:** ✅ S7 states it explicitly.

### c27: The animal-substitution argument (SCHOLARLY_INTERPRETATION) · ✏️
- **Attribution check:** Stager ✅ (S7). Fulton et al. 2023 is known only through S9.
- **Correction of attribution:** "Stager 2014; Fulton et al. 2023 (as reported by McCarty 2024)". Alternatively, attribute only to Stager until Fulton et al. has been read.

### c28: Infants are rare in ordinary cemeteries (VERIFIED_FACT) · ✅
- **Supports:** S1's abstract (the absence of the youngest humans from the main cemeteries is unusual), S7 (citing Bénichou-Safar 1982), S6. **Add S1 as a source.**

### c29: State of the debate (VERIFIED_FACT) · ✏️
- **Supports:** S9, read in full. The reviewer writes that the archaeology's interpretation remains as uncertain as ever, and that the final report is still absent.
- **Issue:** this is **one reviewer's** assessment of one volume, not a consensus statement. Wikipedia separately asserts that most scholars favour sacrifice. We cannot establish what most scholars think in either direction.
- **Correction:** "In a 2024 review of the latest specialist volume, the reviewer judged the interpretation of the Carthage tophet still uncertain; the final report of the 1976–79 excavation remains unpublished."
- **Script wording:** "One 2024 expert review still called the evidence uncertain." Never use "experts agree", "most experts" or "experts are split evenly".

### c30: The Zita study (VERIFIED_FACT) · ✅
- **Supports:** S8's abstract and discussion, read directly. It is about Zita only. Not used in the Short.

### c31: The spring-rite hypothesis (HYPOTHESIS) · ✅
- **Supports:** S7. Not used in the Short.

### c32: The central open question (UNRESOLVED_QUESTION) · ✅
- **Supports:** the published exchange S2–S6 runs to 2017 without resolution, and S9 (2024) says the same.
- **Caution:** frame it as *unresolved*, not as *evenly contested*.

### c33: Routine or crisis (UNRESOLVED_QUESTION) · ✅
- **Supports:** S7 (periodic), S12 (crisis). Not used in the Short.

## Claims used in the proposed Short
c01 (location text only), c07, c08, c12, c16, c17, c18, c21, c22, c23, c24, c25, c29, c32.
All of these are ✅ or ✏️. **None of the 🔍 claims is needed for the Short** apart from c01's location text, and a quick read of the UNESCO page settles that.

## Before anyone signs off
1. The editor accepts or rejects each ✏️ correction. Accepted corrections are then copied into `claims.json`. I can do that on request.
2. A researcher re-reads each cited passage for the claims used in the Short and sets `verified: true` only then.
3. Ideally, a specialist (bioarchaeologist or Punic epigrapher) reviews c22–c25.

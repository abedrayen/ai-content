# Licensing audit: carthage-tophet image assets

Audited 2026-11-17. **This is a structured research note, not legal advice. It does not guarantee compliance.** Neither the Wikimedia Foundation nor Creative Commons gives legal advice. Wikimedia's own reuse page advises contacting "a suitable legal professional in your jurisdiction" for situation-specific questions.

## Sources consulted (all read directly on 2026-11-17)
- **L1:** the Commons file page for the Lyon stela: https://commons.wikimedia.org/wiki/File:Stele_with_palm_and_Tanit_sign-MBA_Lyon_1969-86-IMG_0548.jpg (last edited 26 March 2026)
- **L2:** the Commons file page for the vaults photo: https://commons.wikimedia.org/wiki/File:St%C3%A8les_puniques_sous_vo%C3%BBtes_romaines_au_tophet_de_Carthage.jpg (last edited 3 July 2026)
- **L3:** CC BY-SA 3.0 Unported legal code: https://creativecommons.org/licenses/by-sa/3.0/legalcode
- **L4:** CC BY-SA 2.0 France legal code (French): https://creativecommons.org/licenses/by-sa/2.0/fr/legalcode
- **L5:** Creative Commons FAQ: https://creativecommons.org/faq/ (about two-thirds read verbatim; anything from the unread part is marked *unverified*)
- **L6:** CC wiki, "Recommended practices for attribution": https://wiki.creativecommons.org/wiki/Recommended_practices_for_attribution
- **L7:** Commons, "Reusing content outside Wikimedia": https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia
- **L8:** Commons, "Credit line" (an essay, not policy): https://commons.wikimedia.org/wiki/Commons:Credit_line

## Decisions

| Asset | Decision | Summary |
|---|---|---|
| A. Lyon stela (`assets/stela-palm-tanit-lyon.jpg`) | **APPROVED WITH CONDITIONS** | Commercial use is granted, and attribution is straightforward. The share-alike risk is reduced by showing the photo whole and unaltered. The residual uncertainty (A7, A8) must be accepted by the editor, or reviewed by a lawyer, **before monetised publication**. |
| B. Stelae under Roman vaults (not downloaded) | **REQUIRES LEGAL REVIEW** | The licence is clear, but **authorship is uncertain**: the embedded camera metadata names a different author from the Commons record. Don't use it until that is resolved. A replacement candidate is listed. |

---

## A. Lyon stela

### Verified facts from L1
| Item | Value |
|---|---|
| Object | Punic limestone stela with a palm and the sign of Tanit, "Tophet of Carthage", dated "3rd century BCE". Musée des Beaux-Arts de Lyon, accession number 1969-86. |
| Photographer / author | **Rama** ("Source/Photographer: Rama / Own work"). Photographed 20 April 2011. |
| Licences | Dual-licensed. CeCILL (v2) **and** CC BY-SA 2.0 France. The page says "You may select the license of your choice." **We elect CC BY-SA 2.0 FR.** |
| Author's requested attribution | "Photograph by Rama, Wikimedia Commons, Cc-by-sa-2.0-fr" |
| Museum note | "Courtesy of Musée des beaux-arts de Lyon" |
| Our file | The original, 3744×5616 px, 2,184,442 bytes. It matches the Commons file history and metadata (current version uploaded 28 May 2011 by Rama). |

### Analysis
**A1. Is commercial use permitted? Yes (confirmed).** Article 3 of L4 grants a worldwide, royalty-free, non-exclusive authorisation to reproduce, distribute and communicate the work and derivative works. That grant has no commercial-use condition. The licence title ("Paternité – Partage des Conditions Initiales à l'Identique 2.0"), the Commons licence template and the deed all identify the licence as BY-SA, with no NC element. *See A8 for a drafting anomaly.*

**A2. Is attribution required, and in what format? Yes (confirmed).** L4 Art. 4(c) requires, "de manière raisonnable au regard du médium":
- the author's name;
- the title of the original work, if given;
- the URI where possible;
- for a derivative work, a credit identifying the use of the original.

L7 says the author's specified attribution should be followed. We will use:
- **On screen (short form):** `Photo: Rama · CC BY-SA 2.0 FR · Musée des Beaux-Arts de Lyon`
- **In the video description (full form):** `"Stele with palm and Tanit sign – MBA Lyon 1969-86" — Photograph by Rama, Wikimedia Commons, Cc-by-sa-2.0-fr (https://commons.wikimedia.org/wiki/File:Stele_with_palm_and_Tanit_sign-MBA_Lyon_1969-86-IMG_0548.jpg). Licence: https://creativecommons.org/licenses/by-sa/2.0/fr/. Courtesy of Musée des Beaux-Arts de Lyon. Shown in full; scaled for video, no other changes.`

L6 recommends that video attribution appear both in the video and in the description box.

**A3. Must modifications be disclosed?** L4 (version 2.0 FR) has **no general clause** requiring modifications to be labelled. The derivative-work credit in Art. 4(c) is the closest provision. The CC FAQ (L5) says that before version 4.0, indicating modifications is required only for adaptations, and that "trivial alterations" need not be noted. **Our practice:** state "Shown in full; scaled for video" in the description anyway. It costs nothing and removes ambiguity.

**A4. Could our use be an adaptation?**
- L4 Art. 1(3) defines a "Derivative Work" broadly.
- L4 Art. 1(2) excludes a **Collective Work**: a work in which the original "dans sa forme intégrale et non modifiée, est assemblée… avec d'autres contributions". Its examples are periodicals, anthologies and encyclopaedias.
- The synchronisation clause in Art. 1(3) applies **only to musical compositions and sound recordings**, not to photographs.
- L5 says whether a use is an adaptation "depends primarily on the applicable copyright law".

**Conclusion:** neither "collective work" nor "derivative work" is certain for a still photograph shown in a documentary. The Collective Work route requires the photo to appear **in full and unmodified**.

**A5. Do cropping, zooming, compositing or effects change the analysis? Yes, plausibly.**
- The previous build showed the photo full-bleed: cropped to 9:16, a slow 7% zoom that cuts further into the edges, a gradient laid over it, and captions printed on the image. That is hard to describe as "intégrale et non modifiée".
- **The new build** shows the whole image, uncropped, scaled to fit, with a very slight 2% scale-up inside a margin, so nothing is ever cut off. Nothing is laid over the image's pixels. Captions sit outside it. There is no colour grade, mask or feathering.
- L6 treats "a simple crop/excerpt that keeps the original message undistorted" as not needing a modification note. That is evidence that light mechanical changes are not creative adaptations, but it is guidance, not legal code.

**A6. What share-alike obligations could apply?** If our use **is** a derivative work, L4 Art. 4(b) allows it to be distributed only under this licence, a later version with the same options, or an equivalent Creative Commons licence. If the use is a **collective work**, Art. 4(a) states that the licence terms do not apply to the collective work outside the original work itself.

**A7. Would the whole documentary be affected? Uncertain. This is the central residual risk.**
- **If collective work:** obligations attach only to the photo, which we must attribute and not sublicense. The documentary is not affected.
- **If derivative work:** what counts as "the derivative work" is not defined for this case. Is it the frame showing the photo, the scene, or the whole film? The licence text doesn't say. A conservative reading is that a court *could* treat the film as the derivative, which would bring the whole documentary under share-alike.
- **Mitigation already applied:** presenting the photo in full and unmodified, which supports the collective reading.
- **Further mitigation available:** we could release the specific frame or scene showing the photo under CC BY-SA 2.0 FR. Whether that is sufficient is a legal question.

**A8. Drafting anomaly in L4.** Article 1(7), "Options du Contrat", reads "Paternité – Pas d'Utilisation Commerciale – Partage des Conditions Initiales à l'Identique", which includes **non-commercial**. Its example in 4(b) also names an NC licence. This conflicts with the licence's own title, the deed and Article 3. The most natural reading is a template error in the French port, and the operative grant (Art. 3) contains no NC limit. **Not resolved here.** The CC FAQ notes that ported 3.0-and-earlier licences "are not equivalent to the international licenses". Ask a lawyer if the channel will be monetised.

**A9. Moral rights.** L4 has no specific honour or integrity clause, unlike the CC 3.0 Unported §4(d). French law, which governs this port (Art. 8), recognises strong moral rights, including the right to have one's name credited and to the integrity of the work. Our in-full, unmodified presentation and credit line respect both.

**A10. Museum and object.** The stela itself is ancient and out of copyright. The *photograph* is the copyrighted work. The page carries a "Courtesy of" note from the museum, and no museum restriction is stated. We credit the museum on screen. We could ask the museum whether it has its own image terms, but nothing on Commons requires this.

### Conditions for A (APPROVED WITH CONDITIONS)
1. Show the image **in full and unmodified**: scene `fit: "contain"`, no crop, nothing laid over the image, no grade. *The checker now enforces `contain` for share-alike assets.*
2. Keep the on-screen credit visible for the whole time the image is on screen. Put the full attribution in the video description and on any accompanying web page.
3. Never imply endorsement by Rama, Wikimedia or the museum.
4. **Before monetised publication, the editor either accepts the residual risk in A7 and A8 in writing in `approval.md`, or obtains legal advice.**

---

## B. Punic stelae under Roman vaults

### Verified facts from L2
| Item | Value |
|---|---|
| Subject | "Nécropole punique dite le Tophet, Carthage". Protected monument ID 11-54 (Tunisia). Uploaded for Wiki Loves Monuments 2014. |
| Author (Commons field) | **Ferchichi Abderraouf**, "Own work", 9 April 2014 |
| Licence | CC BY-SA 3.0 Unported (single licence). The page specifies no attribution string. |
| File | 3456×5184 px, 11.27 MB. Single upload on 24 September 2014 by Ferchichi Abderraouf. |
| **EXIF "Author"** | **"ahmed {SAQSOUQ}"**, which **does not match** the Commons author. The structured data lists Ferchichi Abderraouf as creator. |
| Our copy | **Not obtained.** Wikimedia returned HTTP 429 (rate-limited) on every attempt. We did not retry further or use mirrors. |

### Analysis
- **Commercial use: permitted (confirmed).** L3 §3 grants worldwide, royalty-free rights, including distribution of adaptations (§3(d)), with no NC element.
- **Attribution: required (confirmed).** L3 §4(c) requires the author's name, the title if supplied, the URI where reasonably practicable, and for adaptations a credit identifying the use, all "reasonable to the medium". Proposed credit, *if cleared*: `"Stèles puniques sous voûtes romaines au tophet de Carthage" — Ferchichi Abderraouf, Wikimedia Commons, CC BY-SA 3.0 (link)`.
- **Modifications:** L3 §3(b) requires reasonable steps to identify changes, *in adaptations*.
- **Adaptation vs collection:** the same structure as A. L3 §1(a) defines an Adaptation, which includes "cinematographic adaptations". The synchronisation clause applies only to musical works. §1(b) excludes a Collection, in which the work is included "in its entirety in unmodified form". §4(a): the licence "does not require the Collection apart from the Work itself" to follow it.
- **Moral rights:** L3 §4(d) forbids distortion "prejudicial to the Original Author's honor or reputation".
- **Why legal review:** a CC licence is valid only if granted by the copyright holder. The camera metadata naming someone else raises a real possibility that the uploader **is not the photographer**. An "Author" tag can also simply reflect a borrowed camera or an alias, so this is **not proof of a problem**. But it is exactly what a rights audit should not wave through.

### Options for B
1. **Resolve authorship:** leave a polite question on the file's Commons talk page, or contact the uploader through Commons, asking who took the photo.
2. **Replace it** with the already-identified candidate *Nekropole tophet 20260718 11.jpg* (by Z thomas, own work, CC BY-SA 4.0, 2252×4000, Wiki Loves Monuments 2026). It shows a stone marker with the sign of Tanit in place at the site. **It still needs its own full verification and your approval to download.**
3. Keep the **text card** for segment 2. This is the current state, and it is acceptable for publication.

**Current status:** segment 2 stays a text card. No unverified image is used.

---

---

## C. Additions of 2026-11-17 (second pass)

| Asset | Decision | Notes |
|---|---|---|
| Natural Earth 1:50m land, via `world-atlas` (ISC) | **APPROVED** | Public-domain data, used for all maps. Credited on screen ("Map data: Natural Earth (public domain)"). |
| Pleiades coordinates (5 sites) | **APPROVED** | CC BY 3.0 US. Credited in the description. Coordinates are facts in any case. |
| Drone music beds (`audio/drone-bed.mp3`, `audio/drone-bed-long.mp3`) | **APPROVED** | Original, in-house, synthesised with FFmpeg. No third-party material. |
| "Tophet de Carthage.jpg" (IssamBarhoumi, CC BY-SA 4.0) | **APPROVED WITH CONDITIONS**, **not yet obtained** | Commons author and metadata are consistent. The same conditions as asset A apply: shown whole, credited on screen and in the description. CC BY-SA 4.0 §1(a) defines "Adapted Material" and has an explicit image-in-video provision only for music, so the collection-versus-adaptation analysis is the same as in A. |
| "Nekropole tophet 20260718 11.jpg" (Z thomas, CC BY-SA 4.0) | **APPROVED WITH CONDITIONS**, **not yet obtained** | As above. |
| "Carthage Harbour – panoramio.jpg" (Gonzo Gooner, CC BY 3.0) | **APPROVED WITH CONDITIONS**, **not yet obtained** | There is no share-alike condition, and cropping and pan/zoom are allowed. CC BY 3.0 §4(b) requires credit and, for adaptations, identification of changes. The original Panoramio source page is defunct, and Commons bot review on 13 March 2017 confirmed the licence. Residual risk is low but not zero. |

| Synthetic voice-overs (`audio/narration-short.mp3`, `audio/narration-long.mp3`) | **APPROVED** | Generated locally with Kokoro-82M (Apache-2.0). They are our own output, and no third-party voice or likeness is imitated. They are marked `aiGenerated: true` in `assets.json` and disclosed in the description (`youtube-package.md` §3). |

All three photos were approved for download by the editor on 2026-11-17, and all requests were rate-limited (HTTP 429). See `asset-intake.md` for the drop-in procedure.

## Standard for future productions
1. Prefer CC0, public domain, or CC BY 4.0. Treat share-alike as usable **with conditions**, never as automatically approved.
2. For each asset, record: author, title, source URL, licence and licence URL, the author's requested attribution string, the date verified, and any discrepancies. (`assets.json` now has fields for these, and the checker requires them whenever attribution is required.)
3. Show share-alike images in full and unmodified unless a lawyer has cleared adaptation.
4. Credit in the video and in the description. Keep a copy of each Commons page (PDF or archive link) as of the download date.
5. Flag any author or metadata mismatch for review before use.

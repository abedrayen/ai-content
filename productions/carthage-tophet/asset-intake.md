# Asset intake: photos approved but not yet obtained

On 2026-11-17 the editor approved downloading these three photos. Every automated request to `upload.wikimedia.org` returned **HTTP 429** (rate-limited). Wikimedia expects automated tools to send a User-Agent with contact details. We did not send personal details, retry in a loop, or use mirrors.

## How to add them (about 2 minutes)
1. Open each file page below in a browser. Click **Download**, then **Original file**.
2. Save it into `productions/carthage-tophet/assets/` with the **exact filename** given.
3. Tell Claude: "photos are in". Claude will then:
   - check the dimensions and byte size against the values below;
   - add the `assets.json` entries below;
   - switch the matching scenes from text cards to image scenes;
   - re-render.

Alternatively, you can allow a User-Agent containing a contact address, so Claude can retry within Wikimedia's policy.

## The three files
| Save as | Commons page | Original size | Licence | Use |
|---|---|---|---|---|
| `tophet-precinct-barhoumi.jpg` | https://commons.wikimedia.org/wiki/File:Tophet_de_Carthage.jpg | 4063×2461, 5.94 MB | CC BY-SA 4.0 · IssamBarhoumi, own work, 1 May 2018 · Quality image | Long-form cold open and closing: the precinct today. **Show whole** (`fit: contain`). |
| `tophet-cippus-tanit-zthomas.jpg` | https://commons.wikimedia.org/wiki/File:Nekropole_tophet_20260718_11.jpg | 2252×4000, 4.49 MB | CC BY-SA 4.0 · Z thomas, own work, 18 July 2026 | Short, segment 2: a stone marker with the sign of Tanit in place. **Show whole**. |
| `carthage-harbour-gonzo-gooner.jpg` | https://commons.wikimedia.org/wiki/File:Carthage_Harbour_-_panoramio.jpg | 2592×1944, 1.3 MB | **CC BY 3.0** · Gonzo Gooner (via Panoramio, licence reviewed by bot on 13 March 2017) | Long-form section 2: the ancient harbour. CC BY has no share-alike, so cropping and camera moves are allowed, but changes must be indicated. |

## `assets.json` entries, ready to add on arrival
```json
{ "path": "carthage-tophet/assets/tophet-precinct-barhoumi.jpg",
  "description": "The tophet precinct at Carthage (Salammbô), 2018. Original 4063x2461.",
  "origin": "Wikimedia Commons, own work by IssamBarhoumi, Wiki Loves Monuments 2018",
  "licence": "CC BY-SA 4.0", "commercialUseAllowed": true, "attributionRequired": true,
  "attributionText": "\"Tophet de Carthage\" — IssamBarhoumi, Wikimedia Commons, CC BY-SA 4.0 (https://commons.wikimedia.org/wiki/File:Tophet_de_Carthage.jpg). Shown in full; scaled for video.",
  "aiGenerated": false, "title": "Tophet de Carthage", "author": "IssamBarhoumi",
  "sourceUrl": "https://commons.wikimedia.org/wiki/File:Tophet_de_Carthage.jpg",
  "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0/legalcode" }
{ "path": "carthage-tophet/assets/tophet-cippus-tanit-zthomas.jpg",
  "description": "Stone marker (cippus) with the sign of Tanit in the tophet precinct, July 2026. Original 2252x4000.",
  "origin": "Wikimedia Commons, own work by Z thomas, Wiki Loves Monuments 2026",
  "licence": "CC BY-SA 4.0", "commercialUseAllowed": true, "attributionRequired": true,
  "attributionText": "\"Nekropole tophet 20260718 11\" — Z thomas, Wikimedia Commons, CC BY-SA 4.0 (https://commons.wikimedia.org/wiki/File:Nekropole_tophet_20260718_11.jpg). Shown in full; scaled for video.",
  "aiGenerated": false, "title": "Nekropole tophet 20260718 11", "author": "Z thomas",
  "sourceUrl": "https://commons.wikimedia.org/wiki/File:Nekropole_tophet_20260718_11.jpg",
  "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0/legalcode" }
{ "path": "carthage-tophet/assets/carthage-harbour-gonzo-gooner.jpg",
  "description": "The ancient harbour of Carthage, 2005. Original 2592x1944.",
  "origin": "Wikimedia Commons (from Panoramio), by Gonzo Gooner",
  "licence": "CC BY 3.0", "commercialUseAllowed": true, "attributionRequired": true,
  "attributionText": "\"Carthage Harbour\" — Gonzo Gooner, via Wikimedia Commons, CC BY 3.0 (https://commons.wikimedia.org/wiki/File:Carthage_Harbour_-_panoramio.jpg). Cropped and animated (pan/zoom) for video.",
  "aiGenerated": false, "title": "Carthage Harbour", "author": "Gonzo Gooner",
  "sourceUrl": "https://commons.wikimedia.org/wiki/File:Carthage_Harbour_-_panoramio.jpg",
  "licenceUrl": "https://creativecommons.org/licenses/by/3.0/legalcode" }
```

## Rejected candidates (for the record)
| File | Reason |
|---|---|
| Stèles puniques sous voûtes romaines… | REQUIRES LEGAL REVIEW: the EXIF author ("ahmed {SAQSOUQ}") does not match the Commons author |
| Tophet Carthage1921.jpg | Unknown photographer; the public-domain basis depends on an unverifiable author lifespan |
| Karthago Tophet.JPG / Karthago Tophet 2.JPG | Public-domain release, but "own work" is only *assumed* by Commons |
| Stèles tophet Carthage.jpg (Pradigue) | Low resolution (1280×960). GFDL/CC BY-SA options only |
| Port punique… panoramas | CC BY-SA. Usable whole, but the harbour photo above (CC BY) is better suited to camera moves |

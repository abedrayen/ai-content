# The Hidden World: video templates

Remotion project for The Hidden World. See `../docs/production-pipeline.md` for the full workflow and `../CLAUDE.md` for brand and editorial rules.

```bash
npm run dev                         # Remotion Studio
npm run new -- <slug>               # new production folder
npm run check -- <slug>             # gate report
npx remotion render Short --props=../productions/<slug>/storyboard.json
```

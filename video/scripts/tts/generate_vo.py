"""Synthetic voice-over for a production storyboard (Kokoro-82M, Apache-2.0).

Usage (from video/):
  <venv>/python scripts/tts/generate_vo.py ../productions/<slug> narration-short.json

For every scene in the narration file it synthesises the text, trims silence,
then refits the storyboard: each scene lasts long enough for its narration
(plus lead-in/out) and never shorter than a per-type visual minimum. It writes:
  audio/<stem>.mp3         one narration track aligned to the crossfaded timeline
  captions-<stem>.srt      sentence-level captions from the same timings
  <storyboard>.json        updated durations + audio.narration
The scene order in the storyboard is made to follow the narration file.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro import KPipeline

SR = 24000
XFADE = 0.5  # must match TRANSITION_FRAMES (15) / 30 fps
LEAD = 0.7   # voice starts this long after a scene begins (after the crossfade)
TAIL = 0.6   # breathing room after the voice, before the next crossfade


def min_visual(scene: dict) -> float:
    t = scene["type"]
    if t == "map":
        # the last marker/arc must have appeared and settled (reveal 0.7–1.6 s)
        last = max([m["appearAt"] for m in scene["markers"]] + [a["appearAt"] + 1.0 for a in scene.get("arcs", [])] + [0])
        return max(6.0, last + 3.0)
    return {
        # image: text fades in by 1.2 s; diagram: lines by ~4.5 s, labels by ~5.1 s
        "title": 4.5, "statement": 4.0, "image": 6.0, "stat": 6.0, "source": 9.0,
        "diagram": 6.5, "compare": 16.0,
        "timeline": 3.0 + 1.2 * len(scene.get("events", [])),
        "ledger": 2.5 + 1.0 * (len(scene.get("left", [])) + len(scene.get("right", []))),
    }.get(t, 4.0)


def trim(audio: np.ndarray, thresh: float = 0.01) -> np.ndarray:
    idx = np.where(np.abs(audio) > thresh)[0]
    return audio if idx.size == 0 else audio[max(0, idx[0] - 240): idx[-1] + 2400]


def srt_time(t: float) -> str:
    ms = int(round(t * 1000))
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"


def plain(text: str) -> str:
    # strip [word](/phonemes/) overrides for captions
    return re.sub(r"\[([^\]]+)\]\(/[^)]*/\)", r"\1", text)


def main(prod: Path, narration_file: str) -> None:
    cfg = json.loads((prod / narration_file).read_text(encoding="utf-8"))
    sb_path = prod / cfg["storyboard"]
    sb = json.loads(sb_path.read_text(encoding="utf-8"))
    by_name = {s["name"]: s for s in sb["scenes"]}
    names = [s["name"] for s in cfg["scenes"]]
    missing = set(by_name) ^ set(names)
    if missing:
        sys.exit(f"narration and storyboard scene names differ: {sorted(missing)}")

    global LEAD, TAIL
    LEAD = cfg.get("lead", LEAD)
    TAIL = cfg.get("tail", TAIL)
    pipe = KPipeline(lang_code=cfg["lang"], repo_id="hexgrad/Kokoro-82M")
    clips = {}
    for s in cfg["scenes"]:
        if not s["text"].strip():
            continue
        parts = [np.asarray(a, dtype=np.float32) for _, _, a in pipe(s["text"], voice=cfg["voice"], speed=cfg["speed"])]
        clips[s["name"]] = trim(np.concatenate(parts))
        print(f"  {s['name']}: {len(clips[s['name']]) / SR:.2f}s")

    # Refit scene durations and lay out the narration track.
    scenes, t, cues, track = [], 0.0, [], []
    for i, s in enumerate(cfg["scenes"]):
        sc = by_name[s["name"]]
        vo = len(clips[s["name"]]) / SR if s["name"] in clips else 0.0
        need = LEAD + vo + TAIL + (XFADE if i < len(cfg["scenes"]) - 1 else 0)
        sc["durationInSeconds"] = float(np.ceil(max(min_visual(sc), need) * 10) / 10)  # 0.1 s grid
        start = t
        if s["name"] in clips:
            track.append((start + LEAD, clips[s["name"]]))
            # sentence-level captions, timed proportionally to characters
            text = plain(s["text"])
            sents = [x.strip() for x in re.split(r"(?<=[.?!:])\s+", text) if x.strip()]
            total = sum(len(x) for x in sents)
            c = start + LEAD
            for x in sents:
                d = vo * len(x) / total
                cues.append((c, c + d, x))
                c += d
        scenes.append(sc)
        t += sc["durationInSeconds"] - (XFADE if i < len(cfg["scenes"]) - 1 else 0)
    total_len = t
    sb["scenes"] = scenes

    buf = np.zeros(int((total_len + 1) * SR), dtype=np.float32)
    for at, clip in track:
        a = int(at * SR)
        buf[a: a + len(clip)] += clip
    buf = buf[: int(total_len * SR)]

    stem = Path(narration_file).stem
    raw = prod / "audio" / f"{stem}-raw.wav"
    out = prod / "audio" / f"{stem}.mp3"
    sf.write(raw, buf, SR)
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw),
         "-af", "loudnorm=I=-15:TP=-1.5:LRA=11,aresample=48000", "-ac", "1", "-c:a", "libmp3lame", "-b:a", "192k", str(out)],
        check=True,
    )
    raw.unlink()

    slug = sb["slug"]
    sb.setdefault("audio", {})["narration"] = {"src": f"{slug}/audio/{out.name}", "volume": 1}
    sb_path.write_text(json.dumps(sb, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    with open(prod / f"captions-{stem.replace('narration-', '')}.srt", "w", encoding="utf-8") as f:
        for n, (a, b, x) in enumerate(cues, 1):
            f.write(f"{n}\n{srt_time(a)} --> {srt_time(b)}\n{x}\n\n")

    print(f"timeline {total_len:.1f}s · narration → {out.name} · captions → captions-{stem.replace('narration-', '')}.srt")


if __name__ == "__main__":
    main(Path(sys.argv[1]).resolve(), sys.argv[2])

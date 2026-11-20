import json
import os
import re
import urllib.request
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parent
CUES_PATH = Path(os.environ.get("LUMINA_CUES_PATH", str(ROOT / "cues.json")))
OUT_DIR = Path(os.environ.get("LUMINA_NARRATION_DIR", "/tmp/lumina-narration"))
MODEL_DIR = Path(os.environ.get("KOKORO_MODEL_DIR", "/tmp/kokoro-models"))

MODEL_URL = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx"
VOICES_URL = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin"

VOICE = os.environ.get("KOKORO_VOICE", "af_heart")
SPEED = float(os.environ.get("KOKORO_SPEED", "1.24"))


def ensure_models() -> tuple[Path, Path]:
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    model_path = MODEL_DIR / "kokoro-v1.0.onnx"
    voices_path = MODEL_DIR / "voices-v1.0.bin"
    if not model_path.exists():
        print(f"[tts] Downloading {MODEL_URL} -> {model_path}")
        urllib.request.urlretrieve(MODEL_URL, model_path)
    if not voices_path.exists():
        print(f"[tts] Downloading {VOICES_URL} -> {voices_path}")
        urllib.request.urlretrieve(VOICES_URL, voices_path)
    return model_path, voices_path


def synthesize_cue(kokoro: Kokoro, text: str) -> tuple[np.ndarray, int]:
    sr = 24000
    lead_pad = np.zeros(int(sr * 0.06), dtype=np.float32)
    tail_pad = np.zeros(int(sr * 0.08), dtype=np.float32)

    # Full-paragraph synthesis preserves Kokoro's natural cross-sentence breath & F0 prosody.
    # Only split if an unusually long paragraph approaches Kokoro's 510-phoneme context window.
    if len(text) <= 450:
        audio, sr = kokoro.create(text.strip(), voice=VOICE, speed=SPEED, lang="en-us")
        return np.concatenate([lead_pad, audio.astype(np.float32), tail_pad]), sr

    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", text.strip()) if s.strip()]
    parts: list[np.ndarray] = [lead_pad]
    breath = np.zeros(int(sr * 0.14), dtype=np.float32)
    for i, sentence in enumerate(sentences):
        audio, sr = kokoro.create(sentence, voice=VOICE, speed=SPEED, lang="en-us")
        parts.append(audio.astype(np.float32))
        if i < len(sentences) - 1:
            parts.append(breath)
    parts.append(tail_pad)
    return np.concatenate(parts), sr


def main() -> None:
    model_path, voices_path = ensure_models()
    kokoro = Kokoro(str(model_path), str(voices_path))

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    data = json.loads(CUES_PATH.read_text(encoding="utf-8"))
    manifest: dict[str, list[dict]] = {}

    total_ms = 0
    total_words = 0

    for suite_name, cues in data.items():
        suite_dir = OUT_DIR / suite_name
        suite_dir.mkdir(parents=True, exist_ok=True)
        manifest[suite_name] = []
        suite_ms = 0

        for idx, cue in enumerate(cues):
            wav_path = suite_dir / f"{idx:02d}_{cue['id']}.wav"
            meta_path = suite_dir / f"{idx:02d}_{cue['id']}.sha"
            spoken_text = cue.get("tts") or cue["speech"]
            cache_key = f"v2|{VOICE}|{SPEED}|{spoken_text}"
            force = "--force" in os.sys.argv

            if (
                not force
                and wav_path.exists()
                and wav_path.stat().st_size > 1000
                and meta_path.exists()
                and meta_path.read_text(encoding="utf-8") == cache_key
            ):
                info = sf.info(str(wav_path))
                duration_ms = int(round(info.duration * 1000))
            else:
                samples, sr = synthesize_cue(kokoro, spoken_text)
                sf.write(str(wav_path), samples, sr, subtype="PCM_16")
                meta_path.write_text(cache_key, encoding="utf-8")
                duration_ms = int(round((len(samples) / sr) * 1000))

            words = len(cue["speech"].split())
            suite_ms += duration_ms
            total_ms += duration_ms
            total_words += words

            entry = {
                **cue,
                "audioFile": str(wav_path),
                "durationMs": duration_ms,
            }
            manifest[suite_name].append(entry)
            wpm = words / (duration_ms / 60000)
            print(f"[tts] {suite_name}/{cue['id']}: {duration_ms}ms ({wpm:.0f} WPM)")

        print(f"[tts] Suite {suite_name} total speech: {suite_ms / 1000:.1f}s")

    manifest_path = OUT_DIR / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    overall_wpm = total_words / (total_ms / 60000)
    print(f"[tts] Wrote manifest -> {manifest_path} (overall {overall_wpm:.0f} WPM)")


if __name__ == "__main__":
    main()

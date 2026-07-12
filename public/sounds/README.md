# Click sound

Drop a click sound effect here named **`click.mp3`**:

```
public/sounds/click.mp3
```

The dock/UI click feedback ([src/lib/sound.js](../../src/lib/sound.js)) will pick it
up automatically — no code changes needed. It's fetched once and cached, so
repeated clicks are low-latency.

If this file is missing (or fails to load), the app falls back to a synthesized
click, so sound always works even before you add your own.

To use a different filename or path, change `CLICK_SOUND_URL` in
[src/lib/sound.js](../../src/lib/sound.js).

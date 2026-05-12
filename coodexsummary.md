# Codex Summary

## Project State

This portfolio is a static React/Babel site with fullscreen canvas backgrounds for two modes:

- `scene-graveyard.js` handles Graveyard mode.
- `scene-matrix.js` handles Matrix mode and the Phase 2 Three.js cockpit work.
- `index.html` loads React, Three.js, `GLTFLoader`, both scene files, and the React app.

The Matrix scene currently loads `SpaceSceneV2.glb` through global `THREE.GLTFLoader`.

## Matrix 3D Cockpit Notes

The GLB loads successfully, but framing has been the main tuning problem. The scene is now using the normalized hybrid path instead of raw `glb_only` Blender transform preservation.

Current key setup in `scene-matrix.js`:

- `MATRIX_SCENE_MODE = "hybrid"`
- Active preset: `inside_cockpit_forward`
- `USE_GLB_CAMERA_IF_AVAILABLE = false`
- `ENABLE_VIDEO_SCREENS = true`
- Starfield and planet stay visible after the GLB loads.
- Procedural cockpit and procedural monitor frames are hidden after GLB success.

## Important Tuning Constants

Start here if the cockpit is too far away, too close, or pointed wrong:

- `MODEL_FRAMING_PRESETS.inside_cockpit_forward.targetSize`
- `MODEL_FRAMING_PRESETS.inside_cockpit_forward.position`
- `MODEL_FRAMING_PRESETS.inside_cockpit_forward.rotation`
- `MODEL_FRAMING_PRESETS.inside_cockpit_forward.cameraPosition`
- `MODEL_FRAMING_PRESETS.inside_cockpit_forward.cameraLookAt`

Recent target values:

```js
targetSize: 92
position: { x: 0, y: -16, z: 8 }
rotation: { x: 0, y: 0, z: 0 }
cameraPosition: { x: 0, y: 2.2, z: 18 }
cameraLookAt: { x: 0, y: 1.2, z: -18 }
```

If it is too close, lower `targetSize` toward `70`.
If it is still too far, raise `targetSize` toward `115`.

## Video Screens

Independent screen planes are created separately from the procedural monitor frames, so they can remain visible when the GLB cockpit replaces the procedural shell.

Current intended mapping:

- Screen 1: `ObIntro.mkv`
- Screen 2: `ZercIntro.mkv`
- Screen 3: Matrix/static placeholder

Browser note: MKV video textures may not be reliable in production. Prefer MP4/H.264 or WebM if playback is inconsistent.

## Debug Helpers

Model debug helpers should be off by default so they do not draw through hero text:

- `DEBUG_MODEL = false`
- `DEBUG_BOUNDS = false`
- `DEBUG_AXES = false`

Screen debug borders can be enabled with:

- `DEBUG_SCREENS = true`

## Runtime API

The app still depends on:

```js
window.__matrixScene.setVisible(trueOrFalse)
window.__graveyardScene.setVisible(trueOrFalse)
```

Do not remove or rename those APIs.

Useful Matrix debug getters:

```js
window.__matrixScene.getMonitorScreens()
window.__matrixScene.getModelGroup()
window.__matrixScene.getModelScaleFactor()
window.__matrixScene.getModelScaledSize()
```

## Local Test

Run the static server from the project root:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

Press `B` to switch between Graveyard and Matrix modes.

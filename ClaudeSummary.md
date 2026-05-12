# GIGAKILLS Portfolio — 3D Integration Status

**Last Updated:** May 10, 2026  
**Current Phase:** Phase 2 — GLB Model Integration (In Progress)  
**Status:** ✅ GLB Loading | ⚠️ Camera Framing | ⚠️ Skybox Needed

---

## Project Overview

GIGAKILLS is a dual-mode portfolio website with **Graveyard Realm** (2D/dark aesthetic) and **Matrix Sector** (3D sci-fi cockpit). The site uses React 18 + Three.js r128 (CDN-based, no build tools).

### Key URLs
- **Live:** http://localhost:8000
- **Repository:** c:\Users\Austin\Documents\PortfolioV2
- **Entry Point:** index.html → app.jsx → scene-matrix.js / scene-graveyard.js

---

## Phase Completion Status

### Phase 1 ✅ COMPLETE
- ✅ Procedural cockpit (BoxGeometry, IcosahedronGeometry, PlaneGeometry)
- ✅ Starfield (800 point particles)
- ✅ Planet (procedural texture with canvas)
- ✅ Monitor screens (3x glowing planes)
- ✅ Camera drift/parallax animation
- ✅ Mode switching (B key: Matrix ↔ Graveyard)
- ✅ UI integration (cockpit behind text, clickable)

### Phase 1.5 ✅ COMPLETE
- ✅ Visual composition tuning
- ✅ Tuning constants organized at top of scene-matrix.js
- ✅ Debug modes with keyboard cycling (N key)
- ✅ Z-index layering fixed (vignette no longer covers canvas)

### Phase 2 🟡 IN PROGRESS
- ✅ GLTFLoader integrated (CDN from jsdelivr)
- ✅ SpaceSceneV2.glb loads successfully (100%)
- ✅ Model transform preserved (Blender composition)
- ✅ Lights detected and added
- ⚠️ **Camera framing:** Fallback camera too close (need adjustment)
- ⚠️ **Skybox missing:** GLB has no background, need procedural/generated
- ❌ Video screens: Disabled for now (can re-enable)
- ❌ Models within GLB: Screens identified (Screen_Left, Screen_Main, Screen_Right) but not yet utilized

---

## Current State

### What's Working
```
✅ Matrix mode shows SpaceSceneV2.glb cockpit model
✅ GLB camera detection (found none, uses fallback)
✅ GLB lights detection (found none, adds fallback ambient/directional)
✅ Model transform preservation (no normalization/scaling)
✅ Graveyard mode 100% untouched
✅ UI responsive and clickable
✅ Mode switching smooth (B key)
✅ Animation loop @ 60 FPS
```

### What Needs Work
```
⚠️ Camera too close — model appears as huge wall
   Solution: Increase FALLBACK_CAMERA_POSITION.z to 1500
   
⚠️ No background skybox — black void
   Solution: Add procedural starfield or image-based skybox
   
⚠️ Videos disabled — screens not showing video textures yet
   Solution: Re-enable ENABLE_VIDEO_SCREENS = true + test MKV playback
```

### Scene Mode Options
```javascript
MATRIX_SCENE_MODE = "hybrid"      // GLB + procedural (current)
                   "glb_only"     // GLB only (clean, minimal)
                   "procedural"   // Procedural only (original)
```

Currently set to: **"hybrid"** (allows both GLB and fallback procedural objects)

---

## Key Files

### Core 3D Files
| File | Size | Purpose |
|------|------|---------|
| **scene-matrix.js** | ~50KB | 3D cockpit scene (Three.js) |
| **scene-graveyard.js** | 9KB | 2D graveyard scene (canvas) |
| **index.html** | 15KB | HTML structure, CSS, script tags |
| **app.jsx** | 4.5KB | React state, mode switching |
| **components.jsx** | 23KB | UI components (hero, projects, skills) |

### Assets
| File | Size | Status |
|------|------|--------|
| **SpaceSceneV2.glb** | 106MB | ✅ Loaded, visible |
| **ObIntro.mkv** | 8.4MB | ⚠️ Video format issue (MKV) |
| **ZercIntro.mkv** | 14MB | ⚠️ Video format issue (MKV) |
| **plain_starfield1** | ? | Added by user |

---

## How to Adjust Camera Framing

### Quick Camera Fix (Make Model Visible)

Edit **scene-matrix.js** lines 54-55:

```javascript
// BEFORE (too close):
const FALLBACK_CAMERA_POSITION = { x: 0, y: 2, z: 12 };
const FALLBACK_CAMERA_LOOK_AT = { x: 0, y: 1, z: 0 };

// AFTER (far enough back):
const FALLBACK_CAMERA_POSITION = { x: 0, y: 200, z: 1500 };
const FALLBACK_CAMERA_LOOK_AT = { x: 0, y: 200, z: 0 };
```

Then **hard refresh** (Ctrl+Shift+R).

### Using Framing Presets (When DEBUG_MODEL = true)

Set `DEBUG_MODEL = true` (line 59), then press **N** to cycle through presets:
1. Outside (current)
2. Inside cockpit (forward) — **best for composition**
3. Inside cockpit (flipped)
4. Cockpit behind UI
5. Inside (large scale)

Preset #2 is tuned to show the model nicely behind the hero text.

---

## Adding a Skybox

### Option A: Procedural Starfield (Quick)

Already provided in instructions — add `createProceduralStarfield()` function and call it in `init()`.

### Option B: Image-Based Skybox (Better Quality)

Need 6 images (front, back, left, right, top, bottom) or 1 equirectangular image:

```javascript
const textureLoader = new THREE.TextureLoader();
const skyboxTexture = textureLoader.load('path/to/skybox.jpg');
const skyboxGeo = new THREE.SphereGeometry(5000, 32, 32);
const skyboxMat = new THREE.MeshBasicMaterial({ 
  map: skyboxTexture,
  side: THREE.BackSide 
});
const skybox = new THREE.Mesh(skyboxGeo, skyboxMat);
scene.add(skybox);
```

### Option C: Use GLB's Skybox (If Available)

If SpaceSceneV2.glb has internal skybox meshes, they should appear automatically. Check console for "Skybox" mesh name.

---

## Video Screens Setup

**Current Status:** Disabled (`ENABLE_VIDEO_SCREENS = false`)

### To Re-Enable Videos:

1. Change line 44:
   ```javascript
   const ENABLE_VIDEO_SCREENS = true;
   ```

2. Ensure video files are accessible:
   ```
   ObIntro.mkv    ✅ Present
   ZercIntro.mkv  ✅ Present
   ```

3. ⚠️ **Browser Compatibility Issue:**
   - .MKV files have limited browser support
   - Videos likely won't play in Chrome/Firefox/Safari
   - **Solution:** Convert to MP4 using FFmpeg:
     ```bash
     ffmpeg -i ObIntro.mkv -c:v libx264 -c:a aac ObIntro.mp4
     ffmpeg -i ZercIntro.mkv -c:v libx264 -c:a aac ZercIntro.mp4
     ```
   - Then update VIDEO_CONFIG.videoFiles (line 155-157 in scene-matrix.js)

---

## Debug Flags

All located at top of scene-matrix.js (lines 57-63):

```javascript
DEBUG_VISIBILITY = false  // Bright debug objects (Phase 1.5)
DEBUG_MODEL = false       // Mesh names, camera markers (Phase 2)
DEBUG_BOUNDS = false      // Bounding box helper
DEBUG_AXES = false        // Axes helper (X=red, Y=green, Z=blue)
DEBUG_SCREENS = false     // Screen plane borders
HIDE_GLB_SKYBOX_MESHES = false  // Hide sky/dome meshes
```

To debug: set `DEBUG_MODEL = true`, then press **N** to cycle camera presets and see detailed logs.

---

## Console Output Checklist

### On Load (What You Should See)
```
[MatrixScene] scene-matrix.js loaded
🟢 Matrix Scene: Initializing...
[Scene] Creating procedural objects (MATRIX_SCENE_MODE: "hybrid")
GLB loading progress: 0% → 100%
✅ GLB model loaded successfully
[GLB_ONLY] Using GLB-only rendering mode
[GLB] Cameras in GLB: 0
⚠️ No GLB camera found. Using fallback camera
[GLB] Lights in GLB scene: ❌ none found
✅ Adding fallback lighting
[GLB_ONLY] Adding GLB to scene
[GLB] Bounding box: 1000.00 x 1000.00 x 1000.00
✅ [GLB_ONLY] Setup complete
🟢 Matrix Scene: FULLY INITIALIZED
```

### If You See Errors
```
❌ SyntaxError        → Hard refresh (Ctrl+Shift+R)
❌ GLTFLoader not loaded → Check index.html for script tag
❌ Canvas not found  → Check index.html for <canvas id="scene-matrix">
```

---

## Known Issues & Solutions

### Issue: Model is a huge wall (can't see it)
**Cause:** Camera at z:12 is inside/too close to 1000-unit model  
**Fix:** Set `FALLBACK_CAMERA_POSITION.z = 1500` and refresh

### Issue: Black/no background skybox
**Cause:** GLB has no skybox mesh, procedural starfield disabled  
**Fix:** Add procedural starfield function + call in init()

### Issue: Videos not playing
**Cause:** MKV format not supported by browsers  
**Fix:** Convert to MP4 using FFmpeg (see Video Screens Setup above)

### Issue: Graveyard mode broken
**Status:** Should never happen — graveyard completely untouched  
**Fix:** Check scene-graveyard.js hasn't been edited

### Issue: UI not clickable / behind 3D
**Cause:** Z-index issue  
**Fix:** Verify `#root { z-index: 2 }` and `.scene-layer { z-index: 0 }` in index.html

---

## Next Steps

### Immediate (Today)
- [ ] Adjust camera position (z: 1500) and refresh
- [ ] Verify cockpit model is fully visible
- [ ] Add procedural or image-based skybox
- [ ] Test mode switching (B key) still works

### Short Term (This Week)
- [ ] Convert videos from MKV to MP4
- [ ] Re-enable video screens (`ENABLE_VIDEO_SCREENS = true`)
- [ ] Test videos playing on monitor planes
- [ ] Fine-tune camera position for hero text balance

### Medium Term (Next Phase)
- [ ] Explore GLB model structure (named meshes for screens)
- [ ] Consider replacing procedural screens with GLB screens if available
- [ ] Add lighting/material adjustments if needed
- [ ] Performance optimization (LOD, culling, etc.)

### Long Term (Phase 3+)
- [ ] Interactive controls (mouse look, WASD movement)
- [ ] Data visualization on screens (live metrics, animations)
- [ ] Audio reactivity (music-synchronized glows)
- [ ] Mobile optimization

---

## Important Constants Reference

| Constant | Default | Purpose |
|----------|---------|---------|
| `MATRIX_SCENE_MODE` | "hybrid" | Which scene to render |
| `FALLBACK_CAMERA_POSITION` | (0, 2, 12) | **← Adjust this for visibility** |
| `FALLBACK_CAMERA_LOOK_AT` | (0, 1, 0) | Where camera looks |
| `USE_GLB_CAMERA_IF_AVAILABLE` | false | Use camera from GLB if found |
| `ENABLE_VIDEO_SCREENS` | false | Show videos on screens |
| `DEBUG_MODEL` | false | Show debug info + N key |
| `HIDE_GLB_SKYBOX_MESHES` | false | Hide sky/dome meshes |

---

## Testing Checklist

```
[ ] Hard refresh loads without errors
[ ] Press B → Matrix mode shows cockpit model
[ ] Press B again → Graveyard mode shows gravestones
[ ] Model is fully visible (not a wall filling screen)
[ ] Background visible (not pure black)
[ ] Hero text readable over 3D
[ ] UI buttons clickable
[ ] No console errors (except React DevTools suggestion)
[ ] FPS stable (~60 on desktop, 30+ on mobile)
```

---

## Questions to Clarify

1. **Skybox preference?** Procedural stars, nebula, or upload images?
2. **Video codec:** Convert MKV to MP4, or skip videos for now?
3. **Camera inside or outside model?** Currently outside looking in — prefer different framing?
4. **Performance:** Any lag or stuttering?

---

**Last Tested:** May 10, 2026 @ 2560x1355, 60 FPS  
**Browser:** Chrome/Firefox (Three.js r128, Babel transpiler)  
**Build Tool:** None (CDN scripts + React development mode)

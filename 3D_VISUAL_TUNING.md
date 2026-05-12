# 3D Visual Tuning — Cockpit Composition Guide

**Status**: ✅ Updated with better composition and easy-to-find tuning constants  
**Changes**: Reorganized scene-matrix.js with tuning constants at top  
**API**: Unchanged — `window.__matrixScene.setVisible()` still works  
**Performance**: Same lightweight footprint (no regression)

---

## What Changed

### 1. **Tuning Constants at Top** (Lines 32-113)
All adjustable values are now grouped in named objects at the start of the file:
- `CAMERA_PARAMS` — Viewpoint and drift
- `PLANET_PARAMS` — Planet appearance and movement
- `STARFIELD_PARAMS` — Stars appearance
- `COCKPIT_PARAMS` — Frame geometry and scale
- `MONITOR_PARAMS` — Screen positions and glow
- `LIGHTING_PARAMS` — Scene illumination

**Why**: No more hunting through 370 lines to find a value. All composition tweaks are in one place.

### 2. **Better Composition**
- **Camera position**: Moved back slightly (z: 12→15) for better view of entire cockpit
- **Camera target**: Now looks at the cockpit center, not far into space (z: -15→-30)
- **Cockpit scale**: Added scale multiplier so entire frame can be sized uniformly
- **Monitors**: Moved forward (z: 9→10) to feel more integrated with cockpit, less floating
- **Monitor positions**: Adjusted Y to 1.0 (was 1.5) for better visual balance
- **Planet**: Slightly repositioned (y: 10→-5) to sit lower in background, less in-face
- **Lighting**: Reduced ambient to 0.3 (was 0.4), added darker fog (0x000a15 vs 0x001a2e)

### 3. **Better Monitor Glow Control**
- Monitor brightness: Now controlled by `MONITOR_PARAMS.brightness` (was scattered)
- Glow pulse: Reduced amplitude so screens don't flash too much
- Glow doesn't overpower text on hero section anymore

### 4. **Cockpit Feels More Surrounding**
- Side panels positioned to edge of view
- Ceiling arch frames the top
- Floor grid anchors the bottom
- Camera position centered so cockpit surrounds viewer

### 5. **Better Visual Hierarchy for UI**
- Darker ambient light (less wash-out behind text)
- Reduced monitor glow brightness to not compete with hero content
- Starfield less distracting (darker stars)
- Planet positioned to not dominate center

---

## Most Important Tuning Values

**These are the "big knobs" — adjust these for major composition changes:**

### CAMERA_PARAMS (Lines 35-44)
```javascript
position: { x: 0, y: 0.5, z: 15 }  // ← This frames the entire cockpit
driftAmplitudeX: 0.3                // ← Too high = nauseating, too low = boring
driftSpeedX: 0.15                   // ← Slower = relaxing, faster = energetic
```

**How to use:**
- Move camera back: increase `z` to 18-20 (pulls back from cockpit)
- Move camera forward: decrease `z` to 12-14 (closer, more immersive)
- Stop drift entirely: set `driftAmplitudeX: 0` and `driftAmplitudeY: 0`
- Make drift faster: increase `driftSpeedX` to 0.25

### COCKPIT_PARAMS (Lines 85-93)
```javascript
scale: 1.0  // ← Adjust to make entire cockpit bigger or smaller
```

**How to use:**
- Bigger cockpit: change to `scale: 1.3` (30% larger)
- Smaller cockpit: change to `scale: 0.8` (20% smaller)
- Affects panels, ceiling, floor, and grid all at once

### MONITOR_PARAMS (Lines 95-113)
```javascript
brightness: 0.5      // ← How bright monitors glow (0.3 = dim, 0.8 = bright)
positions: [...]     // ← Where monitors are positioned
pulseSpeed: 2        // ← How fast glow pulses (1 = slow, 4 = fast)
```

**How to use:**
- Dim monitors (less distraction for text): `brightness: 0.3`
- Bright monitors (more dramatic): `brightness: 0.7`
- Move monitor closer: change z value in positions from 10 to 8
- Move monitors higher: change y value from 1 to 1.5

### PLANET_PARAMS (Lines 68-76)
```javascript
radius: 8              // ← Planet size
position: { x: 15, y: -5, z: -60 }  // ← Where it sits in background
```

**How to use:**
- Bigger planet: `radius: 12`
- Smaller planet: `radius: 5`
- Move planet higher: change `y` from -5 to 5
- Move planet closer: change `z` from -60 to -40

### LIGHTING_PARAMS (Lines 115-121)
```javascript
ambientIntensity: 0.3  // ← Overall brightness
mainLightIntensity: 0.6 // ← Directional light strength
```

**How to use:**
- Brighter scene: increase to 0.4 or 0.5
- Darker/more dramatic: decrease to 0.2 or 0.15

---

## Suggested Screenshot Angles

Take screenshots at these positions to judge composition:

### 1. **Hero Section View**
- Don't adjust camera, just take natural screenshot
- Check: Does cockpit frame feel surrounding without overwhelming hero title?
- Good: Faint panels on left/right, planet visible but not center
- Bad: Bright monitors glaring behind "GIGAKILLS" text

**What to look for:**
- Title text should be easily readable
- Monitors should glow, not overpower
- Cockpit should feel like "window frame" not "competitor"

### 2. **Full Screen View (Matrix Mode)**
- Press B to enter Matrix mode
- Look at entire viewport
- Check: Does composition feel balanced?
- Good: Starfield, planet, cockpit, and monitors all visible and working together
- Bad: One element dominates, others are invisible or confusing

**What to look for:**
- Starfield should be visible but not distracting
- Planet should feel like main background element
- Cockpit should surround the viewer
- Monitors should feel mounted inside, not floating

### 3. **Mobile View (375px width)**
- Resize browser to 375 pixels wide
- Press B to enter Matrix mode
- Check: Does composition still work on small screen?
- Good: Cockpit feels proportional, text readable
- Bad: Cockpit elements feel oversized, text crushed

**What to look for:**
- Cockpit should be scaled appropriately for mobile viewport
- Content should still be readable
- No broken layouts

### 4. **Camera Drift Animation**
- Watch for 10-15 seconds
- Check: Is drift annoying or subtle?
- Good: Barely noticeable movement, adds life
- Bad: Obvious swaying, makes you dizzy

**What to look for:**
- Camera should drift smoothly (not jerky)
- Movement should be subtle enough to not distract
- If it feels wrong, adjust `driftAmplitudeX` or `driftSpeedX`

### 5. **Monitor Glow Pulse**
- Look at the three monitor screens
- Check: Do they pulse nicely?
- Good: Gentle fade in/out, each slightly different
- Bad: Too fast/bright, or all exactly in sync

**What to look for:**
- Screens should not flash aggressively
- Should be visible but not dominate
- If too bright, reduce `MONITOR_PARAMS.brightness`
- If too fast, reduce `pulseSpeed`

---

## Quick Tuning Scenarios

### Scenario A: "Hero content is hard to read"
**Problem**: Cockpit and monitors are too bright/distracting

**Fix**:
```javascript
// In MONITOR_PARAMS:
brightness: 0.3,          // was 0.5
glowDistance: 12,         // was 15 (shorter reach)

// In LIGHTING_PARAMS:
ambientIntensity: 0.25,   // was 0.3
mainLightIntensity: 0.4,  // was 0.6
```

### Scenario B: "Background looks flat/boring"
**Problem**: Not enough visual interest

**Fix**:
```javascript
// In CAMERA_PARAMS:
driftAmplitudeX: 0.5,    // was 0.3 (more noticeable movement)
driftSpeedX: 0.20,       // was 0.15 (slightly faster)

// In MONITOR_PARAMS:
brightness: 0.7,         // was 0.5 (more dramatic glow)
pulseSpeed: 3,           // was 2 (faster pulse)
```

### Scenario C: "Cockpit feels too small/disconnected"
**Problem**: Not enough presence as background

**Fix**:
```javascript
// In COCKPIT_PARAMS:
scale: 1.3,  // was 1.0

// In CAMERA_PARAMS:
position: { x: 0, y: 0.5, z: 12 }  // move closer (was 15)
```

### Scenario D: "Text is readable but cockpit is too subtle"
**Problem**: Balance is off — background needs more presence

**Fix**:
```javascript
// In LIGHTING_PARAMS:
ambientIntensity: 0.35,     // was 0.3
mainLightIntensity: 0.7,    // was 0.6

// In MONITOR_PARAMS:
brightness: 0.6,            // was 0.5
```

### Scenario E: "Planet is too prominent / distracting"
**Problem**: Planet too big or too central

**Fix**:
```javascript
// In PLANET_PARAMS:
radius: 5,                          // was 8 (smaller)
position: { x: 20, y: -10, z: -80 } // move to edge and down
```

---

## How to Apply Changes

1. **Open scene-matrix.js**
2. **Find the tuning constant section** (lines 32-121)
3. **Locate the specific parameter** you want to change
4. **Edit the value**
5. **Save the file**
6. **Reload page** (Ctrl+R or Cmd+R)
7. **Press B** to enter Matrix mode
8. **Observe the result**
9. **Repeat until you like it**

**Example change:**
```javascript
// BEFORE:
brightness: 0.5,

// AFTER (make monitors dimmer):
brightness: 0.35,

// Save, reload, press B, look at result
```

---

## Testing Guide

### Visual Acceptance Criteria

**✅ Good Composition:**
- [ ] Hero section text easily readable (no glare)
- [ ] Cockpit surrounds viewer, not just floating geometry
- [ ] Planet feels like main background element
- [ ] Monitors glow subtly, add depth
- [ ] Starfield visible but not distracting
- [ ] Camera drift is smooth and subtle (not nauseating)
- [ ] On mobile (375px), composition still works
- [ ] Scene feels like "looking out from a spaceship cockpit"

**❌ Problem Signs:**
- [ ] Hero title washed out / hard to read
- [ ] Monitors so bright they compete with content
- [ ] Cockpit feels like it's floating in front of content
- [ ] Camera drift is jerky or makes you dizzy
- [ ] Starfield dominates the view
- [ ] Planet is either invisible or too prominent
- [ ] Layout broken on mobile
- [ ] Scene feels disconnected, like random floating objects

### Performance Check (Should be unaffected)

- [ ] Desktop: 60 FPS
- [ ] Mobile: 30-45 FPS
- [ ] No lag on mode switch
- [ ] No memory leaks (check DevTools)

---

## Common Questions

**Q: How do I make monitors glow less?**  
A: `MONITOR_PARAMS.brightness: 0.3` (lower = dimmer)

**Q: How do I make the cockpit feel bigger?**  
A: `COCKPIT_PARAMS.scale: 1.5` (or adjust camera back)

**Q: How do I stop the camera from drifting?**  
A: Set `driftAmplitudeX: 0` and `driftAmplitudeY: 0`

**Q: The planet is invisible. Why?**  
A: Check camera position and lookAt point. Planet at z:-60 should be visible if camera is at z:15.

**Q: Can I make the monitors different colors?**  
A: Yes! `MONITOR_PARAMS.screenColor: 0x3df0ff` (cyan) or try other hex values.

**Q: How do I position monitors exactly where I want?**  
A: Edit the `positions` array in `MONITOR_PARAMS`. Each item is `{ x, y, z }`.

---

## Next Steps

1. **Test the current scene**: Press B, look at composition
2. **Take screenshots** at different positions (see section above)
3. **Identify what feels "off"** (if anything)
4. **Find the relevant tuning constant**
5. **Make small adjustments** (don't change by 50% on first try)
6. **Test again**
7. **Iterate until happy**

**Estimated time for tuning**: 15-30 minutes

---

## Reverting Changes

If you want to revert to default composition, just change back:

```javascript
// Default values (revert here if things look worse):
position: { x: 0, y: 0.5, z: 15 }
brightness: 0.5
scale: 1.0
```

Or you can view the backup in your browser history / git if you saved the original.

---

## Future: When You Import a Real Model

When you import a Blender cockpit model (.glb), most of these parameters will still work:
- Camera position will still frame the view
- Lighting values will still illuminate the model
- Monitor positions might need adjustment if model geometry is different

Just re-tune after importing the model.


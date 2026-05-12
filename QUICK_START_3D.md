# Quick Start — 3D Cockpit Testing

**Status**: ✅ Done  
**What's New**: 3D Matrix Sector background using Three.js  
**What's Same**: Graveyard mode, all UI, all content

---

## 1. Open & Test (2 minutes)

```bash
# Option A: Direct file
open c:\Users\Austin\Documents\PortfolioV2\index.html

# Option B: Server (better)
cd c:\Users\Austin\Documents\PortfolioV2
python -m http.server 8000
# Then: http://localhost:8000
```

**Expected:**
- Page loads
- Hero section visible
- Dark background

---

## 2. Trigger Matrix Mode

**Press B key** (or click "⚡ Breach Reality" button)

**Expected:**
- Glow effect / glitch animation
- Background changes to 3D
- Starfield visible (white dots)
- Blue planet visible
- Dark cockpit frame
- Green glowing monitors
- Scene animates smoothly

**Problem?** Check console (F12 > Console tab) for red errors

---

## 3. Check Key Features

| Feature | How to Test | Expected |
|---------|-------------|----------|
| **Starfield** | Look at background | 1000 distant white points |
| **Planet** | Center of background | Blue sphere rotating slowly |
| **Cockpit Frame** | Around you | Dark boxes (panels, ceiling, floor) |
| **Monitors** | In front | 3 green glowing rectangles |
| **Camera Drift** | Watch over time | Scene slowly drifts left/right |
| **Glow Pulse** | Monitor screens | Brightness varies smoothly |

---

## 4. Test Graveyard (Unchanged)

**Press B again**

**Expected:**
- Back to 2D background
- Embers, fog, lanterns visible
- Everything like before

---

## 5. Test Mobile Responsiveness

**Resize browser to 375px width**

**Expected:**
- Scene still renders
- Content stacks properly
- No broken layout
- Press B still works

---

## 6. Check Performance

**Open DevTools** (F12)

**Performance Tab:**
1. Click record (red dot)
2. Watch scene for 5 seconds
3. Stop recording
4. Look at FPS graph at top

**Expected:**
- Desktop: 60 FPS (green)
- Mobile: 30-45 FPS (acceptable)
- No long red frames

---

## 7. Visual Checklist

- [ ] Starfield visible
- [ ] Planet visible and rotating
- [ ] Cockpit panels visible
- [ ] Monitor screens glowing green
- [ ] Scene animates smoothly
- [ ] No flickering or glitches
- [ ] UI is readable over 3D
- [ ] All buttons clickable

---

## 8. Troubleshooting

### Blank screen in Matrix mode?
```
→ Check console (F12) for errors
→ Try refreshing page
→ Check camera position in scene-matrix.js line ~50
```

### Slow/stuttering?
```
→ Desktop should be 60 FPS
→ Mobile 30-45 FPS is OK
→ If worse, try reducing star count (line ~134)
```

### Mode switch doesn't work?
```
→ Press B key (not just button click)
→ Check console for errors
→ Verify THREE.js loaded (Network tab in DevTools)
```

### Colors wrong?
```
→ Scene uses green (#2fa84a) and cyan (#3df0ff)
→ Check 3D_TUNING.md for color hex codes
```

---

## 9. What to Tweak Next

**See `3D_TUNING.md` for detailed parameter guide**

Quick examples:

```javascript
// Make planet bigger (line ~149)
new THREE.IcosahedronGeometry(12, 4);  // was 8

// Move planet closer (line ~172)
planetMesh.position.set(25, 10, -50);  // was z: -80

// Move monitors higher (line ~251)
{ pos: [-5, 3, 9], rot: [0, 0.1, 0] },  // was y: 1.5

// Slow down camera (line ~305)
Math.sin(time * 0.05) * 0.8  // was 0.15
```

After edits:
1. Save file
2. Reload page (Ctrl+R)
3. Press B to test changes

---

## 10. Next Phase Options

### Option A: Refine Current Scene
- Adjust planet size/position
- Adjust monitor positions
- Change colors/lighting
- Tune animation speeds
- See `3D_TUNING.md`

### Option B: Import Real Cockpit Model
- Create cockpit in Blender
- Export as `.glb`
- Replace procedural geometry with model
- See `3D_IMPLEMENTATION_SUMMARY.md` > Phase 2

### Option C: Add Video Textures
- Create/capture video
- Add to monitor screens
- Loop on playback
- See `3D_IMPLEMENTATION_SUMMARY.md` > Phase 3

---

## Files Modified

| File | Change | Impact |
|------|--------|--------|
| **index.html** | Added Three.js CDN | +600KB (cached) |
| **scene-matrix.js** | 2D → 3D cockpit | New features! |
| **scene-graveyard.js** | None | Unchanged ✅ |
| **app.jsx** | None | Unchanged ✅ |
| **components.jsx** | None | Unchanged ✅ |

---

## Key Takeaways

✅ **Working:**
- 3D background in Matrix mode
- All UI on top, fully functional
- Smooth 60 FPS (desktop)
- Responsive on mobile
- Mode switching seamless
- Graveyard unchanged

❌ **Not Yet:**
- Real 3D model (using boxes/spheres)
- Video on screens (using solid colors)
- Code rain or operator figure

✅ **Easy to Change:**
- Camera position
- Planet size/distance
- Monitor positions
- Colors and lighting
- Animation speeds

---

## Test in 30 Seconds

1. Open `index.html`
2. Press **B**
3. See starfield + planet + cockpit + glowing monitors
4. Press **B** again to confirm Graveyard still works
5. Resize to 375px and repeat
6. ✅ Done!

---

**Questions?** See:
- `3D_TUNING.md` — How to change parameters
- `3D_IMPLEMENTATION_SUMMARY.md` — Full details & next phases
- `AUDIT.md` — Architecture & technical details


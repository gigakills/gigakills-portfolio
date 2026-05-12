# Matrix Sector 3D Cockpit — Tuning Guide

**Scene File**: `scene-matrix.js`  
**Status**: ✅ Lightweight Three.js proof-of-concept  
**Performance**: ~30-60 FPS (depends on device)

---

## Quick Parameter Locations

Find and adjust these values in `scene-matrix.js` to customize the scene:

---

## 1. CAMERA (Line ~50)

**Current Setup:**
```javascript
camera.position.set(0, 2, 12);    // x, y, z
camera.lookAt(0, 1, -15);         // looking at point
```

### Adjust Camera Position
```javascript
camera = 0:     // x-axis: left(-) / right(+)
camera = 2:     // y-axis: down(-) / up(+)
camera = 12:    // z-axis: close(-) / far from cockpit(+)
```

**Examples:**
- Move left: `camera.position.x = -5`
- Move up: `camera.position.y = 4`
- Move back: `camera.position.z = 20`

### Adjust Camera Angle
```javascript
camera.lookAt(0, 1, -15);  // (x, y, z) = look-at point
```

---

## 2. PLANET (Line ~145)

**Current Setup:**
```javascript
planetMesh.position.set(25, 10, -80);  // x, y, z
```

### Adjust Planet Position

```javascript
25:    // x: left(-20) to right(40) — left/right in view
10:    // y: down(-20) to up(30) — vertical position
-80:   // z: close(-20) to far(-200) — depth in background
```

**Examples:**
- Move planet more to center: `planetMesh.position.set(0, 10, -80)`
- Move planet up: `planetMesh.position.set(25, 25, -80)`
- Move planet closer: `planetMesh.position.set(25, 10, -50)`

### Adjust Planet Size

**Current Setup:**
```javascript
const geometry = new THREE.IcosahedronGeometry(8, 4);  // radius 8, detail 4
```

Change the `8` (radius):
```javascript
new THREE.IcosahedronGeometry(4, 4);   // Smaller planet
new THREE.IcosahedronGeometry(15, 4);  // Larger planet
new THREE.IcosahedronGeometry(20, 4);  // Much larger planet
```

---

## 3. COCKPIT FRAME (Line ~195)

### Adjust Cockpit Panel Sizes

**Left/Right Panels:**
```javascript
const leftPanelGeo = new THREE.BoxGeometry(3, 8, 0.2);
                                         ↑  ↑  ↑
                                      width height depth
```

**Examples:**
- Wider panels: `BoxGeometry(4, 8, 0.2)`
- Taller panels: `BoxGeometry(3, 10, 0.2)`
- Thicker panels: `BoxGeometry(3, 8, 0.5)`

**Top Ceiling:**
```javascript
const ceilingGeo = new THREE.BoxGeometry(14, 1.5, 0.2);
```

**Floor:**
```javascript
const floorGeo = new THREE.BoxGeometry(14, 0.5, 12);
                                      ↑   ↑   ↑
                                    width height depth
```

### Adjust Cockpit Panel Positions

**Left Panel:**
```javascript
leftPanel.position.set(-6, 0, 8);
                      ↑   ↑  ↑
                      x   y  z
```

**Right Panel:**
```javascript
rightPanel.position.set(6, 0, 8);
```

**Ceiling:**
```javascript
ceiling.position.set(0, 4, 8);
```

**Floor:**
```javascript
floor.position.set(0, -4, 5);
```

---

## 4. MONITORS/SCREENS (Line ~235)

### Adjust Monitor Positions

**Current Monitor Layout:**
```javascript
const monitorPositions = [
  { pos: [-5, 1.5, 9], rot: [0, 0.1, 0] },  // Left
  { pos: [0, 1.5, 9.5], rot: [0, 0, 0] },   // Center
  { pos: [5, 1.5, 9], rot: [0, -0.1, 0] },  // Right
];
```

**pos array:** `[x, y, z]`
- x: left(-10) to right(10)
- y: down(-2) to up(4)
- z: back(0) to front(15)

**rot array:** `[rotX, rotY, rotZ]` in radians
- rotY: 0.1 = ~5.7° angle inward/outward

**Examples:**

Move all monitors higher:
```javascript
{ pos: [-5, 3, 9], rot: [0, 0.1, 0] },    // was 1.5, now 3
{ pos: [0, 3, 9.5], rot: [0, 0, 0] },
{ pos: [5, 3, 9], rot: [0, -0.1, 0] },
```

Spread monitors wider apart:
```javascript
{ pos: [-8, 1.5, 9], rot: [0, 0.15, 0] },  // -8 instead of -5
{ pos: [0, 1.5, 9.5], rot: [0, 0, 0] },
{ pos: [8, 1.5, 9], rot: [0, -0.15, 0] },  // 8 instead of 5
```

Tilt monitors more inward:
```javascript
{ pos: [-5, 1.5, 9], rot: [0, 0.2, 0] },   // 0.2 instead of 0.1
```

### Adjust Monitor Size

**Current Size:**
```javascript
const screenGeo = new THREE.PlaneGeometry(2.8, 2);
                                         ↑    ↑
                                      width height
```

**Examples:**
```javascript
new THREE.PlaneGeometry(3.5, 2.5);  // Larger screens
new THREE.PlaneGeometry(2.0, 1.5);  // Smaller screens
```

### Adjust Monitor Colors

**Current Color:**
```javascript
color: 0x2fa84a  // Green (#2fa84a)
```

**Change to:**
```javascript
color: 0x3df0ff  // Cyan (#3df0ff)
color: 0xff00ff  // Magenta (#ff00ff)
color: 0xffff00  // Yellow (#ffff00)
color: 0xff6600  // Orange (#ff6600)
```

---

## 5. LIGHTING (Line ~80)

### Ambient Light

**Current:**
```javascript
const ambientLight = new THREE.AmbientLight(0x1a4d6d, 0.4);
                                            ↑          ↑
                                         color       intensity (0-1)
```

Increase intensity for brighter overall scene:
```javascript
new THREE.AmbientLight(0x1a4d6d, 0.6);  // Brighter
new THREE.AmbientLight(0x1a4d6d, 0.2);  // Darker
```

Change color (more cyan/teal):
```javascript
new THREE.AmbientLight(0x3df0ff, 0.4);  // Cyan tint
```

### Main Light (from Planet)

**Current:**
```javascript
const mainLight = new THREE.DirectionalLight(0x3df0ff, 0.8);
mainLight.position.set(20, 30, -30);
```

Adjust intensity:
```javascript
new THREE.DirectionalLight(0x3df0ff, 1.0);  // Brighter (more shadow detail)
new THREE.DirectionalLight(0x3df0ff, 0.5);  // Darker (softer shadows)
```

Change light color:
```javascript
new THREE.DirectionalLight(0xff6600, 0.8);  // Orange light
new THREE.DirectionalLight(0xffff00, 0.8);  // Yellow light
```

Adjust light direction:
```javascript
mainLight.position.set(30, 40, -50);  // More dramatic angle
mainLight.position.set(10, 20, -10);  // Softer angle
```

---

## 6. STARFIELD (Line ~120)

### Adjust Star Count

**Current:**
```javascript
const starCount = 1000;
```

**Examples:**
```javascript
const starCount = 500;   // Fewer, sparser stars
const starCount = 2000;  // More stars (uses more GPU)
```

### Adjust Star Color

**Current:**
```javascript
color: 0xccddff  // Cool white/blue
```

**Examples:**
```javascript
color: 0xffddaa  // Warmer (yellow-tinted)
color: 0xffffff  // Pure white
color: 0x88bbff  // More blue
```

### Adjust Star Size

**Current:**
```javascript
size: 0.7
```

**Examples:**
```javascript
size: 0.4   // Smaller, more realistic
size: 1.5   // Larger, more prominent
```

---

## 7. ANIMATION SPEED (Line ~300)

### Camera Drift Speed

**Current:**
```javascript
const driftX = Math.sin(time * 0.15) * 0.8 + mouseX;
                           ↑
                        0.15 = speed multiplier
```

Adjust speed:
```javascript
Math.sin(time * 0.05) * 0.8;   // Slower drift
Math.sin(time * 0.3) * 0.8;    // Faster drift
Math.sin(time * 0.15) * 0.2;   // Less amplitude (smaller movement)
Math.sin(time * 0.15) * 1.5;   // More amplitude (larger movement)
```

### Planet Rotation Speed

**Current:**
```javascript
planetMesh.rotation.y += 0.0002;  // Slow rotation
planetMesh.rotation.x += 0.00005; // Very slow tilt
```

**Examples:**
```javascript
planetMesh.rotation.y += 0.001;   // Faster rotation
planetMesh.rotation.y += 0.00001; // Slower rotation
```

### Monitor Glow Pulse Speed

**Current:**
```javascript
const pulse = 0.6 + Math.sin(time * 2 + idx) * 0.4;
                           ↑
                        2 = speed multiplier
```

**Examples:**
```javascript
Math.sin(time * 1) * 0.4;  // Slower glow pulse
Math.sin(time * 4) * 0.4;  // Faster glow pulse
```

---

## 8. FOG (Line ~45)

**Current:**
```javascript
scene.fog = new THREE.Fog(0x001a2e, 100, 500);
                          ↑      ↑   ↑
                        color   near far
```

### Change Fog Intensity

```javascript
new THREE.Fog(0x001a2e, 50, 300);   // Thicker fog (closer range)
new THREE.Fog(0x001a2e, 200, 1000); // Thinner fog (farther range)
```

### Change Fog Color

```javascript
new THREE.Fog(0x3df0ff, 100, 500);   // Cyan fog
new THREE.Fog(0xff0000, 100, 500);   // Red fog (ominous)
```

---

## Quick Test After Each Change

After tweaking parameters:

1. **Reload the page** (Ctrl+R or Cmd+R)
2. **Press B** to enter Matrix mode
3. **Check console** (F12) for errors
4. **Verify responsive** — resize to mobile (375px)
5. **Check performance** — should stay smooth (DevTools > Performance > record)

---

## Common Tweaking Goals

### "Make the cockpit bigger"
Increase panel sizes:
```javascript
BoxGeometry(5, 10, 0.2)  // Wider, taller panels
```

### "Make monitors stand out more"
Increase monitor glow:
```javascript
const glowLight = new THREE.PointLight(0x7cff5e, 1.2, 20);  // was 0.8, 15
```

### "Slow down the drift"
Reduce camera drift speed:
```javascript
const driftX = Math.sin(time * 0.05) * 0.5;  // was 0.15, 0.8
```

### "Make the planet closer"
Adjust Z position:
```javascript
planetMesh.position.set(25, 10, -40);  // was -80
```

### "More visible grid"
The grid is auto-generated; to make it more visible, change the cockpit frame position or add more geometry.

---

## Future Upgrades (TODO)

When you're ready to replace the procedural geometry with a real model:

1. **Import Blender model** (in `createCockpitFrame`)
   ```javascript
   // TODO: Remove the box geometry below and import from .glb instead
   const loader = new THREE.GLTFLoader();
   loader.load('cockpit.glb', (gltf) => {
     cockpitGroup.add(gltf.scene);
   });
   ```

2. **Add video textures** (in `createMonitors`)
   ```javascript
   // TODO: Replace PlaneGeometry screens with actual video canvas texture
   const video = document.createElement('video');
   const videoTexture = new THREE.VideoTexture(video);
   ```

3. **Add particle effects** (for data streams, sparks)
   ```javascript
   // TODO: Add THREE.Points with data-stream particles
   ```

4. **Sync with audio** (if you add sound)
   ```javascript
   // TODO: Get audio frequency data and animate monitor glow reactively
   ```

---

## Performance Notes

**Current Budget:**
- 1000 stars = ~1MB GPU memory
- 1 planet (low-poly) = ~100KB
- 3 cockpit panels = ~50KB
- 3 monitor screens = ~30KB
- Total: ~1.2MB (very lightweight)

**If too slow on mobile:**
- Reduce star count: `starCount = 500`
- Reduce planet detail: `IcosahedronGeometry(8, 3)` instead of (8, 4)
- Simplify monitor geometry or reduce count
- Use `renderer.setPixelRatio(1)` instead of capping at 2

**If too fast (CPU idle):**
- It's fine! The scene is efficient. No changes needed.

---

## Debugging Tips

**Canvas is blank?**
- Check console (F12) for red errors
- Verify you're in Matrix mode (press B)
- Check that canvas.style.display is not 'none'

**Scene looks wrong?**
- Camera might be inside geometry — move camera back: `camera.position.z = 20`
- Lights might be off — increase ambient or main light intensity
- Check rotation values (radians, not degrees)

**Stuttering?**
- Check DevTools Performance tab
- Reduce star count or planet detail
- Disable shadow map: `renderer.shadowMap.enabled = false`

**Colors wrong?**
- Colors are hex values (0xRRGGBB)
- Use color picker: https://www.color-hex.com/
- Test with simple colors first (0xff0000 = red, 0x00ff00 = green, 0x0000ff = blue)

---

## Test Checklist

After changes:
- [ ] Page loads without errors
- [ ] Matrix mode shows 3D scene (press B)
- [ ] Graveyard mode still shows 2D background
- [ ] Mode switching smooth (no flicker)
- [ ] Scene animates (planets rotate, lights glow, camera drifts)
- [ ] Responsive on mobile (375px width)
- [ ] FPS stable (60+ on desktop, 30+ on mobile)
- [ ] All UI buttons still clickable

---

**Ready to tweak?** Pick one parameter above and try adjusting it!


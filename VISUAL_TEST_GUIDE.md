# Visual Testing Guide — 3D Cockpit Composition

**Goal**: Verify the new 3D composition feels like a proper spaceship cockpit background without overwhelming the website content.

**Time**: 5 minutes

---

## Step 1: Load the Site

```bash
# Method 1: Direct
open c:\Users\Austin\Documents\PortfolioV2\index.html

# Method 2: Server (recommended)
cd c:\Users\Austin\Documents\PortfolioV2
python -m http.server 8000
# Then: http://localhost:8000
```

---

## Step 2: Enter Matrix Mode

- **Press B key** (or click "⚡ Breach Reality" button)
- Wait for glow effect to finish
- You should see the 3D cockpit background

---

## Step 3: Visual Inspection Checklist

### Check 1: Hero Content Readability
**Location**: Top of page  
**What to Look For**:
- [ ] "GIGAKILLS" title is clearly readable (not washed out)
- [ ] Subtitle "Ushering in the golden age..." is visible
- [ ] No glare from monitors behind the text
- [ ] Status chips (CHANNEL ACTIVE, VER 2.6.1) are visible

**Good Result**: Hero content sits on top of 3D background, clearly separated  
**Bad Result**: Text is hard to read, 3D elements overpower content

---

### Check 2: Cockpit Composition
**Location**: Entire viewport  
**What to Look For**:
- [ ] Dark panels visible on left and right sides
- [ ] Ceiling arch visible at top (but not blocking hero)
- [ ] Floor visible at bottom with grid pattern
- [ ] Everything feels like it's "surrounding" the viewer
- [ ] Cockpit doesn't feel like random floating objects

**Good Result**: Feels like you're sitting in a spaceship interior  
**Bad Result**: Feels like separate geometric elements floating in space

---

### Check 3: Planet Positioning
**Location**: Center background, distant  
**What to Look For**:
- [ ] Blue planet visible in background
- [ ] Planet rotates slowly (watch for 10 seconds)
- [ ] Planet is visible but not dominating the view
- [ ] Planet feels "far away" in background, not in front

**Good Result**: Main background element, sets the scene  
**Bad Result**: Too prominent (overshadows other elements) OR invisible

---

### Check 4: Monitor Screens
**Location**: Facing viewer, inside cockpit  
**What to Look For**:
- [ ] 3 green glowing rectangles visible (left, center, right)
- [ ] Screens glow with a pulse (watch for 5 seconds)
- [ ] Glow is visible but not blinding
- [ ] Screens feel "mounted" in cockpit frame, not floating

**Good Result**: Add depth and sci-fi feel without being distracting  
**Bad Result**: Too bright (overpower content), OR invisible

---

### Check 5: Starfield
**Location**: Background, all around  
**What to Look For**:
- [ ] White/blue dots visible in distant background
- [ ] Not so dense that it's distracting
- [ ] Not so sparse that it's empty
- [ ] Subtle rotation over time (very slow)

**Good Result**: Adds depth, fills empty space  
**Bad Result**: Distracting, hard to see, or overwhelming

---

### Check 6: Camera Movement (Parallax)
**Location**: Watch the entire scene for 15 seconds  
**What to Look For**:
- [ ] Scene drifts slightly left/right over time
- [ ] Movement is smooth and subtle
- [ ] NOT jerky or nauseating
- [ ] Movement adds life, not motion sickness

**Good Result**: Barely noticeable movement that feels natural  
**Bad Result**: Obvious sway, makes you dizzy, or no movement at all

---

### Check 7: Screen Sections

**Scroll down to see other parts of the site:**

- [ ] "SHOWCASE CHANNELS" section visible, readable
  - Background should be darker here to not distract from content
- [ ] "FEATURED PROJECTS" section visible, readable
  - Project cards should stand out from 3D background
- [ ] "SKILLS & SYSTEMS" section visible, readable
  - Skill chips should be clear and clickable
- [ ] All buttons clickable (try clicking one)
- [ ] No layout broken by 3D background

**Good Result**: 3D background is integrated, content always readable  
**Bad Result**: Content is hard to read, layout is broken, buttons don't work

---

## Step 4: Mobile Responsiveness

**Resize browser to 375px width** (or use DevTools device emulation):

- [ ] Scene still renders (not blank)
- [ ] Hero content readable at mobile width
- [ ] Cockpit composition still feels right (not stretched)
- [ ] No broken layout
- [ ] Can scroll normally
- [ ] **Press B again** — mode switch still works on mobile

**Good Result**: Composition scales appropriately  
**Bad Result**: Broken layout, unreadable text, or scene doesn't render

---

## Step 5: Performance Check

**Open DevTools** (F12):

1. Go to **Performance** tab
2. Click **Record** (red circle)
3. Watch the 3D scene for 5-10 seconds
4. Stop recording
5. Look at FPS graph at top

- [ ] Desktop: 60 FPS (green line, mostly flat)
- [ ] Mobile: 30-45 FPS (acceptable dip)
- [ ] No big red spikes (performance drops)

**Good Result**: Smooth animation, consistent frame rate  
**Bad Result**: Choppy animation, big FPS drops

---

## Step 6: Mode Switch Test

**Press B key twice** (to toggle between modes):

1. **First B**: Switch from Graveyard to Matrix
   - [ ] Glow/glitch animation plays
   - [ ] 3D cockpit appears
   - [ ] Smooth transition (no flicker)

2. **Second B**: Switch back to Graveyard
   - [ ] 2D background returns (embers, fog, lanterns)
   - [ ] Smooth transition

**Good Result**: Seamless switching, both modes work perfectly  
**Bad Result**: Glitches, crashes, or mode doesn't switch

---

## Scoring Checklist

**Rate Each Category** (✓ = good, ✗ = needs work):

| Category | Score | Notes |
|----------|-------|-------|
| Hero content readability | ✓/✗ | Is "GIGAKILLS" clear? |
| Cockpit composition | ✓/✗ | Does it feel surrounding? |
| Planet positioning | ✓/✗ | Visible background element? |
| Monitor glow | ✓/✗ | Visible but not glaring? |
| Starfield | ✓/✗ | Present but not distracting? |
| Camera drift | ✓/✗ | Smooth and subtle? |
| Content readability (scrolled) | ✓/✗ | Is everything readable? |
| Mobile layout | ✓/✗ | Works at 375px? |
| Performance (FPS) | ✓/✗ | 60 FPS (desktop), 30+ (mobile)? |
| Mode switching | ✓/✗ | Both modes work? |

**Overall Assessment**:
- **8-10 ✓**: Composition is excellent, ready to proceed
- **6-7 ✓**: Good baseline, might benefit from minor tweaks
- **4-5 ✓**: Needs tuning, see Tuning Guide below
- **<4 ✓**: Major issues, needs investigation

---

## If Something Doesn't Feel Right

### Issue: Hero text is hard to read / 3D is too bright

**Fix**: Reduce monitor brightness and ambient light

```javascript
// In scene-matrix.js, MONITOR_PARAMS:
brightness: 0.3  // was 0.5

// In LIGHTING_PARAMS:
ambientIntensity: 0.25  // was 0.3
```

### Issue: Cockpit is too small / too subtle

**Fix**: Scale up cockpit

```javascript
// In COCKPIT_PARAMS:
scale: 1.3  // was 1.0
```

### Issue: Camera drift is annoying

**Fix**: Reduce or eliminate drift

```javascript
// In CAMERA_PARAMS:
driftAmplitudeX: 0.1  // was 0.3 (or set to 0 for no drift)
driftAmplitudeY: 0.05  // was 0.2
```

### Issue: Planet is invisible or too dominant

**Fix**: Adjust planet

```javascript
// In PLANET_PARAMS:
radius: 6  // was 8 (make smaller)
position: { x: 15, y: -5, z: -50 }  // move closer or farther
```

### Issue: Performance is bad (FPS drops)

**Check**:
1. Are you in Matrix mode? (Press B)
2. Is canvas visible? (F12 Console)
3. Try reducing star count:

```javascript
// In STARFIELD_PARAMS:
count: 400  // was 800
```

---

## What to Look For in Good Composition

✅ **Visual Balance**
- 3D elements support the content, don't compete with it
- Hero title is the focal point, 3D is background
- Planet draws the eye to the distance
- Monitors provide visual anchors

✅ **Immersion**
- Feels like you're inside a spaceship cockpit
- Geometry surrounds the viewer
- Depth is clear (foreground monitors, background planet)

✅ **Subtlety**
- Camera drift is there but not obvious
- Monitor glow is visible but not blinding
- Starfield adds texture without distraction

✅ **Technical Quality**
- Smooth 60 FPS animation
- No flickering or glitches
- Responsive on all screen sizes
- All content remains interactive

---

## Screenshot Suggestions

Take these images to document your testing:

1. **Hero full page** — Shows integration with website
2. **Full cockpit view** — Shows 3D composition
3. **Monitor glow detail** — Shows screen animation
4. **Mobile view** — Confirms responsive design
5. **Graveyard mode** — Confirms mode switching works

Use these for:
- Portfolio review with team
- Before/after comparison
- Documentation of final state

---

## Final Question

**Does this feel like a spaceship cockpit interior that you're looking out from?**

- **Yes**: ✅ Composition is working! Proceed to tweaking or model import
- **Mostly**: ✅ Good baseline, consider minor adjustments (see tuning guide)
- **Not quite**: See "If Something Doesn't Feel Right" section above
- **No**: Check console (F12) for errors, or see troubleshooting guide

---

## Next Steps After Testing

### If Composition is Good:
1. **Take reference screenshots** (for future comparison)
2. **Document current tuning values** (in case you want to revert)
3. **Proceed to**:
   - Option A: Fine-tune with 3D_VISUAL_TUNING.md
   - Option B: Import real Blender model (Phase 2)
   - Option C: Move on to other portfolio improvements

### If Composition Needs Tweaking:
1. **Identify which parameter needs change** (see Tuning Guide)
2. **Make small adjustment** (don't change by 50% at once)
3. **Reload and re-test**
4. **Iterate until happy** (should take 15-30 min)

### If There's a Technical Issue:
1. **Check console** (F12 > Console)
2. **Look for red errors**
3. **Try refreshing page**
4. **Check DevTools Network** to confirm Three.js loaded
5. **See 3D_IMPLEMENTATION_SUMMARY.md > Troubleshooting**

---

**Ready to test?** Start at Step 1 above. Should take about 5 minutes total.

